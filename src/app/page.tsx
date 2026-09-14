import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const fleet = [
  {
    name: "Toyota Avanza",
    year: "Tahun 2022",
    price: "Rp 450k",
    seats: "7 Kursi",
    transmission: "Matic",
    status: "Tersedia",
    statusTone: "available",
    image: "/rentgo-hero.png",
    imagePosition: "62% 58%",
  },
  {
    name: "Honda Brio",
    year: "Tahun 2022",
    price: "Rp 350k",
    seats: "4 Kursi",
    transmission: "Matic",
    status: "Tersedia",
    statusTone: "available",
    image: "/rentgo-hero.png",
    imagePosition: "48% 62%",
  },
  {
    name: "Honda Vario 160",
    year: "Tahun 2023",
    price: "Rp 120k",
    seats: "2 Kursi",
    transmission: "Matic",
    status: "Disewa",
    statusTone: "rented",
    image: "/rentgo-hero.png",
    imagePosition: "88% 60%",
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

function BookingPanel() {
  return (
    <form id="pesan" className="grid gap-3 rounded-lg border border-[#D5DFEC] bg-white p-4 shadow-xl shadow-[#10213D]/10 md:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_auto]">
      <label className="flex min-w-0 items-center gap-3 rounded-md border border-[#DDE5F0] bg-[#F7FAFD] px-3 py-3">
        <Icon name="pin" className="h-5 w-5 shrink-0 text-[#1346A0]" />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold text-[#66758D]">Lokasi ambil</span>
          <input className="w-full bg-transparent text-sm font-semibold text-[#132033] outline-none placeholder:text-[#8A96A8]" placeholder="Surabaya" />
        </span>
      </label>
      <label className="rounded-md border border-[#DDE5F0] bg-[#F7FAFD] px-3 py-3">
        <span className="block text-[11px] font-semibold text-[#66758D]">Kategori</span>
        <select className="w-full bg-transparent text-sm font-semibold text-[#132033] outline-none">
          <option>Mobil</option>
          <option>Motor</option>
        </select>
      </label>
      <label className="rounded-md border border-[#DDE5F0] bg-[#F7FAFD] px-3 py-3">
        <span className="block text-[11px] font-semibold text-[#66758D]">Tanggal sewa</span>
        <input type="date" className="w-full bg-transparent text-sm font-semibold text-[#132033] outline-none" />
      </label>
      <label className="rounded-md border border-[#DDE5F0] bg-[#F7FAFD] px-3 py-3">
        <span className="block text-[11px] font-semibold text-[#66758D]">Tanggal kembali</span>
        <input type="date" className="w-full bg-transparent text-sm font-semibold text-[#132033] outline-none" />
      </label>
      <button className="inline-flex items-center justify-center gap-2 rounded-md bg-[#147C4C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0F633C]" type="button">
        <Icon name="search" className="h-4 w-4" />
        Cari
      </button>
    </form>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#EEF3FA]">
      <div className="absolute inset-0">
        <Image
          src="/rentgo-hero.png"
          alt="Armada mobil dan motor RentGo siap disewa"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7FAFD] via-[#F7FAFD]/88 to-[#F7FAFD]/18" />
      </div>

      <div className="relative mx-auto max-w-[1232px] px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pb-14 lg:pt-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#132033] sm:text-5xl lg:text-6xl">
            Sewa kendaraan lebih cepat, tercatat, dan siap jalan.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#445168] sm:text-lg">
            RentGo membantu pelanggan melihat armada tersedia, menghitung biaya sewa, membayar DP, dan memantau status pesanan. Admin mengelola kendaraan, transaksi, serta laporan dari satu tempat.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#pesan" className="inline-flex items-center gap-2 rounded-md bg-[#1346A0] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0D367D]">
              Mulai pesan
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="#cara-sewa" className="rounded-md border border-[#B8C5D8] bg-white px-5 py-3 text-sm font-semibold text-[#132033] hover:border-[#1346A0]">
              Lihat cara sewa
            </Link>
          </div>
        </div>

        <div className="mt-12 max-w-6xl">
          <BookingPanel />
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="layanan" className="bg-white py-20">
      <div className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#147C4C]">Produk dan Layanan</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">
              Dari pencarian unit sampai laporan transaksi.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#526176]">
            PRD RentGo menargetkan dua pengguna utama: pelanggan yang ingin menyewa kendaraan tanpa proses manual, dan admin rental yang membutuhkan pengelolaan data lebih rapi.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article key={service.title} className="rounded-lg border border-[#DDE5F0] bg-[#F7FAFD] p-6">
              <div className="grid h-12 w-12 place-items-center rounded-md bg-white text-[#1346A0] shadow-sm">
                <Icon name={service.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#132033]">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#526176]">{service.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Fleet() {
  return (
    <section id="armada" className="bg-[#F7FAFD] py-20">
      <div className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-[#147C4C]">Armada</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">
              Kendaraan populer untuk kebutuhan harian.
            </h2>
          </div>
          <Link href="#pesan" className="inline-flex w-fit items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#1346A0] ring-1 ring-[#DDE5F0] hover:ring-[#1346A0]">
            Cek ketersediaan
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
                  {vehicle.status}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-2xl font-semibold leading-tight text-[#132033]">{vehicle.name}</h3>
                <p className="mt-1 text-base font-medium text-[#66758D]">{vehicle.year}</p>

                <div className="mt-5 grid grid-cols-2 gap-4 text-base font-medium text-[#526176]">
                  <span className="inline-flex items-center gap-2">
                    <Icon name="users" className="h-5 w-5 text-[#526176]" />
                    {vehicle.seats}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Icon name="gear" className="h-5 w-5 text-[#526176]" />
                    {vehicle.transmission}
                  </span>
                </div>

                <div className="mt-6 border-t border-[#DDE5F0] pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-2xl font-semibold text-[#1346A0]">
                      {vehicle.price}
                      <span className="text-sm font-semibold text-[#66758D]"> /hari</span>
                    </p>
                    <button
                      type="button"
                      disabled={vehicle.statusTone !== "available"}
                      className="rounded-lg bg-[#1346A0] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0D367D] disabled:bg-[#E9EEF7] disabled:text-[#9AA7BA]"
                    >
                      Pilih
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

function Steps() {
  return (
    <section id="cara-sewa" className="bg-white py-20">
      <div className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#147C4C]">Cara Sewa</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">
            Alur dibuat untuk mengurangi proses manual.
          </h2>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-lg border border-[#DDE5F0] p-6">
              <span className="text-4xl font-semibold text-[#DDE5F0]">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-8 text-lg font-semibold text-[#132033]">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#526176]">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Rules() {
  return (
    <section id="aturan" className="bg-[#10213D] py-20 text-white">
      <div className="mx-auto grid max-w-[1232px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold text-[#75D09B]">Aturan Bisnis</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Transparan sejak pelanggan memilih tanggal.
          </h2>
          <p className="mt-5 leading-8 text-[#C8D4E6]">
            Sistem hanya menerima booking jika kendaraan tersedia di rentang tanggal yang dipilih. Perhitungan biaya, DP, pelunasan, dan diskon dibuat otomatis untuk mengurangi kesalahan pencatatan.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 text-[#132033]">
            <h3 className="text-lg font-semibold">Diskon durasi sewa</h3>
            <div className="mt-5 divide-y divide-[#DDE5F0]">
              {rules.map((rule) => (
                <div key={rule.label} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="font-semibold text-[#526176]">{rule.label}</span>
                  <span className="font-semibold text-[#1346A0]">{rule.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 text-[#132033]">
            <h3 className="text-lg font-semibold">Refund pembatalan</h3>
            <ul className="mt-5 space-y-3">
              {refunds.map((refund) => (
                <li key={refund} className="flex gap-3 text-sm leading-6 text-[#526176]">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-[#147C4C]" />
                  {refund}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Help() {
  return (
    <section id="bantuan" className="bg-white py-20">
      <div className="mx-auto grid max-w-[1232px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold text-[#147C4C]">Bantuan</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">
            Siap membantu pelanggan dan admin rental.
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-[#526176]">
            Landing page ini menyiapkan titik masuk untuk login, register, daftar kendaraan, filter, detail kendaraan, tentang kami, dan pusat bantuan sesuai hak akses Guest pada PRD.
          </p>
        </div>
        <div className="rounded-lg border border-[#DDE5F0] bg-[#F7FAFD] p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-[#1346A0] text-white">
              <Icon name="phone" className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-[#132033]">Butuh bantuan pemesanan?</p>
              <p className="text-sm text-[#526176]">Call Center 1500 009</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#pesan" className="rounded-md bg-[#1346A0] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0D367D]">
              Pesan kendaraan
            </Link>
            <Link href="#armada" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#132033] ring-1 ring-[#DDE5F0] hover:ring-[#1346A0]">
              Lihat armada
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <SiteHeader activePage="home" />
      <Hero />
      <Services />
      <Fleet />
      <Steps />
      <Rules />
      <Help />
      <SiteFooter />
    </main>
  );
}
