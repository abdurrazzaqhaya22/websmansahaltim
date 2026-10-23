export interface Settings {
  id: string;
  nama_sekolah: string;
  alamat: string;
  npsn: string;
  akreditasi: string;
  sejarah_sekolah: string;
  visi: string;
  misi: string;
  tujuan: string;
  sambutan_kepsek: string;
  nama_kepsek: string;
  foto_kepsek_url: string;
  telepon?: string;
  email?: string;
  maps_embed_url?: string;
  updated_at?: string;
}

export interface Staff {
  id: string;
  nama: string;
  jabatan: string;
  foto_url: string;
  status_aktif: boolean;
  urutan: number;
  created_at: string;
}

export interface Article {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  konten: string;
  thumbnail_url: string;
  tipe: "berita" | "pengumuman";
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  judul_foto: string;
  image_url: string;
  deskripsi: string | null;
  created_at: string;
}

export interface SpecialLink {
  id: string;
  nama_link: string;
  url_tujuan: string;
  icon: string;
  is_active: boolean;
  urutan: number;
  created_at: string;
}
