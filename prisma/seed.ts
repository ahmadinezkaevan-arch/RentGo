// Seed database RentGo dari katalog kendaraan yang ada di src/lib/vehicles.ts.
// Jalankan: npx prisma db seed  (config: prisma.config.ts → migrations.seed)
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createHash } from "node:crypto";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

// hash placeholder utk seed (produksi pakai bcrypt/argon2 — lihat catatan)
const demoHash = createHash("sha256").update("password-demo").digest("hex");

async function main() {
  // Admin + 1 customer demo
  const admin = await prisma.user.upsert({
    where: { email: "admin@rentgo.id" },
    update: {},
    create: {
      email: "admin@rentgo.id",
      name: "Admin RentGo",
      passwordHash: demoHash,
      role: "ADMIN",
    },
  });
  const customer = await prisma.user.upsert({
    where: { email: "budi@example.com" },
    update: {},
    create: {
      email: "budi@example.com",
      name: "Budi Siswa",
      passwordHash: demoHash,
      role: "CUSTOMER",
      phone: "081234567890",
      address: "Jakarta",
    },
  });

  // Kategori
  const categories = [
    { name: "MPV Keluarga", slug: "mpv-keluarga" },
    { name: "City Car", slug: "city-car" },
    { name: "Motor Matic", slug: "motor-matic" },
  ];
  const cat: Record<string, string> = {};
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    cat[c.name] = row.id;
  }

  // Kendaraan — cermin dari src/lib/vehicles.ts
  const vehicles = [
    {
      slug: "toyota-avanza",
      name: "Toyota Avanza",
      year: 2023,
      category: "MPV Keluarga",
      fuel: "Bensin",
      seats: 7,
      transmission: "Matic",
      baggage: "2 Koper Besar",
      dailyRate: 500000,
      status: "AVAILABLE" as const,
      description:
        "Toyota Avanza 2023 adalah pilihan ideal untuk perjalanan keluarga atau grup bisnis. Kabinnya lega, konsumsi bahan bakar efisien, dan unit dirawat rutin agar perjalanan tetap nyaman dan aman.",
      features: [
        "AC dingin dengan double blower",
        "Sistem audio Bluetooth/USB",
        "Asuransi kendaraan all risk",
        "Perlengkapan P3K dasar",
      ],
    },
    {
      slug: "honda-brio",
      name: "Honda Brio",
      year: 2022,
      category: "City Car",
      fuel: "Bensin",
      seats: 4,
      transmission: "Matic",
      baggage: "1 Koper Sedang",
      dailyRate: 350000,
      status: "AVAILABLE" as const,
      description:
        "Honda Brio cocok untuk mobilitas harian di dalam kota. Ukurannya ringkas, lincah untuk parkir, dan tetap nyaman untuk perjalanan singkat bersama keluarga kecil.",
      features: [
        "AC kabin cepat dingin",
        "Head unit Bluetooth/USB",
        "Sensor parkir belakang",
        "Unit bersih dan siap jalan",
      ],
    },
    {
      slug: "honda-vario-160",
      name: "Honda Vario 160",
      year: 2023,
      category: "Motor Matic",
      fuel: "Bensin",
      seats: 2,
      transmission: "Matic",
      baggage: "Bagasi Helm",
      dailyRate: 120000,
      status: "RENTED" as const,
      description:
        "Honda Vario 160 praktis untuk perjalanan personal dan mobilitas cepat. Motor ini hemat, responsif, dan mudah digunakan untuk aktivitas harian.",
      features: [
        "Bagasi luas",
        "Rem responsif",
        "Konsumsi BBM hemat",
        "Helm standar tersedia",
      ],
    },
    {
      slug: "mitsubishi-xpander",
      name: "Mitsubishi Xpander",
      year: 2021,
      category: "MPV Keluarga",
      fuel: "Bensin",
      seats: 7,
      transmission: "Manual",
      baggage: "3 Koper Sedang",
      dailyRate: 500000,
      status: "AVAILABLE" as const,
      description:
        "Mitsubishi Xpander memberi ruang kabin lapang untuk keluarga dan perjalanan rombongan. Suspensinya nyaman untuk rute perkotaan maupun perjalanan antarkota.",
      features: [
        "AC double blower",
        "Kabin lega",
        "Bagasi fleksibel",
        "Asuransi kendaraan all risk",
      ],
    },
  ];

  for (const v of vehicles) {
    const { category, ...rest } = v;
    await prisma.vehicle.upsert({
      where: { slug: v.slug },
      update: { ...rest, categoryId: cat[category] },
      create: { ...rest, categoryId: cat[category] },
    });
  }

  // 1 booking contoh end-to-end (Avanza 3 hari, diskon 0, DP 50%)
  const avanza = await prisma.vehicle.findUnique({ where: { slug: "toyota-avanza" } });
  if (avanza) {
    const start = new Date("2026-09-20T08:00:00Z");
    const end = new Date("2026-09-23T08:00:00Z");
    const days = 3;
    const total = days * avanza.dailyRate;
    await prisma.booking.upsert({
      where: { code: "RG-2026-0001" },
      update: {},
      create: {
        code: "RG-2026-0001",
        userId: customer.id,
        vehicleId: avanza.id,
        startDate: start,
        endDate: end,
        days,
        dailyRate: avanza.dailyRate,
        totalAmount: total,
        dpAmount: Math.round(total / 2),
        remainder: total - Math.round(total / 2),
        status: "PENDING_PAYMENT",
        payments: {
          create: [
            {
              type: "DP",
              amount: Math.round(total / 2),
              method: "TRANSFER",
              status: "UNPAID",
            },
            {
              type: "REMAINDER",
              amount: total - Math.round(total / 2),
              method: "TRANSFER",
              status: "UNPAID",
            },
          ],
        },
      },
    });
  }

  console.log("Seed selesai:", {
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    vehicles: await prisma.vehicle.count(),
    bookings: await prisma.booking.count(),
    payments: await prisma.payment.count(),
    adminId: admin.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
