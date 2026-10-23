import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "@/components/admin/ArticleForm";
import type { Article } from "@/types/database";

interface EditBeritaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "Sunting Artikel | Admin SMAN 1 Halmahera Timur",
};

export default async function EditBeritaPage({ params }: EditBeritaPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: articleData } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (!articleData) {
    notFound();
  }

  const article = articleData as Article;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-editorial text-2xl font-bold text-[#122238]">
          Sunting Artikel
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Perbarui teks, foto sampul, atau status publikasi artikel.
        </p>
      </div>

      <ArticleForm initialData={article} />
    </div>
  );
}

