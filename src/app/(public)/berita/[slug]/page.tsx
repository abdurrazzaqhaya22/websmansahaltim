import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronRight, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { ArticleCard } from "@/components/ArticleCard";
import type { Article } from "@/types/database";

interface ArticleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("judul, ringkasan")
    .eq("slug", slug)
    .single();

  if (!article) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: `${article.judul} | SMAN 1 Halmahera Timur`,
    description: article.ringkasan || "Warta resmi SMA Negeri 1 Halmahera Timur",
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch article
  const { data: articleData } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!articleData) {
    notFound();
  }

  const article = articleData as Article;

  // Fetch related articles
  const { data: relatedData } = await supabase
    .from("articles")
    .select("*")
    .neq("id", article.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const relatedArticles = (relatedData as Article[]) || [];
  const isPengumuman = article.tipe === "pengumuman";

  return (
    <article className="bg-white min-h-screen py-16 sm:py-24 selection:bg-slate-900 selection:text-white">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 space-y-10">
        
        {/* Breadcrumb & Navigation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/berita" className="hover:text-slate-900 transition-colors">Warta & Berita</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-semibold truncate max-w-xs">
              {article.judul}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span
              className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${
                isPengumuman
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {article.tipe}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            <span className="text-xs text-slate-400">&bull; Humas SMAN 1 Halmahera Timur</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
            {article.judul}
          </h1>

          {article.ringkasan && (
            <p className="text-lg sm:text-xl text-slate-500 font-normal leading-relaxed pt-1">
              {article.ringkasan}
            </p>
          )}
        </div>

        {/* Featured Image */}
        {article.thumbnail_url && (
          <div className="relative w-full h-[320px] sm:h-[420px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
            <Image
              src={article.thumbnail_url}
              alt={article.judul}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Article Body Content (Medium / Coda Reading Style) */}
        <div
          className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal space-y-5 border-t border-slate-100 pt-8"
          dangerouslySetInnerHTML={{ __html: article.konten }}
        />

        {/* Back Link */}
        <div className="pt-8 border-t border-slate-100">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Semua Warta</span>
          </Link>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="pt-16 border-t border-slate-100 space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              Warta Terkait Lainnya
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.slice(0, 2).map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}