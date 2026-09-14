export type VehicleDetail = {
  slug: string;
  name: string;
  displayName: string;
  year: string;
  yearLabel: string;
  category: string;
  fuel: string;
  baggage: string;
  price: string;
  dailyRate: number;
  seats: string;
  transmission: string;
  status: "Tersedia" | "Disewa";
  available: boolean;
  imagePosition: string;
  galleryPositions: string[];
  description: string;
  features: string[];
};

export const vehicleCatalog: VehicleDetail[] = [
  {
    slug: "toyota-avanza",
    name: "Toyota Avanza",
    displayName: "Toyota Avanza 2023",
    year: "2023",
    yearLabel: "Tahun 2023",
    category: "MPV Keluarga",
    fuel: "Bensin",
    baggage: "2 Koper Besar",
    price: "Rp 500k",
    dailyRate: 500000,
    seats: "7 Kursi",
    transmission: "Matic",
    status: "Tersedia",
    available: true,
    imagePosition: "63% 59%",
    galleryPositions: ["61% 58%", "40% 61%", "74% 61%"],
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
    displayName: "Honda Brio 2022",
    year: "2022",
    yearLabel: "Tahun 2022",
    category: "City Car",
    fuel: "Bensin",
    baggage: "1 Koper Sedang",
    price: "Rp 350k",
    dailyRate: 350000,
    seats: "4 Kursi",
    transmission: "Matic",
    status: "Tersedia",
    available: true,
    imagePosition: "47% 61%",
    galleryPositions: ["47% 61%", "34% 62%", "69% 62%"],
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
    displayName: "Honda Vario 160 2023",
    year: "2023",
    yearLabel: "Tahun 2023",
    category: "Motor Matic",
    fuel: "Bensin",
    baggage: "Bagasi Helm",
    price: "Rp 120k",
    dailyRate: 120000,
    seats: "2 Kursi",
    transmission: "Matic",
    status: "Disewa",
    available: false,
    imagePosition: "87% 60%",
    galleryPositions: ["87% 60%", "82% 62%", "90% 61%"],
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
    displayName: "Mitsubishi Xpander 2021",
    year: "2021",
    yearLabel: "Tahun 2021",
    category: "MPV Keluarga",
    fuel: "Bensin",
    baggage: "3 Koper Sedang",
    price: "Rp 500k",
    dailyRate: 500000,
    seats: "7 Kursi",
    transmission: "Manual",
    status: "Tersedia",
    available: true,
    imagePosition: "57% 58%",
    galleryPositions: ["57% 58%", "41% 60%", "72% 61%"],
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

export function getVehicleBySlug(slug: string) {
  return vehicleCatalog.find((vehicle) => vehicle.slug === slug);
}
