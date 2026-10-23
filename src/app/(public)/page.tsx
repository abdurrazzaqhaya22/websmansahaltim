import React from "react";
import { createClient } from "@/lib/supabase/server";
import { AnimatedHomePage } from "@/components/AnimatedHomePage";
import type { Settings, Article, GalleryItem } from "@/types/database";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch settings sekolah & kepsek
  const { data: settingsData } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  // Fetch 6 artikel terbaru
  const { data: articlesData } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  // Fetch 2 pengumuman penting untuk Kotak 3 Bento Grid
  const { data: announcementsData } = await supabase
    .from("articles")
    .select("*")
    .eq("tipe", "pengumuman")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(2);

  // Fetch 5 foto galeri
  const { data: galleryData } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const settings = settingsData as Settings | null;
  const articles = (articlesData as Article[]) || [];
  const announcements = (announcementsData as Article[]) || [];
  const gallery = (galleryData as GalleryItem[]) || [];

  return (
    <AnimatedHomePage
      settings={settings}
      articles={articles}
      announcements={announcements}
      gallery={gallery}
    />
  );
}
