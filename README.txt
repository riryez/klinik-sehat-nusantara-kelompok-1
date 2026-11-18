KLINIK SEHAT NUSANTARA — SIMULASI CPMK1 / CPMK2

CARA 1 (VS CODE LIVE SERVER)
1. Ekstrak ZIP. Jangan buka index.html saat masih dalam ZIP.
2. Di VS Code: File > Open Folder > pilih folder klinik_sehat_nusantara yang berisi index.html.
3. Pastikan ekstensi "Live Server" (Ritwick Dey) telah diinstal dan diaktifkan.
4. Klik kanan index.html > Open with Live Server (atau tombol Go Live di bawah).
5. Jika browser tidak otomatis terbuka, kunjungi http://127.0.0.1:5501/index.html
6. Dashboard admin: http://127.0.0.1:5501/admin.html

CARA 2 (TANPA EKSTENSI LIVE SERVER)
Pada Windows, klik dua kali jalankan_website.bat (memerlukan Python terinstal).
Alternatif manual: buka terminal dalam folder ini, jalankan:
    py -m http.server 5501
Lalu kunjungi http://127.0.0.1:5501/index.html
Tekan Ctrl+C pada terminal untuk menghentikan server.

KENDALA UMUM
- "This site can't be reached": server belum aktif, port digunakan aplikasi lain, atau folder belum benar.
- HTTP 404: folder yang dibuka bukan folder yang memiliki index.html.
- Halaman tampil tetapi tombol tidak berfungsi: pastikan internet tersedia karena Alpine.js dan Font Awesome dimuat dari CDN.
- Jika halaman berubah tidak terlihat: Ctrl+Shift+R untuk refresh tanpa cache.
- Jangan gunakan alamat file:/// untuk penyimpanan lokal yang konsisten.
- Buka pasien dan admin melalui hostname DAN port yang sama untuk berbagi localStorage.
- Jika port 5501 sibuk, tutup server lama atau ubah port di .vscode/settings.json.

ISI PROYEK
index.html : halaman pasien; admin.html : dashboard simulasi
js/data.js : data dokter array objek; js/validation.js : validasi dan usia
js/storage.js : antrean dan localStorage; js/app.js : interaksi pasien
css/tailwind.css dan css/style.css : tampilan
images/ : 4 foto lokal sesuai pilihan terakhir

PENTING: PROYEK DEMO. Jangan gunakan data pasien asli karena localStorage
bukan database aman dan tidak mendukung autentikasi atau sinkronisasi perangkat.
