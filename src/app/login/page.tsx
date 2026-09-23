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

function GoogleIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.2c1.9-1.8 3.1-4.4 3.1-7.4Z" /><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.3H2.9v2.6A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.2 13.7A6 6 0 0 1 5.9 12c0-.6.1-1.2.3-1.7V7.7H2.9A10 10 0 0 0 2 12c0 1.6.4 3.1.9 4.3l3.3-2.6Z" /><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 2.9 7.7l3.3 2.6C7 7.8 9.3 6 12 6Z" /></svg>;
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const [{ error, next }, locale] = await Promise.all([searchParams, getLocale()]);
  const nextPath = next?.startsWith("/") && !next.startsWith("//") ? next : "";
  const t = (id: string, en: string) => pick(locale, { id, en });
  const errors: Record<string, string> = {
    "missing-fields": t("Masukkan email dan kata sandi.", "Enter your email and password."),
    "invalid-credentials": t("Email atau kata sandi tidak sesuai.", "Incorrect email or password."),
    "admin-required": t("Masuk dengan akun admin untuk membuka dashboard.", "Log in with an admin account to open the dashboard."),
    "google-not-configured": t("Login Google belum dikonfigurasi.", "Google login is not configured yet."),
    "google-cancelled": t("Login Google dibatalkan.", "Google login was cancelled."),
    "google-invalid-state": t("Sesi login Google tidak valid. Coba lagi.", "Your Google login session is invalid. Please try again."),
    "google-email-not-verified": t("Google belum memverifikasi email akun ini.", "Google has not verified this account email."),
    "google-account-inactive": t("Akun ini tidak aktif.", "This account is inactive."),
    "google-failed": t("Login Google gagal. Coba lagi.", "Google login failed. Please try again."),
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
      <div className="mx-auto flex w-full max-w-md flex-col justify-center py-2 lg:py-8"><div><p className="text-sm font-semibold text-[#147C4C]">{t("Masuk RentGo", "RentGo Login")}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">{t("Masuk ke akun Anda", "Log in to your account")}</h1><p className="mt-2 max-w-sm text-sm leading-6 text-[#526176]">{t("Gunakan akun Anda untuk melanjutkan pemesanan, pembayaran, dan verifikasi dokumen.", "Use your account to continue booking, payment, and document verification.")}</p></div>

        <form action={login} className="mt-5 w-full space-y-4"><input type="hidden" name="next" value={nextPath} />{errorMessage ? <p role="alert" className="rounded-xl border border-[#F6C5CB] bg-[#FDE5E7] px-4 py-2.5 text-sm font-medium text-[#B42318]">{errorMessage}</p> : null}<label className="block"><span className="text-sm font-semibold text-[#344054]">Email</span><span className="mt-1.5 flex h-12 items-center gap-3 rounded-xl border border-[#C8D0DD] bg-[#FBFCFE] px-3.5 transition-colors focus-within:border-[#0E3FA8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0E3FA8]/10"><Icon name="mail" className="h-4.5 w-4.5 shrink-0 text-[#667085]" /><input name="email" type="email" autoComplete="email" required placeholder={t("nama@email.com", "name@email.com")} className="w-full bg-transparent text-sm text-[#132033] outline-none placeholder:text-[#98A2B3]" /></span></label><label className="block"><span className="text-sm font-semibold text-[#344054]">{t("Kata sandi", "Password")}</span><span className="mt-1.5 flex h-12 items-center gap-3 rounded-xl border border-[#C8D0DD] bg-[#FBFCFE] px-3.5 transition-colors focus-within:border-[#0E3FA8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0E3FA8]/10"><Icon name="lock" className="h-4.5 w-4.5 shrink-0 text-[#667085]" /><input name="password" type="password" autoComplete="current-password" required placeholder={t("Masukkan kata sandi", "Enter your password")} className="w-full bg-transparent text-sm text-[#132033] outline-none placeholder:text-[#98A2B3]" /></span></label><button type="submit" className="mt-1 flex h-13 shrink-0 w-full cursor-pointer items-center justify-center rounded-xl bg-[#0E3FA8] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0B348D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3FA8]">{t("Masuk", "Login")}</button></form>
        <div className="my-4 flex shrink-0 items-center gap-3 text-xs font-medium text-[#98A2B3]"><span className="h-px flex-1 bg-[#E4E9F2]" />{t("atau", "or")}<span className="h-px flex-1 bg-[#E4E9F2]" /></div>
        <Link href="/api/auth/google?from=login" className="flex h-13 shrink-0 w-full items-center justify-center gap-3 rounded-xl border border-[#C8D0DD] bg-white px-5 text-sm font-semibold text-[#344054] shadow-xs transition-colors hover:bg-[#F8FAFC] hover:border-[#B0BCCF] hover:text-[#132033] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3FA8]"><GoogleIcon className="h-5 w-5 shrink-0" />{t("Lanjutkan dengan Google", "Continue with Google")}</Link>
        <p className="mt-5 shrink-0 text-center text-sm text-[#526176]">{t("Belum punya akun?", "Do not have an account?")} <Link href="/register" className="font-semibold text-[#0E3FA8] hover:text-[#0B348D]">{t("Daftar sekarang", "Register now")}</Link></p>
      </div>
    </section>
  </main>;
}