import Link from "next/link";

type SiteHeaderProps = {
  activePage?: "home" | "kendaraan" | "tentang";
  isAuthenticated?: boolean;
};

const navLinks = [
  { label: "Home", href: "/", key: "home" },
  { label: "Kendaraan", href: "/kendaraan", key: "kendaraan" },
  { label: "Tentang Kami", href: "/tentang-kami", key: "tentang" },
  { label: "Bantuan", href: "/#bantuan" },
] as const;

function Icon({ name, className }: { name: "car" | "bell"; className?: string }) {
  const paths = {
    car: (
      <>
        <path d="M5 16h14M6.5 16v2M17.5 16v2M4 13l2-5h12l2 5" />
        <path d="M7 13h10" />
      </>
    ),
    bell: (
      <>
        <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z" />
        <path d="M10 20a2 2 0 0 0 4 0" />
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

export function SiteHeader({ activePage, isAuthenticated = false }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E4E9F2] bg-white">
      <div className="mx-auto flex h-20 max-w-[1232px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-[#0E3FA8]" aria-label="RentGo beranda">
          <Icon name="car" className="h-5 w-5" />
          <span className="text-2xl font-semibold tracking-tight">RentGo</span>
        </Link>

        <nav className="hidden items-center gap-8 text-base font-semibold text-[#4B5565] md:flex">
          {navLinks.map((link) => {
            const isActive = "key" in link && link.key === activePage;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={isActive ? "text-[#0E3FA8]" : "hover:text-[#0E3FA8]"}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 sm:gap-5">
            <button type="button" className="relative text-[#667085]" aria-label="Notifikasi">
              <Icon name="bell" className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#F04438]" />
            </button>
            <Link href="/profile" className="flex items-center gap-3" aria-label="Buka profil">
              <span className="hidden text-right sm:block">
                <span className="block text-sm font-semibold text-[#132033]">Ahmadinezka Evan</span>
                <span className="block text-xs font-semibold text-[#667085]">Pelanggan</span>
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#0E3FA8] text-sm font-semibold text-white">
                AE
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <button type="button" className="relative hidden text-[#667085] sm:block" aria-label="Notifikasi">
              <Icon name="bell" className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#F04438]" />
            </button>
            <Link href="/login" className="hidden text-sm font-semibold text-[#0E3FA8] sm:inline">
              Login
            </Link>
            <Link href="/register" className="rounded-lg bg-[#0E3FA8] px-5 py-3 text-sm font-semibold text-white">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

