import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, pick } from "@/lib/i18n";

type SiteHeaderProps = {
  activePage?: "home" | "kendaraan" | "tentang" | "faq";
};

const navLinks = [
  { id: "Beranda", en: "Home", href: "/", key: "home" },
  { id: "Kendaraan", en: "Vehicles", href: "/kendaraan", key: "kendaraan" },
  { id: "Tentang Kami", en: "About Us", href: "/tentang-kami", key: "tentang" },
  { id: "Bantuan", en: "Help", href: "/faq", key: "faq" },
] as const;

function Icon({ name, className }: { name: "bell" | "logout"; className?: string }) {
  const paths = {
    bell: <><path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    logout: <><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M12 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" className={className} aria-hidden="true">{paths[name]}</svg>;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export async function SiteHeader({ activePage }: SiteHeaderProps) {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  const roleLabel = user?.role === "ADMIN" ? "Admin RentGo" : pick(locale, { id: "Pelanggan RentGo", en: "RentGo Customer" });

  return (
    <header className="sticky top-0 z-50 border-b border-[#E4E9F2] bg-white">
      <div className="mx-auto flex h-20 max-w-[1232px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label={pick(locale, { id: "Beranda RentGo", en: "RentGo home" })}>
          <Image src="/referensi/Logo%20RentGo.svg" alt="RentGo" width={174} height={58} priority className="h-6 w-auto" />
        </Link>
        <nav className="hidden items-center gap-8 text-base font-semibold text-[#4B5565] md:flex" aria-label={pick(locale, { id: "Navigasi utama", en: "Main navigation" })}>
          {navLinks.map((link) => <Link key={link.key} href={link.href} className={link.key === activePage ? "text-[#0E3FA8]" : "hover:text-[#0E3FA8]"}>{link[locale]}</Link>)}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher locale={locale} />
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <button type="button" className="relative hidden text-[#667085] lg:block" aria-label={pick(locale, { id: "Notifikasi", en: "Notifications" })}>
                <Icon name="bell" className="h-6 w-6" /><span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#F04438]" />
              </button>
              <Link href="/profile" className="flex items-center gap-3" aria-label={pick(locale, { id: "Buka profil", en: "Open profile" })}>
                <span className="hidden text-right lg:block"><span className="block text-sm font-semibold text-[#132033]">{user.name}</span><span className="block text-xs font-semibold text-[#667085]">{roleLabel}</span></span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0E3FA8] text-sm font-semibold text-white sm:h-11 sm:w-11">{initials(user.name)}</span>
              </Link>
              <form action={logout} className="hidden sm:block"><button type="submit" className="grid h-10 w-10 place-items-center rounded-lg border border-[#D5DDEA] text-[#526176] hover:border-[#0E3FA8] hover:text-[#0E3FA8]" aria-label={pick(locale, { id: "Keluar", en: "Log out" })}><Icon name="logout" className="h-5 w-5" /></button></form>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4"><Link href="/login" className="hidden text-sm font-semibold text-[#0E3FA8] sm:inline">{pick(locale, { id: "Masuk", en: "Login" })}</Link><Link href="/register" className="rounded-lg bg-[#0E3FA8] px-3 py-2.5 text-xs font-semibold text-white sm:px-5 sm:py-3 sm:text-sm">{pick(locale, { id: "Daftar", en: "Register" })}</Link></div>
          )}
        </div>
      </div>
    </header>
  );
}