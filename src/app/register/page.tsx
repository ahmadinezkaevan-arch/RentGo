import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register - RentGo",
  description:
    "Buat akun RentGo dan unggah dokumen KTP serta SIM sebagai persyaratan penyewaan kendaraan.",
};

function Icon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: <path d="M5 4h4l2 5-2 1.5a12 12 0 0 0 5 5L15.5 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    lock: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4 2.8 7.5 7 9 4.2-1.5 7-5 7-9V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
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

function TextField({
  label,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  placeholder: string;
  type?: string;
  icon: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#344054]">{label}</span>
      <span className="mt-1.5 flex items-center gap-2.5 rounded-lg border border-[#C8D0DD] bg-white px-3 py-2 focus-within:border-[#0E3FA8]">
        <Icon name={icon} className="h-4 w-4 shrink-0 text-[#667085]" />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#98A2B3]"
        />
      </span>
    </label>
  );
}

function DocumentUpload({ label, helper }: { label: string; helper: string }) {
  return (
    <label className="block rounded-xl border border-dashed border-[#AFC0D8] bg-[#F7FAFD] p-3">
      <span className="flex items-start gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#0E3FA8] shadow-sm">
          <Icon name="upload" className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-[#132033]">{label}</span>
          <span className="mt-0.5 block text-[11px] leading-4 text-[#667085]">{helper}</span>
        </span>
      </span>
      <input type="file" accept="image/*,.pdf" className="mt-3 block w-full text-xs text-[#526176] file:mr-3 file:rounded-lg file:border-0 file:bg-[#0E3FA8] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white" />
    </label>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FC] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-5xl place-items-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-[#D8E5F6] bg-white shadow-sm lg:grid-cols-[0.9fr_1fr]">
          <div className="relative min-h-60 bg-[#10213D] lg:min-h-[30rem]">
            <Image
              src="/rentgo-hero.png"
              alt="Proses serah terima kendaraan RentGo"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10213D]/90 via-[#10213D]/45 to-transparent" />
            <Link href="/" className="absolute left-5 top-5" aria-label="RentGo beranda">
              <Image src="/referensi/Logo%20RentGo.svg" alt="RentGo" width={174} height={58} className="h-9 w-auto brightness-0 invert" />
            </Link>
            <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-6 sm:left-6 sm:right-6">
              <h1 className="max-w-sm text-2xl font-bold leading-tight sm:text-3xl">
                Siapkan akun dan dokumen sebelum booking.
              </h1>
              <div className="mt-5 rounded-xl bg-white/12 p-4 backdrop-blur">
                <p className="flex items-center gap-2.5 text-xs font-semibold leading-5 text-white">
                  <Icon name="shield" className="h-4 w-4 text-[#75D09B]" />
                  KTP dan SIM akan digunakan untuk proses verifikasi admin.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center p-5 sm:p-6 lg:p-8">
            <div className="w-full">
              <div>
                <p className="text-sm font-semibold text-[#147C4C]">Register RentGo</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#132033]">
                  Buat akun pelanggan
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#526176]">
                  Lengkapi data diri dan unggah dokumen KTP serta SIM agar proses pemesanan dapat diverifikasi.
                </p>
              </div>

              <form className="mt-5 space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <TextField label="Nama lengkap" placeholder="Nama sesuai KTP" icon="user" />
                  <TextField label="Nomor telepon" placeholder="08xxxxxxxxxx" icon="phone" />
                  <TextField label="Email" placeholder="nama@email.com" type="email" icon="mail" />
                  <TextField label="Password" placeholder="Buat password" type="password" icon="lock" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#132033]">Dokumen identitas</h3>
                  <p className="mt-1 text-xs leading-5 text-[#667085]">
                    Dokumen wajib diunggah sebelum admin mengonfirmasi pemesanan kendaraan.
                  </p>
                  <div className="mt-2.5 grid gap-2.5 md:grid-cols-2">
                    <DocumentUpload label="Upload KTP" helper="Foto/scan KTP yang masih berlaku. Format JPG, PNG, atau PDF." />
                    <DocumentUpload label="Upload SIM" helper="Foto/scan SIM aktif sesuai jenis kendaraan yang akan disewa." />
                  </div>
                </div>

                <label className="flex items-start gap-3 text-xs leading-5 text-[#526176]">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#C8D0DD]" />
                  Saya menyatakan data dan dokumen yang diunggah benar serta dapat dipertanggungjawabkan.
                </label>

                <Link href="/profile" className="block w-full rounded-lg bg-[#0E3FA8] px-5 py-3 text-center text-sm font-semibold text-white">
                  Register
                </Link>
              </form>

              <p className="mt-5 text-center text-sm text-[#526176]">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-semibold text-[#0E3FA8]">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

