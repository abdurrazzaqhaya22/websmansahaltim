import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SMA Negeri 1 Halmahera Timur",
    template: "%s | SMAN 1 Halmahera Timur",
  },
  description:
    "Website Resmi SMA Negeri 1 Halmahera Timur - Membangun generasi berakhlak mulia, unggul dalam prestasi, dan berwawasan global di Maluku Utara.",
  keywords: [
    "SMAN 1 Halmahera Timur",
    "SMA Negeri 1 Halmahera Timur",
    "Sekolah Haltim",
    "SMA Maluku Utara",
    "Pendidikan Halmahera Timur",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-slate-900 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
