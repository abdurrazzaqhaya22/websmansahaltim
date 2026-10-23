"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Upload, Loader2, User, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Staff } from "@/types/database";

interface StaffManagerProps {
  initialStaff: Staff[];
}

export function StaffManager({ initialStaff }: StaffManagerProps) {
  const router = useRouter();

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [urutan, setUrutan] = useState<number>(1);
  const [statusAktif, setStatusAktif] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setNama("");
    setJabatan("");
    setFotoUrl("");
    setUrutan(initialStaff.length + 1);
    setStatusAktif(true);
    setErrorMsg("");
  };

  const handleEditClick = (staff: Staff) => {
    setEditingId(staff.id);
    setNama(staff.nama);
    setJabatan(staff.jabatan);
    setFotoUrl(staff.foto_url || "");
    setUrutan(staff.urutan || 1);
    setStatusAktif(staff.status_aktif);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `staff-${Date.now()}.${fileExt}`;
      const filePath = `staff/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("school-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("school-assets")
        .getPublicUrl(filePath);

      setFotoUrl(urlData.publicUrl);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg("Gagal mengunggah foto staf: " + (error?.message || "Error"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nama.trim() || !jabatan.trim()) {
      setErrorMsg("Nama dan Jabatan staf wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const payload = {
        nama,
        jabatan,
        foto_url: fotoUrl,
        urutan: Number(urutan) || 0,
        status_aktif: statusAktif,
      };

      if (editingId) {
        const { error } = await supabase
          .from("staff")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setSuccessMsg("Data staf berhasil diperbarui!");
      } else {
        const { error } = await supabase.from("staff").insert([payload]);
        if (error) throw error;
        setSuccessMsg("Staf baru berhasil ditambahkan!");
      }

      resetForm();
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg("Gagal menyimpan data staf: " + (error?.message || "Error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, namaStaff: string) => {
    const confirmed = window.confirm(`Hapus data staf "${namaStaff}"?`);
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      alert("Gagal menghapus: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Card */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2DFD5] shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EEE6]">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#B45309]" />
            <h2 className="text-sm font-bold text-[#122238] uppercase tracking-wide">
              {editingId ? "Sunting Profil Staf" : "Tambah Guru / Staf Baru"}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Batal Edit</span>
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-xs text-green-700 rounded-lg">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 space-y-1.5">
              <label className="text-xs font-bold text-[#122238] block">
                Nama Lengkap & Gelar *
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Dra. Maryam Abubakar, M.Pd."
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
              />
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-[#122238] block">
                Jabatan / Tugas *
              </label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                placeholder="Contoh: Guru Kimia & Pembina Pramuka"
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#122238] block">
                Nomor Urutan
              </label>
              <input
                type="number"
                value={urutan}
                onChange={(e) => setUrutan(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
              />
            </div>
          </div>

          {/* Photo and Status */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 space-y-2">
              <label className="text-xs font-bold text-[#122238] block">
                Foto Profil Staf
              </label>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FAF9F5] border border-[#D5D2C8] hover:bg-[#EAE8E0] rounded-lg text-xs font-semibold text-[#122238] cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#B45309]" />
                  <span>{isUploading ? "Mengunggah..." : "Pilih Foto"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <span className="text-[11px] text-gray-500">
                  Format JPG/PNG pas foto
                </span>
              </div>
              <input
                type="url"
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                placeholder="Atau tempel URL gambar foto di sini..."
                className="w-full px-3 py-2 text-xs bg-white border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238]"
              />
            </div>

            <div className="md:col-span-4 flex items-center justify-between sm:justify-start gap-4">
              {fotoUrl ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#122238] shadow-xs">
                  <Image
                    src={fotoUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-300">
                  <User className="w-8 h-8" />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="statusAktif"
                  checked={statusAktif}
                  onChange={(e) => setStatusAktif(e.target.checked)}
                  className="w-4 h-4 text-[#122238] rounded border-[#D5D2C8]"
                />
                <label htmlFor="statusAktif" className="text-xs font-semibold text-[#122238] cursor-pointer">
                  Status Aktif
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#122238] hover:bg-[#1A3356] text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{editingId ? "Perbarui Data Staf" : "Simpan Staf"}</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Staff Table / List */}
      <div className="bg-white rounded-xl border border-[#E2DFD5] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E2DFD5]">
          <h3 className="font-editorial text-base font-bold text-[#122238]">
            Daftar Dewan Guru & Staf ({initialStaff.length})
          </h3>
        </div>

        {initialStaff.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 italic">
            Belum ada data staf yang tersimpan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-[#E2DFD5] text-[#5C6778] font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Urutan</th>
                  <th className="py-3 px-4">Foto</th>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Jabatan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEE6]">
                {initialStaff.map((st) => (
                  <tr key={st.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-[#6B7280]">
                      {st.urutan}
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#D5D2C8] bg-gray-100">
                        {st.foto_url ? (
                          <Image
                            src={st.foto_url}
                            alt={st.nama}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#122238]">
                      {st.nama}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {st.jabatan}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          st.status_aktif
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {st.status_aktif ? "Aktif" : "Non-aktif"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(st)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Sunting Staf"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(st.id, st.nama)}
                          disabled={deletingId === st.id}
                          className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                          title="Hapus Staf"
                        >
                          {deletingId === st.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

