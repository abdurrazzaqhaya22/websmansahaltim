import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types/database";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const isPengumuman = article.tipe === "pengumuman";
  const thumbnail =
    article.thumbnail_url ||
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop";

  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail Container */}
      <div className="relative w-full h-52 overflow-hidden bg-slate-100">
        <Image
          src={thumbnail}
          alt={article.judul}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${
              isPengumuman
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-900 border border-slate-200"
            }`}
          >
            {article.tipe}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div className="space-y-2.5">
          <div className="text-xs text-slate-400 font-mono">
            {formatDate(article.created_at)}
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-600 transition-colors leading-snug line-clamp-2">
            <Link href={`/berita/${article.slug}`}>
              {article.judul}
            </Link>
          </h3>

          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {article.ringkasan ||
              article.konten.replace(/<[^>]*>?/gm, "").slice(0, 120) + "..."}
          </p>
        </div>

        <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/berita/${article.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-slate-600 transition-colors"
          >
            <span>Baca Selengkapnya</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}