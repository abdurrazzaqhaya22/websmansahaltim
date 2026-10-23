import React from "react";
import Image from "next/image";
import { User } from "lucide-react";
import type { Staff } from "@/types/database";

interface StaffCardProps {
  staff: Staff;
}

export function StaffCard({ staff }: StaffCardProps) {
  const photo = staff.foto_url;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center p-6">
      <div className="relative w-28 h-28 rounded-full overflow-hidden border border-slate-200 mb-4 bg-slate-100">
        {photo ? (
          <Image
            src={photo}
            alt={staff.nama}
            fill
            sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <User className="w-10 h-10" />
          </div>
        )}
      </div>

      <h3 className="text-base font-bold text-slate-900 leading-tight mb-1">
        {staff.nama}
      </h3>
      <p className="text-xs text-slate-500 font-medium leading-snug">
        {staff.jabatan}
      </p>
    </div>
  );
}