"use server";

import { randomBytes } from "node:crypto";
import { BookingStatus, PaymentMethod, PaymentStatus, PaymentType, VehicleStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

const activeBookingStatuses: BookingStatus[] = [
  BookingStatus.PENDING_PAYMENT,
  BookingStatus.AWAITING_VERIFICATION,
  BookingStatus.CONFIRMED,
  BookingStatus.ACTIVE,
];

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item.trim() : "";
}

function toLocalDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function checkoutError(slug: string, code: string): never {
  redirect(`/checkout/${encodeURIComponent(slug)}?error=${encodeURIComponent(code)}`);
}

function bookingCode() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `RG-${stamp}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function createBooking(formData: FormData) {
  const slug = value(formData, "vehicleSlug");
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/checkout/${slug}`)}`);
  if (!slug) redirect("/kendaraan");

  const startDate = toLocalDate(value(formData, "startDate"));
  const endDate = toLocalDate(value(formData, "endDate"));
  const name = value(formData, "fullName");
  const phone = value(formData, "phone");

  if (!startDate || !endDate || endDate <= startDate || name.length < 2 || phone.length < 8 || formData.get("terms") !== "accepted") {
    checkoutError(slug, "invalid-data");
  }

  const days = Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000);
  if (days < 1 || days > 30) checkoutError(slug, "invalid-duration");

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { slug }, select: { id: true, dailyRate: true, status: true } });
      if (!vehicle || vehicle.status !== VehicleStatus.AVAILABLE) throw new Error("vehicle-unavailable");

      const conflict = await tx.booking.findFirst({
        where: {
          vehicleId: vehicle.id,
          status: { in: activeBookingStatuses },
          startDate: { lt: endDate },
          endDate: { gt: startDate },
        },
        select: { id: true },
      });
      if (conflict) throw new Error("date-unavailable");

      const totalAmount = vehicle.dailyRate * days;
      const dpAmount = Math.ceil(totalAmount / 2);
      const phoneOwner = await tx.user.findFirst({ where: { phone, id: { not: user.id } }, select: { id: true } });
      if (phoneOwner) throw new Error("phone-in-use");
      await tx.user.update({ where: { id: user.id }, data: { name, phone } });
      return tx.booking.create({
        data: {
          code: bookingCode(), userId: user.id, vehicleId: vehicle.id, startDate, endDate, days,
          dailyRate: vehicle.dailyRate, totalAmount, dpAmount, remainder: totalAmount - dpAmount,
          status: BookingStatus.PENDING_PAYMENT,
          payments: { create: { type: PaymentType.DP, amount: dpAmount, method: PaymentMethod.ONLINE_GATEWAY, status: PaymentStatus.UNPAID } },
        },
        select: { code: true },
      });
    }, { isolationLevel: "Serializable" });

    redirect(`/payment/${encodeURIComponent(booking.code)}`);
  } catch (error) {
    if (error instanceof Error && ["vehicle-unavailable", "date-unavailable", "phone-in-use"].includes(error.message)) checkoutError(slug, error.message);
    throw error;
  }
}