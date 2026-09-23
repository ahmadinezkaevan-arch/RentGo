"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeNextPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : null;
}

function errorRedirect(path: "/login" | "/register", code: string): never {
  redirect(`${path}?error=${code}`);
}

export async function login(formData: FormData) {
  const email = textValue(formData, "email").toLowerCase();
  const password = textValue(formData, "password");
  const nextPath = safeNextPath(textValue(formData, "next"));

  if (!email || !password) errorRedirect("/login", "missing-fields");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
    errorRedirect("/login", "invalid-credentials");
  }

  if (!user.passwordHash.startsWith("scrypt$")) {
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password) } });
  }
  await createSession(user.id);
  redirect(user.role === "ADMIN" ? "/admin" : nextPath ?? "/profile");
}

export async function register(formData: FormData) {
  const name = textValue(formData, "name");
  const email = textValue(formData, "email").toLowerCase();
  const phone = textValue(formData, "phone");
  const password = textValue(formData, "password");
  const nextPath = safeNextPath(textValue(formData, "next"));
  const acceptedTerms = formData.get("terms") === "on";

  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || !acceptedTerms) {
    errorRedirect("/register", "invalid-data");
  }

  const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, ...(phone ? [{ phone }] : [])] } });
  if (existingUser) errorRedirect("/register", "account-exists");

  const user = await prisma.user.create({
    data: { name, email, phone: phone || null, passwordHash: await hashPassword(password) },
    select: { id: true },
  });

  await createSession(user.id);
  redirect("/profile");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}