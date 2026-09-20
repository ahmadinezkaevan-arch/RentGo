# Dokumentasi Arsitektur & Analisis — RentGo

Dokumen ini berisi diagram dan spesifikasi analisis sistem **RentGo** (Sistem Informasi Rental Kendaraan).

---

## 1. Use Case Diagram

File Use Case Diagram tersimpan dalam 2 format yang siap dibuka di **draw.io**:

- **[`usecase-diagram.xml`](./usecase-diagram.xml)**: Format XML standar draw.io / diagrams.net.
- **[`usecase-diagram.drawio`](./usecase-diagram.drawio)**: Format draw.io native (kompatibel langsung dengan ekstensi VS Code *Draw.io Integration*).

---

## 2. Cara Membuka Diagram

### Opsi A: Melalui Draw.io Web
1. Buka [app.diagrams.net](https://app.diagrams.net/) di browser.
2. Klik tombol **Open Existing Diagram**.
3. Arahkan ke folder:
   ```text
   C:\rent-go\docs\usecase-diagram.xml
   ```

### Opsi B: Melalui Visual Studio Code
1. Pasang ekstensi **Draw.io Integration** (*hediet.vscode-drawio*) di VS Code.
2. Klik langsung file [`usecase-diagram.drawio`](./usecase-diagram.drawio) di panel Explorer VS Code.
3. Diagram akan terbuka langsung di editor interaktif.

---

## 3. Ringkasan Aktor & Use Case

| Aktor | Tanggung Jawab & Hak Akses | Use Case Terkait |
| :--- | :--- | :--- |
| **Guest** *(Pengunjung)* | Belum melakukan login ke sistem | - Registrasi Akun<br>- Login & Logout Akun<br>- Lihat Katalog & Cari Kendaraan |
| **Pelanggan** *(Customer)* | Pengguna terdaftar yang menyewa kendaraan | - Kelola Profil Akun<br>- Unggah Dokumen Identitas (KTP & SIM)<br>- Melakukan Pemesanan (Booking Kendaraan)<br>- Bayar DP (50%) & Unggah Bukti Transfer<br>- Pelunasan Sisa Bayar (50%) H-24 Jam<br>- Lihat Riwayat & Status Pemesanan<br>- Batalkan Pemesanan |
| **Admin Rental** *(Pengelola)* | Pengelola operasional rental RentGo | - Kelola Data Kendaraan (CRUD & Status)<br>- Kelola Kategori Kendaraan<br>- Kelola Data Pelanggan<br>- Verifikasi Dokumen Identitas (Terima / Tolak)<br>- Konfirmasi Pemesanan & Status Booking<br>- Verifikasi Pembayaran (DP & Pelunasan)<br>- Kelola Serah Terima & Pengembalian Unit<br>- Proses Refund Dana<br>- Melihat & Mencetak Laporan Transaksi |

### Relasi Khusus (Include & Extend)
- **`<<include>>` (Pemesanan Kendaraan):**
  - **Cek Ketersediaan Jadwal & Anti Double-Booking**: Memastikan tidak ada tabrakan jadwal booking pada unit yang sama.
  - **Hitung Total Biaya & Diskon Durasi Sewa**: Menghitung tarif harian dan potongan diskon bertingkat (4–7 hari: 5%, 8–10 hari: 10%, 11–14 hari: 15%, >14 hari: 20%).
- **`<<extend>>`:**
  - **Lihat Detail Kendaraan** memperluas *Lihat Katalog & Cari Kendaraan*.
  - **Input Catatan Alasan Penolakan Dokumen** memperluas *Verifikasi Dokumen Identitas* saat verifikasi ditolak admin.
  - **Proses Refund Dana** memperluas *Batalkan Pemesanan* sesuai ketentuan rentang waktu pembatalan PRD.
