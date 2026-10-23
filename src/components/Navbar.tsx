"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ExternalLink, Sparkles } from "lucide-react";
import { DynamicIcon } from "./DynamicIcon";
import type { SpecialLink } from "@/types/database";

interface NavbarProps {
  specialLinks?: SpecialLink[];
}

export function Navbar({ specialLinks = [] }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Profil Sekolah", href: "/profil" },
    { label: "Guru & Staf", href: "/guru-staf" },
    { label: "Berita & Pengumuman", href: "/berita" },
    { label: "Galeri", href: "/galeri" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu and dropdown on route change without triggering cascading effect render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setDropdownOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & School Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-10 h-10 shrink-0 p-0.5 bg-white rounded-full border border-slate-200 overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo SMAN 1 Halmahera Timur"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 group-hover:text-slate-600 transition-colors leading-tight">
                SMAN 1 HALMAHERA TIMUR
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                FADEL DELA NA MAFIA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Coda Pill Tabs) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-50 border border-slate-200/60">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-white text-slate-900 font-bold border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Special Links Button & Admin Access */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                aria-expanded={dropdownOpen}
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                <span>Pintasan</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-200 rounded-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Tautan Layanan Resmi
                    </p>
                  </div>
                  {specialLinks.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-400 italic">
                      Belum ada tautan khusus aktif.
                    </div>
                  ) : (
                    specialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url_tujuan}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-slate-500">
                            <DynamicIcon name={link.icon} className="w-4 h-4" />
                          </span>
                          <span>{link.nama_link}</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-700" />
                      </a>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link
              href="/admin"
              className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-full transition-all"
            >
              Portal Admin
            </Link>
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 text-sm font-semibold rounded-full ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-3 border-t border-slate-100">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Pintasan Layanan
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {specialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url_tujuan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-full"
                >
                  <span className="flex items-center gap-2">
                    <DynamicIcon name={link.icon} className="w-4 h-4 text-slate-600" />
                    {link.nama_link}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                href="/admin"
                className="block text-center text-xs font-bold py-3 px-4 bg-slate-900 text-white rounded-full"
              >
                Portal Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}