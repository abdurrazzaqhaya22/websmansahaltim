import React from "react";
import Link from "next/link";
import { PlusCircle, Search, Edit3, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";
import type { Article } from "@/types/database";

export const metadata = {
  title: "Kelola Berita & Pengumuman | Admin SMAN 1 Halmahera Timur",
};

export const revalidate = 0;

interface AdminBeritaProps {
  searchParams: Promise<{
    q?: string;
    tipe?: string;
  }>;
}

export default async function AdminBeritaPage({ searchParams }: AdminBeritaProps) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || "";
  const tipe = resolvedSearchParams.tipe || "semua";

  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (tipe === "berita" || tipe === "pengumuman") {
    query = query.eq("tipe", tipe);
  }

  if (q) {
    query = query.ilike("judul", `%${q}%`);
  }

  const { data: articlesData } = await query;
  const articles = (articlesData as Article[]) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E2DFD5] gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#122238]">
            Kelola Warta & Pengumuman
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Publikasikan artikel berita, informasi kegiatan, dan pengumuman resmi sekolah.
          </p>
        </div>

        <Link
          href="/admin/berita/tambah"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#122238] hover:bg-[#1A3356] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tipe filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EAE8E0]/80 rounded-lg">
          <Link
            href="/admin/berita"
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tipe === "semua"
                ? "bg-white text-[#122238] shadow-2xs"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Semua ({articles.length})
          </Link>
          <Link
            href="/admin/berita?tipe=berita"
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tipe === "berita"
                ? "bg-white text-[#122238] shadow-2xs"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Berita
          </Link>
          <Link
            href="/admin/berita?tipe=pengumuman"
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tipe === "pengumuman"
                ? "bg-white text-[#122238] shadow-2xs"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Pengumuman
          </Link>
        </div>

        {/* Search */}
        <form method="GET" action="/admin/berita" className="relative w-full sm:w-72">
          {tipe !== "semua" && <input type="hidden" name="tipe" value={tipe} />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari judul artikel..."
            className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-[#D5D2C8] rounded-md focus:outline-none focus:border-[#122238]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E2DFD5] shadow-2xs overflow-hidden">
        {articles.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 italic">
            Belum ada artikel yang cocok dengan pencarian Anda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-[#E2DFD5] text-[#5C6778] font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Judul Artikel</th>
                  <th className="py-3 px-4">Tipe</th>
                  <th className="py-3 px-4">Tanggal Buat</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEE6]">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#122238]">
                      <div>
                        <span className="font-semibold line-clamp-1 max-w-sm sm:max-w-lg">
                          {art.judul}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          /{art.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          art.tipe === "pengumuman"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {art.tipe}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {formatDate(art.created_at)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                          art.is_published ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      />
                      <span className="text-gray-700">
                        {art.is_published ? "Terbit" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {art.is_published && (
                          <Link
                            href={`/berita/${art.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-500 hover:text-[#122238] rounded hover:bg-[#EAE8E0] transition-colors"
                            title="Lihat Halaman Publik"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/berita/${art.id}`}
                          className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition-colors"
                          title="Sunting Artikel"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <DeleteArticleButton id={art.id} judul={art.judul} />
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

