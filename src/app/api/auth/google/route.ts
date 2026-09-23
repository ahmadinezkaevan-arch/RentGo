import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const OAUTH_COOKIE = "rentgo_google_oauth";

export async function GET(request: NextRequest) {
  const from = request.nextUrl.searchParams.get("from") === "register" ? "register" : "login";
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !redirectUri) return NextResponse.redirect(new URL(`/${from}?error=google-not-configured`, request.url));

  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const authorization = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorization.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", scope: "openid email profile", state, code_challenge: challenge, code_challenge_method: "S256", prompt: "select_account" }).toString();

  const response = NextResponse.redirect(authorization);
  response.cookies.set(OAUTH_COOKIE, Buffer.from(JSON.stringify({ state, verifier, from })).toString("base64url"), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 600 });
  return response;
}