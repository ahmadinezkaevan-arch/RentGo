"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function numeric(formData: FormData, key: string, minimum = 0) {
  const value = Number(text(formData, key));
  return Number.isSafeInteger(value) && value >= minimum ? value : null;
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login?error=admin-required");
  return user;
}

function fail(path: string, error: string): never {
  redirect(`${path}?error=${error}`);
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = text(formData, "name");
  const slug = slugify(text(formData, "slug") || name);
  if (name.length < 2 || !slug) fail("/admin/kategori", "invalid-category");
  const exists = await prisma.category.findFirst({ where: { OR: [{ name }, { slug }] } });
  if (exists) fail("/admin/kategori", "duplicate-category");
  await prisma.category.create({ data: { name, slug } });
  revalidatePath("/admin");
  revalidatePath("/admin/kategori");
  revalidatePath("/admin/kendaraan");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const slug = slugify(text(formData, "slug") || name);
  if (!id || name.length < 2 || !slug) fail("/admin/kategori", "invalid-category");
  const conflict = await prisma.category.findFirst({ where: { AND: [{ id: { not: id } }, { OR: [{ name }, { slug }] }] } });
  if (conflict) fail("/admin/kategori", "duplicate-category");
  await prisma.category.update({ where: { id }, data: { name, slug } });
  revalidatePath("/admin");
  revalidatePath("/admin/kategori");
  revalidatePath("/admin/kendaraan");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) fail("/admin/kategori", "invalid-category");
  const category = await prisma.category.findUnique({ where: { id }, select: { _count: { select: { vehicles: true } } } });
  if (!category) fail("/admin/kategori", "invalid-category");
  if (category._count.vehicles > 0) fail("/admin/kategori", "category-in-use");
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/kategori");
}

export async function createVehicle(formData: FormData) {
  await requireAdmin();
  const name = text(formData, "name");
  const categoryId = text(formData, "categoryId");
  const year = numeric(formData, "year", 1900);
  const seats = numeric(formData, "seats", 1);
  const dailyRate = numeric(formData, "dailyRate", 1);
  const transmission = text(formData, "transmission");
  const status = text(formData, "status");
  const imageUrl = text(formData, "imageUrl");
  const slug = slugify(text(formData, "slug") || name);
  if (!name || !categoryId || !year || !seats || !dailyRate || !slug || !["Manual", "Matic"].includes(transmission) || !["AVAILABLE", "RENTED", "MAINTENANCE", "INACTIVE"].includes(status)) fail("/admin/kendaraan", "invalid-vehicle");
  const exists = await prisma.vehicle.findUnique({ where: { slug } });
  if (exists) fail("/admin/kendaraan", "duplicate-vehicle");
  await prisma.vehicle.create({ data: { slug, name, year, categoryId, seats, dailyRate, transmission, status: status as "AVAILABLE" | "RENTED" | "MAINTENANCE" | "INACTIVE", features: [], imageUrl: imageUrl || null } });
  revalidatePath("/admin");
  revalidatePath("/admin/kendaraan");
  revalidatePath("/kendaraan");
}

export async function updateVehicle(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const dailyRate = numeric(formData, "dailyRate", 1);
  const status = text(formData, "status");
  if (!id || !dailyRate || !["AVAILABLE", "RENTED", "MAINTENANCE", "INACTIVE"].includes(status)) fail("/admin/kendaraan", "invalid-vehicle");
  await prisma.vehicle.update({ where: { id }, data: { dailyRate, status: status as "AVAILABLE" | "RENTED" | "MAINTENANCE" | "INACTIVE" } });
  revalidatePath("/admin");
  revalidatePath("/admin/kendaraan");
  revalidatePath("/kendaraan");
}

export async function deleteVehicle(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) fail("/admin/kendaraan", "invalid-vehicle");
  const vehicle = await prisma.vehicle.findUnique({ where: { id }, select: { _count: { select: { bookings: true } } } });
  if (!vehicle) fail("/admin/kendaraan", "invalid-vehicle");
  if (vehicle._count.bookings > 0) fail("/admin/kendaraan", "vehicle-in-use");
  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/kendaraan");
  revalidatePath("/kendaraan");
}