import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import type { GalleryItem } from "@/types/database";

export const metadata = {
  title: "Galeri Foto Kegiatan & Kampus",
  description: "Dokumentasi visual kegiatan belajar mengajar dan fasilitas SMA Negeri 1 Halmahera Timur.",
};

export const revalidate = 60;

export default async function GaleriPage() {
  const supabase = await createClient();

  const { data: galleryData } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  const galleryItems = (galleryData as GalleryItem[]) || [];

  return (
    <div className="bg-white min-h-screen py-16 sm:py-24 selection:bg-slate-900 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="space-y-4 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-semibold">Galeri Foto</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-[0.2em] uppercase">
            FADEL DELA NA MAFIA &bull; DOKUMENTASI VISUAL
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.05]">
            Lensa Kampus & Kegiatan.
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl font-normal leading-relaxed">
            Koleksi dokumentasi visual kegiatan belajar mengajar, ekstrakurikuler, seremoni kelulusan, dan fasilitas di SMA Negeri 1 Halmahera Timur.
          </p>
        </div>

        {/* Gallery Grid */}
        <GalleryLightbox items={galleryItems} />

      </div>
    </div>
  );
}