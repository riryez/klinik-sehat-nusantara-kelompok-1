// Penyimpanan simulasi. Data hanya tersedia dalam browser/origin yang sama.
const klinikStorage = (() => {
    const KEY = 'klinik-registrations-v1';
    const PREFIX = { 'Poli Umum': 'UMUM', 'Poli Gigi': 'GIGI', 'Poli KIA': 'KIA', 'Konsultasi Gizi': 'GIZI' };

    function all() {
        const data = JSON.parse(localStorage.getItem(KEY) || '[]');
        return Array.isArray(data) ? data : [];
    }

    function save(data) {
        const rows = all();
        const prefix = PREFIX[data.poliklinik];
        if (!prefix) throw new Error('Poliklinik tidak dikenal.');
        const last = rows.filter(row => row.poliklinik === data.poliklinik && row.tanggalKunjungan === data.tanggalKunjungan)
            .reduce((max, row) => Math.max(max, Number(row.urutan) || 0), 0);
        const urutan = last + 1;
        const item = {
            ...data,
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
            noAntrean: `${prefix}-${String(urutan).padStart(3, '0')}`,
            urutan,
            dibuatPada: new Date().toISOString(),
            status: 'Menunggu'
        };
        localStorage.setItem(KEY, JSON.stringify([...rows, item]));
        window.dispatchEvent(new Event('klinik-data-updated'));
        return item;
    }

    function updateStatus(id, status) {
        if (!['Menunggu', 'Dipanggil', 'Selesai', 'Batal'].includes(status)) throw new Error('Status tidak valid.');
        const rows = all();
        const row = rows.find(item => item.id === id);
        if (!row) throw new Error('Antrean tidak ditemukan.');
        row.status = status;
        localStorage.setItem(KEY, JSON.stringify(rows));
        window.dispatchEvent(new Event('klinik-data-updated'));
    }

    return { all, save, updateStatus };
})();
