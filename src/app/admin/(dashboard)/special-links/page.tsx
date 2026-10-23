import React from "react";
import { createClient } from "@/lib/supabase/server";
import { SpecialLinksManager } from "@/components/admin/SpecialLinksManager";
import type { SpecialLink } from "@/types/database";

export const metadata = {
  title: "Kelola Special Links | Admin SMAN 1 Halmahera Timur",
};

export const revalidate = 0;

export default async function AdminSpecialLinksPage() {
  const supabase = await createClient();

  const { data: linksData } = await supabase
    .from("special_links")
    .select("*")
    .order("urutan", { ascending: true })
    .order("created_at", { ascending: true });

  const links = (linksData as SpecialLink[]) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#122238]">
          Kelola Menu Khusus / Link Eksternal
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Atur pintasan tautan resmi (seperti E-Rapor, Dapodik, Perpustakaan Digital) yang muncul di menu Navbar.
        </p>
      </div>

      <SpecialLinksManager initialLinks={links} />
    </div>
  );
}

