import React from "react";
import { createClient } from "@/lib/supabase/server";
import { SettingsTabsForm } from "@/components/admin/SettingsTabsForm";
import type { Settings } from "@/types/database";

export const metadata = {
  title: "Pengaturan Profil & Sekolah | Admin SMAN 1 Halmahera Timur",
};

export const revalidate = 0;

export default async function AdminPengaturanPage() {
  const supabase = await createClient();

  const { data: settingsData } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  const settings = settingsData as Settings | null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900">
          Pengaturan Profil, Sejarah, Visi & Misi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola informasi identitas resmi, sejarah berdirinya sekolah, sambutan kepala sekolah, visi, misi, dan target tujuan sekolah.
        </p>
      </div>

      <SettingsTabsForm initialSettings={settings} />
    </div>
  );
}
