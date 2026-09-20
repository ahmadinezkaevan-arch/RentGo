import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale, pick } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: "RentGo - Online Vehicle Rental",
    description: pick(locale, {
      id: "Rental kendaraan online dengan pemesanan, verifikasi dokumen, dan pembayaran yang praktis.",
      en: "Online vehicle rental with convenient booking, document verification, and payment.",
    }),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}