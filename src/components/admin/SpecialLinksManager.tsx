"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, ExternalLink, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DynamicIcon } from "@/components/DynamicIcon";
import type { SpecialLink } from "@/types/database";

interface SpecialLinksManagerProps {
  initialLinks: SpecialLink[];
}

const AVAILABLE_ICONS = [
  "BookOpen",
  "Database",
  "Library",
  "ExternalLink",
  "Globe",
  "FileText",
  "Award",
  "GraduationCap",
  "Laptop",
  "Sparkles",
  "ShieldCheck",
  "Mail",
  "Calendar",
];

export function SpecialLinksManager({ initialLinks }: SpecialLinksManagerProps) {
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [namaLink, setNamaLink] = useState("");
  const [urlTujuan, setUrlTujuan] = useState("");
  const [icon, setIcon] = useState("ExternalLink");
  const [urutan, setUrutan] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setNamaLink("");
    setUrlTujuan("");
    setIcon("ExternalLink");
    setUrutan(initialLinks.length + 1);
    setIsActive(true);
    setErrorMsg("");
  };

  const handleEditClick = (link: SpecialLink) => {
    setEditingId(link.id);
    setNamaLink(link.nama_link);
    setUrlTujuan(link.url_tujuan);
    setIcon(link.icon || "ExternalLink");
    setUrutan(link.urutan || 1);
    setIsActive(link.is_active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!namaLink.trim() || !urlTujuan.trim()) {
      setErrorMsg("Nama link dan URL tujuan wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const payload = {
        nama_link: namaLink,
        url_tujuan: urlTujuan,
        icon,
        urutan: Number(urutan) || 0,
        is_active: isActive,
      };

      if (editingId) {
        const { error } = await supabase
          .from("special_links")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setSuccessMsg("Tautan khusus berhasil diperbarui!");
      } else {
        const { error } = await supabase.from("special_links").insert([payload]);
        if (error) throw error;
        setSuccessMsg("Tautan khusus baru berhasil ditambahkan!");
      }

      resetForm();
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg("Gagal menyimpan tautan: " + (error?.message || "Error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    const confirmed = window.confirm(`Hapus tautan "${nama}"?`);
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("special_links").delete().eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      alert("Gagal menghapus tautan: " + error.message);
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
              {editingId ? "Sunting Tautan Khusus" : "Tambah Tautan Khusus Baru"}
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
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5 space-y-1.5">
              <label className="text-xs font-bold text-[#122238] block">
                Nama Tautan / Label Menu *
              </label>
              <input
                type="text"
                required
                value={namaLink}
                onChange={(e) => setNamaLink(e.target.value)}
                placeholder="Contoh: E-Rapor Kurikulum Merdeka"
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-7 space-y-1.5">
              <label className="text-xs font-bold text-[#122238] block">
                URL Tujuan Eksternal *
              </label>
              <input
                type="url"
                required
                value={urlTujuan}
                onChange={(e) => setUrlTujuan(e.target.value)}
                placeholder="https://erapor.kemdikbud.go.id"
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-[#122238] block">
                Pilih Ikon Lucide
              </label>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#FAF9F5] border border-[#D5D2C8] rounded-md text-[#B45309]">
                  <DynamicIcon name={icon} className="w-4 h-4" />
                </span>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-[#122238] block">
                Urutan Tampil
              </label>
              <input
                type="number"
                value={urutan}
                onChange={(e) => setUrutan(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-5 flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#122238] rounded border-[#D5D2C8]"
              />
              <label htmlFor="isActive" className="text-xs font-semibold text-[#122238] cursor-pointer">
                Tampilkan di Tombol &ldquo;Special Links&rdquo; Navbar
              </label>
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
                <span>{editingId ? "Perbarui Tautan" : "Simpan Tautan Khusus"}</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-xl border border-[#E2DFD5] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E2DFD5]">
          <h3 className="font-editorial text-base font-bold text-[#122238]">
            Daftar Special Links ({initialLinks.length})
          </h3>
        </div>

        {initialLinks.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 italic">
            Belum ada tautan khusus yang ditambahkan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-[#E2DFD5] text-[#5C6778] font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Urutan</th>
                  <th className="py-3 px-4">Ikon</th>
                  <th className="py-3 px-4">Nama Tautan</th>
                  <th className="py-3 px-4">URL Tujuan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEE6]">
                {initialLinks.map((lk) => (
                  <tr key={lk.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-[#6B7280]">
                      {lk.urutan}
                    </td>
                    <td className="py-3 px-4 text-[#B45309]">
                      <DynamicIcon name={lk.icon} className="w-4 h-4" />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#122238]">
                      {lk.nama_link}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      <a
                        href={lk.url_tujuan}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <span className="truncate max-w-xs">{lk.url_tujuan}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          lk.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {lk.is_active ? "Aktif" : "Non-aktif"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(lk)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Sunting Tautan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(lk.id, lk.nama_link)}
                          disabled={deletingId === lk.id}
                          className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                          title="Hapus Tautan"
                        >
                          {deletingId === lk.id ? (
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

