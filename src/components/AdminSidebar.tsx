"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Camera,
  Users,
  Settings as SettingsIcon,
  Link2,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminSidebarProps {
  userEmail: string;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Exact order required by prompt
  const menuItems = [
    {
      label: "1. Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "2. Berita & Pengumuman",
      href: "/admin/berita",
      icon: Newspaper,
    },
    {
      label: "3. Galeri Foto",
      href: "/admin/galeri",
      icon: Camera,
    },
    {
      label: "4. Guru & Staf",
      href: "/admin/guru-staf",
      icon: Users,
    },
    {
      label: "5. Profil & Kepsek",
      href: "/admin/settings",
      icon: SettingsIcon,
    },
    {
      label: "6. Menu Khusus / Link",
      href: "/admin/special-links",
      icon: Link2,
    },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#122238] text-white select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1E3352] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 bg-white rounded-full p-0.5 shrink-0 overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo SMAN 1 Halmahera Timur"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="font-editorial text-sm font-bold tracking-wide text-white leading-tight">
              ADMINISTRATOR
            </h2>
            <p className="text-[10px] text-[#F59E0B] font-semibold uppercase tracking-wider">
              SMAN 1 Haltim
            </p>
          </div>
        </div>

        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Menu Utama
        </p>

        {menuItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#1E3352] text-white font-bold border-l-3 border-[#F59E0B]"
                  : "text-gray-300 hover:bg-[#162740] hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#F59E0B]" : "text-gray-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Info & Footer Actions */}
      <div className="p-4 border-t border-[#1E3352] space-y-3 bg-[#0C1726]/80">
        <div className="px-1 text-[11px] text-gray-300 truncate">
          <p className="text-[10px] text-gray-400 uppercase">Login Sebagai:</p>
          <p className="font-semibold text-white truncate">{userEmail}</p>
        </div>

        <div className="space-y-1 pt-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-gray-300 hover:bg-[#1E3352] hover:text-white transition-colors"
          >
            <span>Buka Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors cursor-pointer"
          >
            <span>Keluar (Logout)</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#122238] text-white px-4 py-3 flex items-center justify-between border-b border-[#1E3352] sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 bg-white rounded-full overflow-hidden p-0.5">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="font-editorial text-sm font-bold">Admin SMAN 1 Haltim</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-gray-300 hover:text-white"
          aria-label="Buka menu admin"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-[#1E3352]">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}

