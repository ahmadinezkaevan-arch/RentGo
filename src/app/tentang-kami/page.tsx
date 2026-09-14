import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Tentang Kami - RentGo",
  description:
    "Kenali RentGo, platform rental kendaraan online untuk pemesanan armada, verifikasi dokumen, pembayaran DP, dan pengelolaan transaksi rental.",
};

const highlights = [
  { value: "50+", label: "Unit kendaraan siap dikelola" },
  { value: "24/7", label: "Akses informasi pemesanan" },
  { value: "50%", label: "DP untuk konfirmasi booking" },
  { value: "5 detik", label: "Target proses pencarian" },
];

const values = [
  {
    title: "Praktis untuk pelanggan",
    desc: "Pelanggan dapat mencari kendaraan, memilih tanggal, melihat biaya, dan membuat pesanan tanpa proses manual yang panjang.",
  },
  {
    title: "Transparan sejak awal",
    desc: "Harga, status kendaraan, DP, pelunasan, diskon durasi, dan aturan refund ditampilkan jelas sebelum pemesanan.",
  },
  {
    title: "Terkelola untuk pemilik rental",
    desc: "Admin memiliki ruang kerja untuk mengelola armada, pelanggan, transaksi, status ketersediaan, dan laporan sewa.",
  },
];

const commitments = [
  "Kendaraan hanya dapat dipesan jika tersedia pada rentang tanggal yang dipilih.",
  "KTP dan SIM diverifikasi admin sebelum pesanan dikonfirmasi.",
  "Sisa pembayaran dilunasi maksimal 24 jam sebelum serah terima.",
  "Data pelanggan dan dokumen hanya dapat diakses oleh pihak berwenang.",
];

function Icon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
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
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
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

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F5F7FC]">
      <div className="mx-auto grid max-w-[1232px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-[#132033] sm:text-5xl">
            Tentang RentGo
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#526176]">
            RentGo dirancang untuk membuat rental kendaraan lebih mudah diakses,
            lebih rapi dicatat, dan lebih transparan bagi pelanggan maupun pemilik
            usaha rental.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kendaraan" className="inline-flex items-center gap-2 rounded-lg bg-[#0E3FA8] px-5 py-3 text-sm font-semibold text-white">
              Lihat kendaraan
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="/#bantuan" className="rounded-lg border border-[#C8D0DD] bg-white px-5 py-3 text-sm font-semibold text-[#132033]">
              Hubungi kami
            </Link>
          </div>
        </div>

        <div className="relative min-h-[22rem] overflow-hidden rounded-2xl border border-[#D8E5F6] bg-white shadow-sm">
          <Image
            src="/rentgo-hero.png"
            alt="Armada RentGo di area serah terima kendaraan"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10213D]/55 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-white/92 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-[#0E3FA8]">Solusi rental kendaraan online</p>
            <p className="mt-2 text-2xl font-semibold text-[#132033]">
              Cari, booking, verifikasi, dan kelola transaksi dalam satu alur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-[1232px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold text-[#147C4C]">Profil RentGo</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">
            Dibuat untuk mengganti proses rental yang masih serba manual.
          </h2>
        </div>
        <div className="space-y-5 text-base leading-8 text-[#526176]">
          <p>
            Banyak usaha rental kendaraan masih mengandalkan pencatatan manual,
            pesan singkat, atau pelanggan yang harus datang langsung untuk
            menanyakan ketersediaan armada. Cara ini membuat informasi kendaraan,
            jadwal, data pelanggan, dan transaksi lebih sulit dipantau.
          </p>
          <p>
            RentGo hadir sebagai rancangan platform berbasis website yang
            menghubungkan kebutuhan pelanggan dan admin rental. Pelanggan dapat
            mencari kendaraan, memilih jadwal, melakukan booking, mengunggah KTP
            dan SIM, serta memantau status sewa. Admin dapat mengelola armada,
            verifikasi pesanan, transaksi, dan laporan secara lebih terstruktur.
          </p>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-[#10213D] py-12 text-white">
      <div className="mx-auto grid max-w-[1232px] gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {highlights.map((item) => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-3xl font-semibold text-[#75D09B]">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-[#C8D4E6]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function VisionMission() {
  return (
    <section className="bg-[#F5F7FC] py-20">
      <div className="mx-auto grid max-w-[1232px] gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-2xl border border-[#D8E5F6] bg-white p-8">
          <p className="text-sm font-semibold text-[#147C4C]">Visi Kami</p>
          <h2 className="mt-4 text-3xl font-semibold text-[#132033]">
            Menjadi platform rental kendaraan yang praktis, aman, dan mudah dipercaya.
          </h2>
          <p className="mt-5 leading-8 text-[#526176]">
            RentGo ingin membantu pelanggan menemukan kendaraan yang sesuai dengan
            kebutuhan perjalanan, sekaligus membantu pemilik rental mengelola usaha
            dengan data yang lebih rapi.
          </p>
        </article>

        <article className="rounded-2xl border border-[#D8E5F6] bg-white p-8">
          <p className="text-sm font-semibold text-[#147C4C]">Misi Kami</p>
          <h2 className="mt-4 text-3xl font-semibold text-[#132033]">
            Membuat proses sewa lebih cepat dari pencarian sampai serah terima.
          </h2>
          <p className="mt-5 leading-8 text-[#526176]">
            Kami merancang alur yang mencakup pencarian armada, perhitungan biaya,
            DP, pelunasan, verifikasi dokumen, pembatalan, dan riwayat sewa dalam
            pengalaman web yang mudah dipahami.
          </p>
        </article>
      </div>
    </section>
  );
}

function Values() {
  const icons = ["search", "wallet", "chart"];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#147C4C]">Kenapa RentGo</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">
            Satu platform untuk perjalanan dan pengelolaan rental.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((value, index) => (
            <article key={value.title} className="rounded-2xl border border-[#D8E5F6] bg-[#F7FAFD] p-6">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-white text-[#0E3FA8] shadow-sm">
                <Icon name={icons[index]} className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#132033]">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#526176]">{value.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="bg-[#F5F7FC] py-20">
      <div className="mx-auto grid max-w-[1232px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold text-[#147C4C]">Komitmen Layanan</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">
            Kepercayaan dibangun dari aturan yang jelas.
          </h2>
          <p className="mt-5 leading-8 text-[#526176]">
            Setiap alur RentGo dirancang agar pelanggan mengetahui status pesanan
            dan pemilik rental memiliki dasar data untuk mengambil keputusan.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#D8E5F6]">
          <ul className="space-y-4">
            {commitments.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-7 text-[#526176]">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#EAF7F0] text-[#147C4C]">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#0E3FA8] p-8 text-white md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <h2 className="text-2xl font-semibold">Siap mulai perjalanan dengan RentGo?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
              Pilih kendaraan, lengkapi data, dan buat pesanan dengan proses yang
              lebih terstruktur.
            </p>
          </div>
          <Link href="/kendaraan" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0E3FA8] md:mt-0">
            Lihat daftar kendaraan
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main>
      <SiteHeader activePage="tentang" />
      <Hero />
      <Story />
      <Stats />
      <VisionMission />
      <Values />
      <Trust />
      <Cta />
      <SiteFooter />
    </main>
  );
}
