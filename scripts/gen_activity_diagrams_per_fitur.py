# RentGo: activity diagram PER FITUR (PRD v1.0), tiap fitur = 1 halaman/tab draw.io.
# Satu file .drawio berisi 16 <diagram> (page tabs). Layout koordinat absolut + edge orthogonal.
import io, os
import html as H
import xml.etree.ElementTree as ET

def esc(v): return H.escape(v, quote=True)

X0, Y0 = 40, 110
COL_W, ROW_H = 270, 88
NODE_W, NODE_H = 210, 48
DEC_W, DEC_H = 150, 78
START_D, END_D, END_INNER = 34, 44, 24

ST = {
    "action": "rounded=1;whiteSpace=wrap;html=1;arcSize=20;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=11;",
    "decision": "rhombus;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00;fontSize=10;",
    "start": "ellipse;html=1;aspect=fixed;fillColor=#000000;strokeColor=#000000;",
    "end": "ellipse;html=1;aspect=fixed;fillColor=#ffffff;strokeColor=#000000;strokeWidth=2;",
}

# node = (id, col, row, kind, label); edge kinds: dn (down), rt (a -> right node),
# ul (node on right loops UP into left target's right side), jr (jump down across cols,
# entry fraction), lf (exit left, enter right)
PAGES = []

def page(name, nodes, edges, notes=()):
    PAGES.append(dict(name=name, nodes=nodes, edges=edges, notes=list(notes)))

# ── 01 Registrasi & Login ───────────────────────────────────────────
page("01 Registrasi & Login",
[("s",0,0,"start",""),("reg",0,1,"action","Isi form registrasi<br>(nama, email, kata sandi)"),
 ("v",0,2,"action","Sistem validasi data<br>& keunikan email"),("d1",0,3,"decision","Data valid?"),
 ("e1",1,3,"action","Tampilkan pesan<br>kesalahan isian"),
 ("sacc",0,4,"action","Buat akun role CUSTOMER<br>(password di-hash)"),
 ("login",0,5,"action","Login dengan email<br>& kata sandi"),
 ("d2",0,6,"decision","Kredensial benar?"),
 ("e2",1,6,"action","Tampilkan pesan<br>login gagal"),
 ("home",0,7,"action","Sesi terbentuk, arahkan<br>ke dashboard"),
 ("end",0,8,"end","")],
[("dn","s","reg"),("dn","reg","v"),("dn","v","d1"),("rt","d1","e1","Tidak"),("ul","e1","reg"),
 ("dn","d1","sacc","Ya"),("dn","sacc","login"),("dn","login","d2"),("rt","d2","e2","Tidak"),
 ("ul","e2","login"),("dn","d2","home","Ya"),("dn","home","end")],
[("NFR Security: password disimpan terenkripsi (hash), bukan plaintext. Akses fitur dibatasi per role (guest / pelanggan / admin).","sacc")])

# ── 02 Upload Dokumen Identitas ─────────────────────────────────────
page("02 Upload Dokumen Identitas",
[("s",0,0,"start",""),("upl",0,1,"action","Pelanggan unggah foto<br>KTP & SIM dari halaman profil"),
 ("chk",0,2,"action","Sistem cek format<br>& ukuran file"),("d1",0,3,"decision","File valid?"),
 ("e1",1,3,"action","Pesan: unggah<br>ulang file"),
 ("sv",0,4,"action","Simpan dokumen<br>status PENDING (Storage)"),
 ("adm",0,5,"action","Dokumen masuk daftar<br>antrean verifikasi admin"),
 ("rev",0,6,"action","Admin memeriksa<br>KTP & SIM"),
 ("d2",0,7,"decision","Dokumen sesuai<br>& masih berlaku?"),
 ("rj",1,7,"action","Set REJECTED, kabari<br>pelanggan + alasan"),
 ("ok",0,8,"action","Set status VERIFIED"),
 ("done",0,9,"action","Pelanggan boleh<br>membuat pemesanan"),
 ("end",0,10,"end","")],
[("dn","s","upl"),("dn","upl","chk"),("dn","chk","d1"),("rt","d1","e1","Tidak"),("ul","e1","upl"),
 ("dn","d1","sv","Ya"),("dn","sv","adm"),("dn","adm","rev"),("dn","rev","d2"),
 ("rt","d2","rj","Tidak"),("ul","rj","upl"),("dn","d2","ok","Ya"),("dn","ok","done"),("dn","done","end")],
[("BR Validasi: KTP & SIM diverifikasi manual oleh admin; pemesanan hanya dapat diproses bila data & dokumen dinyatakan lengkap dan valid (status VERIFIED).","rev")])

# ── 03 Kelola Profil ────────────────────────────────────────────────
page("03 Kelola Profil",
[("s",0,0,"start",""),("open",0,1,"action","Pengguna membuka<br>halaman profil"),
 ("show",0,2,"action","Sistem menampilkan<br>data profil saat ini"),
 ("edit",0,3,"action","Ubah nama, telepon,<br>alamat"),
 ("sv",0,4,"action","Klik Simpan perubahan"),
 ("d1",0,5,"decision","Data isian valid?"),
 ("err",1,5,"action","Tampilkan pesan<br>validasi"),
 ("store",0,6,"action","Sistem menyimpan<br>perubahan"),
 ("ok",0,7,"action","Pesan berhasil,<br>profil terbaru tampil"),
 ("end",0,8,"end","")],
[("dn","s","open"),("dn","open","show"),("dn","show","edit"),("dn","edit","sv"),("dn","sv","d1"),
 ("rt","d1","err","Tidak"),("ul","err","edit"),("dn","d1","store","Ya"),("dn","store","ok"),("dn","ok","end")])

# ── 04 Daftar Kendaraan ─────────────────────────────────────────────
page("04 Daftar Kendaraan",
[("s",0,0,"start",""),("open",0,1,"action","Guest / pelanggan membuka<br>halaman daftar kendaraan"),
 ("q",0,2,"action","Sistem mengambil data<br>vehicle + category"),
 ("show",0,3,"action","Tampilkan kartu: foto, nama,<br>kategori, harga/hari, status unit"),
 ("d1",0,4,"decision","Ada kendaraan?"),
 ("emp",1,4,"action","Tampilkan pesan<br>data kosong"),
 ("end",0,5,"end","")],
[("dn","s","open"),("dn","open","q"),("dn","q","show"),("dn","show","d1"),
 ("rt","d1","emp","Tidak"),("jr","emp","end",0.8),
 ("dn","d1","end","Ya")])

# ── 05 Pencarian & Filter Kendaraan ─────────────────────────────────
page("05 Pencarian & Filter",
[("s",0,0,"start",""),("inp",0,1,"action","Ketik kata kunci nama /<br>pilih kategori kendaraan"),
 ("run",0,2,"action","Sistem mencari & memfilter<br>berdasarkan nama / kategori"),
 ("d1",0,3,"decision","Ada hasil?"),
 ("none",1,3,"action","Pesan tidak cocok,<br>sarankan kata kunci lain"),
 ("lst",0,4,"action","Tampilkan hasil terfilter"),
 ("end",0,5,"end","")],
[("dn","s","inp"),("dn","inp","run"),("dn","run","d1"),("rt","d1","none","Tidak"),("ul","none","inp"),
 ("dn","d1","lst","Ya"),("dn","lst","end")])

# ── 06 Detail Kendaraan ─────────────────────────────────────────────
page("06 Detail Kendaraan",
[("s",0,0,"start",""),("clk",0,1,"action","Pengguna klik kartu<br>kendaraan"),
 ("load",0,2,"action","Sistem memuat data<br>vehicle berdasarkan slug"),
 ("d1",0,3,"decision","Data ditemukan?"),
 ("nf",1,3,"action","Pesan kendaraan<br>tidak ditemukan"),
 ("show",0,4,"action","Tampilkan spesifikasi lengkap,<br>fitur, harga sewa, status ketersediaan"),
 ("btn",0,5,"action","Klik tombol<br>Pesan / Sewa"),
 ("end",0,6,"end","")],
[("dn","s","clk"),("dn","clk","load"),("dn","load","d1"),("rt","d1","nf","Tidak"),
 ("ul","nf","clk"),("dn","d1","show","Ya"),("dn","show","btn"),("dn","btn","end")],
[("Lanjutan alur pemesanan berada di halaman 07 Pemesanan Kendaraan.","show")])

# ── 07 Pemesanan Kendaraan ──────────────────────────────────────────
page("07 Pemesanan Kendaraan",
[("s",0,0,"start",""),("date",0,1,"action","Pilih tanggal ambil &<br>kembali + catatan"),
 ("d1",0,2,"decision","Tanggal logis?<br>(kembali > ambil)"),
 ("e1",1,2,"action","Pesan: perbaiki<br>tanggal"),
 ("chk",0,3,"action","Sistem cek booking kendaraan<br>lain pada rentang tanggal"),
 ("d2",0,4,"decision","Tanggal tersedia?<br>(tidak bentrok)"),
 ("e2",1,4,"action","Pesan tanggal penuh,<br>sarankan tanggal lain"),
 ("calc",0,5,"action","Sistem hitung lama sewa, total,<br>& diskon (lihat hlm 08)"),
 ("crea",0,6,"action","Buat kode booking RG-…,<br>snapshot harga, DP 50%"),
 ("st",0,7,"action","Simpan booking status<br>PENDING_PAYMENT"),
 ("show",0,8,"action","Tampilkan ringkasan pesanan<br>& instruksi bayar DP"),
 ("end",0,9,"end","")],
[("dn","s","date"),("dn","date","d1"),("rt","d1","e1","Tidak"),("ul","e1","date"),
 ("dn","d1","chk","Ya"),("dn","chk","d2"),("rt","d2","e2","Tidak"),("ul","e2","date"),
 ("dn","d2","calc","Ya"),("dn","calc","crea"),("dn","crea","st"),("dn","st","show"),("dn","show","end")],
[("BR: kendaraan hanya dapat dipesan bila tersedia pada rentang tanggal tsb dan tidak ada booking aktif lain yang bertabrakan.","chk")])

# ── 08 Perhitungan Biaya & Diskon ───────────────────────────────────
page("08 Biaya Sewa & Diskon",
[("s",0,0,"start",""),("pre",0,1,"action","Booking dibuat<br>(tanggal dipilih)"),
 ("days",0,2,"action","Hitung lama sewa =<br>tanggal kembali - tanggal ambil"),
 ("sub",0,3,"action","Subtotal = hari x tarif/hari<br>(harga saat order / snapshot)"),
 ("d1",0,4,"decision","Durasi >= 4 hari?"),
 ("yes",1,4,"action","Pakai diskon sesuai<br>tier durasi (lihat catatan)"),
 ("no",1,5,"action","Tidak dapat diskon<br>(0%)"),
 ("total",0,6,"action","Total = subtotal - diskon"),
 ("dp",0,7,"action","DP = 50% x total,<br>sisa = 50%"),
 ("ret",0,8,"action","Hasil ditampilkan pada<br>form pemesanan"),
 ("end",0,9,"end","")],
[("dn","s","pre"),("dn","pre","days"),("dn","days","sub"),("dn","sub","d1"),
 ("rt","d1","yes","Ya"),("rt","d1","no","Tidak"),
 ("jr","yes","total",0.35),("jr","no","total",0.65),
 ("dn","total","dp"),("dn","dp","ret"),("dn","ret","end")],
[("Tier diskon (BR): 1-3 hari 0%; 4-7 hari 5%; 8-10 hari 10%; 11-14 hari 15%; >14 hari 20%. Total = (hari x tarif) x (100 - diskon)/100.","yes")])

# ── 09 Pembayaran Sewa (DP & Pelunasan) ─────────────────────────────
page("09 Pembayaran DP & Pelunasan",
[("s",0,0,"start",""),("pre",0,1,"action","Booking status<br>PENDING_PAYMENT"),
 ("info",0,2,"action","Sistem tampilkan total, DP 50%<br>& metode (transfer/QRIS/cash)"),
 ("pay",0,3,"action","Pelanggan bayar DP +<br>unggah bukti transfer"),
 ("sv",0,4,"action","Simpan Payment DP<br>status PENDING"),
 ("ver",0,5,"action","Admin memeriksa<br>bukti DP"),
 ("d1",0,6,"decision","DP cocok?"),
 ("bad",1,6,"action","Minta unggah ulang<br>bukti pembayaran"),
 ("conf",0,7,"action","Status booking<br>CONFIRMED"),
 ("pay2",0,8,"action","Pelanggan bayar sisa 50%<br>+ unggah bukti"),
 ("ver2",0,9,"action","Admin memeriksa<br>pelunasan"),
 ("d2",0,10,"decision","Lunas 100%?"),
 ("rem",1,10,"action","Reminder: bayar sisa maks.<br>24 jam sebelum ambil"),
 ("end",0,11,"end","")],
[("dn","s","pre"),("dn","pre","info"),("dn","info","pay"),("dn","pay","sv"),("dn","sv","ver"),
 ("dn","ver","d1"),("rt","d1","bad","Tidak"),("ul","bad","pay"),("dn","d1","conf","Ya"),
 ("dn","conf","pay2"),("dn","pay2","ver2"),("dn","ver2","d2"),
 ("rt","d2","rem","Belum"),("ul","rem","pay2"),("dn","d2","end","Ya")],
[("BR: DP 50% wajib untuk konfirmasi; pelunasan maks. 24 jam sebelum pengambilan; kendaraan hanya diserahkan bila lunas 100%.","info")])

# ── 10 Pembatalan Pesanan ───────────────────────────────────────────
page("10 Pembatalan Pesanan",
[("s",0,0,"start",""),("req",0,1,"action","Pelanggan membuka booking<br>& klik Batalkan Pesanan"),
 ("d1",0,2,"decision","DP sudah dibayar?"),
 ("free",1,2,"action","Status CANCELLED,<br>tidak ada refund"),
 ("calc",0,3,"action","Sistem hitung jarak hari ke<br>tanggal sewa -> % refund"),
 ("ref",0,4,"action","Buat Payment REFUND:<br>dibayar x % - denda"),
 ("notif",0,5,"action","Admin diberitahu untuk<br>mentransfer dana refund"),
 ("done",0,6,"action","Status CANCELLED, kendaraan<br>kembali AVAILABLE"),
 ("end",0,7,"end","")],
[("dn","s","req"),("dn","req","d1"),("rt","d1","free","Tidak"),("jr","free","end",0.8),
 ("dn","d1","calc","Ya"),("dn","calc","ref"),("dn","ref","notif"),("dn","notif","done"),("dn","done","end")],
[("Refund pembatalan pelanggan (BR): >7 hari = 100%; 3-7 hari = 90%; <3 hari = 75%; pada tanggal sewa / tidak datang = 0%. Jika RentGo yang membatalkan (rusak/hambatan) = 100%.","calc")])

# ── 11 Riwayat Penyewaan ────────────────────────────────────────────
page("11 Riwayat Penyewaan",
[("s",0,0,"start",""),("open",0,1,"action","Pengguna membuka menu<br>Riwayat Penyewaan"),
 ("q",0,2,"action","Sistem query booking milik<br>user, urut terbaru"),
 ("d1",0,3,"decision","Ada transaksi?"),
 ("emp",1,3,"action","Tampilkan kosong + tombol<br>ke daftar kendaraan"),
 ("lst",0,4,"action","Daftar: kode booking, kendaraan,<br>tanggal, total, status"),
 ("det",0,5,"action","Klik pesanan -> detail &<br>download bukti bayar"),
 ("end",0,6,"end","")],
[("dn","s","open"),("dn","open","q"),("dn","q","d1"),("rt","d1","emp","Tidak"),
 ("jr","emp","end",0.8),("dn","d1","lst","Ya"),("dn","lst","det"),("dn","det","end")])

# ── 12 Kelola Kendaraan (admin) ─────────────────────────────────────
page("12 Kelola Kendaraan",
[("s",0,0,"start",""),("lst",0,1,"action","Admin membuka daftar<br>vehicle + filter"),
 ("dops",0,2,"decision","Operasi apa?"),
 ("aE",1,3,"action","Tambah / ubah data<br>vehicle"),
 ("aF",2,3,"action","Isi form: nama, kategori, tarif,<br>spek, fitur, foto"),
 ("dA",2,4,"decision","Data valid?"),
 ("eA",1,4,"action","Pesan kesalahan<br>form"),
 ("svA",2,5,"action","Simpan vehicle<br>(slug unik)"),
 ("b3",1,6,"action","Perbarui status<br>ketersediaan"),
 ("s3",2,7,"action","Set AVAILABLE / RENTED /<br>MAINTENANCE / INACTIVE"),
 ("b1",1,8,"action","Hapus kendaraan"),
 ("dC",2,8,"decision","Ada booking<br>aktif?"),
 ("errR",3,8,"action","Ditolak: ubah status<br>saja"),
 ("doDel",2,9,"action","Hapus data kendaraan"),
 ("join",0,10,"action","Daftar vehicle tampil<br>terkini"),
 ("end",0,11,"end","")],
[("dn","s","lst"),("dn","lst","dops"),
 ("rt","dops","aE","Tambah/ubah"),("rt","aE","aF"),("dn","aF","dA"),
 ("lf","dA","eA","Tidak"),("ur","eA","aF"),("dn","dA","svA","Ya"),
 ("rt","dops","b3","Status"),("rt","b3","s3"),
 ("rt","dops","b1","Hapus"),("rt","b1","dC"),("rt","dC","errR","Ya"),
 ("ub","errR","b1"),("dn","dC","doDel","Tidak"),
 ("jr","svA","join",0.3),("jr","s3","join",0.5),("jr","doDel","join",0.7),
 ("dn","join","end")])

# ── 13 Kelola Kategori Kendaraan ────────────────────────────────────
page("13 Kelola Kategori",
[("s",0,0,"start",""),("lst",0,1,"action","Admin membuka daftar kategori<br>(Mobil, Motor, ...)"),
 ("dops",0,2,"decision","Operasi apa?"),
 ("nE",1,3,"action","Tambah / ubah kategori"),
 ("nF",2,3,"action","Isi nama & slug kategori"),
 ("dD",2,4,"decision","Nama/slug sudah<br>dipakai?"),
 ("eD",3,4,"action","Pesan duplikat"),
 ("sv",2,5,"action","Simpan kategori"),
 ("dE",1,6,"action","Hapus kategori"),
 ("dH",2,6,"decision","Ada vehicle memakai<br>kategori ini?"),
 ("errR",3,6,"action","Pindahkan vehicle<br>terlebih dulu"),
 ("doDel",2,7,"action","Hapus data kategori"),
 ("join",0,8,"action","Daftar kategori<br>tampil terkini"),
 ("end",0,9,"end","")],
[("dn","s","lst"),("dn","lst","dops"),
 ("rt","dops","nE","Tambah/ubah"),("rt","nE","nF"),("dn","nF","dD"),
 ("rt","dD","eD","Ya"),("ul","eD","nF"),("dn","dD","sv","Tidak"),
 ("rt","dops","dE","Hapus"),("rt","dE","dH"),("rt","dH","errR","Ya"),
 ("ub","errR","dE"),("dn","dH","doDel","Tidak"),
 ("jr","sv","join",0.3),("jr","doDel","join",0.7),
 ("dn","join","end")])

# ── 14 Kelola Data Pelanggan ────────────────────────────────────────
page("14 Kelola Data Pelanggan",
[("s",0,0,"start",""),("open",0,1,"action","Admin membuka menu<br>Kelola Pelanggan"),
 ("srch",0,2,"action","Cari pelanggan<br>(nama / email)"),
 ("lst",0,3,"action","Daftar: nama, kontak, status<br>dokumen, jumlah booking"),
 ("det",0,4,"action","Klik pelanggan -> detail profil<br>& dokumen KTP/SIM"),
 ("act",0,5,"action","Edit data / nonaktifkan<br>akun (isActive)"),
 ("d1",0,6,"decision","Konfirmasi perubahan?"),
 ("cancel",1,6,"action","Batal, tidak ada<br>perubahan"),
 ("save",0,7,"action","Sistem menyimpan<br>perubahan"),
 ("done",0,8,"action","Daftar pelanggan<br>terkini"),
 ("end",0,9,"end","")],
[("dn","s","open"),("dn","open","srch"),("dn","srch","lst"),("dn","lst","det"),("dn","det","act"),
 ("dn","act","d1"),("rt","d1","cancel","Tidak"),("jr","cancel","end",0.8),
 ("dn","d1","save","Ya"),("dn","save","done"),("dn","done","end")],
[("BR hak akses: data pribadi & dokumen pelanggan hanya dapat diakses pelanggan bersangkutan dan admin berwenang.","det")])

# ── 15 Kelola Transaksi ─────────────────────────────────────────────
page("15 Kelola Transaksi",
[("s",0,0,"start",""),("flt",0,1,"action","Admin membuka transaksi +<br>filter status"),
 ("lst",0,2,"action","Daftar booking menunggu<br>verifikasi / aktif"),
 ("det",0,3,"action","Buka detail: pelanggan, unit,<br>status DP & pelunasan"),
 ("d1",0,4,"decision","Data, dokumen, DP<br>semuanya valid?"),
 ("rej",1,4,"action","Tolak booking -><br>refund sesuai aturan"),
 ("conf",0,5,"action","Konfirmasi booking<br>CONFIRMED"),
 ("d2",0,6,"decision","Waktu ambil<br>tiba?"),
 ("wait",1,6,"action","Tunggu / reminder<br>ke pelanggan"),
 ("hand",0,7,"action","Serah terima: cek identitas asli,<br>booking ACTIVE, unit RENTED"),
 ("d3",0,8,"decision","Kendaraan<br>dikembalikan?"),
 ("notyet",1,8,"action","Masa sewa masih<br>berjalan"),
 ("done",0,9,"action","Cek kondisi unit, denda bila<br>terlambat, status COMPLETED"),
 ("fin",0,10,"action","Unit kembali AVAILABLE,<br>status tersimpan"),
 ("end",0,11,"end","")],
[("dn","s","flt"),("dn","flt","lst"),("dn","lst","det"),("dn","det","d1"),
 ("rt","d1","rej","Tidak"),("ul","rej","lst"),("dn","d1","conf","Ya"),("dn","conf","d2"),
 ("rt","d2","wait","Belum"),("ul","wait","d2"),("dn","d2","hand","Ya"),("dn","hand","d3"),
 ("rt","d3","notyet","Belum"),("ul","notyet","d3"),("dn","d3","done","Ya"),
 ("dn","done","fin"),("dn","fin","end")],
[("Admin berhak mengonfirmasi pemesanan/pembayaran, memperbarui status transaksi & kendaraan, dan membatalkan bila ada hambatan dari pihak rental (refund 100%).","det")])

# ── 16 Laporan Transaksi ────────────────────────────────────────────
page("16 Laporan Transaksi",
[("s",0,0,"start",""),("period",0,1,"action","Admin pilih rentang tanggal /<br>filter status"),
 ("gen",0,2,"action","Sistem rekap transaksi &<br>pendapatan per periode"),
 ("d1",0,3,"decision","Ada data?"),
 ("emp",1,3,"action","Pesan tidak ada<br>transaksi"),
 ("rep",0,4,"action","Tampilkan laporan: kode booking,<br>pelanggan, unit, periode, total, status"),
 ("exp",0,5,"action","Cetak / ekspor PDF"),
 ("end",0,6,"end","")],
[("dn","s","period"),("dn","period","gen"),("dn","gen","d1"),("rt","d1","emp","Tidak"),
 ("ul","emp","period"),("dn","d1","rep","Ya"),("dn","rep","exp"),("dn","exp","end")],
[("Laporan bersumber dari data booking & payment yang tersimpan otomatis di database (NFR Reliability).","gen")])

# ═════════════════════════════════════════════════════════════════════
def build_page(diagram_id, name, nodes, edges, notes):
    pos = {}
    for (i,c,r,k,l) in nodes:
        w,h = {"action":(NODE_W,NODE_H),"decision":(DEC_W,DEC_H),"start":(START_D,START_D),"end":(END_D,END_D)}[k]
        cx = X0 + c*COL_W + COL_W//2
        y  = Y0 + 40 + r*ROW_H
        pos[i] = (cx - w/2, y, w, h, c)
    maxr = max(n[2] for n in nodes); maxc = max(n[1] for n in nodes) + 1
    notes_w = 260 if notes else 0
    note_x = X0 + maxc*COL_W + 60
    W = maxc*COL_W + (notes_w + 90 if notes else 60) + 120
    H_ = Y0 + 40 + maxr*ROW_H + 160

    cells = []
    nid = [0]
    def nx():
        nid[0] += 1; return f"c{nid[0]}"
    cells.append(f'<mxCell id="{nx()}" parent="1" value="{esc(name[3:] if name[1:3]==" " else name)}" '
        'style="text;html=1;align=left;verticalAlign=middle;fontSize=16;fontStyle=1;" vertex="1">'
        f'<mxGeometry x="{X0}" y="26" width="700" height="34" as="geometry"/></mxCell>')
    node_ids = {}
    for (i,c,r,k,l) in nodes:
        x,y,w,h,_ = pos[i]; cid = nx(); node_ids[i]=cid
        cells.append(f'<mxCell id="{cid}" parent="1" value="{esc(l)}" style="{ST[k]}" vertex="1">'
                     f'<mxGeometry x="{x:g}" y="{y:g}" width="{w}" height="{h}" as="geometry"/></mxCell>')
        if k == "end":
            iid = nx()
            cells.append(f'<mxCell id="{iid}" parent="1" value="" '
                'style="ellipse;html=1;fillColor=#000000;strokeColor=none;" vertex="1">'
                f'<mxGeometry x="{x+(END_D-END_INNER)/2:g}" y="{y+(END_D-END_INNER)/2:g}" '
                f'width="{END_INNER}" height="{END_INNER}" as="geometry"/></mxCell>')

    def cx_(i): x,y,w,h,_ = pos[i]; return x+w/2
    def cy_(i,f=0.5): x,y,w,h,_ = pos[i]; return y+h*f
    EX = {"b":"exitX=0.5;exitY=1;exitDx=0;exitDy=0;","t":"exitX=0.5;exitY=0;exitDx=0;exitDy=0;",
          "l":"exitX=0;exitY=0.5;exitDx=0;exitDy=0;","r":"exitX=1;exitY=0.5;exitDx=0;exitDy=0;"}
    EN = {"b":"entryX=0.5;entryY=1;entryDx=0;entryDy=0;","t":"entryX=0.5;entryY=0;entryDx=0;entryDy=0;",
          "l":"entryX=0;entryY=0.5;entryDx=0;entryDy=0;","r":"entryX=1;entryY=0.5;entryDx=0;entryDy=0;"}
    def put(a,b,label,ex,en,pts=()):
        eid = nx()
        st=("edgeStyle=orthogonalEdgeStyle;rounded=1;jettySize=auto;html=1;endArrow=block;endFill=1;"
            f"fontColor=#333333;fontSize=10;labelBackgroundColor=#ffffff;{ex}{en}")
        geo='<mxGeometry relative="1" as="geometry">'
        if pts: geo += '<Array as="points">' + "".join(f'<mxPoint x="{px:g}" y="{py:g}"/>' for px,py in pts) + "</Array>"
        geo += "</mxGeometry>"
        cells.append(f'<mxCell id="{eid}" parent="1" value="{esc(label)}" source="{node_ids[a]}" '
                     f'target="{node_ids[b]}" style="{st}" edge="1">{geo}</mxCell>')
    for spec in edges:
        kind = spec[0]; a,b = spec[1],spec[2]; lbl = spec[3] if len(spec)>3 else ""
        if kind=="dn": put(a,b,lbl,EX["b"],EN["t"])
        elif kind=="rt": put(a,b,lbl,EX["r"],EN["l"])
        elif kind=="lf": put(a,b,lbl,EX["l"],EN["r"])
        elif kind=="ul":  # node a (right col) loops UP into b (left col): top->right of b
            put(a,b,lbl,EX["t"],EN["r"],[(cx_(a), cy_(b))])
        elif kind=="ur":  # a (left col) loops UP into b (right col): top->left of b
            put(a,b,lbl,EX["t"],EN["l"],[(cx_(a), cy_(b))])
        elif kind=="ub":  # a loops DOWN-LEFT then enter b bottom (for side-error -> op upstream)
            x,y,w,h,_ = pos[b]
            put(a,b,lbl,EX["b"],EN["b"]+"" if False else "entryX=0.65;entryY=1;entryDx=0;entryDy=0;",
                [(cx_(a), y+h+26),(x+w*0.65, y+h+26)])
        elif kind=="jr":  # jump down across columns into b top at fraction f
            f = spec[3] if len(spec)>3 else 0.5
            x,y,w,h,_ = pos[b]
            put(a,b,"",EX["b"],"entryX=%g;entryY=0;entryDx=0;entryDy=0;"%f,
                [(cx_(a), y-26),(x+w*f, y-26)])

    for (text, anchor) in notes:
        cid = nx()
        nlines = text.count("<br>") + 1
        hh = max(70, 30 + nlines*15 + len(text)//32)
        ynote = min(cy_(anchor), Y0 + 40 + maxr*ROW_H - 40)
        cells.append(f'<mxCell id="{cid}" parent="1" value="{esc(text)}" '
            'style="shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;fillColor=#FFF9B2;'
            'strokeColor=#d6b656;align=left;fontSize=10;size=14;" vertex="1">'
            f'<mxGeometry x="{note_x}" y="{ynote-30:g}" width="{notes_w}" height="{hh}" as="geometry"/></mxCell>')
        e = nx()
        cells.append(f'<mxCell id="{e}" parent="1" value="" source="{node_ids[anchor]}" target="{cid}" '
            'style="endArrow=none;dashed=1;html=1;strokeColor=#999999;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" '
            'edge="1"><mxGeometry relative="1" as="geometry"/></mxCell>')

    inner = "\n      ".join(cells)
    return (f'<diagram id="{diagram_id}" name="{esc(name)}">\n'
            f'  <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" '
            f'arrows="1" fold="1" page="1" pageScale="1" pageWidth="{W}" pageHeight="{H_}" math="0" shadow="0">\n'
            f'    <root>\n      <mxCell id="0"/>\n      <mxCell id="1" parent="0"/>\n      {inner}\n'
            f'    </root>\n  </mxGraphModel>\n</diagram>')

diagrams = [build_page(f"act{i:02d}", p["name"], p["nodes"], p["edges"], p["notes"])
            for i, p in enumerate(PAGES)]
xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
       '<mxfile host="app.diagrams.net" agent="RentGo" version="24.0.0">\n  '
       + "\n  ".join(diagrams) + "\n</mxfile>\n")

out = r"C:\rent-go\docs\Activity Diagram per Fitur - RentGo.drawio"
os.makedirs(os.path.dirname(out), exist_ok=True)
with io.open(out,"w",encoding="utf-8") as f: f.write(xml)

# validate
t = ET.parse(out)
for d in t.iter("diagram"):
    ids = {c.get("id") for c in d.iter("mxCell")}
    bad = [(c.get("source"),c.get("target")) for c in d.iter("mxCell")
           if c.get("edge")=="1" and (c.get("source") not in ids or c.get("target") not in ids)]
    assert not bad, (d.get("name"), bad)
nd = len(list(t.iter("diagram")))
print(f"OK -> {out}\n   {nd} pages, {len(xml)} bytes")
for p in PAGES:
    print("   -", p["name"])
