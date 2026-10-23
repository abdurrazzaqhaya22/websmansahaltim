"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  School,
  UserCheck,
  Target,
  Upload,
  Loader2,
  CheckCircle2,
  Save,
  Phone,
  Mail,
  MapPin,
  Award,
  Hash,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Settings } from "@/types/database";

interface SettingsTabsFormProps {
  initialSettings: Settings | null;
}

export function SettingsTabsForm({ initialSettings }: SettingsTabsFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"identitas" | "sejarah" | "visi">("identitas");

  // Tab 1: Identitas & Kontak
  const [namaSekolah, setNamaSekolah] = useState(
    initialSettings?.nama_sekolah || "SMA Negeri 1 Halmahera Timur"
  );
  const [alamat, setAlamat] = useState(
    initialSettings?.alamat || "Jl. Lintas Halmahera Timur, Desa Sailal, Kecamatan Maba, Kabupaten Halmahera Timur"
  );
  const [npsn, setNpsn] = useState(initialSettings?.npsn || "60201362");
  const [akreditasi, setAkreditasi] = useState(initialSettings?.akreditasi || "A");
  const [telepon, setTelepon] = useState(initialSettings?.telepon || "(0924) 21008");
  const [email, setEmail] = useState(initialSettings?.email || "info@sman1haltim.sch.id");
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState(initialSettings?.maps_embed_url || "");

  // Tab 2: Sejarah & Kepsek
  const [sejarahSekolah, setSejarahSekolah] = useState(
    initialSettings?.sejarah_sekolah || ""
  );
  const [sambutanKepsek, setSambutanKepsek] = useState(
    initialSettings?.sambutan_kepsek || ""
  );
  const [namaKepsek, setNamaKepsek] = useState(
    initialSettings?.nama_kepsek || "Drs. H. M. Taher, M.Pd."
  );
  const [fotoKepsekUrl, setFotoKepsekUrl] = useState(
    initialSettings?.foto_kepsek_url || ""
  );

  // Tab 3: Visi, Misi & Tujuan
  const [visi, setVisi] = useState(initialSettings?.visi || "");
  const [misi, setMisi] = useState(initialSettings?.misi || "");
  const [tujuan, setTujuan] = useState(initialSettings?.tujuan || "");

  // UI States
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Upload photo to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `kepsek-${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("school-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("school-assets")
        .getPublicUrl(filePath);

      setFotoKepsekUrl(urlData.publicUrl);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg("Gagal mengunggah foto kepala sekolah: " + error?.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    const supabase = createClient();

    try {
      const payload = {
        nama_sekolah: namaSekolah,
        alamat,
        npsn,
        akreditasi,
        telepon,
        email,
        maps_embed_url: mapsEmbedUrl,
        sejarah_sekolah: sejarahSekolah,
        sambutan_kepsek: sambutanKepsek,
        nama_kepsek: namaKepsek,
        foto_kepsek_url: fotoKepsekUrl,
        visi,
        misi,
        tujuan,
        updated_at: new Date().toISOString(),
      };

      if (initialSettings?.id) {
        // UPDATE by ID
        const { error } = await supabase
          .from("settings")
          .update(payload)
          .eq("id", initialSettings.id);

        if (error) throw error;
      } else {
        // Fallback: check if any row exists
        const { data: existingRows } = await supabase
          .from("settings")
          .select("id")
          .limit(1);

        if (existingRows && existingRows.length > 0) {
          const { error } = await supabase
            .from("settings")
            .update(payload)
            .eq("id", existingRows[0].id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("settings").insert([payload]);
          if (error) throw error;
        }
      }

      setSuccessMsg("Seluruh data pengaturan profil berhasil diperbarui!");
      router.refresh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg("Gagal menyimpan data: " + error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    {
      id: "identitas" as const,
      label: "Identitas & Kontak",
      icon: School,
      desc: "Nama, Alamat, NPSN, Akreditasi, Kontak",
    },
    {
      id: "sejarah" as const,
      label: "Sejarah & Kepsek",
      icon: UserCheck,
      desc: "Sejarah Sekolah, Sambutan & Foto Kepsek",
    },
    {
      id: "visi" as const,
      label: "Visi, Misi & Tujuan",
      icon: Target,
      desc: "Visi, Misi, dan Target Capaian",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl pb-16">
      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 rounded-2xl flex items-center gap-2">
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB NAVIGATION HEADER (Lucide Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-gray-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  isActive ? "bg-white/10 text-amber-300" : "bg-slate-100 text-slate-700"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold">{tab.label}</span>
                <span
                  className={`text-[11px] block mt-0.5 line-clamp-1 ${
                    isActive ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {tab.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: IDENTITAS & KONTAK
         ======================================================== */}
      {activeTab === "identitas" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-slate-900" />
              <span>Identitas Pokok & Kontak Sekolah</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Data resmi legalitas sekolah yang muncul pada navigasi, footer, dan dokumen publik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            {/* Nama Sekolah */}
            <div className="sm:col-span-12 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Nama Resmi Sekolah *
              </label>
              <input
                type="text"
                required
                value={namaSekolah}
                onChange={(e) => setNamaSekolah(e.target.value)}
                placeholder="SMA Negeri 1 Halmahera Timur"
                className="w-full px-4 py-2.5 text-xs bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            {/* NPSN */}
            <div className="sm:col-span-6 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>NPSN (Nomor Pokok Sekolah Nasional) *</span>
              </label>
              <input
                type="text"
                required
                value={npsn}
                onChange={(e) => setNpsn(e.target.value)}
                placeholder="60201362"
                className="w-full px-4 py-2.5 text-xs bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 font-mono"
              />
            </div>

            {/* Akreditasi */}
            <div className="sm:col-span-6 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Peringkat Akreditasi BAN-S/M *</span>
              </label>
              <input
                type="text"
                required
                value={akreditasi}
                onChange={(e) => setAkreditasi(e.target.value)}
                placeholder="A"
                className="w-full px-4 py-2.5 text-xs bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 font-bold"
              />
            </div>

            {/* Alamat */}
            <div className="sm:col-span-12 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Alamat Lengkap Sekolah *</span>
              </label>
              <textarea
                rows={2}
                required
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Jl. Lintas Halmahera Timur, Desa Sailal, Kecamatan Maba, Kabupaten Halmahera Timur"
                className="w-full px-4 py-2.5 text-xs bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 leading-relaxed"
              />
            </div>

            {/* Telepon */}
            <div className="sm:col-span-6 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Nomor Telepon Kantor</span>
              </label>
              <input
                type="text"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                placeholder="(0924) 21008"
                className="w-full px-4 py-2.5 text-xs bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-6 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Alamat Email Resmi</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@sman1haltim.sch.id"
                className="w-full px-4 py-2.5 text-xs bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900"
              />
            </div>

            {/* Maps URL */}
            <div className="sm:col-span-12 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Google Maps Embed URL (Iframe Src)
              </label>
              <input
                type="text"
                value={mapsEmbedUrl}
                onChange={(e) => setMapsEmbedUrl(e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-4 py-2.5 text-xs bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: SEJARAH & KEPSEK
         ======================================================== */}
      {activeTab === "sejarah" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-slate-900" />
              <span>Sejarah Sekolah & Kepemimpinan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Dokumentasi perjalanan historis sekolah dan profil sambutan pimpinan institusi.
            </p>
          </div>

          {/* Profil Kepsek Section */}
          <div className="p-5 rounded-2xl bg-[#F9F9F8] border border-gray-200/80 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
              Profil Kepala Sekolah
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-8 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Nama Lengkap Kepala Sekolah Beserta Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaKepsek}
                    onChange={(e) => setNamaKepsek(e.target.value)}
                    placeholder="Drs. H. M. Taher, M.Pd."
                    className="w-full px-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Foto Resmi Kepala Sekolah
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:border-slate-900 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-[#B45309]" />
                      <span>{isUploading ? "Mengunggah..." : "Pilih Foto Baru"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Disimpan otomatis ke Storage
                    </span>
                  </div>
                  <input
                    type="url"
                    value={fotoKepsekUrl}
                    onChange={(e) => setFotoKepsekUrl(e.target.value)}
                    placeholder="Atau tempel URL gambar eksternal di sini..."
                    className="w-full px-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900"
                  />
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col items-center justify-center p-3">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-slate-900 shadow-sm bg-slate-200">
                  {fotoKepsekUrl ? (
                    <Image
                      src={fotoKepsekUrl}
                      alt={namaKepsek}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <UserCheck className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase mt-2">
                  Pratinjau Foto
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-800 block">
                Naskah Sambutan Kepala Sekolah
              </label>
              <textarea
                rows={5}
                value={sambutanKepsek}
                onChange={(e) => setSambutanKepsek(e.target.value)}
                placeholder="Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa..."
                className="w-full px-4 py-3 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 text-slate-900 leading-relaxed"
              />
            </div>
          </div>

          {/* Sejarah Sekolah Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Naskah Lengkap Sejarah Sekolah *
            </label>
            <textarea
              rows={7}
              required
              value={sejarahSekolah}
              onChange={(e) => setSejarahSekolah(e.target.value)}
              placeholder="SMA Negeri 1 Halmahera Timur berawal dari SMA PGRI Buli yang didirikan pada tahun 1989..."
              className="w-full px-4 py-3 text-xs bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: VISI, MISI & TUJUAN
         ======================================================== */}
      {activeTab === "visi" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-700" />
              <span>Visi, Misi & Tujuan Sekolah</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Panduan filosofis dan capaian strategis mutu lulusan SMAN 1 Halmahera Timur.
            </p>
          </div>

          {/* Visi */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 block">
                Visi Sekolah *
              </label>
              <span className="text-[10px] text-slate-400">Kalimat Visi Utama</span>
            </div>
            <textarea
              rows={3}
              required
              value={visi}
              onChange={(e) => setVisi(e.target.value)}
              placeholder="Unggul dalam prestasi, memiliki karakter pembelajar, terampil dan kreatif menghargai keberagaman serta tangguh dan mandiri berdasarkan delapan dimensi profil lulusan."
              className="w-full px-4 py-3 text-xs bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 leading-relaxed font-medium"
            />
          </div>

          {/* Misi */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 block">
                Misi Sekolah (Daftar Poin-Poin) *
              </label>
              <span className="text-[10px] text-slate-400">Format bernomor 1, 2, 3...</span>
            </div>
            <textarea
              rows={7}
              required
              value={misi}
              onChange={(e) => setMisi(e.target.value)}
              placeholder="1. Menyelenggarakan proses pendidikan yang berorientasi pada pencapaian prestasi akademik...&#10;2. Menumbuhkembangkan budaya pembelajar sepanjang hayat...&#10;3. Menanamkan nilai-nilai keimanan, ketakwaan, dan budi pekerti luhur..."
              className="w-full px-4 py-3 text-xs bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 leading-relaxed"
            />
          </div>

          {/* Tujuan */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 block">
                Tujuan Pendidikan Sekolah *
              </label>
              <span className="text-[10px] text-slate-400">Target capaian lulusan</span>
            </div>
            <textarea
              rows={6}
              required
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              placeholder="1. Menghasilkan lulusan yang memiliki kompetensi akademik unggul...&#10;2. Mengembangkan potensi peserta didik dalam bidang sains, teknologi, seni budaya...&#10;3. Terbentuknya karakter lulusan yang mencerminkan delapan dimensi profil lulusan..."
              className="w-full px-4 py-3 text-xs bg-[#F9F9F8] border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* STICKY BOTTOM SAVE ACTION BAR */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-xs text-slate-500">
          Perubahan langsung tersimpan ke Supabase Database secara realtime.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan ke Supabase...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Pengaturan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

