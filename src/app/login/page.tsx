import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login - RentGo",
  description: "Masuk ke akun RentGo untuk melihat pesanan, riwayat sewa, dan status verifikasi dokumen.",
};

function Icon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
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

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FC] px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl place-items-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-[#D8E5F6] bg-white shadow-sm lg:grid-cols-[0.9fr_1fr]">
          <div className="relative min-h-60 bg-[#10213D] lg:min-h-[30rem]">
            <Image
              src="/rentgo-hero.png"
              alt="Armada RentGo siap digunakan"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10213D]/88 via-[#10213D]/40 to-transparent" />
            <Link href="/" className="absolute left-5 top-5 text-xl font-semibold tracking-tight text-white">
              RentGo
            </Link>
            <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-6 sm:left-6 sm:right-6">
              <h1 className="max-w-sm text-2xl font-bold leading-tight sm:text-3xl">
                Kelola perjalanan Anda dengan satu akun.
              </h1>
              <ul className="mt-5 space-y-2 text-xs text-blue-50">
                {["Pantau status pesanan", "Cek riwayat penyewaan", "Lihat status dokumen"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center p-5 sm:p-6 lg:p-8">
            <div className="w-full">
            <div>
              <p className="text-sm font-semibold text-[#147C4C]">Login RentGo</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#132033]">
                Masuk ke akun Anda
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#526176]">
                Gunakan akun pelanggan untuk melanjutkan pemesanan, pembayaran, dan verifikasi dokumen.
              </p>
            </div>

            <form className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-[#344054]">Email</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-[#C8D0DD] bg-white px-3.5 py-2.5 focus-within:border-[#0E3FA8]">
                  <Icon name="mail" className="h-5 w-5 shrink-0 text-[#667085]" />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    className="w-full bg-transparent text-base outline-none placeholder:text-[#98A2B3]"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#344054]">Password</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-[#C8D0DD] bg-white px-3.5 py-2.5 focus-within:border-[#0E3FA8]">
                  <Icon name="lock" className="h-5 w-5 shrink-0 text-[#667085]" />
                  <input
                    type="password"
                    placeholder="Masukkan password"
                    className="w-full bg-transparent text-base outline-none placeholder:text-[#98A2B3]"
                  />
                </span>
              </label>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-[#526176]">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#C8D0DD]" />
                  Ingat saya
                </label>
                <Link href="#" className="font-semibold text-[#0E3FA8]">
                  Lupa password?
                </Link>
              </div>

              <Link href="/profile" className="block w-full rounded-lg bg-[#0E3FA8] px-5 py-3 text-center text-sm font-semibold text-white">
                Login
              </Link>
            </form>

            <p className="mt-5 text-center text-sm text-[#526176]">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-[#0E3FA8]">
                Register sekarang
              </Link>
            </p>
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}

