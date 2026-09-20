import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLocale, type Locale } from "@/lib/i18n";

const english: Record<string, string> = {
  "Sewa kendaraan lebih cepat dan siap jalan.": "Rent a vehicle faster and hit the road.",
  "RentGo membantu anda menyewa mobil atau motor tanpa perlu datang ke lokasi terlebih dahulu.": "RentGo lets you rent a car or motorcycle without visiting the rental office first.",
  "Mulai pesan": "Start booking", "Lihat cara sewa": "How it works", "Produk dan Layanan": "Products and Services",
  "Dari pencarian unit sampai laporan transaksi.": "From finding a vehicle to transaction reports.",
  "Solusi sewa mobil dan motor lepas kunci tanpa ribet, proses instan 100% online dengan armada terawat dan siap pakai.": "A hassle-free self-drive car and motorcycle rental solution with an instant 100% online process and well-maintained vehicles ready to use.",
  "Armada": "Fleet", "Kendaraan populer untuk kebutuhan harian.": "Popular vehicles for everyday needs.", "Cek ketersediaan": "Check availability", "/hari": "/day", "Pilih": "Choose",
  "Cara Sewa": "How to Rent", "Alur dibuat untuk mengurangi proses manual.": "A simple flow designed to reduce manual steps.",
  "Aturan Bisnis": "Rental Policies", "Transparan sejak pelanggan memilih tanggal.": "Clear terms from the moment you choose your dates.",
  "Sistem hanya menerima booking jika kendaraan tersedia di rentang tanggal yang dipilih. Perhitungan biaya, DP, pelunasan, dan diskon dibuat otomatis untuk mengurangi kesalahan pencatatan.": "Bookings are accepted only when a vehicle is available for the selected dates. Rental fees, deposits, balances, and discounts are calculated automatically.",
  "Diskon durasi sewa": "Rental duration discounts", "Refund pembatalan": "Cancellation refunds", "Bantuan": "Help",
  "Siap membantu pelanggan dan admin rental.": "Support for customers and rental teams.",
  "Punya pertanyaan seputar syarat rental, jadwal, atau pembayaran? Tim RentGo siap membantu Anda 24/7.": "Have questions about rental requirements, schedules, or payments? The RentGo team is ready to help you 24/7.",
  "Butuh bantuan pemesanan?": "Need help with a booking?", "Pesan kendaraan": "Book a vehicle", "Lihat armada": "View fleet",  "Tahun 2022": "Year 2022", "Tahun 2023": "Year 2023", "7 Kursi": "7 seats", "4 Kursi": "4 seats", "2 Kursi": "2 seats", "Tersedia": "Available", "Disewa": "Rented",
  "Pemesanan online": "Online booking", "Pelanggan bisa melihat kendaraan tersedia, memilih tanggal sewa, lalu membuat booking tanpa datang ke lokasi.": "Customers can view available vehicles, choose rental dates, and book without visiting the rental office.",
  "Verifikasi KTP dan SIM": "ID and driving license verification", "Dokumen pelanggan diperiksa admin sebelum pesanan dikonfirmasi agar serah terima lebih aman.": "Customer documents are reviewed before confirmation to keep vehicle handover secure.",
  "Pembayaran DP 50%": "50% down payment", "Pesanan aktif setelah DP dibayar, lalu sisa pembayaran dilunasi sebelum kendaraan diambil.": "The booking becomes active after the deposit is paid, with the balance due before pickup.",
  "Laporan admin": "Admin reports", "Pemilik rental dapat mengelola armada, pelanggan, transaksi, status unit, dan laporan penyewaan.": "Rental owners can manage fleets, customers, transactions, vehicle status, and rental reports.",
  "Cari kendaraan": "Find a vehicle", "Pilih lokasi, kategori mobil atau motor, serta tanggal ambil dan kembali.": "Choose a location, car or motorcycle category, and pickup and return dates.",
  "Booking dan unggah dokumen": "Book and upload documents", "Lengkapi profil, KTP, dan SIM agar admin dapat memvalidasi data penyewa.": "Complete your profile, ID, and driving license so the rental team can verify your details.",
  "Bayar DP 50%": "Pay a 50% deposit", "Sistem menghitung biaya sewa, diskon durasi, dan nilai DP secara otomatis.": "The system automatically calculates rental costs, duration discounts, and the deposit.",
  "Ambil kendaraan": "Pick up the vehicle", "Lunasi sisa pembayaran maksimal 24 jam sebelum serah terima kendaraan.": "Pay the remaining balance no later than 24 hours before vehicle handover.",
  "1-3 hari": "1-3 days", "4-7 hari": "4-7 days", "8-10 hari": "8-10 days", "11-14 hari": "11-14 days", "> 14 hari": "> 14 days", "Tanpa diskon": "No discount", "Diskon 5%": "5% discount", "Diskon 10%": "10% discount", "Diskon 15%": "15% discount", "Diskon 20%": "20% discount",
  "Lebih dari 7 hari sebelum sewa: refund 100%": "More than 7 days before rental: 100% refund", "3-7 hari sebelum sewa: refund 90%": "3-7 days before rental: 90% refund", "Kurang dari 3 hari sebelum sewa: refund 75%": "Less than 3 days before rental: 75% refund", "Hari H atau tidak hadir: tidak dapat dikembalikan": "On the rental day or no-show: non-refundable",
};

function tr(locale: Locale, value: string) {
  return locale === "en" ? english[value] ?? value : value;
}
const fleet = [
  {
    name: "Toyota Avanza",
    year: "Tahun 2022",
    price: "Rp 450k",
    seats: "7 Kursi",
    transmission: "Matic",
    status: "Tersedia",
    statusTone: "available",
    image: "/referensi/toyota_avanza.webp",
    imagePosition: "center",
  },
  {
    name: "Honda Brio",
    year: "Tahun 2022",
    price: "Rp 350k",
    seats: "4 Kursi",
    transmission: "Matic",
    status: "Tersedia",
    statusTone: "available",
    image: "/referensi/honda_brio.webp",
    imagePosition: "center",
  },
  {
    name: "Honda Vario 160",
    year: "Tahun 2023",
    price: "Rp 120k",
    seats: "2 Kursi",
    transmission: "Matic",
    status: "Disewa",
    statusTone: "rented",
    image: "/referensi/honda_vario160.webp",
    imagePosition: "center",
  },
];

const services = [
  {
    title: "Pemesanan online",
    desc: "Pelanggan bisa melihat kendaraan tersedia, memilih tanggal sewa, lalu membuat booking tanpa datang ke lokasi.",
    icon: "calendar",
  },
  {
    title: "Verifikasi KTP dan SIM",
    desc: "Dokumen pelanggan diperiksa admin sebelum pesanan dikonfirmasi agar serah terima lebih aman.",
    icon: "shield",
  },
  {
    title: "Pembayaran DP 50%",
    desc: "Pesanan aktif setelah DP dibayar, lalu sisa pembayaran dilunasi sebelum kendaraan diambil.",
    icon: "wallet",
  },
  {
    title: "Laporan admin",
    desc: "Pemilik rental dapat mengelola armada, pelanggan, transaksi, status unit, dan laporan penyewaan.",
    icon: "chart",
  },
];

const steps = [
  {
    title: "Cari kendaraan",
    desc: "Pilih lokasi, kategori mobil atau motor, serta tanggal ambil dan kembali.",
  },
  {
    title: "Booking dan unggah dokumen",
    desc: "Lengkapi profil, KTP, dan SIM agar admin dapat memvalidasi data penyewa.",
  },
  {
    title: "Bayar DP 50%",
    desc: "Sistem menghitung biaya sewa, diskon durasi, dan nilai DP secara otomatis.",
  },
  {
    title: "Ambil kendaraan",
    desc: "Lunasi sisa pembayaran maksimal 24 jam sebelum serah terima kendaraan.",
  },
];

const rules = [
  { label: "1-3 hari", value: "Tanpa diskon" },
  { label: "4-7 hari", value: "Diskon 5%" },
  { label: "8-10 hari", value: "Diskon 10%" },
  { label: "11-14 hari", value: "Diskon 15%" },
  { label: "> 14 hari", value: "Diskon 20%" },
];

const refunds = [
  "Lebih dari 7 hari sebelum sewa: refund 100%",
  "3-7 hari sebelum sewa: refund 90%",
  "Kurang dari 3 hari sebelum sewa: refund 75%",
  "Hari H atau tidak hadir: tidak dapat dikembalikan",
];

function Icon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4 2.8 7.5 7 9 4.2-1.5 7-5 7-9V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2.5" />
        <path d="M3 10h18M16 14h2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5M4 19h16" />
        <path d="M8 15v-4M12 15V8M16 15v-6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.4" />
      </>
    ),
    phone: <path d="M5 4h4l2 5-2 1.5a12 12 0 0 0 5 5L15.5 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    users: (
      <>
        <path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4" />
        <circle cx="12" cy="9" r="3" />
        <path d="M4.5 18.5c0-1.8 1.4-3.2 3.2-3.2M16.3 15.3c1.8 0 3.2 1.4 3.2 3.2" />
        <path d="M6.8 12.2a2.4 2.4 0 1 1 1.7-4.1M15.5 8.1a2.4 2.4 0 1 1 1.7 4.1" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2.8v2.5M12 18.7v2.5M4.2 4.2 6 6M18 18l1.8 1.8M2.8 12h2.5M18.7 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] overflow-hidden bg-[#EEF3FA]">
      <div className="absolute inset-0">
        <Image
          src="/rentgo-hero.png"
          alt="Armada mobil dan motor RentGo siap disewa"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7FAFD]/82 via-[#F7FAFD]/48 to-transparent" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1232px] items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#132033] sm:text-5xl lg:text-6xl">
            {tr(locale, "Sewa kendaraan lebih cepat dan siap jalan.")}
          </h1>
          <p className="mt-5 max-w-xl text-base font-medium leading-8 text-[#203651] sm:text-lg">
            {tr(locale, "RentGo membantu anda menyewa mobil atau motor tanpa perlu datang ke lokasi terlebih dahulu.")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kendaraan" className="inline-flex items-center gap-2 rounded-md bg-[#1346A0] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0D367D]">
              {tr(locale, "Mulai pesan")}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="#cara-sewa" className="rounded-md border border-[#B8C5D8] bg-white px-5 py-3 text-sm font-semibold text-[#132033] hover:border-[#1346A0]">
              {tr(locale, "Lihat cara sewa")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ locale }: { locale: Locale }) {
  return (
    <section id="layanan" className="bg-white py-20">
      <div className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#147C4C]">{tr(locale, "Produk dan Layanan")}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">
              {tr(locale, "Dari pencarian unit sampai laporan transaksi.")}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#526176]">
            {tr(locale, "Solusi sewa mobil dan motor lepas kunci tanpa ribet, proses instan 100% online dengan armada terawat dan siap pakai.")}
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article key={tr(locale, service.title)} className="rounded-lg border border-[#DDE5F0] bg-[#F7FAFD] p-6">
              <div className="grid h-12 w-12 place-items-center rounded-md bg-white text-[#1346A0] shadow-sm">
                <Icon name={service.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#132033]">{tr(locale, service.title)}</h3>
              <p className="mt-3 text-sm leading-7 text-[#526176]">{tr(locale, service.desc)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Fleet({ locale }: { locale: Locale }) {
  return (
    <section id="armada" className="bg-[#F7FAFD] py-20">
      <div className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-[#147C4C]">{tr(locale, "Armada")}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">
              {tr(locale, "Kendaraan populer untuk kebutuhan harian.")}
            </h2>
          </div>
          <Link href="/kendaraan" className="inline-flex w-fit items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#1346A0] ring-1 ring-[#DDE5F0] hover:ring-[#1346A0]">
            {tr(locale, "Cek ketersediaan")}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {fleet.map((vehicle) => (
            <article
              key={vehicle.name}
              className="overflow-hidden rounded-xl border border-[#D8E5F6] bg-white shadow-sm"
            >
              <div className="relative h-44 bg-[#EAF1FA]">
                <Image
                  src={vehicle.image}
                  alt={`${vehicle.name} tersedia di RentGo`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: vehicle.imagePosition }}
                />
                <span
                  className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                    vehicle.statusTone === "available"
                      ? "bg-[#DDF8E7] text-[#147C4C]"
                      : "bg-[#FDE5E7] text-[#C74A58]"
                  }`}
                >
                  <Icon
                    name={vehicle.statusTone === "available" ? "check" : "phone"}
                    className="h-3.5 w-3.5"
                  />
                  {tr(locale, vehicle.status)}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-2xl font-semibold leading-tight text-[#132033]">{vehicle.name}</h3>
                <p className="mt-1 text-base font-medium text-[#66758D]">{tr(locale, vehicle.year)}</p>

                <div className="mt-5 grid grid-cols-2 gap-4 text-base font-medium text-[#526176]">
                  <span className="inline-flex items-center gap-2">
                    <Icon name="users" className="h-5 w-5 text-[#526176]" />
                    {tr(locale, vehicle.seats)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Icon name="gear" className="h-5 w-5 text-[#526176]" />
                    {tr(locale, vehicle.transmission)}
                  </span>
                </div>

                <div className="mt-6 border-t border-[#DDE5F0] pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-2xl font-semibold text-[#1346A0]">
                      {vehicle.price}
                      <span className="text-sm font-semibold text-[#66758D]"> {tr(locale, "/hari")}</span>
                    </p>
                    <button
                      type="button"
                      disabled={vehicle.statusTone !== "available"}
                      className="rounded-lg bg-[#1346A0] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0D367D] disabled:bg-[#E9EEF7] disabled:text-[#9AA7BA]"
                    >
                      {tr(locale, "Pilih")}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps({ locale }: { locale: Locale }) {
  return (
    <section id="cara-sewa" className="bg-white py-20">
      <div className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#147C4C]">{tr(locale, "Cara Sewa")}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">
            {tr(locale, "Alur dibuat untuk mengurangi proses manual.")}
          </h2>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-4">
          {steps.map((step, index) => (
            <li key={tr(locale, step.title)} className="rounded-lg border border-[#DDE5F0] p-6">
              <span className="text-4xl font-semibold text-[#DDE5F0]">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-8 text-lg font-semibold text-[#132033]">{tr(locale, step.title)}</h3>
              <p className="mt-3 text-sm leading-7 text-[#526176]">{tr(locale, step.desc)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Rules({ locale }: { locale: Locale }) {
  return (
    <section id="aturan" className="bg-[#10213D] py-20 text-white">
      <div className="mx-auto grid max-w-[1232px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold text-[#75D09B]">{tr(locale, "Aturan Bisnis")}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {tr(locale, "Transparan sejak pelanggan memilih tanggal.")}
          </h2>
          <p className="mt-5 leading-8 text-[#C8D4E6]">
            {tr(locale, "Sistem hanya menerima booking jika kendaraan tersedia di rentang tanggal yang dipilih. Perhitungan biaya, DP, pelunasan, dan diskon dibuat otomatis untuk mengurangi kesalahan pencatatan.")}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 text-[#132033]">
            <h3 className="text-lg font-semibold">{tr(locale, "Diskon durasi sewa")}</h3>
            <div className="mt-5 divide-y divide-[#DDE5F0]">
              {rules.map((rule) => (
                <div key={tr(locale, rule.label)} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="font-semibold text-[#526176]">{tr(locale, rule.label)}</span>
                  <span className="font-semibold text-[#1346A0]">{tr(locale, rule.value)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 text-[#132033]">
            <h3 className="text-lg font-semibold">{tr(locale, "Refund pembatalan")}</h3>
            <ul className="mt-5 space-y-3">
              {refunds.map((refund) => (
                <li key={tr(locale, refund)} className="flex gap-3 text-sm leading-6 text-[#526176]">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-[#147C4C]" />
                  {tr(locale, refund)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Help({ locale }: { locale: Locale }) {
  return (
    <section id="bantuan" className="bg-white py-20">
      <div className="mx-auto grid max-w-[1232px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold text-[#147C4C]">{tr(locale, "Bantuan")}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">
            {tr(locale, "Siap membantu pelanggan dan admin rental.")}
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-[#526176]">
            {tr(locale, "Punya pertanyaan seputar syarat rental, jadwal, atau pembayaran? Tim RentGo siap membantu Anda 24/7.")}
          </p>
        </div>
        <div className="rounded-lg border border-[#DDE5F0] bg-[#F7FAFD] p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-[#1346A0] text-white">
              <Icon name="phone" className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-[#132033]">{tr(locale, "Butuh bantuan pemesanan?")}</p>
              <p className="text-sm text-[#526176]">Call Center 1500 009</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/kendaraan" className="rounded-md bg-[#1346A0] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0D367D]">
              {tr(locale, "Pesan kendaraan")}
            </Link>
            <Link href="#armada" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#132033] ring-1 ring-[#DDE5F0] hover:ring-[#1346A0]">
              {tr(locale, "Lihat armada")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const locale = await getLocale();
  return (
    <main>
      <SiteHeader activePage="home" />
      <Hero locale={locale} />
      <Services locale={locale} />
      <Fleet locale={locale} />
      <Steps locale={locale} />
      <Rules locale={locale} />
      <Help locale={locale} />
      <SiteFooter />
    </main>
  );
}


