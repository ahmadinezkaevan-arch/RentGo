# RentGo activity diagram -> draw.io XML. 3 swimlanes, absolute coords,
# every edge has fixed exit/entry + explicit orthogonal waypoints.
# Values may contain <br/> HTML; everything passes through esc() so the
# XML attribute stays well-formed and draw.io still renders the markup.
import io, os
import html as H
import xml.etree.ElementTree as ET

def esc(v):
    return H.escape(v, quote=True)

X0, START_Y, HDR = 40, 120, 30
LANE_W, ROW0, ROWH = 430, 50, 88
NODE_W, NODE_H, DEC_W, DEC_H = 240, 46, 150, 80
START_D, END_D, END_INNER = 34, 44, 24

lanes = ["Pelanggan", "Sistem RentGo", "Admin (Pemilik)"]

steps = [
    ("s0",     0, "start", ""),
    ("reg",    0, "action", "Registrasi akun<br>(isi data diri)"),
    ("vreg",   1, "action", "Validasi data registrasi"),
    ("dreg",   1, "decision", "Data valid?"),
    ("sacc",   1, "action", "Simpan akun<br>(password di-hash)"),
    ("login",  0, "action", "Login"),
    ("dcred",  1, "decision", "Kredensial benar?"),
    ("home",   1, "action", "Tampilkan beranda &<br>dashboard pelanggan"),
    ("upload", 0, "action", "Unggah foto KTP dan SIM"),
    ("sdoc",   1, "action", "Simpan dokumen<br>(status PENDING)"),
    ("revdoc", 2, "action", "Periksa dokumen identitas"),
    ("ddoc",   2, "decision", "Dokumen valid?"),
    ("nnotif", 1, "action", "Tandai REJECTED &<br>notifikasi pelanggan"),
    ("vdoc",   1, "action", "Set dokumen VERIFIED"),
    ("search", 0, "action", "Cari / filter kendaraan"),
    ("list",   1, "action", "Tampilkan daftar kendaraan<br>(harga & status unit)"),
    ("detail", 0, "action", "Lihat detail kendaraan"),
    ("pick",   0, "action", "Pilih tanggal sewa &<br>tanggal kembali"),
    ("dsched", 1, "decision", "Jadwal tidak<br>bertabrakan?"),
    ("conf",   1, "action", "Tampilkan pesan jadwal<br>bertabrakan"),
    ("calc",   1, "action", "Hitung lama sewa, biaya,<br>& diskon jangka panjang"),
    ("creat",  1, "action", "Buat pesanan<br>(PENDING_PAYMENT)"),
    ("dp",     0, "action", "Bayar DP 50% & unggah<br>bukti transfer"),
    ("spay",   1, "action", "Simpan pembayaran<br>(status PENDING)"),
    ("verdp",  2, "action", "Verifikasi bukti DP &<br>kelengkapan pesanan"),
    ("dvalid", 2, "decision", "Data, dokumen,<br>& DP valid?"),
    ("rej",    1, "action", "Tolak / batalkan pesanan<br>& refund sesuai ketentuan"),
    ("endR",   1, "end", ""),
    ("conf2",  1, "action", "Status pesanan<br>CONFIRMED"),
    ("dcancel", 0, "decision", "Batal sebelum<br>tanggal sewa?"),
    ("cancel", 0, "action", "Ajukan pembatalan<br>pesanan"),
    ("refund", 1, "action", "Hitung refund & denda,<br>status CANCELLED"),
    ("endC",   1, "end", ""),
    ("rest",   0, "action", "Lunasi sisa 50% maks.<br>24 jam sebelum ambil"),
    ("verpay", 2, "action", "Verifikasi pelunasan"),
    ("dpaid",  2, "decision", "Lunas 100%?"),
    ("remind", 1, "action", "Kirim pengingat<br>pembayaran"),
    ("hand",   2, "action", "Serah terima kendaraan<br>(cek identitas, ACTIVE)"),
    ("use",    0, "action", "Gunakan kendaraan &<br>kembali tepat waktu"),
    ("check",  2, "action", "Cek kondisi kendaraan<br>saat pengembalian"),
    ("done",   1, "action", "Status COMPLETED,<br>catat riwayat sewa"),
    ("end1",   2, "end", ""),
]

pos = {}
for idx, (sid, lane, kind, label) in enumerate(steps):
    w, h = {"action": (NODE_W, NODE_H), "decision": (DEC_W, DEC_H),
            "start": (START_D, START_D), "end": (END_D, END_D)}[kind]
    y = START_Y + HDR + ROW0 + idx * ROWH
    cxs = X0 + lane * LANE_W + LANE_W // 2
    pos[sid] = (cxs - w / 2, y, w, h, lane)

lane_h = HDR + ROW0 + (len(steps) - 1) * ROWH + 90
cells = []
nid = [0]
def next_id():
    nid[0] += 1
    return "n%d" % nid[0]

def add(s):
    cells.append(s)

add(f'<mxCell id="title" parent="1" value="{esc("Activity Diagram - Proses Penyewaan Kendaraan (RentGo)")}" '
    'style="text;html=1;align=left;verticalAlign=middle;fontSize=18;fontStyle=1;" vertex="1">'
    f'<mxGeometry x="{X0}" y="40" width="800" height="40" as="geometry"/></mxCell>')

for i, ln in enumerate(lanes):
    lid = next_id()
    add(f'<mxCell id="{lid}" parent="1" value="{esc(ln)}" '
        'style="swimlane;html=1;whiteSpace=wrap;startSize=30;horizontal=1;fillColor=none;'
        'strokeColor=#666666;fontSize=12;fontStyle=1;pointerEvents=0;container=0;" vertex="1">'
        f'<mxGeometry x="{X0 + i*LANE_W}" y="{START_Y}" width="{LANE_W}" height="{lane_h}" as="geometry"/></mxCell>')

node_ids = {}
for sid, lane, kind, label in steps:
    x, y, w, h, _ = pos[sid]
    cid = next_id(); node_ids[sid] = cid
    st = {"action": "rounded=1;whiteSpace=wrap;html=1;arcSize=20;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=11;",
          "decision": "rhombus;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00;fontSize=11;",
          "start": "ellipse;html=1;aspect=fixed;fillColor=#000000;strokeColor=#000000;",
          "end": "ellipse;html=1;aspect=fixed;fillColor=#ffffff;strokeColor=#000000;strokeWidth=2;"}[kind]
    add(f'<mxCell id="{cid}" parent="1" value="{esc(label)}" style="{st}" vertex="1">'
        f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/></mxCell>')
    if kind == "end":
        iid = next_id()
        add(f'<mxCell id="{iid}" parent="1" value="" '
            'style="ellipse;html=1;fillColor=#000000;strokeColor=none;" vertex="1">'
            f'<mxGeometry x="{x+(END_D-END_INNER)/2}" y="{y+(END_D-END_INNER)/2}" '
            f'width="{END_INNER}" height="{END_INNER}" as="geometry"/></mxCell>')

def cy(sid, f=0.5):
    x, y, w, h, _ = pos[sid]
    return y + h * f

EX = {"l": "exitX=0;exitY=0.5;exitDx=0;exitDy=0;", "r": "exitX=1;exitY=0.5;exitDx=0;exitDy=0;",
      "b": "exitX=0.5;exitY=1;exitDx=0;exitDy=0;", "t": "exitX=0.5;exitY=0;exitDx=0;exitDy=0;"}
EN = {"l": "entryX=0;entryY=0.5;entryDx=0;entryDy=0;", "r": "entryX=1;entryY=0.5;entryDx=0;entryDy=0;",
      "b": "entryX=0.5;entryY=1;entryDx=0;entryDy=0;", "t": "entryX=0.5;entryY=0;entryDx=0;entryDy=0;"}

def edge(a, b, guard="", ex="b", en="t", waypoints=()):
    eid = next_id()
    st = ("edgeStyle=orthogonalEdgeStyle;rounded=1;jettySize=auto;html=1;endArrow=block;endFill=1;"
          f"fontColor=#333333;fontSize=10;labelBackgroundColor=#ffffff;{EX[ex]}{EN[en]}")
    geo = '<mxGeometry relative="1" as="geometry">'
    if waypoints:
        pts = "".join(f'<mxPoint x="{wx:g}" y="{wy:g}"/>' for wx, wy in waypoints)
        geo += f'<Array as="points">{pts}</Array>'
    geo += "</mxGeometry>"
    add(f'<mxCell id="{eid}" parent="1" value="{esc(guard)}" source="{node_ids[a]}" '
        f'target="{node_ids[b]}" style="{st}" edge="1">{geo}</mxCell>')

def route(a, b, gx, guard="", ex="l", en="l"):
    edge(a, b, guard, ex, en, waypoints=[(gx, cy(a)), (gx, cy(b))])

# ── straight / simple flow ─────────────────────────────────────────
for a, b, g in [
    ("s0","reg",""), ("reg","vreg",""), ("vreg","dreg",""), ("dreg","sacc","Ya"),
    ("sacc","login",""), ("login","dcred",""), ("dcred","home","Ya"), ("home","upload",""),
    ("upload","sdoc",""), ("sdoc","revdoc",""), ("revdoc","ddoc",""), ("ddoc","vdoc","Ya"),
    ("vdoc","search",""), ("search","list",""), ("list","detail",""), ("detail","pick",""),
    ("pick","dsched",""), ("dsched","conf","Tidak"),
    ("calc","creat",""), ("creat","dp",""), ("dp","spay",""),
    ("spay","verdp",""), ("verdp","dvalid",""), ("dvalid","rej","Tidak"),
    ("rej","endR",""), ("conf2","dcancel",""), ("dcancel","cancel","Ya"), ("cancel","refund",""),
    ("refund","endC",""), ("rest","verpay",""), ("verpay","dpaid",""), ("dpaid","hand","Ya"),
    ("hand","use",""), ("use","check",""), ("check","done",""), ("done","end1",""),
]:
    edge(a, b, g)

# ── loop / branch edges via gutter corridors ───────────────────────
GX_L  = X0 + 45                  # left margin of lane Pelanggan
GX_R0 = X0 + LANE_W - 55         # right margin of lane Pelanggan
GX_L1 = X0 + LANE_W + 50         # left margin of lane Sistem
GX_R1 = X0 + 2*LANE_W - 60       # right margin of lane Sistem
GX_L2 = X0 + 2*LANE_W + 30       # left margin of lane Admin

route("dreg", "reg", GX_L, "Tidak")
route("dcred", "login", GX_L, "Tidak")
route("dsched", "calc", GX_L1, "Ya")
route("dvalid", "conf2", GX_L1, "Ya")
route("ddoc", "nnotif", GX_L2, "Tidak", ex="l", en="r")
edge("conf", "pick", "Ganti tanggal", ex="r", en="r",
     waypoints=[(GX_R1, cy("conf")), (GX_R1, cy("pick"))])
route("nnotif", "upload", GX_R0, "Unggah ulang", ex="l", en="r")
route("dcancel", "rest", GX_L, "Tidak")
edge("dpaid", "remind", "Belum", ex="l", en="r",
     waypoints=[(GX_L2, cy("dpaid")), (GX_L2, cy("remind"))])
edge("remind", "rest", "", ex="l", en="r",
     waypoints=[(GX_L1, cy("remind")), (GX_L1, cy("rest"))])

# ── notes ──────────────────────────────────────────────────────────
def note(text, anchor_sid, h=104, dy=-30):
    cid = next_id()
    x = X0 + 3*LANE_W + 40
    y = cy(anchor_sid) + dy
    add(f'<mxCell id="{cid}" parent="1" value="{esc(text)}" '
        'style="shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;fillColor=#FFF9B2;'
        'strokeColor=#d6b656;align=left;fontSize=10;size=14;" vertex="1">'
        f'<mxGeometry x="{x}" y="{y}" width="250" height="{h}" as="geometry"/></mxCell>')
    e = next_id()
    add(f'<mxCell id="{e}" parent="1" value="" source="{node_ids[anchor_sid]}" target="{cid}" '
        'style="endArrow=none;dashed=1;html=1;strokeColor=#999999;exitX=1;exitY=0.5;'
        'entryX=0;entryY=0.5;" edge="1"><mxGeometry relative="1" as="geometry"/></mxCell>')

note("RentGo berhak menolak/membatalkan pesanan jika data atau dokumen tidak valid, pembayaran "
     "tidak memenuhi ketentuan, atau kendaraan tidak layak -> refund 100%.", "rej", h=96)
note("Diskon durasi sewa:<br>1-3 hari: 0%<br>4-7 hari: 5%<br>8-10 hari: 10%<br>"
     "11-14 hari: 15%<br>>14 hari: 20%", "calc", h=110)
note("Serah terima hanya bila lunas 100% & dokumen terverifikasi; bawa identitas asli. "
     "Keterlambatan mengembalikan kendaraan dikenakan biaya tambahan.", "hand", h=96)
note("Ketentuan refund pembatalan oleh pelanggan:<br>>7 hari sebelum sewa: 100%<br>"
     "3-7 hari: 90%<br><3 hari: 75%<br>Pada tanggal sewa / tidak datang: 0%", "refund", h=110)

pool_w = 3*LANE_W + 320
page_w, page_h = pool_w + X0 + 60, START_Y + lane_h + 60

xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
       '<mxfile host="app.diagrams.net" agent="RentGo" version="24.0.0">\n'
       '  <diagram id="activity-rentgo" name="Activity Diagram Sewa">\n'
       f'    <mxGraphModel dx="1600" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" '
       f'arrows="1" fold="1" page="1" pageScale="1" pageWidth="{page_w}" pageHeight="{page_h}" math="0" shadow="0">\n'
       '      <root>\n        <mxCell id="0"/>\n        <mxCell id="1" parent="0"/>\n        '
       + "\n        ".join(cells) +
       '\n      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>\n')

out = r"C:\rent-go\docs\Activity Diagram - Penyewaan Kendaraan - RentGo.drawio"
os.makedirs(os.path.dirname(out), exist_ok=True)
with io.open(out, "w", encoding="utf-8") as f:
    f.write(xml)

# validate: well-formed + every edge's source/target resolves
tree = ET.parse(out)
ids = {c.get("id") for c in tree.iter("mxCell")}
bad = [(c.get("id"), c.get("source"), c.get("target"))
       for c in tree.iter("mxCell")
       if c.get("edge") == "1" and (c.get("source") not in ids or c.get("target") not in ids)]
n_e = sum(1 for c in tree.iter("mxCell") if c.get("edge") == "1")
n_v = sum(1 for c in tree.iter("mxCell") if c.get("vertex") == "1")
assert not bad, bad
print(f"OK -> {out}\n   {len(xml)} bytes | {n_v} vertex, {n_e} edge | all refs resolve")
