import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLocale, pick } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Profil Saya - RentGo",
  description: "Kelola data profil, dokumen identitas, dan riwayat booking kendaraan RentGo.",
};

type IconName =
  | "calendar"
  | "camera"
  | "car"
  | "check"
  | "clock"
  | "document"
  | "edit"
  | "mail"
  | "phone"
  | "shield"
  | "user";

function Icon({ name, className }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    calendar: (
      <>
        <path d="M7 3v4M17 3v4" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M4 10h16" />
      </>
    ),
    camera: (
      <>
        <path d="M8 7 9.5 5h5L16 7h2a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h2Z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
    car: (
      <>
        <path d="M5 16h14M6.5 16v2M17.5 16v2M4 13l2-5h12l2 5" />
        <path d="M7 13h10" />
      </>
    ),
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    document: (
      <>
        <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5" />
        <path d="M8 13h8M8 17h5" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: <path d="M5 4h4l2 5-2 1.5a12 12 0 0 0 5 5L15.5 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
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

function TextField({ label, value, icon }: { label: string; value: string; icon: IconName }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#344054]">{label}</span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-[#C8D0DD] bg-white px-4 focus-within:border-[#0E3FA8]">
        <Icon name={icon} className="h-5 w-5 shrink-0 text-[#667085]" />
        <input className="w-full bg-transparent text-base outline-none" defaultValue={value} />
      </span>
    </label>
  );
}

function DocumentCard({ title, file, status, changeLabel }: { title: string; file: string; status: string; changeLabel: string }) {
  return (
    <article className="rounded-xl border border-[#D5DDEA] bg-[#F8FAFE] p-4">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-[#0E3FA8] shadow-sm">
          <Icon name="document" className="h-6 w-6" />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDF8E7] px-3 py-1 text-xs font-semibold text-[#147C4C]">
          <Icon name="check" className="h-3.5 w-3.5" />
          {status}
        </span>
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#132033]">{title}</h3>
      <p className="mt-1 text-sm text-[#667085]">{file}</p>
      <button type="button" className="mt-4 rounded-lg border border-[#0E3FA8] px-4 py-2 text-sm font-semibold text-[#0E3FA8]">
        {changeLabel}
      </button>
    </article>
  );
}

export default async function ProfilePage() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  if (!user) redirect("/login");
  const t = (id: string, en: string) => pick(locale, { id, en });
  const bookings = [
    { vehicle: "Toyota Avanza 2023", date: t("24 Okt - 27 Okt", "24 Oct - 27 Oct"), status: t("Menunggu pembayaran", "Awaiting payment"), color: "bg-[#FFF3D6] text-[#9A6700]" },
    { vehicle: "Honda Brio 2022", date: t("12 Sep - 14 Sep", "12 Sep - 14 Sep"), status: t("Selesai", "Completed"), color: "bg-[#DDF8E7] text-[#147C4C]" },
  ];

  return (
    <main className="bg-[#F5F7FC]">
      <SiteHeader />

      <section className="mx-auto max-w-[1232px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <section className="overflow-hidden rounded-xl border border-[#D5DDEA] bg-white shadow-sm">
              <div className="h-28 bg-[#0E3FA8]" />
              <div className="px-6 pb-6 text-center">
                <div className="relative mx-auto -mt-14 h-28 w-28 rounded-full border-4 border-white bg-[#DCEBFF]">
                  <Image
                    src="/rentgo-hero.png"
                    alt="Foto profil pengguna RentGo"
                    fill
                    sizes="7rem"
                    className="rounded-full object-cover"
                    style={{ objectPosition: "18% 48%" }}
                  />
                  <button type="button" className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-[#0E3FA8] text-white shadow-sm" aria-label="Ubah foto profil">
                    <Icon name="camera" className="h-4 w-4" />
                  </button>
                </div>
                <h1 className="mt-4 text-2xl font-semibold leading-tight text-[#132033]">{user.name}</h1>
                <p className="mt-1 text-sm font-semibold text-[#667085]">{user.role === "ADMIN" ? "Admin RentGo" : t("Pelanggan RentGo", "RentGo Customer")}</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#DDF8E7] px-4 py-2 text-sm font-semibold text-[#147C4C]">
                  <Icon name="shield" className="h-4 w-4" />
                  {t("Akun aktif", "Active account")}
                </span>
              </div>
            </section>

            <nav className="mt-5 rounded-xl border border-[#D5DDEA] bg-white p-3 shadow-sm" aria-label="Menu profil">
              {[
                [t("Profil Saya", "My Profile"), "user", true],
                [t("Riwayat Booking", "Booking History"), "car", false],
                [t("Dokumen", "Documents"), "document", false],
                [t("Keluar", "Logout"), "shield", false],
              ].map(([label, icon, active]) => (
                <Link
                  key={String(label)}
                  href="#"
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold ${
                    active ? "bg-[#EEF5FF] text-[#0E3FA8]" : "text-[#526176] hover:bg-[#F5F7FC] hover:text-[#0E3FA8]"
                  }`}
                >
                  <Icon name={icon as IconName} className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>

          <div className="space-y-6">
            <section className="rounded-xl border border-[#D5DDEA] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold leading-tight text-[#101B2D]">{t("Profil Saya", "My Profile")}</h2>
                  <p className="mt-2 max-w-2xl text-base leading-7 text-[#667085]">
                    {t("Kelola informasi akun, dokumen identitas, dan status penyewaan kendaraan Anda.", "Manage your account information, identity documents, and rental status.")}
                  </p>
                </div>
                <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[#0E3FA8] px-5 py-3 text-sm font-semibold text-white">
                  <Icon name="edit" className="h-5 w-5" />
                  {t("Edit Profil", "Edit Profile")}
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  [t("Total Booking", "Total Bookings"), "8", "car"],
                  [t("Booking Aktif", "Active Bookings"), "1", "clock"],
                  [t("Terverifikasi", "Verified"), "100%", "shield"],
                ].map(([label, value, icon]) => (
                  <article key={label} className="rounded-lg border border-[#D5DDEA] bg-[#F8FAFE] p-4">
                    <Icon name={icon as IconName} className="h-6 w-6 text-[#0E3FA8]" />
                    <p className="mt-3 text-2xl font-semibold text-[#132033]">{value}</p>
                    <p className="mt-1 text-sm font-semibold text-[#667085]">{label}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#D5DDEA] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold text-[#132033]">{t("Informasi Pribadi", "Personal Information")}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <TextField label={t("Nama Lengkap", "Full Name")} value={user.name} icon="user" />
                <TextField label={t("Nomor Telepon", "Phone Number")} value={user.phone ?? t("Belum diisi", "Not provided")} icon="phone" />
                <TextField label="Email" value={user.email} icon="mail" />
                <TextField label={t("Tanggal Bergabung", "Member Since")} value={t("13 September 2026", "13 September 2026")} icon="calendar" />
              </div>
            </section>

            <section className="rounded-xl border border-[#D5DDEA] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-[#132033]">{t("Riwayat Booking", "Booking History")}</h2>
                <Link href="/kendaraan" className="text-sm font-semibold text-[#0E3FA8]">
                  {t("Sewa kendaraan lagi", "Rent another vehicle")}
                </Link>
              </div>
              <div className="mt-5 space-y-3">
                {bookings.map((booking) => (
                  <article key={booking.vehicle} className="grid gap-4 rounded-lg border border-[#D5DDEA] bg-[#F8FAFE] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="flex items-start gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-[#0E3FA8] shadow-sm">
                        <Icon name="car" className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-[#132033]">{booking.vehicle}</h3>
                        <p className="mt-1 text-sm font-medium text-[#667085]">{booking.date}</p>
                      </div>
                    </div>
                    <span className={`w-max rounded-full px-3 py-1 text-xs font-semibold ${booking.color}`}>{booking.status}</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#D5DDEA] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold text-[#132033]">{t("Dokumen Identitas", "Identity Documents")}</h2>
              <p className="mt-2 text-base text-[#667085]">{t("Dokumen ini digunakan untuk validasi penyewaan kendaraan.", "These documents are used to validate vehicle rentals.")}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <DocumentCard title={t("KTP", "National ID")} file="ktp-ahmadinezka.jpg" status={t("Terverifikasi", "Verified")} changeLabel={t("Ganti Dokumen", "Replace Document")} />
                <DocumentCard title={t("SIM A", "Driving License")} file="sim-a-ahmadinezka.jpg" status={t("Terverifikasi", "Verified")} changeLabel={t("Ganti Dokumen", "Replace Document")} />
              </div>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

