function klinikTheme() {
    return {
        darkMode: false,
        init() {
            try { this.darkMode = localStorage.getItem('klinik-theme') === 'dark'; } catch (_) {}
            document.documentElement.classList.toggle('dark', this.darkMode);
        },
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            document.documentElement.classList.toggle('dark', this.darkMode);
            try { localStorage.setItem('klinik-theme', this.darkMode ? 'dark' : 'light'); } catch (_) {}
        }
    };
}
