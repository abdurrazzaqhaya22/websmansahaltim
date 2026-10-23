import React from "react";
import { createClient } from "@/lib/supabase/server";
import { GalleryManager } from "@/components/admin/GalleryManager";
import type { GalleryItem } from "@/types/database";

export const metadata = {
  title: "Kelola Galeri Foto | Admin SMAN 1 Halmahera Timur",
};

export const revalidate = 0;

export default async function AdminGaleriPage() {
  const supabase = await createClient();

  const { data: galleryData } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  const galleryItems = (galleryData as GalleryItem[]) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#122238]">
          Galeri Dokumentasi & Foto Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Unggah foto kegiatan, prestasi, dan fasilitas sekolah langsung ke Supabase Storage.
        </p>
      </div>

      <GalleryManager initialItems={galleryItems} />
    </div>
  );
}

