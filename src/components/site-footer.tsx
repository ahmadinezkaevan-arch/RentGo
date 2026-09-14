import Link from "next/link";

function Icon({ name, className }: { name: "car" | "mail" | "phone"; className?: string }) {
  const paths = {
    car: (
      <>
        <path d="M5 16h14M6.5 16v2M17.5 16v2M4 13l2-5h12l2 5" />
        <path d="M7 13h10" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M5 4h4l2 5-2 1.5a12 12 0 0 0 5 5L15.5 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
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

export function SiteFooter() {
  return (
    <footer className="bg-[#2F3332] text-[#C9CECD]">
      <div className="mx-auto max-w-[1232px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.45fr_0.9fr_0.9fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-white" aria-label="RentGo beranda">
              <Icon name="car" className="h-5 w-5" />
              <span className="text-2xl font-semibold tracking-tight">RentGo</span>
            </Link>
            <p className="mt-5 max-w-xs text-base leading-7 text-[#B8BEBC]">
              Solusi mobilitas modern dan terpercaya untuk setiap perjalanan Anda.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">Perusahaan</h3>
            <ul className="mt-5 space-y-3 text-base">
              <li>
                <Link href="/tentang-kami" className="hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/#cara-sewa" className="hover:text-white">
                  Karir
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">Bantuan</h3>
            <ul className="mt-5 space-y-3 text-base">
              <li>
                <Link href="/#aturan" className="hover:text-white">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/#aturan" className="hover:text-white">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/#bantuan" className="hover:text-white">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">Kontak</h3>
            <ul className="mt-5 space-y-3 text-base">
              <li className="flex items-center gap-3">
                <Icon name="mail" className="h-5 w-5 text-[#B8BEBC]" />
                <span>support@rentgo.co.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="phone" className="h-5 w-5 text-[#B8BEBC]" />
                <span>0800-1-RENTGO</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 pt-7 text-sm text-[#AEB5B3]">
          © 2024 RentGo Indonesia. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
