import React from "react";
import { createClient } from "@/lib/supabase/server";
import { AnimatedHomePage } from "@/components/AnimatedHomePage";
import type { Settings, Article, GalleryItem } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let settings: Settings | null = null;
  let articles: Article[] = [];
  let announcements: Article[] = [];
  let gallery: GalleryItem[] = [];

  try {
    const supabase = await createClient();

    // Fetch in parallel
    const [settingsRes, articlesRes, announcementsRes, galleryRes] =
      await Promise.all([
        supabase.from("settings").select("*").limit(1).maybeSingle(),
        supabase
          .from("articles")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("articles")
          .select("*")
          .eq("tipe", "pengumuman")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(2),
        supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    if (settingsRes.data) settings = settingsRes.data as Settings;
    if (articlesRes.data) articles = articlesRes.data as Article[];
    if (announcementsRes.data)
      announcements = announcementsRes.data as Article[];
    if (galleryRes.data) gallery = galleryRes.data as GalleryItem[];
  } catch (err) {
    console.error("HomePage fetch error:", err);
  }

  return (
    <AnimatedHomePage
      settings={settings}
      articles={articles}
      announcements={announcements}
      gallery={gallery}
    />
  );
}
