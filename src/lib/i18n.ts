import "server-only";

import { cookies } from "next/headers";

export const LOCALE_COOKIE = "rentgo_locale";
export type Locale = "id" | "en";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : "id";
}

export function pick<T>(locale: Locale, values: { id: T; en: T }): T {
  return values[locale];
}