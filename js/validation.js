const klinikValidation = (() => {
    function localDate(date) {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function dateFromInput(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return localDate(date) === value ? date : null;
    }

    function calculateAge(value, now = new Date()) {
        const born = dateFromInput(value);
        if (!born || born > new Date(now.getFullYear(), now.getMonth(), now.getDate())) return null;
        let age = now.getFullYear() - born.getFullYear();
        if (now.getMonth() < born.getMonth() || (now.getMonth() === born.getMonth() && now.getDate() < born.getDate())) age--;
        return age;
    }

    function fieldErrors(form, doctors, now = new Date()) {
        const errors = {};
        const today = localDate(now);
        const latestDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
        const validPoli = [...new Set(doctors.map(d => d.poli))];
        if (!/^[A-Za-z\p{L} ]{3,}$/u.test((form.nama || '').trim())) errors.nama = 'Nama wajib diisi, minimal 3 karakter, hanya huruf dan spasi.';
        if (!/^\d{16}$/.test(form.nik || '')) errors.nik = 'NIK wajib tepat 16 digit angka.';
        if (calculateAge(form.tanggalLahir, now) === null) errors.tanggalLahir = 'Tanggal lahir wajib valid dan tidak boleh di masa depan.';
        if (!['Laki-laki', 'Perempuan'].includes(form.jenisKelamin)) errors.jenisKelamin = 'Jenis kelamin wajib dipilih.';
        if (!/^(?:08|62)\d{8,12}$/.test(form.hp || '') || (form.hp || '').length > 14) errors.hp = 'HP wajib diawali 08 atau 62, sepanjang 10–14 digit.';
        if ((form.email || '').trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Format email tidak valid.';
        if (!validPoli.includes(form.poliklinik)) errors.poliklinik = 'Poliklinik wajib dipilih.';
        if (!doctors.some(d => d.poli === form.poliklinik && d.name === form.dokter)) errors.dokter = 'Pilih dokter sesuai poliklinik.';
        const visit = dateFromInput(form.tanggalKunjungan);
        if (!visit || form.tanggalKunjungan < today || form.tanggalKunjungan > localDate(latestDate)) errors.tanggalKunjungan = 'Tanggal kunjungan harus antara hari ini dan 14 hari ke depan.';
        else if (visit.getDay() === 0) errors.tanggalKunjungan = 'Hari Minggu klinik tutup. Pilih Senin–Sabtu.';
        if (!(form.keluhan || '').trim() || form.keluhan.length > 200) errors.keluhan = 'Keluhan wajib diisi, maksimal 200 karakter.';
        if (!['Mandiri', 'BPJS'].includes(form.penjamin)) errors.penjamin = 'Pilih jenis penjamin.';
        if (form.penjamin === 'BPJS' && !/^\d{13}$/.test(form.noBpjs || '')) errors.noBpjs = 'Nomor BPJS wajib tepat 13 digit.';
        if (form.setuju !== true) errors.setuju = 'Persetujuan data wajib dicentang.';
        return errors;
    }

    return {
        localDate,
        calculateAge,
        validateField(field) {
            if (!this.hasSubmitted && field !== 'tanggalLahir') return;
            const result = fieldErrors(this.form, this.doctors);
            if (result[field]) this.errors[field] = result[field];
            else delete this.errors[field];
            if (field === 'poliklinik' && !this.availableDoctorsForForm.some(d => d.name === this.form.dokter)) this.form.dokter = '';
            if (field === 'penjamin' && this.form.penjamin !== 'BPJS') delete this.errors.noBpjs;
        },
        validateAll() {
            this.errors = fieldErrors(this.form, this.doctors);
            return Object.keys(this.errors).length === 0;
        }
    };
})();
