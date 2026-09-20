import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getVehicleBySlug, localizeVehicle, vehicleCatalog } from "@/lib/vehicles";
import { getLocale, pick } from "@/lib/i18n";

type PaymentSuccessPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type IconName = "calendar" | "check" | "chevronRight" | "receipt" | "wallet";

export function generateStaticParams() {
  return vehicleCatalog.map((vehicle) => ({ slug: vehicle.slug }));
}

export const metadata: Metadata = {
  title: "Pembayaran Berhasil - RentGo",
  description: "Konfirmasi pembayaran DP dan detail booking kendaraan RentGo.",
};

function Icon({ name, className }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    calendar: (
      <><path d="M7 3v4M17 3v4" /><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 10h16" /></>
    ),
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    receipt: (
      <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6M9 16h4" /></>
    ),
    wallet: (
      <><path d="M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11" /><path d="M16 13h5" /></>
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
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string, locale: "id" | "en") {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default async function PaymentSuccessPage({ params, searchParams }: PaymentSuccessPageProps) {
  const [{ slug }, query, locale] = await Promise.all([params, searchParams, getLocale()]);
  const sourceVehicle = getVehicleBySlug(slug);

  if (!sourceVehicle) {
    notFound();
  }

  const vehicle = localizeVehicle(sourceVehicle, locale);
  const t = (id: string, en: string) => pick(locale, { id, en });
  const fullName = firstValue(query.fullName, "Pelanggan RentGo");
  const startDate = firstValue(query.startDate, "2026-10-24");
  const endDate = firstValue(query.endDate, "2026-10-27");
  const paymentMethod = firstValue(query.paymentMethod, "Virtual Account");
  const parsedDays = Number.parseInt(firstValue(query.rentalDays, "3"), 10);
  const rentalDays = Number.isFinite(parsedDays) && parsedDays > 0 ? parsedDays : 3;
  const total = vehicle.dailyRate * rentalDays + 50000;
  const downPayment = total * 0.5;
  const bookingNumber = `RG-${vehicle.slug.slice(0, 3).toUpperCase()}-241026`;

  return (
    <main className="bg-[#F5F7FC]">
      <SiteHeader activePage="kendaraan" />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="overflow-hidden rounded-xl border border-[#D5DDEA] bg-white shadow-sm">
          <div className="bg-[#EAF8F0] px-5 py-10 text-center sm:px-8">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#147C4C] text-white">
              <Icon name="check" className="h-9 w-9" />
            </span>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#101B2D] sm:text-4xl">{t("Pembayaran DP berhasil", "Deposit Payment Successful")}</h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#526176]">
              {t("Booking atas nama", "A booking for")} {fullName} {t("sudah dibuat. Tim RentGo akan memverifikasi pembayaran dan dokumen penyewa.", "has been created. The RentGo team will verify the payment and customer documents.")}
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-[#DDE5F0] bg-[#F8FAFE] p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#667085]"><Icon name="receipt" className="h-5 w-5 text-[#0E3FA8]" />{t("Nomor booking", "Booking number")}</p>
                <p className="mt-2 text-xl font-semibold text-[#132033]">{bookingNumber}</p>
                <span className="mt-2 inline-flex rounded-full bg-[#FFF1D6] px-3 py-1 text-xs font-semibold text-[#9A6700]">{t("Menunggu verifikasi", "Awaiting verification")}</span>
              </div>
              <div className="rounded-lg border border-[#DDE5F0] bg-[#F8FAFE] p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#667085]"><Icon name="wallet" className="h-5 w-5 text-[#0E3FA8]" />{t("DP dibayar", "Deposit paid")}</p>
                <p className="mt-2 text-xl font-semibold text-[#0E3FA8]">{formatRupiah(downPayment)}</p>
                <p className="mt-2 text-sm text-[#667085]">{paymentMethod}</p>
              </div>
            </div>

            <div className="mt-6 border-t border-[#DDE5F0] pt-6">
              <h2 className="text-xl font-semibold text-[#132033]">{t("Ringkasan penyewaan", "Rental Summary")}</h2>
              <dl className="mt-4 divide-y divide-[#E5EAF2] rounded-lg border border-[#DDE5F0] px-4">
                <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-[#667085]">{t("Kendaraan", "Vehicle")}</dt><dd className="text-right text-sm font-semibold text-[#132033]">{vehicle.displayName}</dd></div>
                <div className="flex items-center justify-between gap-4 py-4"><dt className="flex items-center gap-2 text-sm text-[#667085]"><Icon name="calendar" className="h-4 w-4" />{t("Jadwal", "Schedule")}</dt><dd className="text-right text-sm font-semibold text-[#132033]">{formatDate(startDate, locale)} - {formatDate(endDate, locale)}</dd></div>
                <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-[#667085]">{t("Durasi", "Duration")}</dt><dd className="text-right text-sm font-semibold text-[#132033]">{rentalDays} {t("hari", "days")}</dd></div>
                <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-[#667085]">{t("Sisa pembayaran", "Remaining balance")}</dt><dd className="text-right text-sm font-semibold text-[#132033]">{formatRupiah(total - downPayment)}</dd></div>
              </dl>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/profile" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0E3FA8] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#0B348D]">
                {t("Lihat Pesanan Saya", "View My Booking")}
                <Icon name="chevronRight" className="h-5 w-5" />
              </Link>
              <Link href="/kendaraan" className="flex flex-1 items-center justify-center rounded-lg border border-[#C8D0DD] px-5 py-3.5 text-sm font-semibold text-[#344054] hover:border-[#0E3FA8] hover:text-[#0E3FA8]">
                {t("Kembali ke Daftar Kendaraan", "Back to Vehicles")}
              </Link>
            </div>

            <p className="mt-6 text-center text-sm leading-6 text-[#667085]">{t("Konfirmasi juga dikirim ke email yang digunakan saat checkout.", "A confirmation is also sent to the email used at checkout.")}</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}