import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Prisma, Vehicle } from "@prisma/client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/db";
import { getLocale, pick, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Daftar Kendaraan - RentGo",
  description:
    "Cari dan pilih kendaraan RentGo berdasarkan tipe, harga, transmisi, kapasitas, dan status ketersediaan.",
};

type VehicleCardData = Pick<
  Vehicle,
  "id" | "slug" | "name" | "year" | "seats" | "transmission" | "dailyRate" | "status" | "imageUrl"
>;

type VehicleSearchParams = {
  query?: string | string[];
  type?: string | string[];
  min?: string | string[];
  max?: string | string[];
  transmission?: string | string[];
  seats?: string | string[];
  sort?: string | string[];
};

type ActiveFilters = {
  query: string;
  types: string[];
  min?: number;
  max?: number;
  transmission: "Manual" | "Matic" | "";
  seats: number | "";
  sort: "price-asc" | "price-desc" | "name-asc";
};

function tx(locale: Locale, id: string, en: string) {
  return pick(locale, { id, en });
}

function statusLabel(locale: Locale, status: Vehicle["status"]) {
  const labels = {
    AVAILABLE: tx(locale, "Tersedia", "Available"),
    RENTED: tx(locale, "Disewa", "Rented"),
    MAINTENANCE: tx(locale, "Dalam Perawatan", "Under Maintenance"),
    INACTIVE: tx(locale, "Tidak Aktif", "Inactive"),
  };
  return labels[status];
}

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function getFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function parseAmount(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : undefined;
}

function getActiveFilters(searchParams: VehicleSearchParams): ActiveFilters {
  const types = (Array.isArray(searchParams.type) ? searchParams.type : [searchParams.type])
    .filter((type): type is "mobil" | "motor" => type === "mobil" || type === "motor");
  const transmissionValue = getFirst(searchParams.transmission);
  const seatsValue = Number(getFirst(searchParams.seats));
  const sortValue = getFirst(searchParams.sort);

  return {
    query: getFirst(searchParams.query).trim(),
    types,
    min: parseAmount(getFirst(searchParams.min)),
    max: parseAmount(getFirst(searchParams.max)),
    transmission: transmissionValue === "Manual" || transmissionValue === "Matic" ? transmissionValue : "",
    seats: [2, 4, 7].includes(seatsValue) ? seatsValue : "",
    sort: sortValue === "price-desc" || sortValue === "name-asc" ? sortValue : "price-asc",
  };
}

function Icon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    users: <><path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4" /><circle cx="12" cy="9" r="3" /><path d="M4.5 18.5c0-1.8 1.4-3.2 3.2-3.2M16.3 15.3c1.8 0 3.2 1.4 3.2 3.2" /></>,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2.8v2.5M12 18.7v2.5M4.2 4.2 6 6M18 18l1.8 1.8M2.8 12h2.5M18.7 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8" /></>,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    ban: <><circle cx="12" cy="12" r="8" /><path d="m7 7 10 10" /></>,
  };

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" className={className} aria-hidden="true">{paths[name]}</svg>;
}

function FilterSidebar({ filters, locale }: { filters: ActiveFilters; locale: Locale }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-lg bg-[#F5F7FC] p-4">
        <div className="flex items-center justify-between border-b border-[#D9E0EC] pb-2.5">
          <h1 className="text-lg font-semibold text-[#132033]">{tx(locale, "Filter", "Filters")}</h1>
          <Link href="/kendaraan" className="text-xs font-semibold text-[#0E3FA8]">{tx(locale, "Reset semua", "Reset all")}</Link>
        </div>

        <div className="space-y-4 pt-4">
          <section>
            <h2 className="text-sm font-semibold text-[#414B5D]">{tx(locale, "Tipe Kendaraan", "Vehicle Type")}</h2>
            <div className="mt-2 space-y-1.5">
              <label className="flex items-center gap-2.5 text-sm text-[#475467]"><input name="type" value="mobil" type="checkbox" defaultChecked={filters.types.includes("mobil")} className="h-4 w-4 rounded border-[#C8D0DD] text-[#0E3FA8]" />{tx(locale, "Mobil", "Car")}</label>
              <label className="flex items-center gap-2.5 text-sm text-[#475467]"><input name="type" value="motor" type="checkbox" defaultChecked={filters.types.includes("motor")} className="h-4 w-4 rounded border-[#C8D0DD] text-[#0E3FA8]" />{tx(locale, "Motor", "Motorcycle")}</label>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-[#414B5D]">{tx(locale, "Harga / Hari", "Price / Day")}</h2>
            <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <input name="min" type="number" min="0" defaultValue={filters.min} className="min-w-0 rounded-lg border border-[#C8D0DD] bg-white px-2.5 py-2 text-xs outline-none placeholder:text-[#8A94A6]" placeholder="Min" />
              <span className="text-[#A6AFBE]">-</span>
              <input name="max" type="number" min="0" defaultValue={filters.max} className="min-w-0 rounded-lg border border-[#C8D0DD] bg-white px-2.5 py-2 text-xs outline-none placeholder:text-[#8A94A6]" placeholder="Max" />
            </div>
          </section>

          <section>
            <label htmlFor="transmission" className="text-sm font-semibold text-[#414B5D]">{tx(locale, "Transmisi", "Transmission")}</label>
            <select id="transmission" name="transmission" defaultValue={filters.transmission} className="mt-2 w-full rounded-lg border border-[#C8D0DD] bg-white px-2.5 py-2 text-xs font-semibold text-[#4B5565]">
              <option value="">{tx(locale, "Semua transmisi", "All transmissions")}</option>
              <option value="Manual">Manual</option>
              <option value="Matic">Matic</option>
            </select>
          </section>

          <section>
            <label htmlFor="seats" className="text-sm font-semibold text-[#414B5D]">{tx(locale, "Kapasitas", "Capacity")}</label>
            <select id="seats" name="seats" defaultValue={filters.seats} className="mt-2 w-full rounded-lg border border-[#C8D0DD] bg-white px-2.5 py-2 text-sm text-[#344054]">
              <option value="">{tx(locale, "Semua kapasitas", "All capacities")}</option>
              <option value="2">2 {tx(locale, "kursi", "seats")}</option>
              <option value="4">4 {tx(locale, "kursi", "seats")}</option>
              <option value="7">7 {tx(locale, "kursi", "seats")}</option>
            </select>
          </section>

          <button type="submit" className="w-full rounded-lg bg-[#0E3FA8] px-3 py-2.5 text-xs font-semibold text-white">{tx(locale, "Terapkan filter", "Apply filters")}</button>
        </div>
      </div>
    </aside>
  );
}

function VehicleCard({ vehicle, locale }: { vehicle: VehicleCardData; locale: Locale }) {
  const available = vehicle.status === "AVAILABLE";
  return (
    <article className="overflow-hidden rounded-xl border border-[#D7E5F8] bg-white shadow-sm">
      <div className="relative h-38 bg-[#EAF1FA]">
        <Image src={vehicle.imageUrl ?? "/rentgo-hero.png"} alt={`${vehicle.name} di RentGo`} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw" className={`object-cover ${available ? "" : "grayscale"}`} style={{ objectPosition: "center" }} />
        <span className={`absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${available ? "bg-[#DDF8E7] text-[#147C4C]" : "bg-[#FDE5E7] text-[#C74A58]"}`}>
          <Icon name={available ? "check" : "ban"} className="h-3.5 w-3.5" />{statusLabel(locale, vehicle.status)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold leading-tight text-[#132033]">{vehicle.name}</h3>
        <p className="mt-1.5 text-sm font-medium text-[#667085]">{tx(locale, "Tahun", "Year")} {vehicle.year}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-medium text-[#526176]"><span className="inline-flex items-center gap-1.5"><Icon name="users" className="h-4 w-4 text-[#526176]" />{vehicle.seats} {tx(locale, "Kursi", "seats")}</span><span className="inline-flex items-center gap-1.5"><Icon name="gear" className="h-4 w-4 text-[#526176]" />{vehicle.transmission}</span></div>
        <div className="mt-5 border-t border-[#DDE5F0] pt-4"><div className="flex items-center justify-between gap-3"><p className="text-xl font-semibold text-[#0E3FA8]">{rupiah.format(vehicle.dailyRate)}<span className="text-xs font-semibold text-[#667085]"> /{tx(locale, "hari", "day")}</span></p>{available ? <Link href={`/kendaraan/${vehicle.slug}`} className="rounded-lg bg-[#1647B8] px-4 py-1.5 text-xs font-semibold text-white">{tx(locale, "Pilih", "Choose")}</Link> : <button type="button" disabled className="rounded-lg bg-[#E9EEF7] px-4 py-1.5 text-xs font-semibold text-[#A4AEC0]">{tx(locale, "Pilih", "Choose")}</button>}</div></div>
      </div>
    </article>
  );
}

export default async function VehicleListPage({ searchParams }: { searchParams: Promise<VehicleSearchParams> }) {
  const [params, locale] = await Promise.all([searchParams, getLocale()]);
  const filters = getActiveFilters(params);
  const conditions: Prisma.VehicleWhereInput[] = [{ status: { not: "INACTIVE" } }];

  if (filters.query) {
    conditions.push({ OR: [{ name: { contains: filters.query, mode: "insensitive" } }, { category: { name: { contains: filters.query, mode: "insensitive" } } }] });
  }
  if (filters.types.length === 1) {
    conditions.push(filters.types[0] === "motor" ? { category: { name: { contains: "Motor", mode: "insensitive" } } } : { category: { name: { not: { contains: "Motor" }, mode: "insensitive" } } });
  }
  if (filters.min !== undefined || filters.max !== undefined) conditions.push({ dailyRate: { ...(filters.min !== undefined ? { gte: filters.min } : {}), ...(filters.max !== undefined ? { lte: filters.max } : {}) } });
  if (filters.transmission) conditions.push({ transmission: filters.transmission });
  if (filters.seats) conditions.push({ seats: filters.seats });

  const where: Prisma.VehicleWhereInput = { AND: conditions };
  const orderBy: Prisma.VehicleOrderByWithRelationInput[] = filters.sort === "name-asc" ? [{ name: "asc" }, { id: "asc" }] : [{ dailyRate: filters.sort === "price-desc" ? "desc" : "asc" }, { id: "asc" }];
  const vehicles = await prisma.vehicle.findMany({ where, select: { id: true, slug: true, name: true, year: true, seats: true, transmission: true, dailyRate: true, status: true, imageUrl: true }, orderBy });

  return (
    <main className="bg-white">
      <SiteHeader activePage="kendaraan" />
      <form action="/kendaraan" className="mx-auto grid max-w-[1232px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[18rem_1fr] lg:px-8">
        <FilterSidebar filters={filters} locale={locale} />
        <div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <label className="flex h-14 items-center gap-3 rounded-lg border border-[#C8D0DD] bg-white px-4"><Icon name="search" className="h-6 w-6 shrink-0 text-[#667085]" /><input name="query" defaultValue={filters.query} className="w-full bg-transparent text-base outline-none placeholder:text-[#8A94A6]" placeholder={tx(locale, "Cari merek atau model...", "Search brand or model...")} /></label>
            <div className="flex items-center gap-3"><label htmlFor="sort" className="text-base font-medium text-[#344054]">{tx(locale, "Urutkan:", "Sort:")}</label><select id="sort" name="sort" defaultValue={filters.sort} className="h-14 min-w-44 rounded-lg border border-[#C8D0DD] bg-white px-4 text-base text-[#344054]"><option value="price-asc">{tx(locale, "Harga terendah", "Lowest price")}</option><option value="price-desc">{tx(locale, "Harga tertinggi", "Highest price")}</option><option value="name-asc">{tx(locale, "Nama A–Z", "Name A–Z")}</option></select></div>
          </div>
          <p className="mt-5 text-sm text-[#667085]">{tx(locale, "Menampilkan", "Showing")} {vehicles.length} {tx(locale, "kendaraan", "vehicles")}</p>
          <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} locale={locale} />)}</div>
          {vehicles.length === 0 ? <p className="mt-8 text-[#667085]">{tx(locale, "Tidak ada kendaraan yang sesuai dengan filter ini.", "No vehicles match these filters.")}</p> : null}
        </div>
      </form>
      <SiteFooter />
    </main>
  );
}