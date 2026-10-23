import React from "react";
import { createClient } from "@/lib/supabase/server";
import { StaffManager } from "@/components/admin/StaffManager";
import type { Staff } from "@/types/database";

export const metadata = {
  title: "Kelola Guru & Staf | Admin SMAN 1 Halmahera Timur",
};

export const revalidate = 0;

export default async function AdminGuruStafPage() {
  const supabase = await createClient();

  const { data: staffData } = await supabase
    .from("staff")
    .select("*")
    .order("urutan", { ascending: true })
    .order("created_at", { ascending: true });

  const staffList = (staffData as Staff[]) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#122238]">
          Kelola Dewan Guru & Tenaga Kependidikan
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Atur nama pengajar, jabatan, foto, urutan penampilan, dan status aktif.
        </p>
      </div>

      <StaffManager initialStaff={staffList} />
    </div>
  );
}

