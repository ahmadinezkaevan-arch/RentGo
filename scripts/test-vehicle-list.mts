// Read-only integration check. Start Next.js first; optionally set TEST_BASE_URL.
import "dotenv/config";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";

try {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: { not: "INACTIVE" } },
    orderBy: [{ dailyRate: "asc" }, { id: "asc" }],
  });
  const response = await fetch(`${process.env.TEST_BASE_URL ?? "http://localhost:3100"}/kendaraan`);
  assert.equal(response.status, 200);
  const html = await response.text();
  const cards = [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map((match) => match[1]);
  assert.equal(cards.length, vehicles.length, "Exactly one card per public database vehicle");
  for (const [index, vehicle] of vehicles.entries()) {
    const card = cards[index];
    assert.ok(card.includes(vehicle.name), `Database order/name: ${vehicle.slug}`);
    assert.ok(card.includes(new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(vehicle.dailyRate)), `Database price: ${vehicle.slug}`);
    if (vehicle.status === "AVAILABLE") {
      assert.ok(card.includes(`/kendaraan/${vehicle.slug}`), `Detail link: ${vehicle.slug}`);
    } else {
      assert.match(card, /disabled/, `Unavailable vehicle: ${vehicle.slug}`);
    }
  }
  console.log(`PASS: HTTP 200; ${cards.length} cards match Supabase names, prices, order and availability.`);
} finally {
  await prisma.$disconnect();
}
