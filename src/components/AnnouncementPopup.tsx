"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, X, ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types/database";

interface AnnouncementPopupProps {
  announcement: Article | null;
}

export function AnnouncementPopup({ announcement }: AnnouncementPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!announcement) return;

    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const lastSeen = localStorage.getItem("last_seen_announcement_date");
      const lastSeenId = localStorage.getItem("last_seen_announcement_id");

      if (lastSeen !== todayStr || lastSeenId !== announcement.id) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage might be disabled in private mode
    }
  }, [announcement]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      localStorage.setItem("last_seen_announcement_date", todayStr);
      if (announcement) {
        localStorage.setItem("last_seen_announcement_id", announcement.id);
      }
    } catch {
      // ignore
    }
  };

  if (!isVisible || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-announcement-title"
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 text-slate-900 rounded-full">
              <Bell className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Pengumuman Resmi
            </span>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatDate(announcement.created_at)}</span>
          </div>

          <h3
            id="modal-announcement-title"
            className="text-xl font-bold text-slate-900 leading-snug tracking-tight"
          >
            {announcement.judul}
          </h3>

          <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-normal">
            {announcement.ringkasan ||
              announcement.konten.replace(/<[^>]*>?/gm, "").slice(0, 180) + "..."}
          </p>
        </div>

        {/* Actions (Coda Pill Button) */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleDismiss}
            className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            Tutup untuk hari ini
          </button>

          <Link
            href={`/berita/${announcement.slug}`}
            onClick={handleDismiss}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full transition-colors"
          >
            <span>Baca Selengkapnya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}