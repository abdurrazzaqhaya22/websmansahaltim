import React from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/ArticleCard";
import type { Article } from "@/types/database";

export const metadata = {
  title: "Warta & Pengumuman",
  description: "Kabar berita, prestasi, dan pengumuman resmi SMA Negeri 1 Halmahera Timur.",
};

export const dynamic = "force-dynamic";

interface BeritaPageProps {
  searchParams: Promise<{
    kategori?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const resolvedSearchParams = await searchParams;
  const kategori = resolvedSearchParams.kategori || "semua";
  const searchQuery = resolvedSearchParams.q || "";
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const pageSize = 9;

  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (kategori === "berita" || kategori === "pengumuman") {
    query = query.eq("tipe", kategori);
  }

  if (searchQuery) {
    query = query.ilike("judul", `%${searchQuery}%`);
  }

  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: articlesData, count } = await query.range(from, to);

  const articles = (articlesData as Article[]) || [];
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const tabs = [
    { label: "Semua Publikasi", value: "semua" },
    { label: "Warta Sekolah", value: "berita" },
    { label: "Pengumuman Resmi", value: "pengumuman" },
  ];

  return (
    <div className="bg-white min-h-screen py-16 sm:py-24 selection:bg-slate-900 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="space-y-4 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-semibold">Berita & Pengumuman</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-[0.2em] uppercase">
            FADEL DELA NA MAFIA &bull; WARTA RESMI
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.05]">
            Kabar, Warta & Pengumuman.
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl font-normal leading-relaxed">
            Pusat publikasi informasi kegiatan, pengumuman akademik, dan capaian prestasi civitas akademika SMA Negeri 1 Halmahera Timur.
          </p>
        </div>

        {/* Filter Tabs & Search Bar (Coda Style Pill Controls) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Pill Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full max-w-fit">
            {tabs.map((tab) => {
              const isActive = kategori === tab.value;
              const queryParams = new URLSearchParams();
              if (tab.value !== "semua") queryParams.set("kategori", tab.value);
              if (searchQuery) queryParams.set("q", searchQuery);

              return (
                <Link
                  key={tab.value}
                  href={`/berita${queryParams.toString() ? `?${queryParams.toString()}` : ""}`}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                    isActive
                      ? "bg-white text-slate-900 font-bold border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Search Input (Pill Shaped) */}
          <form method="GET" action="/berita" className="relative w-full sm:w-80">
            {kategori !== "semua" && (
              <input type="hidden" name="kategori" value={kategori} />
            )}
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Cari judul warta..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-xs text-slate-900 border border-slate-200 rounded-full focus:outline-none focus:border-slate-900 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>
        </div>

        {/* Articles Grid (1 col mobile, 3 cols desktop) */}
        {articles.length === 0 ? (
          <div className="py-24 text-center text-sm text-slate-400 italic bg-white rounded-3xl border border-slate-200">
            Tidak ditemukan warta atau pengumuman yang sesuai dengan kriteria pencarian.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Pagination (Clean Coda Pill Buttons) */}
        {totalPages > 1 && (
          <div className="pt-10 border-t border-slate-100 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === currentPage;
              const queryParams = new URLSearchParams();
              if (kategori !== "semua") queryParams.set("kategori", kategori);
              if (searchQuery) queryParams.set("q", searchQuery);
              queryParams.set("page", p.toString());

              return (
                <Link
                  key={p}
                  href={`/berita?${queryParams.toString()}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-semibold transition-all ${
                    isCurrent
                      ? "bg-slate-900 text-white font-bold"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}