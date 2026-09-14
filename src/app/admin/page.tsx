import Link from "next/link";
import type { ReactNode } from "react";

type IconName = "grid"|"car"|"tag"|"calendar"|"receipt"|"users"|"shield"|"report"|"bell"|"search"|"arrow"|"clock"|"logout"|"chevron"|"spark"|"wallet"|"trend";

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    grid:<><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    car:<><path d="M5 17h14M6 17v2M18 17v2M4 14l2-6h12l2 6"/><path d="M7 14h.01M17 14h.01M8 8l1-3h6l1 3"/></>,
    tag:<><path d="M20 13 13 20l-9-9V4h7l9 9Z"/><circle cx="8.5" cy="8.5" r="1.5"/></>,
    calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
    receipt:<><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/></>,
    users:<><path d="M16 20c0-2.8-1.8-5-4-5s-4 2.2-4 5"/><circle cx="12" cy="9" r="3"/><path d="M4 18c0-2 1.2-3.6 3-4.2M20 18c0-2-1.2-3.6-3-4.2"/></>,
    shield:<><path d="M12 3 5 6v5c0 4.2 2.8 7.4 7 9 4.2-1.6 7-4.8 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
    report:<><path d="M5 20V10M12 20V4M19 20v-7"/><path d="M3 20h18"/></>,
    bell:<><path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z"/><path d="M10 21h4"/></>,
    search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow:<path d="M5 12h14m-5-5 5 5-5 5"/>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    logout:<><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></>,
    chevron:<path d="m9 6 6 6-6 6"/>,
    spark:<><path d="m12 3 1.3 4.2L17 9l-3.7 1.8L12 15l-1.3-4.2L7 9l3.7-1.8L12 3Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z"/></>,
    wallet:<><path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V7a3 3 0 0 1 3-3h12"/><path d="M15 12h5v4h-5a2 2 0 0 1 0-4Z"/></>,
    trend:<><path d="m4 16 5-5 4 3 7-8"/><path d="M15 6h5v5"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name]}</svg>;
}

const nav: {label:string;href:string;icon:IconName;count?:number}[] = [
  {label:"Dashboard",href:"/admin",icon:"grid"},{label:"Kendaraan",href:"/admin/kendaraan",icon:"car"},{label:"Kategori",href:"/admin/kategori",icon:"tag"},
  {label:"Pemesanan",href:"/admin/pemesanan",icon:"calendar",count:8},{label:"Transaksi",href:"/admin/transaksi",icon:"receipt"},{label:"Pelanggan",href:"/admin/pelanggan",icon:"users"},
  {label:"Verifikasi dokumen",href:"/admin/verifikasi",icon:"shield",count:5},{label:"Laporan",href:"/admin/laporan",icon:"report"},
];
const stats: {label:string;value:string;note:string;icon:IconName;tone:string}[] = [
  {label:"Armada tersedia",value:"18",note:"dari 24 kendaraan",icon:"car",tone:"bg-[#e9f3ff] text-[#2161d1]"},
  {label:"Pemesanan aktif",value:"12",note:"4 mulai hari ini",icon:"calendar",tone:"bg-[#eaf8f1] text-[#178058]"},
  {label:"Menunggu tindakan",value:"8",note:"perlu ditinjau",icon:"clock",tone:"bg-[#fff3df] text-[#c67516]"},
  {label:"Pendapatan bulan ini",value:"Rp 38,4 jt",note:"+12,8% dari Agustus",icon:"trend",tone:"bg-[#f1edff] text-[#6d4bd1]"},
];
const tasks: {title:string;detail:string;count:string;tone:string;icon:IconName;href:string}[] = [
  {title:"Verifikasi dokumen",detail:"5 pelanggan menunggu pemeriksaan",count:"05",tone:"bg-[#fff3df] text-[#b7660c]",icon:"shield",href:"/admin/verifikasi"},
  {title:"Konfirmasi pemesanan",detail:"3 booking dengan DP terbayar",count:"03",tone:"bg-[#e9f3ff] text-[#2161d1]",icon:"calendar",href:"/admin/pemesanan"},
  {title:"Periksa pembayaran",detail:"2 bukti bayar baru masuk",count:"02",tone:"bg-[#f1edff] text-[#6d4bd1]",icon:"wallet",href:"/admin/transaksi"},
];
const bookings = [
  {id:"BKG-0428",name:"Budi Santoso",initials:"BS",vehicle:"Toyota Avanza",dates:"16-19 Sep 2026",total:"Rp 997.500",status:"Menunggu verifikasi",tone:"bg-[#fff4df] text-[#9b5a0a]"},
  {id:"BKG-0427",name:"Nadia Putri",initials:"NP",vehicle:"Honda Brio",dates:"16-18 Sep 2026",total:"Rp 700.000",status:"Dikonfirmasi",tone:"bg-[#e9f3ff] text-[#1852b0]"},
  {id:"BKG-0426",name:"Rizky Pratama",initials:"RP",vehicle:"Honda Vario 160",dates:"15-20 Sep 2026",total:"Rp 570.000",status:"Sedang disewa",tone:"bg-[#e8f7ef] text-[#126b49]"},
  {id:"BKG-0425",name:"Siti Rahma",initials:"SR",vehicle:"Toyota Innova",dates:"14-17 Sep 2026",total:"Rp 1.650.000",status:"Dikonfirmasi",tone:"bg-[#e9f3ff] text-[#1852b0]"},
];
const schedule = [
  {time:"08:30",title:"Pengambilan Toyota Avanza",person:"Nadia Putri / BKG-0427",dot:"bg-[#2563eb]"},
  {time:"11:00",title:"Pengembalian Honda Brio",person:"Dimas Ardi / BKG-0419",dot:"bg-[#18a06a]"},
  {time:"15:30",title:"Pengambilan Honda Vario",person:"Rizky Pratama / BKG-0426",dot:"bg-[#2563eb]"},
];

function Sidebar() {
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-[#0d1f3c] text-white lg:flex">
    <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-7"><span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#2f6ce5]"><Icon name="car"/></span><span className="text-xl font-bold tracking-[-0.03em]">RentGo</span><span className="ml-1 rounded bg-white/10 px-2 py-1 text-[10px] font-semibold text-[#b9c9e5]">Admin</span></div>
    <nav className="flex-1 px-4 py-6" aria-label="Navigasi admin"><p className="mb-3 px-3 text-xs font-medium text-[#7890b5]">Menu utama</p><div className="space-y-1">{nav.map((item,index)=><Link key={item.label} href={item.href} aria-current={index===0?"page":undefined} className={"flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium "+(index===0?"bg-[#2f6ce5] text-white shadow-[0_8px_24px_rgba(47,108,229,.3)]":"text-[#aebed7] hover:bg-white/5 hover:text-white")}><Icon name={item.icon} className="h-[19px] w-[19px]"/><span>{item.label}</span>{item.count?<span className="ml-auto min-w-6 rounded-full bg-white/10 px-1.5 py-0.5 text-center text-[11px] text-white">{item.count}</span>:null}</Link>)}</div></nav>
    <div className="border-t border-white/10 p-4"><div className="flex items-center gap-3 rounded-xl bg-white/[.06] p-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#dce8ff] text-sm font-bold text-[#2053ad]">RA</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">Raka Admin</span><span className="block truncate text-xs text-[#899dbd]">admin@rentgo.id</span></span><button type="button" aria-label="Keluar" className="text-[#899dbd] hover:text-white"><Icon name="logout"/></button></div></div>
  </aside>;
}
function Header() {
  return <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#e6eaf0] bg-white/95 px-5 backdrop-blur sm:px-8 lg:ml-[260px] lg:px-9">
    <Link href="/admin" className="flex items-center gap-2 text-[#0d1f3c] lg:hidden"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#2f6ce5] text-white"><Icon name="car" className="h-4 w-4"/></span><span className="font-bold">RentGo</span></Link>
    <div className="hidden w-full max-w-[360px] items-center gap-2 rounded-lg border border-[#dfe4eb] bg-[#f8fafc] px-3.5 py-2.5 text-[#8290a5] md:flex"><Icon name="search" className="h-[18px] w-[18px]"/><input aria-label="Cari data admin" className="w-full bg-transparent text-sm text-[#1c2b41] outline-none placeholder:text-[#8c99aa]" placeholder="Cari booking, pelanggan, kendaraan..."/><kbd className="rounded border border-[#dfe4eb] bg-white px-1.5 py-0.5 text-[10px]">Ctrl K</kbd></div>
    <div className="flex items-center gap-3"><p className="hidden text-right sm:block"><span className="block text-xs text-[#647286]">Senin, 14 September</span><span className="block text-sm font-semibold text-[#203047]">Operasional hari ini</span></p><span className="mx-1 hidden h-8 w-px bg-[#e2e7ed] sm:block"/><button type="button" aria-label="Notifikasi, 3 belum dibaca" className="relative grid h-10 w-10 place-items-center rounded-full border border-[#e1e6ed] text-[#45546a]"><Icon name="bell"/><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ed5a5a] ring-2 ring-white"/></button><span className="grid h-10 w-10 place-items-center rounded-full bg-[#dce8ff] text-xs font-bold text-[#2053ad] lg:hidden">RA</span></div>
  </header>;
}

export default function AdminDashboard() {
  return <div className="min-h-screen bg-[#f4f7fa] text-[#17263b]"><Sidebar/><Header/>
    <main className="pb-24 lg:ml-[260px] lg:pb-10"><div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-9 lg:py-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-1 text-sm font-medium text-[#59687b]">Selamat datang kembali, Raka</p><h1 className="text-[28px] font-bold tracking-[-0.035em] text-[#122139] sm:text-[32px]">Pusat operasional RentGo</h1><p className="mt-1.5 max-w-xl text-sm leading-6 text-[#59687b]">Pantau armada, selesaikan verifikasi, dan pastikan setiap perjalanan siap tepat waktu.</p></div><Link href="/admin/pemesanan" className="inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-[#245fd4] px-4 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(36,95,212,.2)]">Lihat semua pemesanan <Icon name="arrow" className="h-4 w-4"/></Link></section>
      <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan bisnis">{stats.map(stat=><article key={stat.label} className="flex items-center gap-4 rounded-xl border border-[#e2e7ed] bg-white p-4"><span className={"grid h-11 w-11 shrink-0 place-items-center rounded-[10px] "+stat.tone}><Icon name={stat.icon}/></span><div className="min-w-0"><p className="text-xs font-medium text-[#59687b]">{stat.label}</p><p className="mt-0.5 truncate text-xl font-bold tracking-[-0.025em]">{stat.value}</p><p className="mt-0.5 truncate text-[11px] text-[#66758a]">{stat.note}</p></div></article>)}</section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.8fr]">
        <div className="overflow-hidden rounded-xl border border-[#e1e6ec] bg-white"><div className="flex items-start justify-between border-b border-[#edf0f3] px-5 py-[18px] sm:items-center sm:px-6"><div><h2 className="font-bold">Perlu ditangani</h2><p className="mt-1 text-xs text-[#66758a]">Tugas prioritas agar operasional tetap lancar.</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff3df] px-2.5 py-1 text-xs font-semibold text-[#81500f]"><span className="h-1.5 w-1.5 rounded-full bg-[#e99a37]"/>8 tugas</span></div>
          <div className="divide-y divide-[#edf0f3]">{tasks.map(task=><Link href={task.href} key={task.title} className="group flex items-center gap-3 px-5 py-4 hover:bg-[#fafbfd] sm:gap-4 sm:px-6"><span className={"grid h-10 w-10 shrink-0 place-items-center rounded-[10px] "+task.tone}><Icon name={task.icon}/></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#233249]">{task.title}</span><span className="mt-0.5 block truncate text-xs text-[#647286]">{task.detail}</span></span><strong className="text-xl tracking-[-.04em] text-[#26364d]">{task.count}</strong><Icon name="chevron" className="h-4 w-4 text-[#a3adba] group-hover:text-[#245fd4]"/></Link>)}</div>
          <div className="bg-[#f9fbfd] px-5 py-3.5 sm:px-6"><p className="flex items-center gap-2 text-xs text-[#66758a]"><Icon name="spark" className="h-4 w-4 shrink-0 text-[#245fd4]"/><span><strong className="font-semibold text-[#34445b]">Prioritas:</strong> 2 pelanggan mengambil kendaraan besok pagi dan belum terverifikasi.</span></p></div>
        </div>
        <aside className="rounded-xl bg-[#102541] p-5 text-white shadow-[0_10px_30px_rgba(16,37,65,.12)] sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-bold">Agenda hari ini</h2><p className="mt-1 text-xs text-[#9fb1c9]">3 jadwal / 14 September</p></div><span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-[#bdd0ec]"><Icon name="calendar"/></span></div><ol className="mt-6 space-y-5">{schedule.map((item,index)=><li key={item.time} className="grid grid-cols-[45px_14px_1fr] gap-2.5"><time className="pt-0.5 text-xs font-semibold text-[#b7c6da]">{item.time}</time><span className="relative flex justify-center"><span className={"mt-1.5 h-2.5 w-2.5 rounded-full ring-[3px] ring-white/10 "+item.dot}/>{index<schedule.length-1?<span className="absolute bottom-[-22px] top-4 w-px bg-white/15"/>:null}</span><span><span className="block text-sm font-semibold leading-5">{item.title}</span><span className="mt-1 block text-xs text-[#afc0d7]">{item.person}</span></span></li>)}</ol><Link href="/admin/pemesanan" className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[.06] py-2.5 text-xs font-semibold text-[#d8e3f2]">Buka jadwal lengkap <Icon name="arrow" className="h-3.5 w-3.5"/></Link></aside>
      </section>
      <section className="mt-5 overflow-hidden rounded-xl border border-[#e1e6ec] bg-white"><div className="flex flex-col justify-between gap-3 border-b border-[#edf0f3] px-5 py-[18px] sm:flex-row sm:items-center sm:px-6"><div><h2 className="font-bold">Pemesanan terbaru</h2><p className="mt-1 text-xs text-[#66758a]">Booking terbaru yang masuk ke sistem.</p></div><Link href="/admin/pemesanan" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#245fd4]">Lihat semua <Icon name="arrow" className="h-3.5 w-3.5"/></Link></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead className="bg-[#f8fafc] text-[11px] font-semibold text-[#526177]"><tr><th className="px-6 py-3">ID booking</th><th className="px-5 py-3">Pelanggan</th><th className="px-5 py-3">Kendaraan</th><th className="px-5 py-3">Periode sewa</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-6 py-3 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-[#edf0f3]">{bookings.map(booking=><tr key={booking.id} className="text-sm hover:bg-[#fbfcfd]"><td className="px-6 py-4 font-semibold text-[#285fbd]">{booking.id}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#edf2f8] text-[10px] font-bold text-[#4e6078]">{booking.initials}</span><span className="font-medium text-[#25354b]">{booking.name}</span></div></td><td className="px-5 py-4 text-[#526177]">{booking.vehicle}</td><td className="px-5 py-4 text-[#526177]">{booking.dates}</td><td className="px-5 py-4 font-semibold text-[#25354b]">{booking.total}</td><td className="px-5 py-4"><span className={"inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold "+booking.tone}>{booking.status}</span></td><td className="px-6 py-4 text-right"><Link href={"/admin/pemesanan/"+booking.id} aria-label={"Lihat detail "+booking.id} className="inline-grid h-8 w-8 place-items-center rounded-lg border border-[#dfe5eb] text-[#66758a]"><Icon name="chevron" className="h-4 w-4"/></Link></td></tr>)}</tbody></table></div>
      </section>
    </div></main>
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-2xl border border-[#dfe5eb] bg-white/95 p-1.5 shadow-[0_10px_35px_rgba(20,38,65,.15)] backdrop-blur lg:hidden" aria-label="Navigasi mobile">{nav.slice(0,4).map((item,index)=><Link key={item.label} href={item.href} className={"flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold "+(index===0?"bg-[#eaf1ff] text-[#245fd4]":"text-[#4c5b70]")}><Icon name={item.icon} className="h-[18px] w-[18px]"/>{item.label}</Link>)}</nav>
  </div>;
}


