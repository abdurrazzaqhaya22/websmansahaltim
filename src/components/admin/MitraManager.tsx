"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Trash2, Loader2, Plus, Handshake } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Mitra } from "@/types/database";

interface MitraManagerProps {
  initialItems: Mitra[];
}

export function MitraManager({ initialItems }: MitraManagerProps) {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setLogoUrl("");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nama.trim()) {
      setErrorMsg("Nama mitra wajib diisi.");
      return;
    }

    if (!selectedFile && !logoUrl.trim()) {
      setErrorMsg("Pilih file logo atau masukkan URL gambar logo.");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();

    try {
      let finalLogoUrl = logoUrl;

      // Upload file to Supabase Storage bucket 'school-assets' under 'mitra/'
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `mitra-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `mitra/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("school-assets")
          .upload(filePath, selectedFile);

        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from("school-assets")
          .getPublicUrl(filePath);

        finalLogoUrl = urlData.publicUrl;
      }

      const { error: dbErr } = await supabase.from("mitra").insert([
        {
          nama: nama.trim(),
          logo_url: finalLogoUrl,
        },
      ]);

      if (dbErr) throw dbErr;

      setSuccessMsg("Mitra kerjasama berhasil ditambahkan!");
      setNama("");
      setLogoUrl("");
      setSelectedFile(null);
      setPreviewUrl("");
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg("Gagal menambahkan mitra: " + (error?.message || "Terjadi kesalahan"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, namaMitra: string) => {
    const confirm = window.confirm(`Hapus logo mitra "${namaMitra}"?`);
    if (!confirm) return;

    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("mitra").delete().eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      alert("Gagal menghapus mitra: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Form Card */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2DFD5] shadow-2xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F0EEE6]">
          <Plus className="w-4 h-4 text-[#B45309]" />
          <h2 className="text-sm font-bold text-[#122238] uppercase tracking-wide">
            Tambah Logo Mitra Kerjasama Baru
          </h2>
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

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-bold text-[#122238] block">
              Nama Instansi / Perusahaan / Lembaga Mitra *
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Dinas Pendidikan Maluku Utara, PT Antam Tbk, dll"
              className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
            />
          </div>

          {/* Logo Source Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#122238] block">
                Pilih Berkas Logo (Format PNG/SVG Transparan Disarankan)
              </label>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FAF9F5] border border-[#D5D2C8] hover:bg-[#EAE8E0] rounded-lg text-xs font-semibold text-[#122238] cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#B45309]" />
                  <span>Pilih Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-gray-500">
                  {selectedFile ? selectedFile.name : "Belum ada file dipilih"}
                </span>
              </div>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                  setSelectedFile(null);
                }}
                placeholder="Atau tempel URL gambar logo langsung..."
                className="w-full px-3 py-2 text-xs bg-white border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238]"
              />
            </div>

            {previewUrl && (
              <div className="relative h-24 w-44 rounded-lg overflow-hidden border border-[#D5D2C8] bg-slate-50 p-2 flex items-center justify-center mx-auto md:mx-0">
                <div className="relative w-full h-full">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#122238] hover:bg-[#1A3356] text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Logo...</span>
                </>
              ) : (
                <span>Simpan Logo Mitra</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Grid of Existing Partners */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Handshake className="w-5 h-5 text-[#B45309]" />
          <h3 className="font-editorial text-lg font-bold text-[#122238]">
            Daftar Mitra Terdaftar ({initialItems.length})
          </h3>
        </div>

        {initialItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 italic bg-white rounded-xl border border-[#E2DFD5]">
            Belum ada logo mitra yang ditambahkan. Gunakan formulir di atas untuk mengunggah logo mitra.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {initialItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl border border-[#E2DFD5] shadow-2xs hover:border-[#122238] transition-all flex flex-col justify-between items-center text-center group"
              >
                <div className="relative w-full h-20 mb-3 bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-center justify-center">
                  <Image
                    src={item.logo_url}
                    alt={item.nama}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="w-full space-y-2">
                  <h4 className="text-xs font-bold text-[#122238] line-clamp-1" title={item.nama}>
                    {item.nama}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    {formatDate(item.created_at)}
                  </p>

                  <div className="pt-2 border-t border-[#F0EEE6] flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.nama)}
                      disabled={deletingId === item.id}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 cursor-pointer text-xs flex items-center gap-1 font-semibold"
                      title="Hapus mitra"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
