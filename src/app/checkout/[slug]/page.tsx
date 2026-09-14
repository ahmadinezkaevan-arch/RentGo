import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getVehicleBySlug, vehicleCatalog } from "@/lib/vehicles";

type CheckoutPageProps = {
  params: Promise<{ slug: string }>;
};

type IconName =
  | "bank"
  | "calendar"
  | "car"
  | "check"
  | "chevronRight"
  | "creditCard"
  | "document"
  | "location"
  | "shield"
  | "wallet";

export function generateStaticParams() {
  return vehicleCatalog.map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: "Checkout - RentGo",
    };
  }

  return {
    title: `Checkout ${vehicle.displayName} - RentGo`,
    description: `Lengkapi data booking dan pembayaran untuk menyewa ${vehicle.displayName} di RentGo.`,
  };
}

function Icon({ name, className }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    bank: (
      <>
        <path d="M4 10h16" />
        <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
        <path d="M3 20h18" />
        <path d="M12 4 4 8h16l-8-4Z" />
      </>
    ),
    calendar: (
      <>
        <path d="M7 3v4M17 3v4" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M4 10h16" />
      </>
    ),
    car: (
      <>
        <path d="M5 16h14M6.5 16v2M17.5 16v2M4 13l2-5h12l2 5" />
        <path d="M7 13h10" />
      </>
    ),
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    creditCard: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </>
    ),
    document: (
      <>
        <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5" />
        <path d="M8 13h8M8 17h5" />
      </>
    ),
    location: (
      <>
        <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    wallet: (
      <>
        <path d="M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11" />
        <path d="M16 13h5" />
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

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const rentalDays = 3;
  const serviceFee = 50000;
  const driverFee = 0;
  const discount = 0;
  const subtotal = vehicle.dailyRate * rentalDays;
  const total = subtotal + serviceFee + driverFee - discount;
  const paymentMethods = [
    { name: "Virtual Account", detail: "BCA, Mandiri, BRI, BNI", icon: "bank" as const, selected: true },
    { name: "E-Wallet", detail: "OVO, Dana, GoPay", icon: "wallet" as const, selected: false },
    { name: "Kartu Kredit", detail: "Visa dan Mastercard", icon: "creditCard" as const, selected: false },
  ];

  return (
    <main className="bg-[#F5F7FC]">
      <SiteHeader activePage="kendaraan" />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#667085]" aria-label="Breadcrumb">
          <Link href="/kendaraan" className="hover:text-[#0E3FA8]">
            Kendaraan
          </Link>
          <Icon name="chevronRight" className="h-4 w-4" />
          <Link href={`/kendaraan/${vehicle.slug}`} className="hover:text-[#0E3FA8]">
            {vehicle.displayName}
          </Link>
          <Icon name="chevronRight" className="h-4 w-4" />
          <span className="text-[#132033]">Checkout</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <div className="space-y-6">
            <section className="rounded-xl border border-[#D5DDEA] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black leading-tight text-[#101B2D] sm:text-4xl">Detail Booking</h1>
                  <p className="mt-2 text-base font-medium text-[#667085]">Periksa data sewa sebelum melanjutkan pembayaran.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#E3F2FF] px-4 py-2 text-sm font-black text-[#087E9F]">
                  <Icon name="shield" className="h-4 w-4" />
                  Pembayaran aman
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  ["Booking", "Detail sewa"],
                  ["Pembayaran", "Pilih metode"],
                  ["Selesai", "Konfirmasi email"],
                ].map(([title, text], index) => (
                  <div key={title} className={`rounded-lg border px-4 py-3 ${index === 1 ? "border-[#0E3FA8] bg-[#EEF5FF]" : "border-[#D5DDEA] bg-white"}`}>
                    <p className="text-sm font-black text-[#132033]">{title}</p>
                    <p className="mt-1 text-sm text-[#667085]">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#D5DDEA] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-black text-[#132033]">Informasi Pemesanan</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-[#D5DDEA] bg-[#F8FAFE] p-4">
                  <p className="flex items-center gap-2 text-sm font-black text-[#667085]">
                    <Icon name="location" className="h-5 w-5 text-[#0E3FA8]" />
                    Lokasi Pengambilan
                  </p>
                  <p className="mt-2 text-base font-black text-[#132033]">RentGo Cabang Bandung</p>
                  <p className="mt-1 text-sm text-[#667085]">Jl. Asia Afrika No. 12, Bandung</p>
                </div>
                <div className="rounded-lg border border-[#D5DDEA] bg-[#F8FAFE] p-4">
                  <p className="flex items-center gap-2 text-sm font-black text-[#667085]">
                    <Icon name="calendar" className="h-5 w-5 text-[#0E3FA8]" />
                    Jadwal Sewa
                  </p>
                  <p className="mt-2 text-base font-black text-[#132033]">24 Okt, 09.00 - 27 Okt, 09.00</p>
                  <p className="mt-1 text-sm text-[#667085]">Durasi {rentalDays} hari, lepas kunci</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-[#D5DDEA] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-black text-[#132033]">Data Pemesan</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-black text-[#344054]">Nama Lengkap</span>
                  <input className="mt-2 h-12 w-full rounded-lg border border-[#C8D0DD] bg-white px-4 text-base outline-none focus:border-[#0E3FA8]" defaultValue="Ahmadinezka Evan Juanurifiki" />
                </label>
                <label className="block">
                  <span className="text-sm font-black text-[#344054]">Nomor HP</span>
                  <input className="mt-2 h-12 w-full rounded-lg border border-[#C8D0DD] bg-white px-4 text-base outline-none focus:border-[#0E3FA8]" defaultValue="0812-3456-7890" />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-black text-[#344054]">Email</span>
                  <input className="mt-2 h-12 w-full rounded-lg border border-[#C8D0DD] bg-white px-4 text-base outline-none focus:border-[#0E3FA8]" defaultValue="evan@rentgo.co.id" />
                </label>
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-lg bg-[#EEF5FF] p-4 text-sm font-medium text-[#4B5565]">
                <Icon name="document" className="mt-0.5 h-5 w-5 shrink-0 text-[#0E3FA8]" />
                <p>Dokumen KTP dan SIM akan diverifikasi kembali oleh admin sebelum unit diserahkan.</p>
              </div>
            </section>

            <section className="rounded-xl border border-[#D5DDEA] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-black text-[#132033]">Metode Pembayaran</h2>
              <div className="mt-5 grid gap-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.name}
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 ${
                      method.selected ? "border-[#0E3FA8] bg-[#EEF5FF]" : "border-[#D5DDEA] bg-white"
                    }`}
                  >
                    <input type="radio" name="payment" defaultChecked={method.selected} className="h-5 w-5 border-[#C8D0DD] text-[#0E3FA8]" />
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-[#0E3FA8] shadow-sm">
                      <Icon name={method.icon} className="h-6 w-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-black text-[#132033]">{method.name}</span>
                      <span className="block text-sm text-[#667085]">{method.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <section className="overflow-hidden rounded-xl border border-[#D5DDEA] bg-white shadow-sm">
              <div className="relative h-52 bg-[#E7EEF8]">
                <Image
                  src="/rentgo-hero.png"
                  alt={`${vehicle.displayName} untuk checkout`}
                  fill
                  sizes="(min-width: 1024px) 25rem, 100vw"
                  className={`object-cover ${vehicle.available ? "" : "grayscale"}`}
                  style={{ objectPosition: vehicle.imagePosition }}
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black leading-tight text-[#132033]">{vehicle.displayName}</h2>
                    <p className="mt-1 text-sm font-medium text-[#667085]">{vehicle.category} - {vehicle.transmission}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${vehicle.available ? "bg-[#DDF8E7] text-[#147C4C]" : "bg-[#FDE5E7] text-[#C74A58]"}`}>
                    {vehicle.status}
                  </span>
                </div>

                <div className="mt-6 rounded-lg bg-[#F8FAFE] p-4 text-sm text-[#5D6677]">
                  <div className="flex justify-between gap-4">
                    <span>{formatRupiah(vehicle.dailyRate)} x {rentalDays} hari</span>
                    <span className="font-semibold text-[#132033]">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-4">
                    <span>Biaya layanan</span>
                    <span className="font-semibold text-[#132033]">{formatRupiah(serviceFee)}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-4">
                    <span>Supir tambahan</span>
                    <span className="font-semibold text-[#132033]">{formatRupiah(driverFee)}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-4">
                    <span>Diskon</span>
                    <span className="font-semibold text-[#147C4C]">-{formatRupiah(discount)}</span>
                  </div>
                  <div className="mt-4 flex justify-between gap-4 border-t border-[#DDE5F0] pt-4 text-lg font-black text-[#132033]">
                    <span>Total</span>
                    <span className="text-[#0E3FA8]">{formatRupiah(total)}</span>
                  </div>
                </div>

                <label className="mt-5 block">
                  <span className="text-sm font-black text-[#344054]">Kode Voucher</span>
                  <div className="mt-2 flex gap-2">
                    <input className="h-12 min-w-0 flex-1 rounded-lg border border-[#C8D0DD] bg-white px-4 text-base outline-none placeholder:text-[#8A94A6] focus:border-[#0E3FA8]" placeholder="Masukkan kode" />
                    <button type="button" className="rounded-lg border border-[#0E3FA8] px-4 text-sm font-black text-[#0E3FA8]">
                      Pakai
                    </button>
                  </div>
                </label>

                <label className="mt-5 flex items-start gap-3 text-sm font-medium text-[#5D6677]">
                  <input type="checkbox" defaultChecked className="mt-0.5 h-5 w-5 rounded border-[#C8D0DD] text-[#0E3FA8]" />
                  Saya menyetujui syarat penyewaan dan kebijakan pembatalan RentGo.
                </label>

                <button
                  type="button"
                  disabled={!vehicle.available}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E3FA8] px-5 py-4 text-base font-black text-white disabled:bg-[#AEB8C8]"
                >
                  Bayar Sekarang
                  <Icon name="chevronRight" className="h-5 w-5" />
                </button>

                <p className="mt-4 text-center text-sm font-medium text-[#667085]">Instruksi pembayaran dikirim setelah checkout dibuat.</p>
              </div>
            </section>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
