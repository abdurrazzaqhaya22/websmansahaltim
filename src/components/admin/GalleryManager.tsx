"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Trash2, Loader2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { GalleryItem } from "@/types/database";

interface GalleryManagerProps {
  initialItems: GalleryItem[];
}

export function GalleryManager({ initialItems }: GalleryManagerProps) {
  const router = useRouter();

  const [judulFoto, setJudulFoto] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
      setImageUrl("");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!judulFoto.trim()) {
      setErrorMsg("Judul foto wajib diisi.");
      return;
    }

    if (!selectedFile && !imageUrl.trim()) {
      setErrorMsg("Pilih file gambar untuk diupload atau tempel URL gambar.");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();

    try {
      let finalImageUrl = imageUrl;

      // If file chosen, upload to Supabase Storage bucket 'school-assets'
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("school-assets")
          .upload(filePath, selectedFile);

        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from("school-assets")
          .getPublicUrl(filePath);

        finalImageUrl = urlData.publicUrl;
      }

      // Insert record to database
      const { error: dbErr } = await supabase.from("gallery").insert([
        {
          judul_foto: judulFoto,
          deskripsi: deskripsi || null,
          image_url: finalImageUrl,
        },
      ]);

      if (dbErr) throw dbErr;

      setSuccessMsg("Foto berhasil ditambahkan ke galeri!");
      setJudulFoto("");
      setDeskripsi("");
      setImageUrl("");
      setSelectedFile(null);
      setPreviewUrl("");
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg("Gagal mengunggah foto: " + (error?.message || "Error"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, judul: string) => {
    const confirm = window.confirm(`Hapus foto "${judul}" dari galeri?`);
    if (!confirm) return;

    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      alert("Gagal menghapus foto: " + error.message);
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
            Unggah Foto Baru ke Supabase Storage
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#122238] block">
                Judul Foto / Acara *
              </label>
              <input
                type="text"
                required
                value={judulFoto}
                onChange={(e) => setJudulFoto(e.target.value)}
                placeholder="Contoh: Upacara Hari Kemerdekaan RI Ke-81"
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#122238] block">
                Deskripsi Singkat (Opsional)
              </label>
              <input
                type="text"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Keterangan singkat momen yang difoto..."
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
              />
            </div>
          </div>

          {/* Image Source Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#122238] block">
                Pilih File Gambar (Disimpan ke Storage Bucket)
              </label>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FAF9F5] border border-[#D5D2C8] hover:bg-[#EAE8E0] rounded-lg text-xs font-semibold text-[#122238] cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#B45309]" />
                  <span>Pilih Berkas Foto</span>
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
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                  setSelectedFile(null);
                }}
                placeholder="Atau masukkan tautan gambar langsung (URL)..."
                className="w-full px-3 py-2 text-xs bg-white border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238]"
              />
            </div>

            {previewUrl && (
              <div className="relative h-28 w-44 rounded-lg overflow-hidden border border-[#D5D2C8] bg-gray-50 mx-auto md:mx-0">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
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
                  <span>Mengunggah ke Storage...</span>
                </>
              ) : (
                <span>Simpan Foto ke Galeri</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Grid of Existing Photos */}
      <div className="space-y-4">
        <h3 className="font-editorial text-lg font-bold text-[#122238]">
          Daftar Koleksi Foto ({initialItems.length})
        </h3>

        {initialItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 italic bg-white rounded-xl border border-[#E2DFD5]">
            Belum ada foto yang diunggah ke galeri.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {initialItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden border border-[#E2DFD5] shadow-2xs hover:border-[#122238] transition-all flex flex-col justify-between group"
              >
                <div className="relative w-full h-44 bg-gray-100">
                  <Image
                    src={item.image_url}
                    alt={item.judul_foto}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-editorial text-sm font-bold text-[#122238] line-clamp-1">
                      {item.judul_foto}
                    </h4>
                    {item.deskripsi && (
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {item.deskripsi}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#F0EEE6] flex items-center justify-between text-[11px] text-gray-400">
                    <span>{formatDate(item.created_at)}</span>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.judul_foto)}
                      disabled={deletingId === item.id}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 cursor-pointer"
                      title="Hapus foto"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
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

