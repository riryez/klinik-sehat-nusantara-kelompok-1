// Interaksi pasien dan formulir pendaftaran.
function klinikApp() {
    const current = new Date();
    const today = klinikValidation.localDate(current);
    const max = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 14);
    return {
        viewMode: 'kartu',
        showScheduleTable: true,
        selectedFilter: 'Semua',
        modalQueueOpen: false,
        serviceModalOpen: false,
        modalSuccessOpen: false,
        queueResultNumber: '',
        queueResultPoli: '',
        registrationResult: null,
        activeService: { title: '', desc: '' },
        todayDate: today,
        maxDate: klinikValidation.localDate(max),
        hasSubmitted: false,
        storageError: '',
        errors: {},
        doctors: klinikDoctors,
        form: {
            nama: '', nik: '', tanggalLahir: '', jenisKelamin: '', hp: '', email: '',
            penjamin: 'Mandiri', noBpjs: '', poliklinik: '', dokter: '',
            tanggalKunjungan: '', keluhan: '', setuju: false
        },
        get greeting() {
            const hour = new Date().getHours();
            const name = hour < 11 ? 'pagi' : hour < 15 ? 'siang' : hour < 18 ? 'sore' : 'malam';
            return `Selamat ${name}, selamat datang di Klinik Sehat Nusantara.`;
        },
        get patientAge() { return klinikValidation.calculateAge(this.form.tanggalLahir); },
        get filteredDoctors() { return this.selectedFilter === 'Semua' ? this.doctors : this.doctors.filter(doc => doc.poli === this.selectedFilter); },
        get availableDoctorsForForm() { return this.doctors.filter(doc => doc.poli === this.form.poliklinik); },
        validateField: klinikValidation.validateField,
        validateAll: klinikValidation.validateAll,
        openQueueModal() { this.modalQueueOpen = true; },
        generateQuickQueue(poli) {
            const doctor = this.doctors.find(doc => doc.poli === poli);
            if (!doctor) return;
            try {
                const item = klinikStorage.save({ jenis: 'Antrean cepat', nama: '', poliklinik: poli, dokter: doctor.name, tanggalKunjungan: klinikValidation.localDate(new Date()) });
                this.registrationResult = null;
                this.queueResultNumber = item.noAntrean;
                this.queueResultPoli = poli;
                this.modalQueueOpen = false;
                this.modalSuccessOpen = true;
                this.storageError = '';
            } catch (_) {
                this.storageError = 'Tidak dapat menyimpan antrean. Periksa izin penyimpanan browser.';
                this.modalQueueOpen = false;
            }
        },
        showServiceDetail(title, desc) { this.activeService = { title, desc }; this.serviceModalOpen = true; },
        selectDoctor(doc) {
            this.form.poliklinik = doc.poli;
            this.form.dokter = doc.name;
            location.hash = '#pendaftaran';
        },
        submitRegistration() {
            this.hasSubmitted = true;
            this.storageError = '';
            if (!this.validateAll()) {
                document.getElementById('registrationForm')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
            try {
                const item = klinikStorage.save({ ...this.form, usia: this.patientAge, jenis: 'Pendaftaran pasien' });
                this.registrationResult = item;
                this.queueResultNumber = item.noAntrean;
                this.queueResultPoli = `${item.poliklinik} (${item.dokter})`;
                this.modalSuccessOpen = true;
            } catch (_) {
                this.storageError = 'Pendaftaran belum tersimpan. Ruang penyimpanan browser mungkin penuh atau diblokir.';
            }
        }
    };
}
