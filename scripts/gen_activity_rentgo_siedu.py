#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generator activity diagram RENTGO (rental kendaraan) — gaya Siedu.

Mesin layout diadopsi dari script referensi (project lain / "Ngekost"):
  - swimlane asli (node parent-nya lane)
  - start = ellipse terisi; end = UML endState hitam
  - fork/join = batang horizontal (5 x L, rotation=90) HANYA di lane Sistem
  - pola fork: kiri "memasukkan data ke database" || kanan "menampilkan ..."
  - edge orthogonal; guard label [dalam kurung siku]; loop error via "side"
Isi halaman = daftar fitur PRD RentGo v1.0 (bagian 6), satu fitur satu halaman.

Cara pakai: python scripts/gen_activity_rentgo_siedu.py
JANGAN edit file .drawio hasilnya — regenerate.
"""
import xml.sax.saxutils as sax
import xml.etree.ElementTree as ET

ST_LANE     = "swimlane;whiteSpace=wrap;html=1;startSize=23;horizontal=1;fontStyle=1;fontSize=12;fillColor=none;strokeColor=#000000;"
ST_START    = "ellipse;html=1;fillColor=#000000;strokeColor=#000000;"
ST_END      = "ellipse;html=1;shape=endState;fillColor=#000000;strokeColor=#000000;"
ST_ACTION   = "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;fontSize=11;"
ST_DECISION = "rhombus;whiteSpace=wrap;html=1;shapeInside=1;fillColor=#FFFFFF;strokeColor=#000000;fontSize=10;"
ST_FORK     = "html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#000000;strokeColor=#000000;rotation=90;"
ST_EDGE     = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#000000;fontSize=10;"
ST_TITLE    = "text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;fontSize=18;fontStyle=1;"

LANE_H_PAD = 23
ACT_W, ACT_H = 150, 60
DEC_W, DEC_H = 120, 80
SE_WH = 30
FORK_W = 5
FORK_MIN_L = 160
GAP_Y = 30
LANE_GAP = 0
Y0 = 80
TITLE_Y = 30

ACTOR_W = 320
SYS_W   = 480


def esc(s):
    return sax.escape(s).replace("\n", "&#xa;")


def lane_widths(lanes):
    return [SYS_W if n.lower() in ("sistem", "system") else ACTOR_W for n in lanes]


# rows: node = (type, label, lane[, col]) ; edges: (src, dst, label[, "side"])
PAGES = [
    dict(name="1. Registrasi & Login",
         title="Registrasi dan Login",
         lanes=["Pelanggan", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "membuka halaman\nlogin / register", 0)],
        [("action", "menampilkan halaman\nlogin & register", 1)],
        [("decision", "sudah punya\nakun?", 0)],
        [("action", "isi email &\npassword", 0, 0),
         ("action", "isi form registrasi\n(nama, email, password)", 0, 1)],
        [("action", "submit login", 0, 0),
         ("action", "submit form register", 0, 1)],
        [("action", "cek kredensial\n(bcrypt)", 1, 0),
         ("action", "validasi input &\ncek email unik", 1, 1)],
        [("decision", "kredensial\nsesuai?", 1, 0),
         ("decision", "email belum\nterdaftar?", 1, 1)],
        [("fork", "", 1)],
        [("action", "memasukkan data\nke database", 1),
         ("action", "menampilkan\npesan sukses", 1)],
        [("join", "", 1)],
        [("action", "menampilkan halaman\ndashboard", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", "sudah punya akun"),
        ("r3-0", "r4-1", "belum punya akun"),
        ("r4-0", "r5-0", ""), ("r4-1", "r5-1", ""),
        ("r5-0", "r6-0", ""), ("r5-1", "r6-1", ""),
        ("r6-0", "r7-0", ""), ("r6-1", "r7-1", ""),
        ("r7-0", "r4-0", "data tidak sesuai", "side"),
        ("r7-0", "r8-0", "sesuai"),
        ("r7-1", "r4-1", "email sudah terdaftar", "side"),
        ("r7-1", "r8-0", "email belum dipakai"),
        ("r8-0", "r9-0", ""), ("r8-0", "r9-1", ""),
        ("r9-0", "r10-0", ""), ("r9-1", "r10-0", ""),
        ("r10-0", "r11-0", ""), ("r11-0", "r12-0", ""),
    ]),

    dict(name="2. Upload Dokumen Identitas",
         title="Upload Dokumen Identitas (KTP & SIM)",
         lanes=["Pelanggan", "Sistem", "Admin"], rows=[
        [("start", "", 0)],
        [("action", "unggah foto\nKTP & SIM", 0)],
        [("action", "cek format &\nukuran file", 1)],
        [("decision", "file valid?", 1)],
        [("action", "tampilkan pesan\nfile ditolak", 1)],
        [("action", "simpan dokumen\nstatus PENDING", 1)],
        [("action", "dokumen masuk\nantrean verifikasi", 1)],
        [("action", "admin memeriksa\nKTP & SIM", 2)],
        [("decision", "dokumen valid &\nmasih berlaku?", 2)],
        [("action", "set REJECTED &\nkabari pelanggan", 1)],
        [("fork", "", 1)],
        [("action", "memasukkan data\nke database", 1),
         ("action", "menampilkan\npesan terverifikasi", 1)],
        [("join", "", 1)],
        [("action", "status dokumen\nVERIFIED", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", "tidak"),
        ("r4-0", "r1-0", "unggah ulang", "side"),
        ("r3-0", "r5-0", "ya"), ("r5-0", "r6-0", ""), ("r6-0", "r7-0", ""),
        ("r7-0", "r8-0", ""),
        ("r8-0", "r9-0", "tidak"),
        ("r9-0", "r1-0", "unggah ulang", "side"),
        ("r8-0", "r10-0", "ya"),
        ("r10-0", "r11-0", ""), ("r10-0", "r11-1", ""),
        ("r11-0", "r12-0", ""), ("r11-1", "r12-0", ""),
        ("r12-0", "r13-0", ""), ("r13-0", "r14-0", ""),
    ]),

    dict(name="3. Kelola Profil",
         title="Kelola Profil",
         lanes=["Pelanggan", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "membuka halaman\nprofil", 0)],
        [("action", "menampilkan data\nprofil saat ini", 1)],
        [("action", "ubah nama, telepon,\nalamat", 0)],
        [("action", "klik simpan\nperubahan", 0)],
        [("action", "validasi isian\nprofil", 1)],
        [("decision", "data valid?", 1)],
        [("action", "tampilkan pesan\nvalidasi", 1)],
        [("fork", "", 1)],
        [("action", "memasukkan data\nke database", 1),
         ("action", "menampilkan\npesan sukses", 1)],
        [("join", "", 1)],
        [("action", "profil terbaru\ntampil", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", ""), ("r4-0", "r5-0", ""), ("r5-0", "r6-0", ""),
        ("r6-0", "r7-0", "tidak"),
        ("r7-0", "r3-0", "perbaiki isian", "side"),
        ("r6-0", "r8-0", "ya"),
        ("r8-0", "r9-0", ""), ("r8-0", "r9-1", ""),
        ("r9-0", "r10-0", ""), ("r9-1", "r10-0", ""),
        ("r10-0", "r11-0", ""), ("r11-0", "r12-0", ""),
    ]),

    dict(name="4. Daftar Kendaraan",
         title="Daftar Kendaraan",
         lanes=["Guest", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "membuka halaman\ndaftar kendaraan", 0)],
        [("action", "query vehicle +\ncategory", 1)],
        [("decision", "ada data?", 1)],
        [("action", "tampilkan pesan\ndata kosong", 1)],
        [("action", "mengirim daftar\nkendaraan", 1)],
        [("action", "menampilkan kartu:\nfoto, kategori, harga,\nstatus unit", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", "tidak"),
        ("r4-0", "r1-0", "muat ulang", "side"),
        ("r3-0", "r5-0", "ya"), ("r5-0", "r6-0", ""), ("r6-0", "r7-0", ""),
    ]),

    dict(name="5. Pencarian & Filter Kendaraan",
         title="Pencarian dan Filter Kendaraan",
         lanes=["Pelanggan", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "ketik kata kunci /\npilih kategori", 0)],
        [("action", "submit pencarian", 0)],
        [("action", "query filter nama\n& kategori", 1)],
        [("decision", "ada hasil?", 1)],
        [("action", "tampilkan pesan\n'tidak ditemukan'", 1)],
        [("action", "menampilkan hasil\nterfilter", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", ""),
        ("r4-0", "r5-0", "tidak"),
        ("r5-0", "r1-0", "ubah kata kunci", "side"),
        ("r4-0", "r6-0", "ya"), ("r6-0", "r7-0", ""),
    ]),

    dict(name="6. Detail Kendaraan",
         title="Detail Kendaraan",
         lanes=["Pelanggan", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "klik kartu\nkendaraan", 0)],
        [("action", "ambil detail by slug\n+ ketersediaan unit", 1)],
        [("decision", "data ditemukan?", 1)],
        [("action", "tampilkan pesan\nkendaraan hilang", 1)],
        [("action", "menampilkan spesifikasi,\nfitur, harga, status", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", "tidak"),
        ("r4-0", "r1-0", "pilih lain", "side"),
        ("r3-0", "r5-0", "ya"), ("r5-0", "r6-0", ""),
    ]),

    dict(name="7. Pemesanan Kendaraan",
         title="Pemesanan Kendaraan",
         lanes=["Pelanggan", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "klik Pesan di detail\nkendaraan", 0)],
        [("action", "isi tanggal ambil &\nkembali + catatan", 0)],
        [("action", "submit pemesanan", 0)],
        [("action", "validasi tanggal\nlogis", 1)],
        [("decision", "tanggal\nbenar?", 1)],
        [("action", "tampilkan pesan\ntanggal salah", 1)],
        [("action", "cek bentrok booking\naktif lain", 1)],
        [("decision", "tanggal\ntersedia?", 1)],
        [("action", "tampilkan pesan\njadwal penuh", 1)],
        [("action", "hitung hari, biaya,\ndiskon (hlm. 8)", 1)],
        [("fork", "", 1)],
        [("action", "memasukkan booking\nke database\n(PENDING_PAYMENT)", 1),
         ("action", "menampilkan instruksi\nbayar DP 50%", 1)],
        [("join", "", 1)],
        [("action", "menampilkan ringkasan\npesanan + kode RG-...", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", ""), ("r4-0", "r5-0", ""),
        ("r5-0", "r6-0", "tidak"),
        ("r6-0", "r2-0", "perbaiki tanggal", "side"),
        ("r5-0", "r7-0", "ya"), ("r7-0", "r8-0", ""),
        ("r8-0", "r9-0", "tidak"),
        ("r9-0", "r2-0", "ganti tanggal", "side"),
        ("r8-0", "r10-0", "ya"), ("r10-0", "r11-0", ""),
        ("r11-0", "r12-0", ""), ("r11-0", "r12-1", ""),
        ("r12-0", "r13-0", ""), ("r12-1", "r13-0", ""),
        ("r13-0", "r14-0", ""), ("r14-0", "r15-0", ""),
    ]),

    dict(name="8. Perhitungan Biaya & Diskon",
         title="Perhitungan Biaya Sewa & Diskon Jangka Panjang",
         lanes=["Pelanggan", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "form pemesanan\nmengirim tanggal", 0)],
        [("action", "hitung lama sewa &\nsubtotal = hari x tarif", 1)],
        [("decision", "durasi >= 4\nhari?", 1)],
        [("action", "pakai diskon durasi\n(5/10/15/20%)", 1, 0),
         ("action", "tidak dapat\ndiskon (0%)", 1, 1)],
        [("action", "total = subtotal -\ndiskon", 1)],
        [("action", "hitung DP 50% &\nsisa 50%", 1)],
        [("fork", "", 1)],
        [("action", "menyimpan biaya\nsnapshot ke database", 1),
         ("action", "menampilkan rincian\nbiaya", 1)],
        [("join", "", 1)],
        [("action", "hasil tampil di form\npemesanan", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", "ya"), ("r3-0", "r4-1", "tidak"),
        ("r4-0", "r5-0", ""), ("r4-1", "r5-0", ""),
        ("r5-0", "r6-0", ""), ("r6-0", "r7-0", ""),
        ("r7-0", "r8-0", ""), ("r7-0", "r8-1", ""),
        ("r8-0", "r9-0", ""), ("r8-1", "r9-0", ""),
        ("r9-0", "r10-0", ""), ("r10-0", "r11-0", ""),
    ]),

    dict(name="9. Pembayaran Sewa (DP & Pelunasan)",
         title="Pembayaran Sewa: DP 50% & Pelunasan",
         lanes=["Pelanggan", "Sistem", "Admin"], rows=[
        [("start", "", 0)],
        [("action", "menampilkan total,\nDP 50%, metode bayar", 1)],
        [("action", "bayar DP + unggah\nbukti transfer", 0)],
        [("action", "simpan Payment DP\nstatus PENDING", 1)],
        [("action", "admin memeriksa\nbukti DP", 2)],
        [("decision", "DP cocok?", 2)],
        [("action", "minta unggah ulang\nbukti bayar", 1)],
        [("fork", "", 1)],
        [("action", "memasukkan data\nke database", 1),
         ("action", "menampilkan\npesan sukses", 1)],
        [("join", "", 1)],
        [("action", "booking status\nCONFIRMED", 1)],
        [("action", "bayar sisa 50% maks.\n24 jam sebelum ambil", 0)],
        [("action", "admin memeriksa\npelunasan", 2)],
        [("decision", "lunas 100%?", 2)],
        [("action", "kirim pengingat\npembayaran", 1)],
        [("fork", "", 1)],
        [("action", "memasukkan data\nke database", 1),
         ("action", "menampilkan jadwal\nserah terima", 1)],
        [("join", "", 1)],
        [("action", "status siap\nserah terima", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", ""), ("r4-0", "r5-0", ""),
        ("r5-0", "r6-0", "tidak"),
        ("r6-0", "r2-0", "unggah ulang", "side"),
        ("r5-0", "r7-0", "ya"),
        ("r7-0", "r8-0", ""), ("r7-0", "r8-1", ""),
        ("r8-0", "r9-0", ""), ("r8-1", "r9-0", ""),
        ("r9-0", "r10-0", ""), ("r10-0", "r11-0", ""),
        ("r11-0", "r12-0", ""), ("r12-0", "r13-0", ""),
        ("r13-0", "r14-0", "belum"),
        ("r14-0", "r11-0", "bayar lagi", "side"),
        ("r13-0", "r15-0", "ya"),
        ("r15-0", "r16-0", ""), ("r15-0", "r16-1", ""),
        ("r16-0", "r17-0", ""), ("r16-1", "r17-0", ""),
        ("r17-0", "r18-0", ""), ("r18-0", "r19-0", ""),
    ]),

    dict(name="10. Pembatalan Pesanan",
         title="Pembatalan Pesanan & Refund",
         lanes=["Pelanggan", "Sistem", "Admin"], rows=[
        [("start", "", 0)],
        [("action", "klik Batalkan pada\npesanan aktif", 0)],
        [("decision", "belum melewati\ntanggal sewa?", 1)],
        [("action", "tolak: sudah lewat\ntenggat / sudah diambil", 1)],
        [("action", "hitung jarak hari ke\ntanggal sewa -> % refund", 1)],
        [("action", "admin memproses\ntransfer refund", 2)],
        [("decision", "refund\nterkirim?", 2)],
        [("action", "retry transfer /\nescalate", 1)],
        [("fork", "", 1)],
        [("action", "update booking\nCANCELLED & jadwal\nunit dibebaskan", 1),
         ("action", "menampilkan info\njumlah refund", 1)],
        [("join", "", 1)],
        [("action", "unit kembali\nAVAILABLE", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""),
        ("r2-0", "r3-0", "tidak"), ("r3-0", "r12-0", ""),
        ("r2-0", "r4-0", "ya"), ("r4-0", "r5-0", ""), ("r5-0", "r6-0", ""),
        ("r6-0", "r7-0", "tidak"),
        ("r7-0", "r5-0", "coba lagi", "side"),
        ("r6-0", "r8-0", "ya"),
        ("r8-0", "r9-0", ""), ("r8-0", "r9-1", ""),
        ("r9-0", "r10-0", ""), ("r9-1", "r10-0", ""),
        ("r10-0", "r11-0", ""), ("r11-0", "r12-0", ""),
    ]),

    dict(name="11. Riwayat Penyewaan",
         title="Riwayat Penyewaan",
         lanes=["Pelanggan", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "membuka menu\nriwayat penyewaan", 0)],
        [("action", "query booking milik\nuser, urut terbaru", 1)],
        [("decision", "ada transaksi?", 1)],
        [("action", "tampilkan kosong +\ntombol cari kendaraan", 1)],
        [("action", "menampilkan daftar:\nkode, tanggal, total,\nstatus", 1)],
        [("action", "klik pesanan ->\ndetail & bukti bayar", 0)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", "tidak"),
        ("r4-0", "r7-0", ""),
        ("r3-0", "r5-0", "ya"), ("r5-0", "r6-0", ""), ("r6-0", "r7-0", ""),
    ]),

    dict(name="12. Kelola Kendaraan",
         title="Kelola Kendaraan (Admin)",
         lanes=["Admin", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "membuka menu\nkelola kendaraan", 0)],
        [("action", "menampilkan daftar\nvehicle + filter", 1)],
        [("action", "pilih operasi", 0)],
        [("action", "isi / ubah form\nvehicle", 0, 0),
         ("action", "ubah status unit /\nhapus data", 0, 1)],
        [("action", "submit data /\nkonfirmasi", 0)],
        [("action", "validasi data vehicle\n& relasi booking", 1)],
        [("decision", "valid & tidak\nada booking aktif?", 1)],
        [("action", "tolak: status\ndiubah saja", 1)],
        [("fork", "", 1)],
        [("action", "memasukkan data\nke database", 1),
         ("action", "menampilkan\npesan sukses", 1)],
        [("join", "", 1)],
        [("action", "daftar vehicle\nterbaru tampil", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", "tambah / ubah"),
        ("r3-0", "r4-1", "status / hapus"),
        ("r4-0", "r5-0", ""), ("r4-1", "r5-0", ""),
        ("r5-0", "r6-0", ""), ("r6-0", "r7-0", ""),
        ("r7-0", "r8-0", "tidak"),
        ("r8-0", "r4-1", "pakai status saja", "side"),
        ("r7-0", "r9-0", "ya"),
        ("r9-0", "r10-0", ""), ("r9-0", "r10-1", ""),
        ("r10-0", "r11-0", ""), ("r10-1", "r11-0", ""),
        ("r11-0", "r12-0", ""), ("r12-0", "r13-0", ""),
    ]),

    dict(name="13. Kelola Kategori Kendaraan",
         title="Kelola Kategori Kendaraan (Admin)",
         lanes=["Admin", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "membuka menu\nkelola kategori", 0)],
        [("action", "menampilkan daftar\nkategori", 1)],
        [("action", "pilih operasi", 0)],
        [("action", "isi nama & slug\nkategori", 0, 0),
         ("action", "hapus kategori", 0, 1)],
        [("action", "submit", 0)],
        [("action", "cek duplikat &\nrelasi vehicle", 1)],
        [("decision", "unik & tidak\ndipakai vehicle?", 1)],
        [("action", "tolak: ubah nama /\npindahkan vehicle", 1)],
        [("fork", "", 1)],
        [("action", "memasukkan data\nke database", 1),
         ("action", "menampilkan\npesan sukses", 1)],
        [("join", "", 1)],
        [("action", "daftar kategori\nterbaru tampil", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", "tambah / ubah"),
        ("r3-0", "r4-1", "hapus"),
        ("r4-0", "r5-0", ""), ("r4-1", "r5-0", ""),
        ("r5-0", "r6-0", ""), ("r6-0", "r7-0", ""),
        ("r7-0", "r8-0", "tidak"),
        ("r8-0", "r4-0", "perbaiki", "side"),
        ("r7-0", "r9-0", "ya"),
        ("r9-0", "r10-0", ""), ("r9-0", "r10-1", ""),
        ("r10-0", "r11-0", ""), ("r10-1", "r11-0", ""),
        ("r11-0", "r12-0", ""), ("r12-0", "r13-0", ""),
    ]),

    dict(name="14. Kelola Data Pelanggan",
         title="Kelola Data Pelanggan (Admin)",
         lanes=["Admin", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "membuka menu\nkelola pelanggan", 0)],
        [("action", "menampilkan daftar\npelanggan", 1)],
        [("action", "cari pelanggan /\nbuka detail", 0)],
        [("action", "mengirim detail profil\n& dokumen", 1)],
        [("action", "edit data / nonaktifkan\nakun (isActive)", 0)],
        [("action", "validasi perubahan", 1)],
        [("decision", "perubahan\nvalid?", 1)],
        [("action", "tampilkan pesan\nvalidasi", 1)],
        [("fork", "", 1)],
        [("action", "memasukkan data\nke database", 1),
         ("action", "menampilkan\npesan sukses", 1)],
        [("join", "", 1)],
        [("action", "daftar pelanggan\nterbaru tampil", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", ""), ("r4-0", "r5-0", ""), ("r5-0", "r6-0", ""),
        ("r6-0", "r7-0", ""),
        ("r7-0", "r8-0", "tidak"),
        ("r8-0", "r5-0", "perbaiki", "side"),
        ("r7-0", "r9-0", "ya"),
        ("r9-0", "r10-0", ""), ("r9-0", "r10-1", ""),
        ("r10-0", "r11-0", ""), ("r10-1", "r11-0", ""),
        ("r11-0", "r12-0", ""), ("r12-0", "r13-0", ""),
    ]),

    dict(name="15. Kelola Transaksi",
         title="Kelola Transaksi & Serah Terima (Admin)",
         lanes=["Admin", "Sistem", "Pelanggan"], rows=[
        [("start", "", 0)],
        [("action", "membuka transaksi\nmenunggu verifikasi", 0)],
        [("action", "menampilkan daftar\nbooking + status bayar", 1)],
        [("action", "tinjau booking\n& bukti DP", 0)],
        [("decision", "data, dokumen,\nDP valid?", 1)],
        [("action", "tolak booking ->\nrefund sesuai aturan", 1)],
        [("fork", "", 1)],
        [("action", "status CONFIRMED\nke database", 1),
         ("action", "notifikasi pelanggan\npesanan dikonfirmasi", 1)],
        [("join", "", 1)],
        [("action", "melunasi sisa\npembayaran", 2)],
        [("action", "serah terima: cek\nidentitas asli,\nunit RENTED/ACTIVE", 0)],
        [("action", "menyewa &\nmengembalikan unit", 2)],
        [("action", "cek kondisi unit,\ndenda bila terlambat", 0)],
        [("fork", "", 1)],
        [("action", "COMPLETED & unit\nAVAILABLE lagi", 1),
         ("action", "notifikasi selesai\n& arsip transaksi", 1)],
        [("join", "", 1)],
        [("action", "status transaksi\nterakhir", 1)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", ""),
        ("r4-0", "r5-0", "tidak"),
        ("r5-0", "r2-0", "pilih lain", "side"),
        ("r4-0", "r6-0", "ya"),
        ("r6-0", "r7-0", ""), ("r6-0", "r7-1", ""),
        ("r7-0", "r8-0", ""), ("r7-1", "r8-0", ""),
        ("r8-0", "r9-0", ""), ("r9-0", "r10-0", ""),
        ("r10-0", "r11-0", ""), ("r11-0", "r12-0", ""),
        ("r12-0", "r13-0", ""),
        ("r13-0", "r14-0", ""), ("r13-0", "r14-1", ""),
        ("r14-0", "r15-0", ""), ("r14-1", "r15-0", ""),
        ("r15-0", "r16-0", ""), ("r16-0", "r17-0", ""),
    ]),

    dict(name="16. Laporan Transaksi",
         title="Laporan Transaksi (Admin)",
         lanes=["Admin", "Sistem"], rows=[
        [("start", "", 0)],
        [("action", "membuka menu\nlaporan transaksi", 0)],
        [("action", "pilih rentang tanggal\n& filter status", 0)],
        [("action", "rekap booking + payment\nper periode", 1)],
        [("decision", "ada data?", 1)],
        [("action", "tampilkan pesan\ntidak ada transaksi", 1)],
        [("action", "menampilkan laporan:\nkode, pelanggan, total", 1)],
        [("action", "cetak / ekspor\nlaporan", 0)],
        [("end", "", 1)],
    ], edges=[
        ("r0-0", "r1-0", ""), ("r1-0", "r2-0", ""), ("r2-0", "r3-0", ""),
        ("r3-0", "r4-0", ""),
        ("r4-0", "r5-0", "tidak"),
        ("r5-0", "r2-0", "ganti periode", "side"),
        ("r4-0", "r6-0", "ya"), ("r6-0", "r7-0", ""), ("r7-0", "r8-0", ""),
    ]),
]


# ---------------------------------------------------------------- layout helpers
def sys_lane(lanes):
    for i, n in enumerate(lanes):
        if n.lower() in ("sistem", "system"):
            return i
    return len(lanes) - 1


def height_of(t):
    if t in ("start", "end"):
        return SE_WH
    if t == "decision":
        return DEC_H
    if t in ("fork", "join"):
        return 8
    return ACT_H


def guard(label):
    if not label:
        return ""
    if label.startswith("["):
        return label
    return f"[{label}]"


def item_col(item):
    return item[3] if len(item) > 3 else None


def fork_len(lane_w):
    return max(FORK_MIN_L, lane_w - 80)


def build_page(idx, spec):
    lanes = spec["lanes"]
    widths = lane_widths(lanes)
    sys_i = sys_lane(lanes)

    lane_x = []
    x = 40
    for w in widths:
        lane_x.append(x)
        x += w + LANE_GAP
    total_w = x - 40

    rows = spec["rows"]
    row_y = []
    y = LANE_H_PAD + 30
    for row in rows:
        t = row[0][0]
        row_y.append(y)
        if t in ("fork", "join"):
            y += 20
        else:
            y += height_of(t) + GAP_Y
        if t == "action" and len(row) >= 2:
            y += 10

    lane_h = y + 40
    title = spec.get("title") or spec["name"]

    nodes = {}
    for r, row in enumerate(rows):
        t0 = row[0][0]
        if t0 in ("fork", "join"):
            lane = sys_i
            L = fork_len(widths[lane])
            w, h = FORK_W, L
            lx = (widths[lane] - FORK_W) / 2
            ly = row_y[r] - L / 2 + 4
            nodes[f"r{r}-0"] = (t0, "", lane, lx, ly, w, h)
            continue

        by_lane = {}
        for k, item in enumerate(row):
            by_lane.setdefault(item[2], []).append((k, item))
        for lane, items in by_lane.items():
            W = widths[lane]
            cols_used = {item_col(it) for _, it in items if item_col(it) is not None}
            n_cols = max(len(cols_used), len(items))
            explicit = bool(cols_used)
            for j, (k, item) in enumerate(items):
                t, label = item[0], item[1]
                col = item_col(item)
                if t in ("start", "end"):
                    w = h = SE_WH
                elif t == "decision":
                    w, h = DEC_W, DEC_H
                else:
                    w, h = ACT_W, ACT_H
                if explicit and col is not None and n_cols > 1:
                    cx = W * (2 * col + 1) / (2 * n_cols)
                elif explicit and col is not None:
                    cx = W / 2
                else:
                    col_w = W / max(len(items), 1)
                    cx = j * col_w + col_w / 2
                lx = cx - w / 2
                nodes[f"r{r}-{k}"] = (t, label, lane, lx, row_y[r], w, h)

    pid = f"p{idx}"
    cells = []

    cells.append(
        f'<mxCell id="{pid}-title" value="{esc(title)}" style="{ST_TITLE}" vertex="1" parent="1">'
        f'<mxGeometry x="{40 + total_w/2 - 240}" y="{TITLE_Y}" width="480" height="30" as="geometry"/></mxCell>'
    )

    for i, name in enumerate(lanes):
        cells.append(
            f'<mxCell id="{pid}-L{i}" value="{esc(name)}" style="{ST_LANE}" vertex="1" parent="1">'
            f'<mxGeometry x="{lane_x[i]}" y="{Y0}" width="{widths[i]}" height="{lane_h}" as="geometry"/></mxCell>'
        )

    for key, (t, label, lane, lx, ly, w, h) in nodes.items():
        style, val = {
            "start": (ST_START, ""), "end": (ST_END, ""),
            "fork": (ST_FORK, ""), "join": (ST_FORK, ""),
            "decision": (ST_DECISION, esc(label)),
        }.get(t, (ST_ACTION, esc(label)))
        cells.append(
            f'<mxCell id="{pid}-{key}" value="{val}" style="{style}" vertex="1" parent="{pid}-L{lane}">'
            f'<mxGeometry x="{lx:.1f}" y="{ly:.1f}" width="{w}" height="{h}" as="geometry"/></mxCell>'
        )

    def abs_box(key):
        t, _, lane, lx, ly, w, h = nodes[key]
        ax = lane_x[lane] + lx
        ay = Y0 + ly
        if t in ("fork", "join"):
            cx, cy = ax + w / 2, ay + h / 2
            return cx - h / 2, cy - w / 2, h, w
        return ax, ay, w, h

    def lane_cx(key):
        _, _, lane, lx, _, w, _ = nodes[key]
        return lx + w / 2

    bar_keys = {k for k, v in nodes.items() if v[0] in ("fork", "join")}
    bar_out, bar_in = {k: [] for k in bar_keys}, {k: [] for k in bar_keys}
    for s, d, *_ in spec["edges"]:
        if s in bar_out:
            bar_out[s].append(d)
        if d in bar_in:
            bar_in[d].append(s)
    frac_out, frac_in = {}, {}

    def frac_on_bar(bar, node_key):
        lane = nodes[bar][2]
        W = widths[lane]
        L = fork_len(W)
        t = 0.5 + (lane_cx(node_key) - W / 2) / L
        return min(0.95, max(0.05, t))

    for bar, lst in bar_out.items():
        for dst in lst:
            frac_out[(bar, dst)] = frac_on_bar(bar, dst)
    for bar, lst in bar_in.items():
        for src in lst:
            frac_in[(src, bar)] = frac_on_bar(bar, src)

    side_base = 40 + total_w + 30
    side_slot = 0
    page_right = 40 + total_w + 20

    for e_i, (s, d, label, *opts) in enumerate(spec["edges"]):
        side = bool(opts) and opts[0] == "side"
        lab = guard(label) if label else ""
        style = ST_EDGE
        geo = '<mxGeometry relative="1" as="geometry"/>'
        same_lane = nodes[s][2] == nodes[d][2]
        parent = f"{pid}-L{nodes[s][2]}" if same_lane and not side else "1"

        if side:
            sx, sy, sw, sh = abs_box(s)
            dx, dy, dw, dh = abs_box(d)
            rx = side_base + 28 * side_slot
            side_slot += 1
            page_right = max(page_right, rx + 40)
            style += "exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;"
            geo = ('<mxGeometry relative="1" as="geometry"><Array as="points">'
                   f'<mxPoint x="{rx:.1f}" y="{sy + sh/2:.1f}"/>'
                   f'<mxPoint x="{rx:.1f}" y="{dy + dh/2:.1f}"/>'
                   "</Array></mxGeometry>")
            parent = "1"
        else:
            if s in bar_keys and (s, d) in frac_out:
                style += f"exitX=0;exitY={frac_out[(s, d)]:.3f};exitDx=0;exitDy=0;exitPerimeter=0;"
            if d in bar_keys and (s, d) in frac_in:
                style += f"entryX=0;entryY={frac_in[(s, d)]:.3f};entryDx=0;entryDy=0;entryPerimeter=0;"

        cells.append(
            f'<mxCell id="{pid}-e{e_i}" value="{esc(lab)}" style="{style}" edge="1" '
            f'parent="{parent}" source="{pid}-{s}" target="{pid}-{d}">{geo}</mxCell>'
        )

    page_w = int(page_right + 20)
    page_h = int(Y0 + lane_h + 40)
    body = "\n".join("        " + c for c in cells)
    return (
        f'  <diagram id="pg-{idx}" name="{esc(spec["name"])}">\n'
        f'    <mxGraphModel dx="1400" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" '
        f'connect="1" arrows="1" fold="1" page="1" pageScale="1" '
        f'pageWidth="{page_w}" pageHeight="{page_h}" math="0" shadow="0">\n'
        f'      <root>\n        <mxCell id="0"/>\n        <mxCell id="1" parent="0"/>\n'
        f'{body}\n      </root>\n    </mxGraphModel>\n  </diagram>'
    )


out = ['<?xml version="1.0" encoding="UTF-8"?>', '<mxfile host="app.diagrams.net">']
for i, spec in enumerate(PAGES, 1):
    out.append(build_page(i, spec))
out.append("</mxfile>")

path = r"C:\rent-go\docs\Activity Diagram per Fitur - RentGo (gaya swimlane).drawio"
import os
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, "w", encoding="utf-8") as f:
    f.write("\n".join(out) + "\n")

tree = ET.parse(path)
diags = tree.getroot().findall("diagram")
total_edges = total_nodes = 0
for d in diags:
    ids = [c.get("id") for c in d.iter("mxCell") if c.get("id")]
    dup = {i for i in ids if ids.count(i) > 1}
    assert not dup, f"{d.get('name')}: duplicate id {dup}"
    idset = set(ids)
    for c in d.iter("mxCell"):
        if c.get("edge") == "1":
            total_edges += 1
            assert c.get("source") in idset, f"{d.get('name')}: src {c.get('source')} missing"
            assert c.get("target") in idset, f"{d.get('name')}: tgt {c.get('target')} missing"
        elif c.get("vertex") == "1":
            total_nodes += 1

# overlap check (absolute boxes, rotation-aware)
for d in diags:
    cells = {c.get("id"): c for c in d.iter("mxCell")}
    lanes = {cid: (float(c.find("mxGeometry").get("x")), float(c.find("mxGeometry").get("y")))
             for cid, c in cells.items() if "swimlane" in (c.get("style") or "")}
    boxes = []
    for cid, c in cells.items():
        if c.get("vertex") != "1":
            continue
        st = c.get("style") or ""
        if "swimlane" in st or "text;" in st:
            continue
        g = c.find("mxGeometry")
        x, y, w, h = (float(g.get(k)) for k in ("x", "y", "width", "height"))
        if c.get("parent") in lanes:
            lx, ly = lanes[c.get("parent")]
            x += lx
            y += ly
        if "rotation=90" in st:
            cx, cy = x + w / 2, y + h / 2
            x, y, w, h = cx - h / 2, cy - w / 2, h, w
        boxes.append((cid, x, y, w, h))
    for i, a in enumerate(boxes):
        for b in boxes[i + 1:]:
            if a[3] < 10 or b[3] < 10:
                continue
            if not (a[1] >= b[1] + b[3] or b[1] >= a[1] + a[3] or
                    a[2] >= b[2] + b[4] or b[2] >= a[2] + a[4]):
                raise AssertionError(f"{d.get('name')}: overlap {a[0]} {b[0]}")

print(f"OK: {len(diags)} halaman, {total_nodes} vertex, {total_edges} edge")
print(path)
