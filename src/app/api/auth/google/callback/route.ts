import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

const OAUTH_COOKIE = "rentgo_google_oauth";
type OAuthCookie = { state: string; verifier: string; from: "login" | "register" };
type GoogleProfile = { email?: string; email_verified?: boolean; name?: string };

function redirectWithError(request: NextRequest, from: "login" | "register", error: string) {
  const response = NextResponse.redirect(new URL(`/${from}?error=${error}`, request.url));
  response.cookies.delete(OAUTH_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const rawCookie = request.cookies.get(OAUTH_COOKIE)?.value;
  let oauth: OAuthCookie | null = null;
  try { oauth = rawCookie ? JSON.parse(Buffer.from(rawCookie, "base64url").toString("utf8")) as OAuthCookie : null; } catch { oauth = null; }
  const from = oauth?.from === "register" ? "register" : "login";
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  if (request.nextUrl.searchParams.get("error")) return redirectWithError(request, from, "google-cancelled");
  if (!oauth || !state || state !== oauth.state || !code) return redirectWithError(request, from, "google-invalid-state");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) return redirectWithError(request, from, "google-not-configured");

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code", code_verifier: oauth.verifier }), cache: "no-store" });
    const token = await tokenResponse.json() as { access_token?: string };
    if (!tokenResponse.ok || !token.access_token) return redirectWithError(request, from, "google-failed");

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${token.access_token}` }, cache: "no-store" });
    const profile = await profileResponse.json() as GoogleProfile;
    const email = profile.email?.trim().toLowerCase();
    if (!profileResponse.ok || !email || profile.email_verified !== true) return redirectWithError(request, from, "google-email-not-verified");

    let user = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true, isActive: true } });
    if (!user) user = await prisma.user.create({ data: { email, name: profile.name?.trim() || email.split("@")[0], passwordHash: await hashPassword(randomBytes(32).toString("base64url")) }, select: { id: true, role: true, isActive: true } });
    if (!user.isActive) return redirectWithError(request, from, "google-account-inactive");

    await createSession(user.id);
    const response = NextResponse.redirect(new URL(user.role === "ADMIN" ? "/admin" : "/profile", request.url));
    response.cookies.delete(OAUTH_COOKIE);
    return response;
  } catch {
    return redirectWithError(request, from, "google-failed");
  }
}