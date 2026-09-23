import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale, pick } from "@/lib/i18n";
import { MidtransPayButton } from "../midtrans-pay-button";

type PaymentPageProps = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: Date, locale: "id" | "en") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(value);
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { slug: bookingCode } = await params;
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  if (!user) redirect(`/login?next=${encodeURIComponent(`/payment/${bookingCode}`)}`);

  const booking = await prisma.booking.findFirst({
    where: { code: bookingCode, userId: user.id },
    include: { vehicle: { include: { category: { select: { name: true } } } }, payments: { where: { type: "DP" }, take: 1 } },
  });
  if (!booking) notFound();

  const t = (id: string, en: string) => pick(locale, { id, en });
  const payment = booking.payments[0];

  return (
    <main className="min-h-screen bg-[#F5F7FC]">
      <SiteHeader activePage="kendaraan" />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#667085]" aria-label="Breadcrumb">
          <Link href="/kendaraan" className="hover:text-[#0E3FA8]">{t("Kendaraan", "Vehicles")}</Link><span>/</span>
          <Link href={`/checkout/${booking.vehicle.slug}`} className="hover:text-[#0E3FA8]">Checkout</Link><span>/</span><span className="text-[#132033]">{t("Pembayaran", "Payment")}</span>
        </nav>
        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <section className="rounded-2xl border border-[#D5DDEA] bg-white p-6 shadow-sm sm:p-8">
            <span className="inline-flex rounded-full bg-[#EEF5FF] px-3 py-1 text-xs font-semibold text-[#0E3FA8]">{t("Pesanan berhasil dibuat", "Booking created")}</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#132033] sm:text-4xl">{t("Lanjutkan pembayaran DP", "Continue with deposit payment")}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-[#667085]">{t("Pesanan Anda telah tersimpan di RentGo. Pembayaran demo Midtrans akan dihubungkan pada tahap berikutnya.", "Your booking is saved in RentGo. Midtrans demo payment will be connected in the next step.")}</p>
            <div className="mt-7 rounded-xl border border-[#DDE5F0] bg-[#F8FAFE] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-medium text-[#667085]">{t("Kode booking", "Booking code")}</p><p className="mt-1 text-xl font-semibold text-[#132033]">{booking.code}</p></div><span className="rounded-full bg-[#FFF3D6] px-3 py-1.5 text-xs font-semibold text-[#9A6700]">{t("Menunggu pembayaran", "Awaiting payment")}</span></div>
              <dl className="mt-5 divide-y divide-[#E0E6F0] border-t border-[#E0E6F0] text-sm"><div className="flex justify-between gap-4 py-3"><dt className="text-[#667085]">{t("Kendaraan", "Vehicle")}</dt><dd className="text-right font-semibold text-[#132033]">{booking.vehicle.name}</dd></div><div className="flex justify-between gap-4 py-3"><dt className="text-[#667085]">{t("Jadwal sewa", "Rental schedule")}</dt><dd className="text-right font-semibold text-[#132033]">{formatDate(booking.startDate, locale)} – {formatDate(booking.endDate, locale)}</dd></div><div className="flex justify-between gap-4 py-3"><dt className="text-[#667085]">{t("Durasi", "Duration")}</dt><dd className="font-semibold text-[#132033]">{booking.days} {t("hari", "days")}</dd></div></dl>
            </div>
            <div className="mt-7 rounded-xl border border-dashed border-[#B8C8E6] bg-[#EEF5FF] p-5"><p className="font-semibold text-[#132033]">{t("Midtrans Demo", "Midtrans Demo")}</p><p className="mt-1 text-sm leading-6 text-[#526176]">{t("Tombol pembayaran akan membuka Snap Midtrans setelah Server Key dan Client Key sandbox Anda dikonfigurasi.", "The payment button will open Midtrans Snap after your sandbox Server Key and Client Key are configured.")}</p></div>
          </section>
          <aside className="h-fit rounded-2xl border border-[#D5DDEA] bg-white p-6 shadow-sm lg:sticky lg:top-28"><h2 className="text-xl font-semibold text-[#132033]">{t("Ringkasan pembayaran", "Payment summary")}</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4 text-[#667085]"><span>{t("Total sewa", "Rental total")}</span><span className="font-medium text-[#132033]">{formatRupiah(booking.totalAmount)}</span></div><div className="flex justify-between gap-4 border-t border-[#E0E6F0] pt-4 text-base font-semibold text-[#132033]"><span>{t("DP dibayar", "Deposit due")}</span><span className="text-[#0E3FA8]">{formatRupiah(payment?.amount ?? booking.dpAmount)}</span></div><div className="flex justify-between gap-4 text-[#667085]"><span>{t("Sisa pelunasan", "Remaining balance")}</span><span>{formatRupiah(booking.remainder)}</span></div></div><MidtransPayButton bookingCode={booking.code} label={t("Bayar DP dengan Midtrans", "Pay deposit with Midtrans")} /><Link href="/profile" className="mt-4 block text-center text-sm font-semibold text-[#0E3FA8]">{t("Lihat pesanan saya", "View my bookings")}</Link></aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}