import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Quote, Award, BookCheck, Sparkles, Building2, ChevronRight } from "lucide-react";
import type { Settings, Article } from "@/types/database";

interface BentoGridProps {
  settings: Settings | null;
  latestArticles: Article[];
}

export function BentoGrid({ settings, latestArticles }: BentoGridProps) {
  const kepsekName = settings?.nama_kepsek || "Kepala SMA Negeri 1 Halmahera Timur";
  const kepsekPhoto = settings?.foto_kepsek_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop";
  const sambutanExcerpt = settings?.sambutan_kepsek
    ? settings.sambutan_kepsek.slice(0, 220) + "..."
    : "Selamat datang di website resmi SMA Negeri 1 Halmahera Timur. Kami berkomitmen untuk menghadirkan ekosistem pembelajaran yang berkualitas dan berkarakter.";

  return (
    <section className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header / Editorial Subhead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E8E6DF] gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#122238]/5 border border-[#122238]/10 rounded-md text-[11px] font-semibold text-[#122238] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Portal Resmi Institusi</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#122238] tracking-tight leading-tight">
              SMA Negeri 1 Halmahera Timur
            </h1>
          </div>
          <p className="text-sm text-[#4B5563] max-w-md leading-relaxed font-light">
            Meneguhkan tekad sebagai kawah candradimuka generasi berintegritas, cerdas bernalar, dan menjunjung tinggi kearifan lokal.
          </p>
        </div>

        {/* BENTO GRID CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* 1. HERO VISUAL CARD (Desktop: Col 1-7) */}
          <div className="lg:col-span-7 bg-[#122238] text-white rounded-2xl overflow-hidden relative shadow-md border border-[#1E3352] flex flex-col justify-end min-h-[380px] sm:min-h-[440px] p-6 sm:p-10 group">
            {/* Background Image with warm gradient overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/hero-bg.jpg"
                alt="Siswa-Siswi SMAN 1 Halmahera Timur"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center opacity-35 group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1424] via-[#0A1424]/70 to-transparent" />
            </div>

            {/* Content Over Hero */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-amber-300 border border-white/20">
                <span>Halmahera Timur, Maluku Utara</span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug tracking-tight text-[#FAF9F5]">
                Pendidikan Berkualitas untuk Masa Depan Berkarakter Luhur.
              </h2>

              <p className="text-sm text-gray-200 max-w-xl font-light leading-relaxed">
                Menyediakan kurikulum komprehensif, sarana sains dan teknologi terintegrasi, serta bimbingan intensif untuk mengantarkan setiap peserta didik meraih cita-cita tertingginya.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#122238] text-xs font-bold rounded-lg hover:bg-[#F3F2EB] transition-colors shadow-sm"
                >
                  <span>Eksplorasi Profil Sekolah</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 backdrop-blur-sm transition-colors"
                >
                  <span>Warta Sekolah</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. KEPALA SEKOLAH BENTO CARD (Desktop: Col 8-12) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-[#E2DFD5] shadow-xs flex flex-col justify-between relative overflow-hidden">
            {/* Watermark quote icon */}
            <Quote className="absolute right-4 top-4 w-20 h-20 text-[#F5F3ED] -z-0 pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B45309] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#B45309]" />
                <span>Sambutan Pimpinan Sekolah</span>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#122238] shadow-xs shrink-0">
                  <Image
                    src={kepsekPhoto}
                    alt={kepsekName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-editorial text-base sm:text-lg font-bold text-[#122238] leading-snug">
                    {kepsekName}
                  </h3>
                  <p className="text-xs text-[#6B7280] font-medium">
                    Kepala SMAN 1 Halmahera Timur
                  </p>
                </div>
              </div>

              <blockquote className="text-sm text-[#4B5563] leading-relaxed italic border-l-2 border-[#B45309] pl-3.5 my-3">
                &ldquo;{sambutanExcerpt}&rdquo;
              </blockquote>
            </div>

            <div className="pt-4 border-t border-[#F0EEE6] mt-4">
              <Link
                href="/profil#sambutan"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#122238] hover:text-[#B45309] transition-colors group"
              >
                <span>Baca Sambutan Lengkap Beliau</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 3. PILLAR STATS (Desktop: 3 small bento columns - Col 1 to 7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1 */}
            <div className="bg-white p-5 rounded-xl border border-[#E2DFD5] shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-lg font-bold text-[#122238]">
                Akreditasi A
              </h4>
              <p className="text-xs text-[#525252] leading-relaxed">
                Predikat Unggul dari Badan Akreditasi Nasional Sekolah/Madrasah.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-5 rounded-xl border border-[#E2DFD5] shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center">
                <BookCheck className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-lg font-bold text-[#122238]">
                Kurikulum Merdeka
              </h4>
              <p className="text-xs text-[#525252] leading-relaxed">
                Pembelajaran mendalam berbasis proyek penguatan profil pelajar Pancasila.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-5 rounded-xl border border-[#E2DFD5] shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-[#DCFCE7] text-[#166534] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-lg font-bold text-[#122238]">
                Fasilitas Terpadu
              </h4>
              <p className="text-xs text-[#525252] leading-relaxed">
                Laboratorium sains modern, perpustakaan digital, dan sarana olahraga.
              </p>
            </div>
          </div>

          {/* 4. SHORTCUT BERITA CEPAT (Desktop: Col 8 to 12) */}
          <div className="lg:col-span-5 bg-[#F6F5EF] rounded-xl p-5 border border-[#E2DFD5] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E6E4DC]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#122238]">
                  Warta Terkini
                </span>
                <Link
                  href="/berita"
                  className="text-[11px] font-semibold text-[#B45309] hover:underline"
                >
                  Semua &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {latestArticles.slice(0, 2).map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.slug}`}
                    className="block p-3 rounded-lg bg-white border border-[#E2DFD5] hover:border-[#122238] transition-all group"
                  >
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#6B7280] mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                        item.tipe === "pengumuman"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {item.tipe}
                      </span>
                      <span>
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <h5 className="font-editorial text-xs font-bold text-[#122238] group-hover:text-[#B45309] line-clamp-2 leading-snug">
                      {item.judul}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
