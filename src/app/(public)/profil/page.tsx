import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Settings } from "@/types/database";

export const metadata = {
  title: "Profil & Sejarah Sekolah",
  description: "Sejarah berdirinya sekolah, visi misi, profil kepala sekolah, dan tujuan mutu SMA Negeri 1 Halmahera Timur.",
};

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const supabase = await createClient();

  const { data: settingsData } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  const settings = settingsData as Settings | null;

  const namaSekolah = settings?.nama_sekolah || "SMA Negeri 1 Halmahera Timur";
  const kepsekName = settings?.nama_kepsek || "Drs. H. M. Taher, M.Pd.";
  const kepsekPhoto =
    settings?.foto_kepsek_url ||
    "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop";

  // Parse misi if array or string list
  const misiRaw = settings?.misi || "";
  let misiList: string[] = [];
  try {
    const parsed = JSON.parse(misiRaw);
    if (Array.isArray(parsed)) misiList = parsed;
    else if (typeof parsed === "string") misiList = [parsed];
  } catch {
    misiList = misiRaw
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  if (misiList.length === 0) {
    misiList = [
      "Menyelenggarakan proses pembelajaran yang inovatif, berpusat pada peserta didik, dan berbasis teknologi digital.",
      "Membina budi pekerti luhur, kedisiplinan, dan ketakwaan kepada Tuhan Yang Maha Esa.",
      "Menumbuhkembangkan semangat berkompetisi sehat dalam bidang akademik, sains, seni, dan olahraga.",
      "Menghargai keberagaman budaya dan kearifan lokal di Bumi Halmahera Timur.",
      "Menciptakan iklim sekolah yang aman, inklusif, sehat, dan ramah lingkungan.",
    ];
  }

  // Parse tujuan if array or string list
  const tujuanRaw = settings?.tujuan || "";
  let tujuanList: string[] = [];
  try {
    const parsed = JSON.parse(tujuanRaw);
    if (Array.isArray(parsed)) tujuanList = parsed;
    else if (typeof parsed === "string") tujuanList = [parsed];
  } catch {
    tujuanList = tujuanRaw
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return (
    <div className="bg-white min-h-screen py-16 sm:py-24 selection:bg-slate-900 selection:text-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Breadcrumb & Semboyan Kicker */}
        <div className="space-y-4 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-semibold">Profil Sekolah</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-[0.2em] uppercase">
            FADEL DELA NA MAFIA &bull; PROFIL RESMI
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.05]">
            Mengenal SMA Negeri 1 Halmahera Timur.
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 font-normal leading-relaxed pt-1">
            Lembaga pendidikan menengah yang mendedikasikan pengabdian demi melahirkan generasi pembelajar yang tangguh, berakhlak mulia, dan berdaya saing tinggi.
          </p>
        </div>

        {/* Quick Institutional Stats Strip */}
        <div className="py-8 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase block">Akreditasi</span>
            <span className="text-xl font-bold text-slate-900">{settings?.akreditasi || "A"} (Unggul)</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase block">NPSN</span>
            <span className="text-xl font-bold text-slate-900 font-mono">{settings?.npsn || "60201362"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase block">Didirikan</span>
            <span className="text-xl font-bold text-slate-900">Tahun 1989</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase block">Status</span>
            <span className="text-xl font-bold text-slate-900">Negeri</span>
          </div>
        </div>

        {/* 1. SAMBUTAN KEPALA SEKOLAH (Editorial Portrait 2-Column Layout) */}
        <section id="sambutan" className="py-14 border-b border-slate-100 space-y-8">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase block">
              Kepemimpinan Sekolah
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              Sambutan Kepala Sekolah
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Kolom Kiri: Foto Besar Portrait & Identitas (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative w-full max-w-sm mx-auto lg:mx-0 aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                <Image
                  src={kepsekPhoto}
                  alt={kepsekName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 360px"
                  className="object-cover object-top"
                  priority
                />
              </div>

              <div className="text-left space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {kepsekName}
                </h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Kepala {namaSekolah}
                </p>
              </div>
            </div>

            {/* Kolom Kanan: Teks Lengkap Sambutan (lg:col-span-7) */}
            <div className="lg:col-span-7 text-base sm:text-lg text-slate-600 leading-relaxed space-y-5 whitespace-pre-line font-normal">
              {settings?.sambutan_kepsek || (
                <>
                  <p>
                    Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat dan karunia-Nya, sehingga SMA Negeri 1 Halmahera Timur terus dapat berdiri tegak menjadi kawah candradimuka bagi pembentukan karakter dan kecerdasan putra-putri bangsa.
                  </p>
                  <p>
                    Di era transformasi global yang bergerak sangat cepat, kami meyakini bahwa pendidikan sejati tidak hanya mengukur kecakapan intelektual di atas kertas, tetapi juga menumbuhkan kepekaan nurani, integritas budi pekerti, dan daya juang yang pantang menyerah.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 2. SEJARAH SEKOLAH (Article Flow) */}
        <section className="py-14 border-b border-slate-100 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase block">
            Kilasan Sejarah
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Perjalanan Sejarah Institusi
          </h2>

          <div className="text-lg text-slate-600 leading-relaxed space-y-4 whitespace-pre-line font-normal">
            {settings?.sejarah_sekolah || (
              <>
                <p>
                  SMA Negeri 1 Halmahera Timur berawal dari SMA PGRI Buli yang didirikan pada tahun 1989. Berdirinya sekolah ini bermula dari aspirasi luhur masyarakat setempat yang mendambakan tersedianya fasilitas pendidikan tingkat menengah atas bagi generasi muda di wilayah Maba dan sekitarnya.
                </p>
                <p>
                  Seiring berjalannya waktu dan meningkatnya kebutuhan pendidikan formal yang berstandar negeri, sekolah ini resmi dinegerikan pada tahun 2004 berdasarkan Keputusan Bupati Halmahera Timur No. 421.3/KEP/07/2004, dan bertransformasi menjadi SMA Negeri 1 Halmahera Timur.
                </p>
                <p>
                  Hingga kini, sekolah terus bertumbuh dengan melengkapi sarana laboratorium, ruang digital, perpustakaan, serta membina ratusan siswa yang mengukir prestasi di tingkat kabupaten, provinsi Maluku Utara, hingga kancah nasional.
                </p>
              </>
            )}
          </div>
        </section>

        {/* 3. VISI SEKOLAH */}
        <section id="visi-misi" className="py-14 border-b border-slate-100 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase block">
            Visi Institusi
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Visi Kami
          </h2>

          <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200">
            <blockquote className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
              &ldquo;{settings?.visi || "Unggul dalam prestasi, memiliki karakter pembelajar, terampil dan kreatif menghargai keberagaman serta tangguh dan mandiri berdasarkan delapan dimensi profil lulusan."}&rdquo;
            </blockquote>
          </div>
        </section>

        {/* 4. MISI SEKOLAH (Clean List with Static Checkmarks) */}
        <section className="py-14 border-b border-slate-100 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase block">
            Langkah Strategis
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Misi Sekolah
          </h2>

          <div className="space-y-4 pt-2">
            {misiList.map((misi, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 transition-colors"
              >
                <div className="p-1 rounded-full bg-slate-900 text-white shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  {misi.replace(/^[0-9]+\.\s*/, "")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. TUJUAN SEKOLAH (If Present) */}
        {tujuanList.length > 0 && (
          <section className="py-14 border-b border-slate-100 space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase block">
              Sasaran Pendidikan
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Tujuan Penyelenggaraan Pendidikan
            </h2>

            <div className="space-y-3 pt-2">
              {tujuanList.map((tujuan, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200"
                >
                  <div className="p-1 rounded-full bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-base text-slate-700 leading-relaxed font-normal">
                    {tujuan.replace(/^[0-9]+\.\s*/, "")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. IDENTITAS DAN ALAMAT RESMI */}
        <section className="py-14 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase block">
            Legalitas & Kontak Resmi
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Identitas Lembaga
          </h2>

          <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200 space-y-4 text-sm text-slate-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 block">Nama Resmi</span>
                <span className="font-bold text-slate-900">{namaSekolah}</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 block">NPSN</span>
                <span className="font-bold text-slate-900 font-mono">{settings?.npsn || "60201362"}</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 block">Akreditasi</span>
                <span className="font-bold text-slate-900">{settings?.akreditasi || "A"} (Unggul)</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 block">Kurikulum</span>
                <span className="font-bold text-slate-900">Kurikulum Merdeka</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-400 block">Alamat Lengkap</span>
              <p className="text-slate-800 font-medium mt-0.5">
                {settings?.alamat || "Desa Sailal, Kecamatan Maba, Kabupaten Halmahera Timur, Maluku Utara"}
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}