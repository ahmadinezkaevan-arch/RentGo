import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createBooking } from "@/app/checkout/actions";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale, pick } from "@/lib/i18n";

type CheckoutPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
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

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { slug }, select: { name: true } });

  if (!vehicle) {
    return {
      title: "Checkout - RentGo",
    };
  }

  return {
    title: `Checkout ${vehicle.name} - RentGo`,
    description: `Lengkapi data booking dan pembayaran untuk menyewa ${vehicle.name} di RentGo.`,
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

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { slug } = await params;
  const [query, locale, user, vehicle] = await Promise.all([
    searchParams,
    getLocale(),
    getCurrentUser(),
    prisma.vehicle.findUnique({ where: { slug }, include: { category: { select: { name: true } } } }),
  ]);
  if (!user) redirect(`/login?next=${encodeURIComponent(`/checkout/${slug}`)}`);
  if (!vehicle || vehicle.status === "INACTIVE") notFound();

  const t = (id: string, en: string) => pick(locale, { id, en });
  const available = vehicle.status === "AVAILABLE";
  const rentalDays = 3;
  const serviceFee = 0;
  const driverFee = 0;
  const discount = 0;
  const subtotal = vehicle.dailyRate * rentalDays;
  const total = subtotal + serviceFee + driverFee - discount;

  return (
    <main className="bg-[#F5F7FC]">
      <SiteHeader activePage="kendaraan" />

      <section className="mx-auto max-w-[1232px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#667085]" aria-label="Breadcrumb">
          <Link href="/kendaraan" className="hover:text-[#0E3FA8]">
            {t("Kendaraan", "Vehicles")}
          </Link>
          <Icon name="chevronRight" className="h-4 w-4" />
          <Link href={`/kendaraan/${vehicle.slug}`} className="hover:text-[#0E3FA8]">
            {vehicle.name}
          </Link>
          <Icon name="chevronRight" className="h-4 w-4" />
          <span className="text-[#132033]">Checkout</span>
        </nav>

        <form action={createBooking} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <input type="hidden" name="vehicleSlug" value={vehicle.slug} />
          {query.error ? <p role="alert" className="lg:col-span-2 rounded-lg border border-[#F6C5CB] bg-[#FDE5E7] px-4 py-3 text-sm font-medium text-[#B42318]">{query.error === "date-unavailable" ? t("Kendaraan sudah dipesan pada rentang tanggal tersebut. Pilih jadwal lain.", "This vehicle is already booked for that date range. Choose another schedule.") : query.error === "phone-in-use" ? t("Nomor HP ini sudah digunakan oleh akun lain.", "This phone number is already used by another account.") : query.error === "vehicle-unavailable" ? t("Kendaraan saat ini tidak tersedia untuk dipesan.", "This vehicle is currently unavailable for booking.") : t("Lengkapi data pemesanan dengan benar.", "Complete the booking details correctly.")}</p> : null}
          <section className="overflow-hidden rounded-xl border border-[#D5DDEA] bg-white p-5 shadow-sm sm:p-6">
            <section>
              <h2 className="text-xl font-semibold text-[#132033]">{t("Informasi Pemesanan", "Booking Information")}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-[#D5DDEA] bg-[#F8FAFE] p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#667085]">
                    <Icon name="location" className="h-5 w-5 text-[#0E3FA8]" />
                    {t("Lokasi Pengambilan", "Pickup Location")}
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#132033]">RentGo Cabang Bandung</p>
                  <p className="mt-1 text-sm text-[#667085]">Jl. Asia Afrika No. 12, Bandung</p>
                </div>
                <div className="rounded-lg border border-[#D5DDEA] bg-[#F8FAFE] p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#667085]">
                    <Icon name="calendar" className="h-5 w-5 text-[#0E3FA8]" />
                    {t("Jadwal Sewa", "Rental Schedule")}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="block">
                      <span className="text-xs font-semibold text-[#667085]">{t("Tanggal mulai", "Start date")}</span>
                      <input type="date" name="startDate" defaultValue="2026-10-24" required className="mt-1.5 h-11 w-full rounded-lg border border-[#C8D0DD] bg-white px-3 text-sm font-medium text-[#132033] outline-none focus:border-[#0E3FA8]" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-[#667085]">{t("Tanggal selesai", "End date")}</span>
                      <input type="date" name="endDate" defaultValue="2026-10-27" required className="mt-1.5 h-11 w-full rounded-lg border border-[#C8D0DD] bg-white px-3 text-sm font-medium text-[#132033] outline-none focus:border-[#0E3FA8]" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-[#667085]">{t("Durasi (hari)", "Duration (days)")}</span>
                      <input type="number" name="rentalDays" min="1" defaultValue={rentalDays} required className="mt-1.5 h-11 w-full rounded-lg border border-[#C8D0DD] bg-white px-3 text-sm font-medium text-[#132033] outline-none focus:border-[#0E3FA8]" />
                    </label>
                  </div>
                  <p className="mt-3 text-sm text-[#667085]">{t("Durasi", "Duration")} {rentalDays} {t("hari, lepas kunci", "days, self-drive")}</p>
                </div>
              </div>
            </section>

            <section className="border-t border-[#DDE5F0] pt-8">
              <h2 className="text-xl font-semibold text-[#132033]">{t("Data Pemesan", "Customer Details")}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-[#344054]">{t("Nama Lengkap", "Full Name")}</span>
                  <input className="mt-2 h-12 w-full rounded-lg border border-[#C8D0DD] bg-white px-4 text-base outline-none focus:border-[#0E3FA8]" name="fullName" defaultValue={user.name} required />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-[#344054]">{t("Nomor HP", "Phone Number")}</span>
                  <input className="mt-2 h-12 w-full rounded-lg border border-[#C8D0DD] bg-white px-4 text-base outline-none focus:border-[#0E3FA8]" name="phone" defaultValue={user.phone ?? ""} required />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-[#344054]">Email</span>
                  <input className="mt-2 h-12 w-full rounded-lg border border-[#C8D0DD] bg-white px-4 text-base outline-none focus:border-[#0E3FA8]" type="email" name="email" defaultValue={user.email} readOnly />
                </label>
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-lg bg-[#EEF5FF] p-4 text-sm font-medium text-[#4B5565]">
                <Icon name="document" className="mt-0.5 h-5 w-5 shrink-0 text-[#0E3FA8]" />
                <p>{t("Dokumen KTP dan SIM akan diverifikasi kembali oleh admin sebelum unit diserahkan.", "Your ID and driving license will be verified again before the vehicle is handed over.")}</p>
              </div>
            </section>
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <section className="overflow-hidden rounded-xl border border-[#D5DDEA] bg-white shadow-sm">
              <div className="relative h-52 bg-[#E7EEF8]">
                <Image
                  src={vehicle.imageUrl ?? "/rentgo-hero.png"}
                  alt={`${vehicle.name} untuk checkout`}
                  fill
                  sizes="(min-width: 1024px) 25rem, 100vw"
                  className={`object-cover ${available ? "" : "grayscale"}`}
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold leading-tight text-[#132033]">{vehicle.name}</h2>
                    <p className="mt-1 text-sm font-medium text-[#667085]">{vehicle.category.name} - {vehicle.transmission}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${available ? "bg-[#DDF8E7] text-[#147C4C]" : "bg-[#FDE5E7] text-[#C74A58]"}`}>
                    {vehicle.status}
                  </span>
                </div>

                <div className="mt-6 rounded-lg bg-[#F8FAFE] p-4 text-sm text-[#5D6677]">
                  <div className="flex justify-between gap-4">
                    <span>{formatRupiah(vehicle.dailyRate)} x {rentalDays} {t("hari", "days")}</span>
                    <span className="font-semibold text-[#132033]">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-4">
                    <span>{t("Biaya layanan", "Service fee")}</span>
                    <span className="font-semibold text-[#132033]">{formatRupiah(serviceFee)}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-4">
                    <span>{t("Supir tambahan", "Additional driver")}</span>
                    <span className="font-semibold text-[#132033]">{formatRupiah(driverFee)}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-4">
                    <span>{t("Diskon", "Discount")}</span>
                    <span className="font-semibold text-[#147C4C]">-{formatRupiah(discount)}</span>
                  </div>
                  <div className="mt-4 flex justify-between gap-4 border-t border-[#DDE5F0] pt-4 text-lg font-semibold text-[#132033]">
                    <span>Total</span>
                    <span className="text-[#0E3FA8]">{formatRupiah(total)}</span>
                  </div>
                </div>

                <label className="mt-5 block">
                  <span className="text-sm font-semibold text-[#344054]">{t("Kode Voucher", "Voucher Code")}</span>
                  <div className="mt-2 flex gap-2">
                    <input className="h-12 min-w-0 flex-1 rounded-lg border border-[#C8D0DD] bg-white px-4 text-base outline-none placeholder:text-[#8A94A6] focus:border-[#0E3FA8]" placeholder={t("Masukkan kode", "Enter code")} />
                    <button type="button" className="rounded-lg border border-[#0E3FA8] px-4 text-sm font-semibold text-[#0E3FA8]">
                      {t("Pakai", "Apply")}
                    </button>
                  </div>
                </label>

                <label className="mt-5 flex items-start gap-3 text-sm font-medium text-[#5D6677]">
                  <input type="checkbox" name="terms" value="accepted" required defaultChecked className="mt-0.5 h-5 w-5 rounded border-[#C8D0DD] text-[#0E3FA8]" />
                  {t("Saya menyetujui syarat penyewaan dan kebijakan pembatalan RentGo.", "I agree to RentGo rental terms and cancellation policy.")}
                </label>

                <button
                  type="submit"
                  disabled={!available}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E3FA8] px-5 py-4 text-base font-semibold text-white disabled:bg-[#AEB8C8]"
                >
                  {t("Lanjut ke Pembayaran", "Continue to Payment")}
                  <Icon name="chevronRight" className="h-5 w-5" />
                </button>

                <p className="mt-4 text-center text-sm font-medium text-[#667085]">{t("Instruksi pembayaran dikirim setelah checkout dibuat.", "Payment instructions are provided after checkout.")}</p>
              </div>
            </section>
          </aside>
        </form>
      </section>

      <SiteFooter />
    </main>
  );
}
