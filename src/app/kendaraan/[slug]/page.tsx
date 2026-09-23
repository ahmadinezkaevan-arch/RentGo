import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/db";
import { getLocale, pick } from "@/lib/i18n";

type VehicleDetailPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function Icon({ name, className }: { name: "calendar" | "check" | "chevronRight" | "fuel" | "image" | "seat" | "shield" | "toolbox"; className?: string }) {
  const paths = {
    calendar: <><path d="M7 3v4M17 3v4" /><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 10h16" /></>,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    fuel: <><path d="M6 21V4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v17" /><path d="M4 21h13M8 8h5M15 7h2l2 2v8a2 2 0 0 1-4 0v-4h2" /></>,
    image: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="m8 14 2.2-2.2a1.5 1.5 0 0 1 2.1 0L18 17" /><circle cx="8.5" cy="9.5" r="1.2" /></>,
    seat: <><path d="M8 4v8M8 12h7a3 3 0 0 1 3 3v5M6 20h12M6 12h2l2 8" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    toolbox: <><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><rect x="4" y="7" width="16" height="13" rx="2" /><path d="M4 12h16" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" className={className} aria-hidden="true">{paths[name]}</svg>;
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function statusLabel(status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "INACTIVE", locale: "id" | "en") {
  const labels = {
    AVAILABLE: pick(locale, { id: "Tersedia", en: "Available" }),
    RENTED: pick(locale, { id: "Sedang disewa", en: "Rented" }),
    MAINTENANCE: pick(locale, { id: "Dalam perawatan", en: "Under maintenance" }),
    INACTIVE: pick(locale, { id: "Tidak tersedia", en: "Unavailable" }),
  };
  return labels[status];
}

async function getVehicle(slug: string) {
  return prisma.vehicle.findUnique({
    where: { slug },
    include: { category: { select: { name: true } } },
  });
}

export async function generateMetadata({ params }: VehicleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  return vehicle
    ? { title: `${vehicle.name} - RentGo`, description: `Detail, spesifikasi, dan harga sewa ${vehicle.name} di RentGo.` }
    : { title: "Detail Kendaraan - RentGo" };
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const vehicle = await getVehicle(slug);
  if (!vehicle || vehicle.status === "INACTIVE") notFound();

  const t = (id: string, en: string) => pick(locale, { id, en });
  const image = vehicle.imageUrl ?? "/rentgo-hero.png";
  const available = vehicle.status === "AVAILABLE";
  const features = vehicle.features.length ? vehicle.features : [t("Unit bersih dan siap jalan", "Clean and road-ready vehicle"), t("Dokumen kendaraan lengkap", "Complete vehicle documents"), t("Bantuan RentGo tersedia", "RentGo assistance available")];
  const specs = [
    { label: t("Kapasitas", "Capacity"), value: `${vehicle.seats} ${t("kursi", "seats")}`, icon: "seat" as const },
    { label: t("Transmisi", "Transmission"), value: vehicle.transmission, icon: "toolbox" as const },
    { label: t("Bahan bakar", "Fuel"), value: vehicle.fuel, icon: "fuel" as const },
    { label: t("Bagasi", "Luggage"), value: vehicle.baggage ?? t("Tidak dicantumkan", "Not specified"), icon: "toolbox" as const },
  ];

  return (
    <main className="bg-white">
      <SiteHeader activePage="kendaraan" />
      <section className="mx-auto max-w-[1232px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#667085]" aria-label="Breadcrumb">
          <Link href="/kendaraan" className="hover:text-[#0E3FA8]">{t("Kendaraan", "Vehicles")}</Link>
          <Icon name="chevronRight" className="h-4 w-4" />
          <span className="text-[#132033]">{vehicle.name}</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
          <div>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_13rem]">
              <div className="relative min-h-72 overflow-hidden rounded-xl bg-[#E7EEF8] sm:min-h-[26rem] lg:min-h-[31rem]">
                <Image src={image} alt={`${vehicle.name} tampak depan`} fill priority sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                {[["center 35%", "foto samping"], ["center 70%", "foto kendaraan"]].map(([position, label], index) => (
                  <div key={label} className="relative min-h-40 overflow-hidden rounded-xl bg-[#E7EEF8] sm:min-h-52 md:min-h-0">
                    <Image src={image} alt={`${vehicle.name} ${label}`} fill sizes="(min-width: 768px) 13rem, 50vw" className={`object-cover ${index === 1 ? "brightness-75" : ""}`} style={{ objectPosition: position }} />
                    {index === 1 ? <span className="absolute inset-x-0 bottom-5 mx-auto inline-flex w-max items-center gap-2 rounded-lg bg-black/45 px-3 py-2 text-sm font-semibold text-white backdrop-blur"><Icon name="image" className="h-5 w-5" />{t("Foto armada", "Fleet photos")}</span> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <div><h1 className="text-4xl font-bold leading-tight text-[#101B2D] sm:text-5xl">{vehicle.name}</h1><p className="mt-3 text-lg font-medium text-[#667085]">{vehicle.category.name} · {vehicle.fuel}</p></div>
              <span className={`inline-flex w-max items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${available ? "bg-[#E3F2FF] text-[#087E9F]" : "bg-[#FDE5E7] text-[#C74A58]"}`}><Icon name="check" className="h-4 w-4" />{statusLabel(vehicle.status, locale)}</span>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{specs.map((spec) => <article key={spec.label} className="rounded-xl border border-[#D5DDEA] bg-white px-5 py-6 text-center shadow-sm"><Icon name={spec.icon} className="mx-auto h-8 w-8 text-[#0E3FA8]" /><p className="mt-3 text-xs font-semibold text-[#667085]">{spec.label}</p><p className="mt-2 text-lg font-semibold text-[#132033]">{spec.value}</p></article>)}</div>

            <div className="mt-8 border-t border-[#DDE5F0] pt-8"><h2 className="text-2xl font-semibold text-[#132033]">{t("Deskripsi Kendaraan", "Vehicle Description")}</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-[#5D6677]">{vehicle.description ?? t("Kendaraan siap digunakan untuk perjalanan Anda. Hubungi RentGo jika memerlukan informasi tambahan.", "This vehicle is ready for your trip. Contact RentGo for additional information.")}</p><h3 className="mt-8 text-base font-semibold text-[#132033]">{t("Fitur termasuk", "Included features")}</h3><div className="mt-4 grid gap-4 text-base font-medium text-[#5D6677] sm:grid-cols-2">{features.map((feature, index) => <div key={feature} className="flex items-center gap-3"><Icon name={index % 2 ? "shield" : "check"} className="h-6 w-6 shrink-0 text-[#07889B]" /><span>{feature}</span></div>)}</div></div>
            <div className="mt-8 rounded-xl border border-[#D5DDEA] bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold text-[#132033]">{t("Syarat Penyewaan", "Rental Requirements")}</h2><div className="mt-5 grid gap-4 text-base text-[#5D6677] sm:grid-cols-3">{[t("KTP dan SIM aktif", "Valid ID and driving license"), t("DP minimal 50%", "Minimum 50% deposit"), t("Konfirmasi maksimal 1 jam", "Confirmation within 1 hour")].map((requirement) => <div key={requirement} className="flex items-start gap-3"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#E3F2FF] text-[#0E3FA8]"><Icon name="check" className="h-4 w-4" /></span><span>{requirement}</span></div>)}</div></div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start"><section className="rounded-xl border border-[#D5DDEA] bg-white p-6 shadow-sm"><p className="text-3xl font-semibold text-[#101B2D]">{formatRupiah(vehicle.dailyRate)}<span className="text-base font-semibold text-[#667085]"> / {t("hari", "day")}</span></p><div className="mt-5 border-y border-[#E5EAF2] py-4"><p className="text-xs font-semibold text-[#526177]">{t("Ketentuan sewa", "Rental notes")}</p><ul className="mt-3 space-y-2 text-sm text-[#5D6677]"><li className="flex items-start gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-[#0E3FA8]" />{t("DP 50% untuk konfirmasi", "50% deposit to confirm")}</li><li className="flex items-start gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-[#0E3FA8]" />{t("KTP dan SIM aktif diperlukan", "Valid ID and driving license required")}</li><li className="flex items-start gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-[#0E3FA8]" />{t("Pelunasan maksimal 24 jam sebelum pengambilan", "Pay the balance no later than 24 hours before pickup")}</li></ul></div><Link href={`/checkout/${vehicle.slug}`} className={`mt-7 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-4 text-base font-semibold text-white ${available ? "bg-[#0E3FA8] hover:bg-[#0B348D]" : "pointer-events-none bg-[#AEB8C8]"}`} aria-disabled={!available}>{t("Booking Sekarang", "Book Now")}<Icon name="chevronRight" className="h-5 w-5" /></Link><p className="mt-5 text-center text-sm font-medium text-[#667085]">{available ? t("Belum ada biaya yang dibebankan.", "No charges have been applied yet.") : t("Kendaraan sedang tidak dapat dipesan.", "This vehicle is currently unavailable.")}</p></section></aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
