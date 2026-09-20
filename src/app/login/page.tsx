import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import { getLocale, pick } from "@/lib/i18n";

export const metadata: Metadata = { title: "Login - RentGo" };

function Icon({ name, className }: { name: "mail" | "lock" | "check"; className?: string }) {
  const paths = { mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>, lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>, check: <path d="m5 12.5 4.5 4.5L19 7.5" /> };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" className={className} aria-hidden="true">{paths[name]}</svg>;
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, locale] = await Promise.all([searchParams, getLocale()]);
  const t = (id: string, en: string) => pick(locale, { id, en });
  const errors: Record<string, string> = {
    "missing-fields": t("Masukkan email dan kata sandi.", "Enter your email and password."),
    "invalid-credentials": t("Email atau kata sandi tidak sesuai.", "Incorrect email or password."),
    "admin-required": t("Masuk dengan akun admin untuk membuka dashboard.", "Log in with an admin account to open the dashboard."),
  };
  const errorMessage = error ? errors[error] : undefined;

  return <main className="grid h-dvh overflow-hidden bg-white lg:grid-cols-[minmax(0,1.05fr)_minmax(30rem,0.95fr)]">
    <section className="relative flex min-h-56 overflow-hidden bg-[#10213D] px-6 py-6 sm:min-h-64 sm:px-10 lg:min-h-dvh lg:px-12 lg:py-10">
      <Image src="/rentgo-hero.png" alt={t("Armada RentGo siap digunakan", "RentGo vehicles ready for your trip")} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#07172D]/92 via-[#0A3170]/64 to-[#10213D]/76" />
      <div className="relative flex w-full flex-col justify-between lg:justify-start lg:gap-24">
        <Link href="/" className="w-fit" aria-label={t("Beranda RentGo", "RentGo home")}><Image src="/referensi/Logo%20RentGo.svg" alt="RentGo" width={174} height={58} className="h-8 w-auto brightness-0 invert" /></Link>
        <div className="max-w-xl pt-6 lg:pt-0"><p className="text-sm font-semibold text-[#9BD9B3]">{t("Rental online yang lebih praktis", "A simpler way to rent online")}</p><h1 className="mt-4 max-w-lg text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">{t("Kelola perjalanan Anda dengan satu akun.", "Manage every trip with one account.")}</h1><ul className="mt-7 grid gap-3 text-sm text-blue-50 sm:grid-cols-3 lg:grid-cols-1">{[t("Pantau status pesanan", "Track booking status"), t("Cek riwayat penyewaan", "View rental history"), t("Lihat status dokumen", "Check document status")].map((item) => <li key={item} className="flex items-center gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10"><Icon name="check" className="h-3.5 w-3.5" /></span>{item}</li>)}</ul></div>
      </div>
    </section>
    <section className="flex overflow-hidden bg-white px-6 py-6 sm:px-10 lg:px-14 xl:px-20">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center py-2 lg:py-10"><div><p className="text-sm font-semibold text-[#147C4C]">{t("Masuk RentGo", "RentGo Login")}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">{t("Masuk ke akun Anda", "Log in to your account")}</h1><p className="mt-3 max-w-sm text-sm leading-6 text-[#526176]">{t("Gunakan akun Anda untuk melanjutkan pemesanan, pembayaran, dan verifikasi dokumen.", "Use your account to continue booking, payment, and document verification.")}</p></div>
        <form action={login} className="mt-9 space-y-5">{errorMessage ? <p role="alert" className="rounded-xl border border-[#F6C5CB] bg-[#FDE5E7] px-4 py-3 text-sm font-medium text-[#B42318]">{errorMessage}</p> : null}<label className="block"><span className="text-sm font-semibold text-[#344054]">Email</span><span className="mt-2 flex h-13 items-center gap-3 rounded-xl border border-[#C8D0DD] bg-[#FBFCFE] px-4 transition-colors focus-within:border-[#0E3FA8] focus-within:bg-white"><Icon name="mail" className="h-5 w-5 shrink-0 text-[#667085]" /><input name="email" type="email" autoComplete="email" required placeholder={t("nama@email.com", "name@email.com")} className="w-full bg-transparent text-base outline-none placeholder:text-[#98A2B3]" /></span></label><label className="block"><span className="text-sm font-semibold text-[#344054]">{t("Kata sandi", "Password")}</span><span className="mt-2 flex h-13 items-center gap-3 rounded-xl border border-[#C8D0DD] bg-[#FBFCFE] px-4 transition-colors focus-within:border-[#0E3FA8] focus-within:bg-white"><Icon name="lock" className="h-5 w-5 shrink-0 text-[#667085]" /><input name="password" type="password" autoComplete="current-password" required placeholder={t("Masukkan kata sandi", "Enter your password")} className="w-full bg-transparent text-base outline-none placeholder:text-[#98A2B3]" /></span></label><button type="submit" className="mt-2 flex h-13 w-full items-center justify-center rounded-xl bg-[#0E3FA8] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0B348D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3FA8]">{t("Masuk", "Login")}</button></form>
        <p className="mt-7 border-t border-[#E4E9F2] pt-6 text-center text-sm text-[#526176]">{t("Belum punya akun?", "Do not have an account?")} <Link href="/register" className="font-semibold text-[#0E3FA8] hover:text-[#0B348D]">{t("Daftar sekarang", "Register now")}</Link></p>
      </div>
    </section>
  </main>;
}