import type { Metadata } from "next";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getVehicleBySlug, localizeVehicle, vehicleCatalog } from "@/lib/vehicles";
import { getLocale, pick } from "@/lib/i18n";

type PaymentPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type IconName = "bank" | "calendar" | "chevronRight" | "creditCard" | "location" | "user" | "wallet";

export function generateStaticParams() {
  return vehicleCatalog.map((vehicle) => ({ slug: vehicle.slug }));
}

export const metadata: Metadata = {
  title: "Pembayaran - RentGo",
  description: "Periksa detail pesanan dan pilih metode pembayaran sewa kendaraan RentGo.",
};

function Icon({ name, className }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    bank: (
      <>
        <path d="M4 10h16M6 10v8M10 10v8M14 10v8M18 10v8M3 20h18" />
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
    chevronRight: <path d="m9 18 6-6-6-6" />,
    creditCard: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </>
    ),
    location: (
      <>
        <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c0-4 3.1-7 7-7s7 3 7 7" />
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function firstValue(value: string | string[] | undefined, fallback: string) {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string, locale: "id" | "en") {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default async function PaymentPage({ params, searchParams }: PaymentPageProps) {
  const [{ slug }, query, locale] = await Promise.all([params, searchParams, getLocale()]);
  const sourceVehicle = getVehicleBySlug(slug);

  if (!sourceVehicle) {
    notFound();
  }

  const vehicle = localizeVehicle(sourceVehicle, locale);
  const t = (id: string, en: string) => pick(locale, { id, en });
  const fullName = firstValue(query.fullName, "Data pemesan belum diisi");
  const phone = firstValue(query.phone, "-");
  const email = firstValue(query.email, "-");
  const location = firstValue(query.location, "RentGo Cabang Bandung");
  const startDate = firstValue(query.startDate, "2026-10-24");
  const endDate = firstValue(query.endDate, "2026-10-27");
  const parsedDays = Number.parseInt(firstValue(query.rentalDays, "3"), 10);
  const rentalDays = Number.isFinite(parsedDays) && parsedDays > 0 ? parsedDays : 3;
  const serviceFee = 50000;
  const subtotal = vehicle.dailyRate * rentalDays;
  const total = subtotal + serviceFee;
  const downPayment = total * 0.5;

  const paymentMethods = [
    { name: "Virtual Account", detail: t("BCA, Mandiri, BRI, dan BNI", "BCA, Mandiri, BRI, and BNI"), icon: "bank" as const },
    { name: "E-Wallet", detail: t("OVO, DANA, dan GoPay", "OVO, DANA, and GoPay"), icon: "wallet" as const },
    { name: t("Kartu Kredit", "Credit Card"), detail: t("Visa dan Mastercard", "Visa and Mastercard"), icon: "creditCard" as const },
  ];

  return (
    <main className="bg-[#F5F7FC]">
      <SiteHeader activePage="kendaraan" />

      <section className="mx-auto max-w-[1232px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#667085]" aria-label="Breadcrumb">
          <Link href="/kendaraan" className="hover:text-[#0E3FA8]">{t("Kendaraan", "Vehicles")}</Link>
          <Icon name="chevronRight" className="h-4 w-4" />
          <Link href={`/checkout/${vehicle.slug}`} className="hover:text-[#0E3FA8]">Checkout</Link>
          <Icon name="chevronRight" className="h-4 w-4" />
          <span className="text-[#132033]">{t("Pembayaran", "Payment")}</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <section className="overflow-hidden rounded-xl border border-[#D5DDEA] bg-white shadow-sm">
            <div className="border-b border-[#DDE5F0] p-5 sm:p-6">
              <h1 className="text-3xl font-semibold tracking-tight text-[#101B2D] sm:text-4xl">{t("Detail Pesanan", "Booking Details")}</h1>
              <p className="mt-2 text-base text-[#667085]">{t("Pastikan jadwal dan data pemesan sudah benar sebelum membayar.", "Check the schedule and customer details before paying.")}</p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid gap-5 sm:grid-cols-[10rem_1fr] sm:items-center">
                <div className="relative h-32 overflow-hidden rounded-lg bg-[#E7EEF8]">
                  <Image src="/rentgo-hero.png" alt={vehicle.displayName} fill sizes="10rem" className="object-cover" style={{ objectPosition: vehicle.imagePosition }} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#132033]">{vehicle.displayName}</h2>
                  <p className="mt-1 text-sm font-medium text-[#667085]">{vehicle.category} · {vehicle.transmission}</p>
                  <p className="mt-3 text-lg font-semibold text-[#0E3FA8]">{formatRupiah(vehicle.dailyRate)} <span className="text-sm text-[#667085]">/ hari</span></p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 border-t border-[#DDE5F0] pt-6 md:grid-cols-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#667085]"><Icon name="calendar" className="h-5 w-5 text-[#0E3FA8]" />{t("Jadwal", "Schedule")}</p>
                  <p className="mt-2 font-semibold text-[#132033]">{formatDate(startDate, locale)}</p>
                  <p className="mt-1 text-sm text-[#667085]">{t("sampai", "to")} {formatDate(endDate, locale)} · {rentalDays} {t("hari", "days")}</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#667085]"><Icon name="location" className="h-5 w-5 text-[#0E3FA8]" />{t("Lokasi pengambilan", "Pickup location")}</p>
                  <p className="mt-2 font-semibold text-[#132033]">{location}</p>
                  <p className="mt-1 text-sm text-[#667085]">Jl. Asia Afrika No. 12, Bandung</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#667085]"><Icon name="user" className="h-5 w-5 text-[#0E3FA8]" />{t("Pemesan", "Customer")}</p>
                  <p className="mt-2 font-semibold text-[#132033]">{fullName}</p>
                  <p className="mt-1 text-sm text-[#667085]">{phone} · {email}</p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-[#F8FAFE] p-5 text-sm text-[#5D6677]">
                <div className="flex justify-between gap-4"><span>{formatRupiah(vehicle.dailyRate)} × {rentalDays} {t("hari", "days")}</span><span className="font-semibold text-[#132033]">{formatRupiah(subtotal)}</span></div>
                <div className="mt-3 flex justify-between gap-4"><span>{t("Biaya layanan", "Service fee")}</span><span className="font-semibold text-[#132033]">{formatRupiah(serviceFee)}</span></div>
                <div className="mt-4 flex justify-between gap-4 border-t border-[#DDE5F0] pt-4 text-lg font-semibold text-[#132033]"><span>{t("Total pesanan", "Booking total")}</span><span className="text-[#0E3FA8]">{formatRupiah(total)}</span></div>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Form action={`/payment/${vehicle.slug}/success`} className="rounded-xl border border-[#D5DDEA] bg-white p-5 shadow-sm sm:p-6">
              <input type="hidden" name="fullName" value={fullName} />
              <input type="hidden" name="phone" value={phone} />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="location" value={location} />
              <input type="hidden" name="startDate" value={startDate} />
              <input type="hidden" name="endDate" value={endDate} />
              <input type="hidden" name="rentalDays" value={rentalDays} />
              <h2 className="text-xl font-semibold text-[#132033]">{t("Metode Pembayaran", "Payment Method")}</h2>
              <p className="mt-2 text-sm leading-6 text-[#667085]">{t("Pilih metode untuk membayar DP 50% dari total pesanan.", "Choose a method to pay the 50% booking deposit.")}</p>

              <div className="mt-5 grid gap-3">
                {paymentMethods.map((method, index) => (
                  <label key={method.name} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${index === 0 ? "border-[#0E3FA8] bg-[#EEF5FF]" : "border-[#D5DDEA]"}`}>
                    <input type="radio" name="paymentMethod" value={method.name} defaultChecked={index === 0} className="h-5 w-5 border-[#C8D0DD] text-[#0E3FA8]" />
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-[#0E3FA8] shadow-sm"><Icon name={method.icon} className="h-5 w-5" /></span>
                    <span><span className="block text-sm font-semibold text-[#132033]">{method.name}</span><span className="block text-xs text-[#667085]">{method.detail}</span></span>
                  </label>
                ))}
              </div>

              <div className="mt-6 rounded-lg bg-[#E8F0FF] p-4">
                <p className="text-sm font-medium text-[#667085]">{t("DP yang dibayar sekarang", "Deposit due now")}</p>
                <p className="mt-1 text-2xl font-semibold text-[#0E3FA8]">{formatRupiah(downPayment)}</p>
                <p className="mt-1 text-xs text-[#667085]">{t("Sisa pembayaran dilunasi sebelum kendaraan diambil.", "The remaining balance is due before vehicle pickup.")}</p>
              </div>

              <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E3FA8] px-5 py-4 text-base font-semibold text-white hover:bg-[#0B348D]">
                {t("Bayar DP Sekarang", "Pay Deposit Now")}
                <Icon name="chevronRight" className="h-5 w-5" />
              </button>
              <Link href={`/checkout/${vehicle.slug}`} className="mt-4 block text-center text-sm font-semibold text-[#0E3FA8]">{t("Kembali ke checkout", "Back to checkout")}</Link>
            </Form>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}