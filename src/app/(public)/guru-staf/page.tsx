import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StaffCard } from "@/components/StaffCard";
import type { Staff } from "@/types/database";

export const metadata = {
  title: "Dewan Guru & Tenaga Kependidikan",
  description: "Daftar pendidik dan staf profesional SMA Negeri 1 Halmahera Timur.",
};

export const revalidate = 60;

export default async function GuruStafPage() {
  const supabase = await createClient();

  const { data: staffData } = await supabase
    .from("staff")
    .select("*")
    .eq("status_aktif", true)
    .order("urutan", { ascending: true })
    .order("created_at", { ascending: true });

  const staffList = (staffData as Staff[]) || [];

  return (
    <div className="bg-white min-h-screen py-16 sm:py-24 selection:bg-slate-900 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="space-y-4 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-semibold">Guru & Staf</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-[0.2em] uppercase">
            FADEL DELA NA MAFIA &bull; DEWAN PENDIDIK
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1.05]">
            Dewan Guru & Tenaga Kependidikan.
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl font-normal leading-relaxed">
            Pendidik berdedikasi tinggi dan staf profesional yang membimbing serta melayani seluruh civitas akademika SMA Negeri 1 Halmahera Timur.
          </p>
        </div>

        {staffList.length === 0 ? (
          <div className="py-24 text-center text-sm text-slate-400 italic bg-white rounded-3xl border border-slate-200">
            Daftar staf dan dewan guru sedang diperbarui.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {staffList.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}