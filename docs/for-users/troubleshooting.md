# Troubleshoot MD Writer

Dokumen ini membantu pengguna plugin mengecek masalah umum di Obsidian.

## Plugin tidak muncul setelah install

Cek hal berikut:

- folder plugin berada di `<vault>/.obsidian/plugins/md-writer/`,
- folder berisi `main.js`, `manifest.json`, dan `styles.css`,
- Community plugins sudah diaktifkan di Obsidian,
- Obsidian sudah direload setelah file plugin disalin.

## Plugin muncul tetapi tidak bisa diaktifkan

Cek:

- versi Obsidian memenuhi `minAppVersion` di `manifest.json`,
- semua aset release berasal dari versi yang sama,
- tidak ada file lama dari versi sebelumnya yang tertinggal di folder plugin.

Jika perlu, hapus folder `md-writer`, install ulang dari release terbaru, lalu
reload Obsidian.

## Perubahan visual tidak terlihat

Coba langkah berikut:

1. Pastikan fitur terkait sudah di-enable di pengaturan MD Writer.
2. Reload Obsidian.
3. Nonaktifkan sementara snippet CSS atau theme yang mungkin menimpa style
   editor.
4. Coba di vault kecil atau vault test untuk memastikan konflik berasal dari
   konfigurasi vault.

## GitHub-style anchor tidak menuju heading

Cek:

- link memakai format heading anchor yang benar,
- heading target ada di file yang sama atau file tujuan,
- duplicate heading memakai suffix seperti `-1` sesuai gaya GitHub,
- link tidak berada di format yang diproses plugin lain sebelum MD Writer.

## Laporkan bug

Saat melaporkan bug, sertakan:

- versi MD Writer,
- versi Obsidian,
- sistem operasi,
- langkah reproduksi,
- expected behavior,
- actual behavior,
- screenshot atau sample Markdown jika relevan.
