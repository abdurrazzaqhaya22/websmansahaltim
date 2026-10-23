import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Settings } from "@/types/database";

interface FooterProps {
  settings: Settings | null;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 bg-white rounded-full p-0.5 shrink-0 overflow-hidden border border-slate-200">
                <Image
                  src="/logo.png"
                  alt="Logo SMAN 1 Halmahera Timur"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
                  SMAN 1 HALMAHERA TIMUR
                </h3>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                  FADEL DELA NA MAFIA
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Lembaga pendidikan menengah atas yang berkomitmen mengantarkan putra-putri Halmahera Timur meraih keunggulan akademik, keluhuran moral, dan kesiapan berkontribusi bagi masyarakat.
            </p>
            <div className="pt-1 text-xs text-slate-400">
              <span>Akreditasi: <strong className="text-slate-700">{settings?.akreditasi || "A"}</strong> &bull; NPSN: <strong className="text-slate-700">{settings?.npsn || "60201362"}</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigasi
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link href="/" className="hover:text-slate-900 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-slate-900 transition-colors">
                  Profil & Sejarah
                </Link>
              </li>
              <li>
                <Link href="/guru-staf" className="hover:text-slate-900 transition-colors">
                  Dewan Guru & Staf
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-slate-900 transition-colors">
                  Warta & Pengumuman
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-slate-900 transition-colors">
                  Galeri Sekolah
                </Link>
              </li>
            </ul>
          </div>

          {/* Alamat & Kontak */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Lokasi & Kontak
            </h4>
            <div className="space-y-1.5 text-xs text-slate-500 leading-relaxed">
              <p>{settings?.alamat || "Desa Sailal, Kec. Maba, Kab. Halmahera Timur, Maluku Utara"}</p>
              <p>Telepon: {settings?.telepon || "(0924) 21008"}</p>
              <p>Email: {settings?.email || "info@sman1haltim.sch.id"}</p>
            </div>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors"
              >
                <span>Portal Administrasi</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-14 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {currentYear} SMA Negeri 1 Halmahera Timur. Seluruh hak cipta dilindungi.
          </p>
          <p className="text-[11px]">
            Platform Pendidikan Digital
          </p>
        </div>
      </div>
    </footer>
  );
}