-- ========================================================
-- 1. EXTENSIONS & STORAGE BUCKET
-- ========================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Buat Storage Bucket Publik untuk Foto/Aset
INSERT INTO storage.buckets (id, name, public) 
VALUES ('school-assets', 'school-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy Storage: Siapapun bisa melihat gambar (Public Read)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'school-assets');

-- Policy Storage: Hanya Admin login yang bisa upload/edit/hapus gambar
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'school-assets');

CREATE POLICY "Admin Update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'school-assets');

CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'school-assets');


-- ========================================================
-- 2. TABEL: settings (Profil Sekolah & Kepala Sekolah)
-- Menggunakan single-row pattern (id = 1)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    nama_kepsek TEXT NOT NULL DEFAULT 'Nama Kepala Sekolah, S.Pd., M.Pd.',
    foto_kepsek_url TEXT DEFAULT '',
    sambutan_kepsek TEXT DEFAULT 'Selamat datang di website resmi SMA Negeri 1 Halmahera Timur...',
    sejarah_sekolah TEXT DEFAULT 'SMA Negeri 1 Halmahera Timur didirikan dengan komitmen untuk memajukan pendidikan...',
    visi_misi TEXT DEFAULT 'Visi:\nUnggul dalam prestasi, berkarakter, dan berwawasan lingkungan.\n\nMisi:\n1. Meningkatkan mutu pembelajaran.\n2. Membina budi pekerti luhur.',
    alamat TEXT DEFAULT 'Jl. Raya Pendidikan No. 01, Halmahera Timur, Maluku Utara',
    telepon TEXT DEFAULT '(0924) xxxxxxx',
    email TEXT DEFAULT 'info@sman1haltim.sch.id',
    maps_embed_url TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row default awal
INSERT INTO public.settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;


-- ========================================================
-- 3. TABEL: staff (Guru & Tenaga Kependidikan)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    jabatan TEXT NOT NULL,
    foto_url TEXT DEFAULT '',
    status_aktif BOOLEAN DEFAULT true NOT NULL,
    urutan INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ========================================================
-- 4. TABEL: articles (Berita & Pengumuman)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    ringkasan TEXT,
    konten TEXT NOT NULL,
    thumbnail_url TEXT DEFAULT '',
    tipe TEXT NOT NULL CHECK (tipe IN ('berita', 'pengumuman')),
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_tipe ON public.articles(tipe);


-- ========================================================
-- 5. TABEL: gallery (Galeri Kegiatan & Sekolah)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul_foto TEXT NOT NULL,
    image_url TEXT NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ========================================================
-- 6. TABEL: special_links (Menu Khusus / Pintasan Eksternal)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.special_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_link TEXT NOT NULL,
    url_tujuan TEXT NOT NULL,
    icon TEXT DEFAULT 'ExternalLink',
    is_active BOOLEAN DEFAULT true NOT NULL,
    urutan INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ========================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_links ENABLE ROW LEVEL SECURITY;

-- Drop policy jika sudah ada untuk menghindari duplikasi saat re-run
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Read Settings" ON public.settings;
    DROP POLICY IF EXISTS "Public Read Staff" ON public.staff;
    DROP POLICY IF EXISTS "Public Read Articles" ON public.articles;
    DROP POLICY IF EXISTS "Public Read Gallery" ON public.gallery;
    DROP POLICY IF EXISTS "Public Read Special Links" ON public.special_links;

    DROP POLICY IF EXISTS "Admin Full Access Settings" ON public.settings;
    DROP POLICY IF EXISTS "Admin Full Access Staff" ON public.staff;
    DROP POLICY IF EXISTS "Admin Full Access Articles" ON public.articles;
    DROP POLICY IF EXISTS "Admin Full Access Gallery" ON public.gallery;
    DROP POLICY IF EXISTS "Admin Full Access Special Links" ON public.special_links;
END $$;

-- Policy: Publik hanya bisa MEMBACA (SELECT)
CREATE POLICY "Public Read Settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public Read Staff" ON public.staff FOR SELECT USING (status_aktif = true);
CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Special Links" ON public.special_links FOR SELECT USING (is_active = true);

-- Policy: Pengguna Login (Admin) punya AKSES PENUH (CRUD)
CREATE POLICY "Admin Full Access Settings" ON public.settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Staff" ON public.staff FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Articles" ON public.articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Gallery" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Special Links" ON public.special_links FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ========================================================
-- 8. DUMMY / INITIAL SEED DATA
-- ========================================================
INSERT INTO public.articles (judul, slug, ringkasan, konten, thumbnail_url, tipe)
VALUES 
(
  'Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran Baru Dibuka',
  'ppdb-tahun-ajaran-baru',
  'Informasi resmi pendaftaran peserta didik baru SMA Negeri 1 Halmahera Timur.',
  '<p>Pendaftaran Peserta Didik Baru (PPDB) SMA Negeri 1 Halmahera Timur resmi dibuka. Silakan mempersiapkan berkas administrasi seperti Ijazah SMP/sederajat, Kartu Keluarga, dan pas foto terbaru.</p>',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
  'pengumuman'
),
(
  'Siswa SMAN 1 Halmahera Timur Raih Medali Olimpiade Sains',
  'siswa-raih-medali-olimpiade-sains',
  'Prestasi membanggakan kembali diukir dalam ajang kompetisi sains tingkat provinsi.',
  '<p>Keluarga besar SMA Negeri 1 Halmahera Timur mengucapkan selamat atas prestasi membanggakan yang diraih oleh siswa dalam ajang kompetisi sains.</p>',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop',
  'berita'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.special_links (nama_link, url_tujuan, icon, urutan)
VALUES 
('E-Rapor Kemdikbud', 'https://erapor.kemdikbud.go.id', 'BookOpen', 1),
('Portal Dapodik', 'https://dapo.kemdikbud.go.id', 'Database', 2),
('Perpustakaan Digital', 'https://perpustakaan.kemdikbud.go.id', 'Library', 3)
ON CONFLICT DO NOTHING;

