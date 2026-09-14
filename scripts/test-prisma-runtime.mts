import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const rows = await prisma.vehicle.findMany({ where: { status: "AVAILABLE" }, select: { name: true, dailyRate: true, category: { select: { name: true } } }, orderBy: { dailyRate: "desc" } });
console.log("RUNTIME POOLER (6543) QUERY OK:");
for (const r of rows) console.log(" -", r.name, "|", r.category.name, "| Rp", r.dailyRate.toLocaleString("id-ID"));
await prisma.$disconnect();
