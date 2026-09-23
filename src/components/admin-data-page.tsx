import { AdminShell } from "@/components/admin-shell";

type Section = "pemesanan" | "transaksi" | "pelanggan" | "verifikasi" | "laporan";

const pages: Record<Section, {
  eyebrow: string;
  title: string;
  description: string;
  tableTitle: string;
  note: string;
  columns: string[];
  rows: string[][];
}> = {
  pemesanan: {
    eyebrow: "Operasional",
    title: "Pemesanan",
    description: "Tinjau booking pelanggan dan pantau status proses penyewaan.",
    tableTitle: "Pemesanan terbaru",
    note: "Data demo untuk kebutuhan presentasi.",
    columns: ["ID Booking", "Pelanggan", "Kendaraan", "Periode sewa", "Status", "Aksi"],
    rows: [["BKG-0428", "Budi Santoso", "Toyota Avanza", "16–19 Sep 2026", "Menunggu verifikasi", "Tinjau"], ["BKG-0427", "Nadia Putri", "Honda Brio", "16–18 Sep 2026", "Dikonfirmasi", "Tinjau"], ["BKG-0426", "Rizky Pratama", "Honda Vario 160", "15–20 Sep 2026", "Sedang disewa", "Tinjau"]],
  },
  transaksi: {
    eyebrow: "Keuangan",
    title: "Transaksi",
    description: "Pantau pembayaran DP, pelunasan, dan status transaksi pelanggan.",
    tableTitle: "Transaksi terbaru",
    note: "Data demo untuk kebutuhan presentasi.",
    columns: ["ID Transaksi", "Booking", "Pelanggan", "Jumlah", "Status", "Aksi"],
    rows: [["TRX-1028", "BKG-0428", "Budi Santoso", "Rp 498.750", "DP dibayar", "Periksa"], ["TRX-1027", "BKG-0427", "Nadia Putri", "Rp 700.000", "Lunas", "Periksa"], ["TRX-1026", "BKG-0426", "Rizky Pratama", "Rp 285.000", "DP dibayar", "Periksa"]],
  },
  pelanggan: {
    eyebrow: "Data pelanggan",
    title: "Pelanggan",
    description: "Lihat data pelanggan dan kelengkapan dokumen penyewa.",
    tableTitle: "Daftar pelanggan",
    note: "Data demo untuk kebutuhan presentasi.",
    columns: ["Pelanggan", "Email", "Dokumen", "Riwayat sewa", "Status", "Aksi"],
    rows: [["Budi Santoso", "budi@email.com", "KTP & SIM", "3 kali", "Menunggu", "Lihat"], ["Nadia Putri", "nadia@email.com", "KTP & SIM", "5 kali", "Terverifikasi", "Lihat"], ["Rizky Pratama", "rizky@email.com", "KTP & SIM", "2 kali", "Terverifikasi", "Lihat"]],
  },
  verifikasi: {
    eyebrow: "Operasional",
    title: "Verifikasi dokumen",
    description: "Periksa kelengkapan KTP dan SIM pelanggan sebelum booking diproses.",
    tableTitle: "Antrean verifikasi",
    note: "Data demo untuk kebutuhan presentasi.",
    columns: ["Pelanggan", "KTP", "SIM", "Tanggal unggah", "Status", "Aksi"],
    rows: [["Budi Santoso", "Tersedia", "Tersedia", "14 Sep 2026", "Menunggu", "Periksa"], ["Dewi Kartika", "Tersedia", "Tersedia", "14 Sep 2026", "Menunggu", "Periksa"], ["Fajar Nugraha", "Tersedia", "Belum unggah", "13 Sep 2026", "Belum lengkap", "Periksa"]],
  },
  laporan: {
    eyebrow: "Analitik",
    title: "Laporan",
    description: "Ringkasan transaksi penyewaan untuk periode berjalan.",
    tableTitle: "Laporan transaksi",
    note: "Data demo untuk kebutuhan presentasi.",
    columns: ["ID Transaksi", "Pelanggan", "Kendaraan", "Total", "Status", "Tanggal"],
    rows: [["TRX-1027", "Nadia Putri", "Honda Brio", "Rp 700.000", "Lunas", "14 Sep 2026"], ["TRX-1025", "Siti Rahma", "Toyota Innova", "Rp 1.650.000", "Lunas", "13 Sep 2026"], ["TRX-1023", "Andi Pratama", "Toyota Avanza", "Rp 997.500", "Lunas", "12 Sep 2026"]],
  },
};

function statusClass(value: string) {
  if (value === "Lunas" || value === "Terverifikasi" || value === "Dikonfirmasi") return "bg-[#EAF1FF] text-[#245FD4]";
  if (value === "Menunggu" || value === "Menunggu verifikasi" || value === "DP dibayar") return "bg-[#F2F5F9] text-[#526177]";
  return "bg-[#F2F5F9] text-[#66758A]";
}

export function AdminDataPage({ section }: { section: Section }) {
  const page = pages[section];

  return (
    <AdminShell active={`/admin/${section}`}>
      <section className="border-b border-[#E1E6EC] pb-6">
        <p className="text-sm font-semibold text-[#245FD4]">{page.eyebrow}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{page.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#59687B]">{page.description}</p>
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-[#E1E6EC] bg-white">
        <div className="border-b border-[#EDF0F3] px-5 py-4">
          <h2 className="font-bold">{page.tableTitle} ({page.rows.length})</h2>
          <p className="mt-1 text-xs text-[#66758A]">{page.note}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-xs text-[#526177]">
              <tr>{page.columns.map((column) => <th key={column} className="px-5 py-3 font-medium">{column}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[#EDF0F3]">
              {page.rows.map((row) => (
                <tr key={row[0]} className="hover:bg-[#FBFCFF]">
                  {row.map((cell, index) => {
                    const isStatus = index === row.length - 2;
                    const isAction = index === row.length - 1;
                    return <td key={cell} className="px-5 py-4 text-[#526177]">
                      {isStatus ? <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(cell)}`}>{cell}</span> : isAction ? <button type="button" className="text-xs font-semibold text-[#245FD4]">{cell}</button> : <span className={index === 0 ? "font-semibold text-[#17263B]" : ""}>{cell}</span>}
                    </td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
