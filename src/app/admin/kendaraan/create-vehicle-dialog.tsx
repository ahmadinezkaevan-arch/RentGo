"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createVehicle } from "@/app/admin/actions";

type CategoryOption = { id: string; name: string };

export function CreateVehicleDialog({ categories }: { categories: CategoryOption[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function submit(formData: FormData) {
    startTransition(async () => {
      await createVehicle(formData);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 items-center rounded-lg bg-[#245FD4] px-4 text-sm font-semibold text-white">
        Tambah Kendaraan
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-[#17263B]/35 p-4 sm:place-items-center" role="presentation">
          <div role="dialog" aria-modal="true" aria-labelledby="create-vehicle-title" className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E1E6EC] px-5 py-4 sm:px-6">
              <div>
                <h2 id="create-vehicle-title" className="text-lg font-bold text-[#17263B]">Tambah kendaraan</h2>
                <p className="mt-1 text-sm text-[#66758A]">Data yang disimpan akan langsung muncul di armada.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-xl text-[#526177] hover:bg-[#F2F5F9]" aria-label="Tutup form">×</button>
            </div>

            <form action={submit} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <label className="text-sm font-semibold text-[#34445B]">Nama kendaraan
                <input name="name" required placeholder="Contoh: Toyota Rush" className="mt-2 h-10 w-full rounded-lg border border-[#DDE5EB] px-3 text-sm font-normal outline-none focus:border-[#245FD4]" />
              </label>
              <label className="text-sm font-semibold text-[#34445B]">Slug
                <input name="slug" placeholder="Otomatis dari nama" className="mt-2 h-10 w-full rounded-lg border border-[#DDE5EB] px-3 text-sm font-normal outline-none focus:border-[#245FD4]" />
              </label>
              <label className="text-sm font-semibold text-[#34445B]">Kategori
                <select name="categoryId" required defaultValue="" className="mt-2 h-10 w-full rounded-lg border border-[#DDE5EB] bg-white px-3 text-sm font-normal outline-none focus:border-[#245FD4]">
                  <option value="" disabled>Pilih kategori</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <label className="text-sm font-semibold text-[#34445B]">Tahun
                <input name="year" required type="number" min="1900" max="2100" placeholder="2024" className="mt-2 h-10 w-full rounded-lg border border-[#DDE5EB] px-3 text-sm font-normal outline-none focus:border-[#245FD4]" />
              </label>
              <label className="text-sm font-semibold text-[#34445B]">Kapasitas kursi
                <input name="seats" required type="number" min="1" placeholder="7" className="mt-2 h-10 w-full rounded-lg border border-[#DDE5EB] px-3 text-sm font-normal outline-none focus:border-[#245FD4]" />
              </label>
              <label className="text-sm font-semibold text-[#34445B]">Transmisi
                <select name="transmission" defaultValue="Matic" className="mt-2 h-10 w-full rounded-lg border border-[#DDE5EB] bg-white px-3 text-sm font-normal outline-none focus:border-[#245FD4]"><option>Matic</option><option>Manual</option></select>
              </label>
              <label className="text-sm font-semibold text-[#34445B]">Harga per hari
                <input name="dailyRate" required type="number" min="1" placeholder="350000" className="mt-2 h-10 w-full rounded-lg border border-[#DDE5EB] px-3 text-sm font-normal outline-none focus:border-[#245FD4]" />
              </label>
              <label className="text-sm font-semibold text-[#34445B]">Status awal
                <select name="status" defaultValue="AVAILABLE" className="mt-2 h-10 w-full rounded-lg border border-[#DDE5EB] bg-white px-3 text-sm font-normal outline-none focus:border-[#245FD4]"><option value="AVAILABLE">Tersedia</option><option value="RENTED">Disewa</option><option value="MAINTENANCE">Perawatan</option><option value="INACTIVE">Nonaktif</option></select>
              </label>
              <label className="text-sm font-semibold text-[#34445B] sm:col-span-2">Path gambar (opsional)
                <input name="imageUrl" placeholder="/referensi/nama-gambar.jpg" className="mt-2 h-10 w-full rounded-lg border border-[#DDE5EB] px-3 text-sm font-normal outline-none focus:border-[#245FD4]" />
              </label>
              <div className="flex flex-col-reverse gap-2 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setOpen(false)} disabled={pending} className="h-10 rounded-lg border border-[#DDE5EB] px-4 text-sm font-semibold text-[#526177] disabled:opacity-50">Batal</button>
                <button type="submit" disabled={pending} className="h-10 rounded-lg bg-[#245FD4] px-4 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Menyimpan..." : "Simpan kendaraan"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
