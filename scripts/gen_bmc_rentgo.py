# BMC (Business Model Canvas) RentGo -> draw.io, satu halaman kanvas 9 blok.
# Hitam-putih seperti gaya diagram tugas. Jalankan: python scripts/gen_bmc_rentgo.py
import io, os
import xml.sax.saxutils as sax
import xml.etree.ElementTree as ET

def esc(s):
    return sax.escape(s, {'"': "&quot;"})

BLOCKS = {
    "kp": ("Key Partners", "Mitra Kunci", [
        "Payment gateway / bank (transfer, QRIS, pembayaran online)",
        "Cloud hosting & storage (Supabase/PostgreSQL)",
        "Bengkel resmi & toko suku cadang (perawatan armada)",
        "Pemilik lahan / garasi parkir armada",
        "Operator wisata, travel, & hotel (referal sewa)",
        "Asuransi kendaraan & jasa derek/tarik",
    ]),
    "ka": ("Key Activities", "Aktivitas Kunci", [
        "Pengembangan & pemeliharaan platform web (Next.js)",
        "Kelola ketersediaan, status, & perawatan kendaraan",
        "Verifikasi KTP/SIM & konfirmasi pembayaran (DP/lunas)",
        "Pencatatan transaksi & penyusunan laporan",
        "Pemasaran & akuisisi pelanggan",
        "Customer service, penanganan klaim & kerusakan",
    ]),
    "kr": ("Key Resources", "Sumber Daya Kunci", [
        "Platform web RentGo (Next.js + Tailwind, PostgreSQL/Supabase)",
        "Armada kendaraan: mobil & motor",
        "Data kendaraan, pelanggan, booking, pembayaran",
        "SDM admin / pemilik usaha",
        "Lokasi rental & tempat parkir",
        "SOP verifikasi dokumen & serah terima unit",
    ]),
    "vp": ("Value Propositions", "Proposisi Nilai", [
        "Cek ketersediaan kendaraan real-time, tanpa datang/telepon",
        "Anti double-booking: validasi tanggal sewa otomatis",
        "Harga transparan: biaya per hari + diskon jangka panjang dihitung sistem",
        "Pemesanan & bayar DP 50% online dengan verifikasi bukti bayar",
        "Dokumen KTP/SIM diverifikasi admin - aman bagi kedua pihak",
        "Pencatatan digital rapi: riwayat sewa & laporan transaksi",
        "Kebatalan & refund jelas (100/90/75/0% sesuai jarak hari)",
    ]),
    "cr": ("Customer Relationships", "Hubungan Pelanggan", [
        "Self-service: cari, pesan, bayar, pantau status sendiri",
        "Verifikasi manual admin (dokumen & pembayaran) = rasa percaya",
        "Notifikasi status pesanan (pending/confirmed/aktif/selesai)",
        "Halaman FAQ / Bantuan & Tentang Kami",
        "Layanan purna jual: denda keterlambatan & penanganan kerusakan",
    ]),
    "ch": ("Channels", "Saluran", [
        "Website RentGo (beranda, daftar kendaraan, detail, FAQ)",
        "Media sosial & promosi digital",
        "SEO lokal & Google Maps (pencarian rental terdekat)",
        "Mulut ke mulut pelanggan lama",
        "Kerja sama hotel / travel / panitia acara",
    ]),
    "cs": ("Customer Segments", "Segmen Pelanggan", [
        "Perorangan tanpa kendaraan pribadi (mendadak/acara/mudik)",
        "Mahasiswa & pekerja perantau di luar kota",
        "Karyawan / perusahaan untuk perjalanan dinas",
        "Keluarga: acara pernikahan, tour, liburan",
        "Penyewa jangka panjang (butuh diskon mingguan/bulanan)",
        "Internal: admin/pemilik rental sebagai pengelola sistem",
    ]),
    "rs": ("Revenue Streams", "Arus Pendapatan", [
        "Hasil sewa harian kendaraan (mobil & motor)",
        "Sewa jangka panjang: volume stabil meski ada diskon durasi",
        "Biaya keterlambatan pengembalian",
        "Denda kerusakan / kehilangan kendaraan",
        "Layanan antar-jemput kendaraan (biaya tambahan)",
        "Biaya layanan / admin fee kanal pembayaran (opsional)",
    ]),
    "cost": ("Cost Structure", "Struktur Biaya", [
        "Pembelian / leasing armada & penyusutan kendaraan",
        "Bensin, servis, suku cadang, & parkir",
        "Hosting, domain, storage, & biaya payment gateway",
        "Gaji admin & tenaga operasional",
        "Pemasaran & promosi",
        "Pengembangan & maintenance platform",
    ]),
}

# layout canvas 5 kolom + strip bawah
X0, Y0 = 40, 70
CW, HALF, STRIP = 330, 350, 250
FULL = HALF * 2
GAP = 0

def box(col, row, w, h):
    return X0 + col * (CW + GAP), Y0 + row, w, h

pos = {
    "kp": (box(0, 0, CW, FULL),),
    "ka": (box(1, 0, CW, HALF),),
    "kr": (box(1, HALF, CW, HALF),),
    "vp": (box(2, 0, CW, FULL),),
    "cr": (box(3, 0, CW, HALF),),
    "ch": (box(3, HALF, CW, HALF),),
    "cs": (box(4, 0, CW, FULL),),
    "rs": (box(0, FULL, CW * 2.5, STRIP),),
    "cost": (box(2.5, FULL, CW * 2.5, STRIP),),
}

ST_BLOCK = ("rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;"
            "align=left;verticalAlign=top;spacing=10;spacingTop=6;fontSize=11;")
ST_TITLE = "text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=13;fontStyle=1;"

cells = []
n = 0
def nid():
    global n
    n += 1
    return f"b{n}"

cells.append(f'<mxCell id="bmc-title" value="{esc("BUSINESS MODEL CANVAS - RentGo (Rental Kendaraan)")}" '
             'style="text;html=1;align=center;verticalAlign=middle;fontSize=20;fontStyle=1;" vertex="1" parent="1">'
             f'<mxGeometry x="{X0}" y="20" width="{CW*5}" height="36" as="geometry"/></mxCell>')

for key, ((x, y, w, h),) in pos.items():
    en, id_, items = BLOCKS[key]
    # title cell + content cell inside block
    cells.append(f'<mxCell id="{nid()}" parent="1" value="{esc(id_ + " / " + en)}" '
                 f'style="{ST_TITLE}" vertex="1">'
                 f'<mxGeometry x="{x:g}" y="{y:g}" width="{w-16:g}" height="22" as="geometry"/></mxCell>')
    body = esc("<br>".join("\u2022 " + it for it in items))
    cells.append(f'<mxCell id="{nid()}" parent="1" value="{body}" '
                 f'style="{ST_BLOCK}html=1;" vertex="1">'
                 f'<mxGeometry x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" as="geometry"/></mxCell>')

# grid lines on top of nothing? blocks already stroked; fine.
page_w = int(X0 * 2 + CW * 5)
page_h = int(Y0 + FULL + STRIP + 40)

xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
       '<mxfile host="app.diagrams.net" agent="RentGo" version="24.0.0">\n'
       '  <diagram id="bmc-rentgo" name="BMC RentGo">\n'
       f'    <mxGraphModel dx="1600" dy="900" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" '
       f'arrows="1" fold="1" page="1" pageScale="1" pageWidth="{page_w}" pageHeight="{page_h}" math="0" shadow="0">\n'
       '      <root>\n        <mxCell id="0"/>\n        <mxCell id="1" parent="0"/>\n        '
       + "\n        ".join(cells) +
       '\n      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>\n')

path = r"C:\rent-go\docs\BMC - RentGo.drawio"
os.makedirs(os.path.dirname(path), exist_ok=True)
io.open(path, "w", encoding="utf-8").write(xml)
ET.parse(path)
print("OK:", path)

# versi teks untuk dokumen
txt = []
order = ["cs", "vp", "ch", "cr", "rs", "kp", "ka", "kr", "cost"]
for k in order:
    en, id_, items = BLOCKS[k]
    txt.append(f"{id_.upper()} ({en})")
    for it in items:
        txt.append(f"- {it}")
    txt.append("")
io.open(r"C:\rent-go\docs\BMC - RentGo.txt", "w", encoding="utf-8").write("\n".join(txt))
print("OK:", r"C:\rent-go\docs\BMC - RentGo.txt")
