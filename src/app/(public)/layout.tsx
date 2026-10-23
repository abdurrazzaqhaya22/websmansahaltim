import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementPopup } from "@/components/AnnouncementPopup";
import type { Settings, SpecialLink, Article } from "@/types/database";

export const revalidate = 60; // Cache revalidate every 60 seconds

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Fetch settings
  const { data: settingsData } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  // Fetch active special links
  const { data: linksData } = await supabase
    .from("special_links")
    .select("*")
    .eq("is_active", true)
    .order("urutan", { ascending: true });

  // Fetch latest announcement for pop-up
  const { data: announcementData } = await supabase
    .from("articles")
    .select("*")
    .eq("tipe", "pengumuman")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const settings = settingsData as Settings | null;
  const specialLinks = (linksData as SpecialLink[]) || [];
  const latestAnnouncement = announcementData as Article | null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar specialLinks={specialLinks} />
      <AnnouncementPopup announcement={latestAnnouncement} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}

