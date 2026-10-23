"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Upload, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { TipTapEditor } from "@/components/TipTapEditor";
import type { Article } from "@/types/database";

interface ArticleFormProps {
  initialData?: Article | null;
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [judul, setJudul] = useState(initialData?.judul || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [tipe, setTipe] = useState<"berita" | "pengumuman">(
    initialData?.tipe || "berita"
  );
  const [ringkasan, setRingkasan] = useState(initialData?.ringkasan || "");
  const [konten, setKonten] = useState(initialData?.konten || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnail_url || ""
  );
  const [isPublished, setIsPublished] = useState(
    initialData ? initialData.is_published : true
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-generate slug when title changes (if not edited manually)
  const handleTitleChange = (val: string) => {
    setJudul(val);
    if (!isEditing || !slug) {
      setSlug(slugify(val));
    }
  };

  // Upload thumbnail to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `article-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("school-assets")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("school-assets")
        .getPublicUrl(filePath);

      setThumbnailUrl(urlData.publicUrl);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg("Gagal mengunggah foto: " + (error?.message || "Error"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!judul.trim()) {
      setErrorMsg("Judul artikel wajib diisi.");
      return;
    }
    if (!konten.trim() || konten === "<p></p>") {
      setErrorMsg("Konten isi artikel wajib ditulis.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const payload = {
        judul,
        slug: slug || slugify(judul),
        tipe,
        ringkasan,
        konten,
        thumbnail_url: thumbnailUrl,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      };

      if (isEditing && initialData) {
        const { error } = await supabase
          .from("articles")
          .update(payload)
          .eq("id", initialData.id);

        if (error) throw error;
        setSuccessMsg("Artikel berhasil diperbarui!");
      } else {
        const { error } = await supabase.from("articles").insert([payload]);
        if (error) throw error;
        setSuccessMsg("Artikel berhasil diterbitkan!");
      }

      setTimeout(() => {
        router.push("/admin/berita");
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg("Gagal menyimpan artikel: " + (error?.message || "Error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2DFD5]">
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#122238] hover:text-[#B45309]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Berita</span>
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#122238] hover:bg-[#1A3356] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <span>{isEditing ? "Simpan Perubahan" : "Terbitkan Artikel"}</span>
          )}
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 bg-green-50 border border-green-200 text-xs text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E2DFD5] shadow-2xs space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#122238] block">
            Judul Warta / Pengumuman *
          </label>
          <input
            type="text"
            required
            value={judul}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Contoh: Pembagian Rapor Semester Ganjil..."
            className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
          />
        </div>

        {/* Slug & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8 space-y-1.5">
            <label className="text-xs font-bold text-[#122238] block">
              Slug URL (Otomatis) *
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-[#FAF9F5] border border-r-0 border-[#D5D2C8] rounded-l-lg text-xs text-gray-500 font-mono">
                /berita/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="pembagian-rapor-semester-ganjil"
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#D5D2C8] rounded-r-lg focus:outline-none focus:border-[#122238]"
              />
            </div>
          </div>

          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-[#122238] block">
              Kategori / Tipe *
            </label>
            <select
              value={tipe}
              onChange={(e) => setTipe(e.target.value as "berita" | "pengumuman")}
              className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
            >
              <option value="berita">Berita Sekolah</option>
              <option value="pengumuman">Pengumuman Resmi</option>
            </select>
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#122238] block">
            Foto Sampul (Thumbnail)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            <div className="sm:col-span-7 space-y-2">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FAF9F5] border border-[#D5D2C8] hover:bg-[#EAE8E0] rounded-lg text-xs font-semibold text-[#122238] cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#B45309]" />
                  <span>{isUploading ? "Mengunggah..." : "Pilih File Foto"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <span className="text-[11px] text-gray-500">
                  Format JPG, PNG, WebP (Maks 5MB)
                </span>
              </div>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="Atau tempel URL gambar eksternal di sini..."
                className="w-full px-3 py-2 text-xs bg-white border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238]"
              />
            </div>

            {thumbnailUrl && (
              <div className="sm:col-span-5 relative h-32 w-full rounded-lg overflow-hidden border border-[#D5D2C8] bg-gray-100">
                <Image
                  src={thumbnailUrl}
                  alt="Preview Thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Excerpt / Ringkasan */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#122238] block">
            Ringkasan Singkat (Lead Paragraph)
          </label>
          <textarea
            rows={2}
            value={ringkasan}
            onChange={(e) => setRingkasan(e.target.value)}
            placeholder="1-2 kalimat ringkasan yang akan muncul di kartu berita..."
            className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#D5D2C8] rounded-lg focus:outline-none focus:border-[#122238] focus:bg-white"
          />
        </div>

        {/* TipTap Rich Text Editor */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#122238] block">
            Isi Lengkap Artikel (Rich Text Editor) *
          </label>
          <TipTapEditor content={konten} onChange={setKonten} />
        </div>

        {/* Publish Checkbox */}
        <div className="pt-3 border-t border-[#F0EEE6] flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 text-[#122238] rounded border-[#D5D2C8] focus:ring-0"
          />
          <label htmlFor="isPublished" className="text-xs font-semibold text-[#122238] cursor-pointer">
            Publikasikan langsung ke website (centang untuk status Terbit)
          </label>
        </div>
      </div>
    </form>
  );
}

