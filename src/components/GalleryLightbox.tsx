"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { X, ZoomIn, Images } from "lucide-react";
import type { GalleryItem } from "@/types/database";

interface GalleryLightboxProps {
  items: GalleryItem[];
}

export function GalleryLightbox({ items }: GalleryLightboxProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string>("Semua");

  // Extract unique album names
  const albums = useMemo(() => {
    const list = items
      .map((i) => i.album_name?.trim() || "Umum")
      .filter(Boolean);
    const unique = Array.from(new Set(list));
    return ["Semua", ...unique];
  }, [items]);

  // Filter items by active album
  const filteredItems = useMemo(() => {
    if (selectedAlbum === "Semua") return items;
    return items.filter(
      (item) => (item.album_name?.trim() || "Umum") === selectedAlbum
    );
  }, [items, selectedAlbum]);

  if (!items || items.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-slate-400 italic bg-white rounded-3xl border border-slate-200">
        Belum ada dokumentasi galeri yang diunggah.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Album Filter Tabs (Pill Buttons Coda Style) */}
      {albums.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-50 border border-slate-200/80">
            {albums.map((album) => {
              const isActive = selectedAlbum === album;
              const count =
                album === "Semua"
                  ? items.length
                  : items.filter(
                      (i) => (i.album_name?.trim() || "Umum") === album
                    ).length;

              return (
                <button
                  key={album}
                  type="button"
                  onClick={() => setSelectedAlbum(album)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  <Images className="w-3.5 h-3.5" />
                  <span>{album}</span>
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? "bg-slate-800 text-slate-200"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Precision Grid: aspect-square, consistent rounded-2xl, gap-6, no heavy shadows */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400 italic bg-slate-50/50 rounded-2xl border border-slate-200">
          Tidak ada foto dalam album &quot;{selectedAlbum}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-slate-200 bg-slate-100 hover:border-slate-400 hover:-translate-y-1 transition-all duration-300"
            >
              <Image
                src={item.image_url}
                alt={item.judul_foto}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
              />
              
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

              {/* Album badge on top left */}
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-wider uppercase border border-white/20">
                  {item.album_name || "Umum"}
                </span>
              </div>

              {/* Hover Indicator */}
              <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <h4 className="text-sm sm:text-base font-bold leading-snug">
                  {item.judul_foto}
                </h4>
                {item.deskripsi && (
                  <p className="text-xs text-slate-300 line-clamp-1 mt-1 font-normal">
                    {item.deskripsi}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2.5 bg-black/60 text-white rounded-full hover:bg-black/90 transition-colors cursor-pointer"
              aria-label="Tutup preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full h-[55vh] sm:h-[65vh] bg-black">
              <Image
                src={selectedItem.image_url}
                alt={selectedItem.judul_foto}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-6 text-white border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-block px-2.5 py-0.5 mb-1.5 bg-slate-800 rounded-full text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                  Album: {selectedItem.album_name || "Umum"}
                </div>
                <h3 className="text-lg font-bold">
                  {selectedItem.judul_foto}
                </h3>
                {selectedItem.deskripsi && (
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {selectedItem.deskripsi}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
