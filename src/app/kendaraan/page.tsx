import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { vehicleCatalog } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Daftar Kendaraan - RentGo",
  description:
    "Cari dan pilih kendaraan RentGo berdasarkan tipe, harga, transmisi, kapasitas, dan status ketersediaan.",
};

const vehicles = [
  vehicleCatalog[0],
  vehicleCatalog[0],
  vehicleCatalog[1],
  vehicleCatalog[1],
  vehicleCatalog[2],
  vehicleCatalog[2],
  vehicleCatalog[3],
  vehicleCatalog[3],
];

function Icon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    users: (
      <>
        <path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4" />
        <circle cx="12" cy="9" r="3" />
        <path d="M4.5 18.5c0-1.8 1.4-3.2 3.2-3.2M16.3 15.3c1.8 0 3.2 1.4 3.2 3.2" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2.8v2.5M12 18.7v2.5M4.2 4.2 6 6M18 18l1.8 1.8M2.8 12h2.5M18.7 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8" />
      </>
    ),
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    ban: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="m7 7 10 10" />
      </>
    ),
    arrowLeft: <path d="m15 18-6-6 6-6" />,
    arrowRight: <path d="m9 18 6-6-6-6" />,
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

function FilterSidebar() {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-none bg-[#F5F7FC] lg:pr-6">
        <div className="flex items-center justify-between border-b border-[#D9E0EC] pb-3">
          <h1 className="text-2xl font-semibold text-[#132033]">Filters</h1>
          <button type="button" className="text-sm font-semibold text-[#0E3FA8]">
            Reset All
          </button>
        </div>

        <div className="space-y-5 pt-5">
          <section>
            <h2 className="text-base font-semibold text-[#414B5D]">Tipe Kendaraan</h2>
            <div className="mt-2.5 space-y-2">
              {["Mobil", "Motor"].map((type) => (
                <label key={type} className="flex items-center gap-3 text-base text-[#475467]">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#C8D0DD] text-[#0E3FA8]" />
                  {type}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#414B5D]">Harga / Hari</h2>
            <div className="mt-2.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <input className="min-w-0 rounded-lg border border-[#C8D0DD] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-[#8A94A6]" placeholder="Min" />
              <span className="text-[#A6AFBE]">-</span>
              <input className="min-w-0 rounded-lg border border-[#C8D0DD] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-[#8A94A6]" placeholder="Max" />
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#414B5D]">Transmisi</h2>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <button type="button" className="rounded-lg border border-[#C8D0DD] bg-white px-3 py-2 text-sm font-semibold text-[#4B5565]">
                Manual
              </button>
              <button type="button" className="rounded-lg bg-[#0E3FA8] px-3 py-2 text-sm font-semibold text-white">
                Matic
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#414B5D]">Kapasitas (Kursi)</h2>
            <button type="button" className="mt-2.5 flex w-full items-center justify-between rounded-lg border border-[#C8D0DD] bg-white px-3 py-2.5 text-left text-base text-[#344054]">
              Semua Kapasitas
              <Icon name="chevron" className="h-5 w-5 text-[#667085]" />
            </button>
          </section>

          <button type="button" className="w-full rounded-lg bg-[#0E3FA8] px-4 py-3 text-sm font-semibold text-white">
            Terapkan Filter
          </button>
        </div>
      </div>
    </aside>
  );
}

function VehicleCard({ vehicle }: { vehicle: (typeof vehicles)[number] }) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#D7E5F8] bg-white shadow-sm">
      <div className="relative h-38 bg-[#EAF1FA]">
        <Image
          src="/rentgo-hero.png"
          alt={`${vehicle.name} di RentGo`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
          className={`object-cover ${vehicle.available ? "" : "grayscale"}`}
          style={{ objectPosition: vehicle.imagePosition }}
        />
        <span
          className={`absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
            vehicle.available ? "bg-[#DDF8E7] text-[#147C4C]" : "bg-[#FDE5E7] text-[#C74A58]"
          }`}
        >
          <Icon name={vehicle.available ? "check" : "ban"} className="h-3.5 w-3.5" />
          {vehicle.status}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold leading-tight text-[#132033]">{vehicle.name}</h3>
        <p className="mt-1.5 text-sm font-medium text-[#667085]">{vehicle.yearLabel}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-medium text-[#526176]">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="users" className="h-4 w-4 text-[#526176]" />
            {vehicle.seats}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="gear" className="h-4 w-4 text-[#526176]" />
            {vehicle.transmission}
          </span>
        </div>

        <div className="mt-5 border-t border-[#DDE5F0] pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xl font-semibold text-[#0E3FA8]">
              {vehicle.price}
              <span className="text-xs font-semibold text-[#667085]"> /hari</span>
            </p>
            {vehicle.available ? (
              <Link
                href={`/kendaraan/${vehicle.slug}`}
                className="rounded-lg bg-[#1647B8] px-4 py-1.5 text-xs font-semibold text-white"
              >
                Pilih
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="rounded-lg bg-[#E9EEF7] px-4 py-1.5 text-xs font-semibold text-[#A4AEC0]"
              >
                Pilih
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Pagination() {
  return (
    <nav className="mt-16 flex justify-center gap-3" aria-label="Pagination">
      <button className="grid h-11 w-11 place-items-center rounded-lg border border-[#CBD5E1] bg-white text-[#344054]" type="button" aria-label="Halaman sebelumnya">
        <Icon name="arrowLeft" className="h-5 w-5" />
      </button>
      <button className="grid h-11 w-11 place-items-center rounded-lg bg-[#0E3FA8] text-base font-semibold text-white" type="button">
        1
      </button>
      <button className="grid h-11 w-11 place-items-center rounded-lg border border-[#CBD5E1] bg-white text-base font-semibold text-[#475467]" type="button">
        2
      </button>
      <button className="grid h-11 w-11 place-items-center rounded-lg border border-[#CBD5E1] bg-white text-[#344054]" type="button" aria-label="Halaman berikutnya">
        <Icon name="arrowRight" className="h-5 w-5" />
      </button>
    </nav>
  );
}

export default function VehicleListPage() {
  return (
    <main className="bg-[#F5F7FC]">
      <SiteHeader activePage="kendaraan" />
      <section className="mx-auto grid max-w-[1232px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[18rem_1fr] lg:px-8">
        <FilterSidebar />

        <div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <label className="flex h-14 items-center gap-3 rounded-lg border border-[#C8D0DD] bg-white px-4">
              <Icon name="search" className="h-6 w-6 shrink-0 text-[#667085]" />
              <input
                className="w-full bg-transparent text-base outline-none placeholder:text-[#8A94A6]"
                placeholder="Cari merk atau model..."
              />
            </label>
            <div className="flex items-center gap-3">
              <span className="text-base font-medium text-[#344054]">Urutkan:</span>
              <button type="button" className="flex h-14 min-w-44 items-center justify-between gap-4 rounded-lg border border-[#C8D0DD] bg-white px-4 text-base text-[#344054]">
                Harga Terendah
                <Icon name="chevron" className="h-5 w-5 text-[#667085]" />
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle, index) => (
              <VehicleCard key={`${vehicle.name}-${index}`} vehicle={vehicle} />
            ))}
          </div>

          <Pagination />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
