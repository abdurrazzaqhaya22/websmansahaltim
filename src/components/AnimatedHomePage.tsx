"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  BookOpen,
  Camera,
  Users,
  Bell,
  ChevronRight,
} from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { formatDate } from "@/lib/utils";
import type { Settings, Article, GalleryItem } from "@/types/database";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Coda subtle ease curve
const codaEase = [0.16, 1, 0.3, 1] as const;

// Staggered Hero Text Reveal Variants (Webflow / Awwwards Premium Style)
const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const heroWordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface AnimatedHomePageProps {
  settings: Settings | null;
  articles: Article[];
  announcements: Article[];
  gallery: GalleryItem[];
}

export function AnimatedHomePage({
  settings,
  articles,
  announcements,
  gallery,
}: AnimatedHomePageProps) {
  const [activeTab, setActiveTab] = useState<"visi" | "dimensi">("visi");

  const kepsekName = settings?.nama_kepsek || "Drs. H. M. Taher, M.Pd.";
  const kepsekPhoto =
    settings?.foto_kepsek_url ||
    "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop";
  const sambutanShort = settings?.sambutan_kepsek
    ? settings.sambutan_kepsek.slice(0, 220) + "..."
    : "Pendidikan adalah komitmen luhur menghadirkan masa depan berkarakter bagi putra-putri Halmahera Timur. Kami bertekad membentuk pembelajar tangguh yang siap menjawab tantangan masa depan.";

  const profilDimensions = [
    { no: "01", title: "Beriman & Bertakwa", desc: "Berakhlak mulia kepada Tuhan dan sesama." },
    { no: "02", title: "Berkebinekaan Global", desc: "Menghargai warisan kearifan lokal & keterbukaan dunia." },
    { no: "03", title: "Gotong Royong", desc: "Kolaborasi aktif dan kepedulian sosial." },
    { no: "04", title: "Mandiri & Tangguh", desc: "Bertanggung jawab atas proses belajar pribadi." },
    { no: "05", title: "Bernalar Kritis", desc: "Memproses informasi objektif dan problem solving." },
    { no: "06", title: "Kreatif & Inovatif", desc: "Gagasan dan karya orisinal yang berdaya guna." },
    { no: "07", title: "Terampil & Tanggap", desc: "Literasi digital dan kecakapan abad ke-21." },
    { no: "08", title: "Berprestasi Unggul", desc: "Semangat berkompetisi sportif dan berprestasi." },
  ];

  const heroHeadlineRow1 = ["Pendidikan", "Berkarakter,"];
  const heroHeadlineRow2 = ["Unggul", "&", "Mandiri."];

  return (
    <div className={`min-h-screen bg-white text-slate-900 ${sansFont.className} pb-32 selection:bg-slate-900 selection:text-white`}>
      
      {/* ========================================================
          1. HERO SECTION (Staggered Text Reveal & Coda Layout)
         ======================================================== */}
      <section className="pt-16 pb-16 md:pt-32 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center">
          
          {/* Motto Kicker Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: codaEase }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-[0.2em] uppercase"
          >
            FADEL DELA NA MAFIA
          </motion.div>

          {/* Staggered Word Reveal Hero Headline */}
          <motion.h1
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="text-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[1.08] sm:leading-[1.05]"
          >
            <span className="inline-block text-center">
              {heroHeadlineRow1.map((word, idx) => (
                <motion.span
                  key={idx}
                  variants={heroWordVariants}
                  className="inline-block mr-[0.22em] last:mr-0 text-center"
                >
                  {word}
                </motion.span>
              ))}
            </span>{" "}
            <br className="hidden sm:inline" />
            <span className="inline-block text-slate-400 font-extrabold text-center">
              {heroHeadlineRow2.map((word, idx) => (
                <motion.span
                  key={idx}
                  variants={heroWordVariants}
                  className="inline-block mr-[0.22em] last:mr-0 text-center"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Subtitle with generous line height */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: codaEase, delay: 0.55 }}
            className="text-center text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Portal resmi SMA Negeri 1 Halmahera Timur. Ekosistem belajar modern yang berakar pada integritas, budi pekerti luhur, dan daya saing di Maluku Utara.
          </motion.p>

          {/* Coda Flat Pill Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: codaEase, delay: 0.65 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
          >
            <div className="flex justify-center w-full sm:w-auto">
              <Link
                href="/profil"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold rounded-full transition-all group"
              >
                <span>Jelajahi Profil Sekolah</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex justify-center w-full sm:w-auto">
              <Link
                href="/berita"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-sm font-semibold rounded-full transition-all"
              >
                <span>Warta & Pengumuman</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Photo Container (Clean flat container card, no fake widgets) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: codaEase, delay: 0.75 }}
          className="mt-12 sm:mt-16 md:mt-24 max-w-6xl mx-auto"
        >
          <div className="relative rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-50 p-2 sm:p-3">
            <div className="relative w-full h-[320px] sm:h-[480px] md:h-[580px] rounded-[1.5rem] overflow-hidden">
              <Image
                src="/hero-bg.jpg"
                alt="Siswa-Siswi SMA Negeri 1 Halmahera Timur"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
                <div>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-300">
                    Keluarga Besar SMAN 1 Halmahera Timur
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                    Merayakan Cita, Prestasi, dan Persaudaraan
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold shrink-0">
                  <span>Desa Sailal, Kec. Maba</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          2. METRIC STRIP (Flat, Clean Hairline Grid)
         ======================================================== */}
      <section className="border-y border-slate-100 bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 sm:gap-y-16 md:gap-y-12 md:divide-x divide-slate-100">
            <div className="text-center pb-6 md:pb-0">
              <span className="block text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                1989
              </span>
              <span className="text-xs text-slate-500 mt-2 block">
                Berdiri Sejak (SMA PGRI Buli)
              </span>
            </div>

            <div className="text-center pb-6 md:pb-0 md:pl-6">
              <span className="block text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                {settings?.akreditasi || "A"}
              </span>
              <span className="text-xs text-slate-500 mt-2 block">
                Akreditasi BAN-S/M Unggul
              </span>
            </div>

            <div className="text-center pb-6 md:pb-0 md:pl-6">
              <span className="block text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-mono">
                {settings?.npsn || "60201362"}
              </span>
              <span className="text-xs text-slate-500 mt-2 block">
                NPSN Resmi Kemendikbud
              </span>
            </div>

            <div className="text-center pb-6 md:pb-0 md:pl-6">
              <span className="block text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                8 Dimensi
              </span>
              <span className="text-xs text-slate-500 mt-2 block">
                Profil Kelulusan Siswa
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. INFORMATION GRID (Flat Coda Cards, No Shadows)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
              Informasi Terpadu
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mt-2">
              Pusat Informasi & Profil Sekolah
            </h2>
          </div>
          <p className="text-base text-slate-500 max-w-md leading-relaxed">
            Akses langsung ke profil kepala sekolah, pengumuman resmi, dan program keunggulan SMA Negeri 1 Halmahera Timur.
          </p>
        </div>

        {/* 2-Column Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sambutan Kepala Sekolah (lg:col-span-5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: codaEase }}
            className="lg:col-span-5 bg-white rounded-[2rem] p-7 sm:p-9 border border-slate-200 hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sambutan Pimpinan
                </span>
                <span className="text-xs font-mono text-slate-400">Kepala Sekolah</span>
              </div>

              {/* Editorial Portrait Layout */}
              <div className="flex flex-col md:flex-row items-center md:items-start md:gap-6 w-full">
                {/* Portrait Photo */}
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 mb-6 md:w-1/3 md:mb-0 shrink-0 shadow-xs">
                  <Image
                    src={kepsekPhoto}
                    alt={kepsekName}
                    fill
                    sizes="(max-width: 768px) 100vw, 240px"
                    className="w-full aspect-[4/5] object-cover rounded-2xl mb-6 md:w-1/3 md:mb-0"
                    priority
                  />
                </div>

                {/* Info & Kutipan */}
                <div className="flex-1 space-y-3 text-center md:text-left w-full">
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                      {kepsekName}
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                      Kepala SMAN 1 Halmahera Timur
                    </p>
                  </div>

                  <blockquote className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    &ldquo;{sambutanShort}&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-center md:justify-start">
              <Link
                href="/profil#sambutan"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-slate-600 transition-colors group"
              >
                <span>Baca Sambutan Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Visi & 8 Dimensi (lg:col-span-7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: codaEase, delay: 0.1 }}
            className="lg:col-span-7 bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-200 hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Visi & Nilai Institusi
                </span>

                {/* Tab Switcher */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setActiveTab("visi")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeTab === "visi" ? "bg-white text-slate-900 font-bold border border-slate-200/60" : "hover:text-slate-900"
                    }`}
                  >
                    Visi Sekolah
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("dimensi")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeTab === "dimensi" ? "bg-white text-slate-900 font-bold border border-slate-200/60" : "hover:text-slate-900"
                    }`}
                  >
                    8 Dimensi
                  </button>
                </div>
              </div>

              {activeTab === "visi" ? (
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
                    &ldquo;{settings?.visi || "Unggul dalam prestasi, memiliki karakter pembelajar, terampil dan kreatif menghargai keberagaman serta tangguh dan mandiri berdasarkan delapan dimensi profil lulusan."}&rdquo;
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Diterapkan melalui pembiasaan budi pekerti, kurikulum berbasis kompetensi abad ke-21, dan penguatan nilai kearifan lokal Halmahera Timur.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {profilDimensions.map((item) => (
                    <div
                      key={item.no}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200"
                    >
                      <span className="text-[10px] font-mono font-bold text-slate-400 block">{item.no}</span>
                      <h5 className="text-xs font-bold text-slate-900 mt-1 leading-snug">{item.title}</h5>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                href="/profil#visi-misi"
                className="font-bold text-slate-900 hover:text-slate-600 transition-colors flex items-center gap-1.5"
              >
                <span>Lihat Penjabaran Misi & Tujuan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-slate-400">Kurikulum Merdeka</span>
            </div>
          </motion.div>

        </div>

        {/* Pintasan Layanan (4 Flat Tiles) */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
              Pintasan Layanan
            </span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Akses Langsung ke Portal Sekolah
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <Link
              href="/berita?kategori=pengumuman"
              className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  PPDB Online
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Informasi pendaftaran siswa baru
                </p>
              </div>
            </Link>

            <Link
              href="/guru-staf"
              className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Dewan Pendidik
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direktori guru & staf kependidikan
                </p>
              </div>
            </Link>

            <Link
              href="/profil"
              className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Kurikulum & Riset
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Struktur pembelajaran akademik
                </p>
              </div>
            </Link>

            <Link
              href="/galeri"
              className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-44"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Camera className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Galeri & Dokumentasi
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Arsip kegiatan belajar & fasilitas sekolah
                </p>
              </div>
            </Link>

          </div>
        </div>

      </section>

      {/* ========================================================
          4. WARTA & PENGUMUMAN (Flat Grid Section)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Urgent Announcement if any */}
        {announcements.length > 0 && (
          <div className="mb-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-full bg-slate-100 text-slate-900">
                  <Bell className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Pengumuman Resmi
                </span>
              </div>
              <Link
                href="/berita?kategori=pengumuman"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.slice(0, 2).map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 transition-colors block"
                >
                  <div className="text-[11px] font-mono text-slate-400 mb-1">
                    {formatDate(item.created_at)}
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {item.judul}
                  </h5>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
              Warta & Berita
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mt-2">
              Warta & Informasi Sekolah
            </h2>
          </div>
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-900 transition-colors"
          >
            <span>Semua Publikasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400 italic bg-white rounded-3xl border border-slate-200">
            Belum ada warta yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          5. GALERI DOKUMENTASI (Potret SMANSA)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
              Dokumentasi Visual
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mt-2">
              Potret SMANSA & Dokumentasi Sekolah
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Koleksi dokumentasi visual kegiatan pembelajaran, dewan guru, fasilitas, dan berbagai momen penting di sekolah.
            </p>
          </div>
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-900 transition-colors mt-4 sm:mt-0"
          >
            <span>Buka Galeri Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <GalleryLightbox items={gallery} />
      </section>

      {/* ========================================================
          6. CALL TO ACTION (Clean Coda Dark Banner)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 sm:p-14 lg:p-16 text-white">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
              FADEL DELA NA MAFIA &bull; SMAN 1 HALMAHERA TIMUR
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Membangun Generasi Cerdas & Berakhlak Luhur.
            </h2>

            <p className="text-base text-slate-400 leading-relaxed font-normal">
              Bergabunglah bersama keluarga besar SMA Negeri 1 Halmahera Timur di Desa Sailal, Kecamatan Maba. Menyongsong masa depan pendidikan yang berintegritas dan bermartabat.
            </p>

            <div className="pt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/profil"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 text-sm font-bold rounded-full transition-all"
              >
                <span>Pelajari Profil & Sejarah</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/guru-staf"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white text-sm font-semibold rounded-full border border-white/20 transition-all"
              >
                <Users className="w-4 h-4 text-slate-400" />
                <span>Kenali Dewan Pendidik</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}