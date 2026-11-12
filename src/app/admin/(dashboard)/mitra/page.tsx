import React from "react";
import { createClient } from "@/lib/supabase/server";
import { MitraManager } from "@/components/admin/MitraManager";
import type { Mitra } from "@/types/database";

export const metadata = {
  title: "Kelola Mitra Kerjasama | Admin SMAN 1 Halmahera Timur",
};

export const revalidate = 0;

export default async function AdminMitraPage() {
  const supabase = await createClient();

  const { data: mitraData } = await supabase
    .from("mitra")
    .select("*")
    .order("created_at", { ascending: false });

  const mitraItems = (mitraData as Mitra[]) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#122238]">
          Logo Mitra Kerjasama & Sponsor
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Kelola logo instansi, universitas, dinas, atau perusahaan mitra yang ditampilkan di footer website resmi.
        </p>
      </div>

      <MitraManager initialItems={mitraItems} />
    </div>
  );
}
