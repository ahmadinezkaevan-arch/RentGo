import { AdminShell } from "@/components/admin-shell";
import { deleteVehicle, updateVehicle } from "@/app/admin/actions";
import { CreateVehicleDialog } from "./create-vehicle-dialog";
import { prisma } from "@/lib/db";

const statusLabels = { AVAILABLE: "Tersedia", RENTED: "Disewa", MAINTENANCE: "Perawatan", INACTIVE: "Nonaktif" };
const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const errors: Record<string, string> = {
  "invalid-vehicle": "Data kendaraan belum lengkap atau tidak valid.",
  "duplicate-vehicle": "Slug kendaraan sudah digunakan.",
  "vehicle-in-use": "Kendaraan memiliki booking dan tidak dapat dihapus.",
};

export default async function AdminVehiclesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, categories, vehicles] = await Promise.all([
    searchParams,
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.vehicle.findMany({
      include: { category: true, _count: { select: { bookings: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AdminShell active="/admin/kendaraan">
      <section className="flex flex-col gap-4 border-b border-[#E1E6EC] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#245FD4]">Operasional</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Kendaraan</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#59687B]">Tambah unit, ubah harga, dan atur ketersediaan armada. Semua perubahan tersimpan langsung ke database.</p>
        </div>
        {categories.length ? <CreateVehicleDialog categories={categories} /> : null}
      </section>

      {error && errors[error] ? <p role="alert" className="mt-5 rounded-lg bg-[#FDE5E7] px-4 py-3 text-sm font-medium text-[#B42318]">{errors[error]}</p> : null}
      {!categories.length ? <section className="mt-6 rounded-xl border border-[#E1E6EC] bg-white p-5"><p className="font-semibold text-[#17263B]">Kategori belum tersedia</p><p className="mt-1 text-sm text-[#66758A]">Buat kategori terlebih dahulu sebelum menambah kendaraan.</p></section> : null}

      <section className="mt-6 overflow-hidden rounded-xl border border-[#E1E6EC] bg-white">
        <div className="flex items-center justify-between border-b border-[#EDF0F3] px-5 py-4">
          <div><h2 className="font-bold">Armada</h2><p className="mt-1 text-xs text-[#66758A]">{vehicles.length} kendaraan tersimpan di database.</p></div>
        </div>
        {vehicles.length ? <div className="overflow-x-auto"><table className="min-w-full text-left text-sm">
          <thead className="bg-[#F8FAFC] text-xs text-[#526177]"><tr><th className="px-5 py-3">Kendaraan</th><th className="px-5 py-3">Kategori</th><th className="px-5 py-3">Harga / hari</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Booking</th><th className="px-5 py-3">Aksi</th></tr></thead>
          <tbody className="divide-y divide-[#EDF0F3]">{vehicles.map((vehicle) => <tr key={vehicle.id}>
            <td className="px-5 py-4"><p className="font-semibold text-[#17263B]">{vehicle.name}</p><p className="text-xs text-[#66758A]">{vehicle.year} · {vehicle.seats} kursi · {vehicle.transmission}</p></td>
            <td className="px-5 py-4 text-[#526177]">{vehicle.category.name}</td>
            <td className="px-5 py-4 font-medium">{rupiah.format(vehicle.dailyRate)}</td>
            <td className="px-5 py-4"><form action={updateVehicle} className="flex min-w-72 gap-2"><input type="hidden" name="id" value={vehicle.id} /><select name="status" defaultValue={vehicle.status} className="rounded border border-[#DDE5EB] px-2 py-1 text-xs">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><input name="dailyRate" type="number" min="1" defaultValue={vehicle.dailyRate} className="w-28 rounded border border-[#DDE5EB] px-2 py-1 text-xs" /><button type="submit" className="text-xs font-semibold text-[#245FD4]">Simpan</button></form></td>
            <td className="px-5 py-4 text-[#526177]">{vehicle._count.bookings}</td>
            <td className="px-5 py-4"><form action={deleteVehicle}><input type="hidden" name="id" value={vehicle.id} /><button type="submit" disabled={vehicle._count.bookings > 0} className="text-xs font-semibold text-[#C23B4A] disabled:text-[#AEB8C8]">Hapus</button></form></td>
          </tr>)}</tbody>
        </table></div> : <div className="px-5 py-12 text-center"><p className="font-semibold text-[#17263B]">Belum ada kendaraan</p><p className="mt-1 text-sm text-[#66758A]">Gunakan tombol Tambah Kendaraan untuk menambahkan armada pertama.</p></div>}
      </section>
    </AdminShell>
  );
}
