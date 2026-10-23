import React from "react";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata = {
  title: "Tulis Artikel Baru | Admin SMAN 1 Halmahera Timur",
};

export default function TambahBeritaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-editorial text-2xl font-bold text-[#122238]">
          Tulis Warta atau Pengumuman Baru
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Gunakan editor di bawah untuk membagikan kabar dan informasi penting sekolah.
        </p>
      </div>

      <ArticleForm />
    </div>
  );
}

