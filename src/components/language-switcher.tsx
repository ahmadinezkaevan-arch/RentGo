import { setLanguage } from "@/app/language/actions";
import type { Locale } from "@/lib/i18n";

function Flag({ locale }: { locale: Locale }) {
  if (locale === "id") {
    return <svg viewBox="0 0 24 16" className="h-3.5 w-5 overflow-hidden rounded-[1px] shadow-sm" aria-hidden="true"><path fill="#E62335" d="M0 0h24v8H0z" /><path fill="#fff" d="M0 8h24v8H0z" /></svg>;
  }

  return <svg viewBox="0 0 24 16" className="h-3.5 w-5 overflow-hidden rounded-[1px] shadow-sm" aria-hidden="true"><rect width="24" height="16" fill="#1D428A" /><path d="M0 0 24 16M24 0 0 16" stroke="#fff" strokeWidth="3.8" /><path d="M0 0 24 16M24 0 0 16" stroke="#C8102E" strokeWidth="1.7" /><path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5.5" /><path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="2.8" /></svg>;
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const label = locale === "id" ? "ID" : "EN";
  const changeLabel = locale === "id" ? "Ubah bahasa" : "Change language";

  return (
    <details className="group relative" aria-label={changeLabel}>
      <summary className="flex h-8 cursor-pointer list-none items-center gap-1.5 rounded-md px-1.5 text-[11px] font-semibold tracking-[0.14em] text-[#25324A] transition-colors hover:bg-[#F4F7FB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3FA8] [&::-webkit-details-marker]:hidden">
        <Flag locale={locale} />
        <span>{label}</span>
        <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current transition-transform group-open:rotate-180" aria-hidden="true"><path d="m3 5 5 6 5-6H3Z" /></svg>
      </summary>
      <form action={setLanguage} className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-md border border-[#D9E1EC] bg-white p-1 shadow-[0_10px_26px_rgba(24,45,78,0.16)]">
        {(["id", "en"] as const).map((value) => (
          <button key={value} type="submit" name="locale" value={value} aria-current={locale === value ? "true" : undefined} className={`flex h-9 w-full items-center gap-2 rounded-[4px] px-2.5 text-left text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0E3FA8] ${locale === value ? "bg-[#EEF4FF] text-[#0E3FA8]" : "text-[#344054] hover:bg-[#F5F7FA]"}`}>
            <Flag locale={value} />
            {value === "id" ? "Indonesia" : "English"}
          </button>
        ))}
      </form>
    </details>
  );
}