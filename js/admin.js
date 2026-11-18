function klinikAdmin() {
    return {
        doctors: klinikDoctors,
        rows: [],
        error: '',
        search: '',
        filterDate: '',
        filterPoli: '',
        filterStatus: '',
        init() {
            this.refresh();
            window.addEventListener('storage', () => this.refresh());
            window.addEventListener('klinik-data-updated', () => this.refresh());
        },
        refresh() {
            try { this.rows = klinikStorage.all().slice().reverse(); this.error = ''; }
            catch (_) { this.error = 'Gagal membaca penyimpanan lokal browser.'; this.rows = []; }
        },
        get filteredRows() {
            const keyword = this.search.trim().toLowerCase();
            return this.rows.filter(item => {
                const matchesText = `${item.nama || ''} ${item.noAntrean} ${item.dokter || ''}`.toLowerCase().includes(keyword);
                return matchesText && (!this.filterDate || this.filterDate === item.tanggalKunjungan)
                    && (!this.filterPoli || this.filterPoli === item.poliklinik)
                    && (!this.filterStatus || this.filterStatus === item.status);
            });
        },
        get todayCount() { return this.rows.filter(item => item.tanggalKunjungan === klinikValidation.localDate(new Date())).length; },
        get waitingCount() { return this.rows.filter(item => item.status === 'Menunggu').length; },
        get finishedCount() { return this.rows.filter(item => item.status === 'Selesai').length; },
        changeStatus(id, status) {
            try { klinikStorage.updateStatus(id, status); this.refresh(); }
            catch (_) { this.error = 'Gagal mengubah status antrean.'; }
        }
    };
}
