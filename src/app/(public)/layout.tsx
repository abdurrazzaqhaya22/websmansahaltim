import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementPopup } from "@/components/AnnouncementPopup";
import type { Settings, SpecialLink, Article } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: Settings | null = null;
  let specialLinks: SpecialLink[] = [];
  let latestAnnouncement: Article | null = null;

  try {
    const supabase = await createClient();

    // Fetch settings
    const { data: settingsData } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (settingsData) settings = settingsData as Settings;

    // Fetch active special links
    const { data: linksData } = await supabase
      .from("special_links")
      .select("*")
      .eq("is_active", true)
      .order("urutan", { ascending: true });

    if (linksData) specialLinks = linksData as SpecialLink[];

    // Fetch latest announcement for pop-up
    const { data: announcementData } = await supabase
      .from("articles")
      .select("*")
      .eq("tipe", "pengumuman")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (announcementData) latestAnnouncement = announcementData as Article;
  } catch (err) {
    console.error("PublicLayout error:", err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar specialLinks={specialLinks} />
      <AnnouncementPopup announcement={latestAnnouncement} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
