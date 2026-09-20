import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const links = [
  ["Dashboard", "/admin"], ["Kendaraan", "/admin/kendaraan"], ["Kategori", "/admin/kategori"], ["Pemesanan", "/admin/pemesanan"], ["Transaksi", "/admin/transaksi"], ["Pelanggan", "/admin/pelanggan"], ["Verifikasi dokumen", "/admin/verifikasi"], ["Laporan", "/admin/laporan"],
];

export async function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login?error=admin-required");
  return <div className="min-h-screen bg-[#F7F9FC] text-[#17263B]"><aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#E1E6EC] bg-white lg:flex lg:flex-col"><div className="flex h-20 items-center gap-3 border-b border-[#E1E6EC] px-6"><Image src="/referensi/Logo%20RentGo.svg" alt="RentGo" width={174} height={58} className="h-5 w-auto" /><span className="rounded bg-[#EAF1FF] px-2 py-1 text-[10px] font-semibold text-[#245FD4]">Admin</span></div><nav className="flex-1 p-4" aria-label="Navigasi admin">{links.map(([label, href]) => <Link key={href} href={href} className={`mb-1 flex rounded-lg px-3 py-3 text-sm font-semibold ${href === active ? "bg-[#245FD4] text-white" : "text-[#526177] hover:bg-[#EEF4FF] hover:text-[#245FD4]"}`}>{label}</Link>)}</nav><div className="border-t border-[#E1E6EC] p-4"><p className="text-sm font-semibold">{user.name}</p><p className="mt-1 text-xs text-[#66758A]">{user.email}</p><form action={logout}><button type="submit" className="mt-3 text-sm font-semibold text-[#245FD4]">Keluar</button></form></div></aside><main className="lg:ml-64"><header className="flex h-20 items-center border-b border-[#E1E6EC] bg-white px-5 lg:px-9"><Link href="/" className="text-sm font-semibold text-[#245FD4]">← Kembali ke situs</Link></header><div className="mx-auto max-w-7xl px-5 py-8 lg:px-9">{children}</div></main></div>;
}