import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FAQAccordion } from "./faq-accordion";

export const metadata: Metadata = {
  title: "FAQ & Bantuan | RentGo",
  description: "Jawaban tentang pemesanan, pembayaran, dokumen, pengambilan, pengembalian, pembatalan, dan refund kendaraan RentGo.",
};

type IconName = "help" | "message" | "phone" | "clock" | "shield" | "wallet" | "car" | "calendar" | "arrow";

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.5 2.1c-.8.5-1.3 1-1.3 2M12 17h.01"/></>,
    message: <><path d="M5 18.5 3.8 21l3.7-1.1a9 9 0 1 0-2.5-1.4Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></>,
    phone: <path d="M5 4h4l2 5-2 1.5a12 12 0 0 0 5 5L15.5 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    shield: <><path d="M12 3 5 6v5c0 4 2.8 7.5 7 9 4.2-1.5 7-5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
    wallet: <><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M16 14h2"/></>,
    car: <><path d="M5 17h14M6 17v2M18 17v2M4 14l2-6h12l2 6"/><path d="M7 14h.01M17 14h.01"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name]}</svg>;
}


const faqs = [
  {
    id: "pemesanan",
    question: "Bagaimana cara memesan kendaraan di RentGo?",
    answer: "Pilih kendaraan dan tanggal sewa, masuk ke akun Anda, lalu lengkapi data pemesanan. Setelah KTP dan SIM dinyatakan valid, bayar DP 50% agar admin dapat mengonfirmasi booking.",
  },
  {
    id: "pembayaran",
    question: "Berapa DP yang harus saya bayar?",
    answer: "DP adalah 50% dari total biaya sewa. Sisa 50% wajib dilunasi paling lambat 24 jam sebelum waktu pengambilan. Kendaraan hanya dapat diserahkan setelah pembayaran lunas.",
  },
  {
    id: "dokumen",
    question: "Dokumen apa yang perlu saya siapkan?",
    answer: "Anda perlu mengunggah KTP dan SIM yang masih berlaku. Admin memeriksanya secara manual, dan dokumen asli yang sama perlu dibawa saat serah terima kendaraan.",
  },
  {
    id: "kendaraan",
    question: "Bagaimana RentGo memastikan kendaraan tersedia?",
    answer: "Ketersediaan diperiksa berdasarkan rentang tanggal yang dipilih. Sistem tidak menerima dua pemesanan aktif untuk kendaraan yang sama pada jadwal yang bertabrakan.",
  },
  {
    question: "Apakah ada diskon untuk sewa beberapa hari?",
    answer: "Ada. Diskon mulai 5% untuk 4-7 hari, 10% untuk 8-10 hari, 15% untuk 11-14 hari, dan 20% untuk durasi lebih dari 14 hari.",
  },
  {
    question: "Bagaimana ketentuan pembatalan dan refund?",
    answer: "Refund 100% berlaku jika pembatalan dilakukan lebih dari 7 hari sebelum sewa, 90% untuk 3-7 hari, 75% untuk kurang dari 3 hari, dan 0% pada hari sewa atau jika pelanggan tidak datang.",
  },
  {
    question: "Apa yang terjadi jika RentGo membatalkan pesanan?",
    answer: "Jika pembatalan disebabkan kendaraan rusak, tidak layak digunakan, atau kendala lain dari pihak RentGo, seluruh jumlah yang sudah Anda bayarkan akan dikembalikan.",
  },
  {
    question: "Apa yang harus saya lakukan saat mengambil kendaraan?",
    answer: "Pastikan pembayaran sudah lunas dan bawa KTP serta SIM asli yang sesuai dengan dokumen digital. Tim kami akan memeriksa dokumen dan kondisi kendaraan sebelum serah terima.",
  },
  {
    question: "Apakah keterlambatan pengembalian dikenai biaya?",
    answer: "Keterlambatan dapat dikenai biaya tambahan sesuai ketentuan rental. Hubungi tim RentGo sesegera mungkin jika jadwal pengembalian berpotensi berubah.",
  },
];

const quickFacts = [
  { value: "50%", label: "DP untuk konfirmasi booking" },
  { value: "24 jam", label: "Batas pelunasan sebelum pengambilan" },
  { value: "100%", label: "Refund jika dibatalkan RentGo" },
];

export default function FAQPage() {
  return <main className="min-h-screen bg-white">
    <SiteHeader activePage="faq"/>
    <section className="relative overflow-hidden border-y border-[#dce5f1] bg-[#10213d] md:aspect-[32/15]">
      <div className="relative aspect-[32/15] w-full md:absolute md:inset-0 md:aspect-auto">
        <Image src="/referensi/Background.jpg" alt="" fill priority sizes="100vw" className="object-contain object-center" />
      </div>
      <div className="absolute inset-0 hidden bg-gradient-to-r from-[#07172d]/85 via-[#07172d]/35 to-transparent md:block" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1232px] px-4 py-9 sm:px-6 md:flex md:h-full md:items-center md:py-0 lg:px-8">
        <div className="max-w-[720px]">
          <h1 className="text-4xl font-bold leading-[1.12] tracking-[-0.04em] text-white sm:text-5xl">Ada yang ingin ditanyakan sebelum perjalanan?</h1>
          <p className="mt-5 max-w-[650px] text-base leading-8 text-white/85 sm:text-lg">Temukan jawaban tentang booking, pembayaran, dokumen, serta aturan pengambilan dan pengembalian kendaraan.</p>
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-[1232px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-16 lg:px-8 lg:py-20">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-sm font-semibold text-[#147c4c]">Bantuan langsung</p>
        <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] text-[#132033]">Belum menemukan jawaban?</h2>
        <p className="mt-3 text-sm leading-7 text-[#5c6b7f]">Tim RentGo siap membantu kendala booking dan kebutuhan perjalanan Anda.</p>
        <div className="mt-7 overflow-hidden rounded-xl border border-[#dce5f0] bg-[#f8fafc]">
          <div className="border-b border-[#dce5f0] p-5">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#e3edfb] text-[#1346a0]"><Icon name="message"/></span>
            <p className="mt-4 font-semibold text-[#132033]">Hubungi layanan pelanggan</p>
            <p className="mt-1 text-sm leading-6 text-[#5c6b7f]">Ceritakan nomor booking dan kendala Anda agar kami dapat membantu lebih cepat.</p>
          </div>
          <div className="space-y-3 p-5 text-sm">
            <a href="tel:08001736846" className="flex items-center gap-3 font-semibold text-[#283a52] hover:text-[#1346a0]"><Icon name="phone" className="h-4 w-4 text-[#147c4c]"/>0800-1-RENTGO</a>
            <p className="flex items-center gap-3 text-[#5c6b7f]"><Icon name="clock" className="h-4 w-4 text-[#147c4c]"/>Setiap hari, 08.00-20.00 WIB</p>
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-[#10213d] p-5 text-white">
          <p className="text-sm font-semibold">Sudah siap memilih kendaraan?</p>
          <p className="mt-2 text-sm leading-6 text-[#c8d4e6]">Cek armada yang tersedia untuk jadwal perjalanan Anda.</p>
          <Link href="/kendaraan" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#1346a0] hover:bg-[#eef4fc]">Lihat kendaraan <Icon name="arrow" className="h-4 w-4"/></Link>
        </div>
      </aside>

      <div>
        <div className="flex flex-col justify-between gap-3 border-b border-[#dce5f0] pb-6 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold text-[#147c4c]">Jawaban cepat</p><h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-[#132033]">Pertanyaan yang sering diajukan</h2></div>
          <p className="text-sm text-[#657489]">{faqs.length} topik bantuan</p>
        </div>
        <FAQAccordion items={faqs} />    </div>
    </section>

    <section className="border-y border-[#dce5f0] bg-[#f7fafd]">
      <div className="mx-auto grid max-w-[1232px] gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        {quickFacts.map((fact,index)=><div key={fact.value} className={"flex items-center gap-4 "+(index>0?"sm:border-l sm:border-[#d2ddea] sm:pl-7":"")}>
          <strong className="text-2xl font-bold tracking-[-0.03em] text-[#1346a0]">{fact.value}</strong><p className="max-w-[190px] text-sm leading-6 text-[#526176]">{fact.label}</p>
        </div>)}
      </div>
    </section>
    <SiteFooter/>
  </main>;
}









