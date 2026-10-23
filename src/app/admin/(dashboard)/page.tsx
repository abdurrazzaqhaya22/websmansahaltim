import React from "react";
import Link from "next/link";
import {
  Newspaper,
  Users,
  Camera,
  Link2,
  PlusCircle,
  ArrowUpRight,
  Settings as SettingsIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types/database";

export const metadata = {
  title: "Dashboard Administrasi | SMAN 1 Halmahera Timur",
};

export const revalidate = 0; // Always fresh for admin

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalArticles },
    { count: totalStaff },
    { count: totalGallery },
    { count: totalLinks },
    { data: recentArticles },
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("staff").select("*", { count: "exact", head: true }),
    supabase.from("gallery").select("*", { count: "exact", head: true }),
    supabase.from("special_links").select("*", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const articles = (recentArticles as Article[]) || [];

  const statCards = [
    {
      title: "Warta & Pengumuman",
      count: totalArticles || 0,
      href: "/admin/berita",
      icon: Newspaper,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Guru & Tenaga Staf",
      count: totalStaff || 0,
      href: "/admin/guru-staf",
      icon: Users,
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "Foto Galeri Kegiatan",
      count: totalGallery || 0,
      href: "/admin/galeri",
      icon: Camera,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Special Links Aktif",
      count: totalLinks || 0,
      href: "/admin/special-links",
      icon: Link2,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E2DFD5] gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#122238]">
            Ringkasan & Statistik Sekolah
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Selamat datang di Pusat Kontrol Website SMA Negeri 1 Halmahera Timur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/berita/tambah"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#122238] hover:bg-[#1C3558] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Berita Baru</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white p-5 rounded-xl border border-[#E2DFD5] shadow-2xs hover:border-[#122238] transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2 rounded-lg border ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#122238] transition-colors" />
              </div>
              <div>
                <span className="text-3xl font-bold text-[#122238] tracking-tight">
                  {stat.count}
                </span>
                <p className="text-xs font-semibold text-[#6B7280] mt-1">
                  {stat.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/galeri"
          className="p-4 bg-white rounded-xl border border-[#E2DFD5] hover:border-[#122238] transition-all flex items-center gap-3"
        >
          <div className="p-2.5 bg-[#FAF9F5] rounded-lg text-[#122238]">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#122238]">Unggah Foto Galeri</h4>
            <p className="text-[11px] text-gray-500">Tambah dokumentasi acara baru</p>
          </div>
        </Link>

        <Link
          href="/admin/guru-staf"
          className="p-4 bg-white rounded-xl border border-[#E2DFD5] hover:border-[#122238] transition-all flex items-center gap-3"
        >
          <div className="p-2.5 bg-[#FAF9F5] rounded-lg text-[#122238]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#122238]">Kelola Guru & Staf</h4>
            <p className="text-[11px] text-gray-500">Perbarui profil tenaga pendidik</p>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="p-4 bg-white rounded-xl border border-[#E2DFD5] hover:border-[#122238] transition-all flex items-center gap-3"
        >
          <div className="p-2.5 bg-[#FAF9F5] rounded-lg text-[#122238]">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#122238]">Profil & Sambutan</h4>
            <p className="text-[11px] text-gray-500">Edit sambutan dan sejarah sekolah</p>
          </div>
        </Link>
      </div>

      {/* Recent Articles Table */}
      <div className="bg-white rounded-xl border border-[#E2DFD5] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E2DFD5] flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-base font-bold text-[#122238]">
              Warta & Pengumuman Terbaru
            </h3>
            <p className="text-xs text-gray-500">
              5 publikasi terakhir yang masuk ke dalam sistem.
            </p>
          </div>
          <Link
            href="/admin/berita"
            className="text-xs font-bold text-[#B45309] hover:underline"
          >
            Lihat Semua &rarr;
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 italic">
            Belum ada warta yang dibuat. Klik tombol di atas untuk menulis berita pertama.
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
                      <span className="line-clamp-1 max-w-sm sm:max-w-md">
                        {art.judul}
                      </span>
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
                      <Link
                        href={`/admin/berita/${art.id}`}
                        className="text-xs font-semibold text-[#122238] hover:text-[#B45309] hover:underline"
                      >
                        Sunting
                      </Link>
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

