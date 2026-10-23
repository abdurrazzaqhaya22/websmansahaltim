-- ========================================================
-- UPDATE SKEMA TABEL: settings
-- ========================================================
DROP TABLE IF EXISTS public.settings CASCADE;

CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_sekolah TEXT NOT NULL DEFAULT 'SMA Negeri 1 Halmahera Timur',
    alamat TEXT DEFAULT 'Jl. Lintas Halmahera Timur, Desa Sailal, Kecamatan Maba, Kabupaten Halmahera Timur',
    npsn TEXT DEFAULT '60201362',
    akreditasi TEXT DEFAULT 'A',
    sejarah_sekolah TEXT,
    visi TEXT,
    misi TEXT,
    tujuan TEXT,
    sambutan_kepsek TEXT,
    nama_kepsek TEXT DEFAULT 'Drs. H. M. Taher, M.Pd.',
    foto_kepsek_url TEXT DEFAULT 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    telepon TEXT DEFAULT '(0924) 21008',
    email TEXT DEFAULT 'info@sman1haltim.sch.id',
    maps_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127607.72620167527!2d128.2713833!3d0.6974751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x329cbfbc0db966e3%3A0xb35a0fec18bf686e!2sHalmahera%20Timur%2C%20North%20Maluku!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Settings" 
ON public.settings FOR SELECT 
USING (true);

CREATE POLICY "Admin Full Access Settings" 
ON public.settings FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ========================================================
-- SEED DATA AWAL TABEL: settings
-- ========================================================
INSERT INTO public.settings (
    nama_sekolah,
    alamat,
    npsn,
    akreditasi,
    sejarah_sekolah,
    visi,
    misi,
    tujuan,
    sambutan_kepsek,
    nama_kepsek,
    foto_kepsek_url
) VALUES (
    'SMA Negeri 1 Halmahera Timur',
    'Jl. Lintas Halmahera Timur, Desa Sailal, Kecamatan Maba, Kabupaten Halmahera Timur',
    '60201362',
    'A',
    'SMA Negeri 1 Halmahera Timur berawal dari SMA PGRI Buli yang didirikan pada tahun 1989 untuk menjawab kebutuhan akses pendidikan menengah atas bagi generasi muda di wilayah Halmahera Timur. Seiring berjalannya waktu dan pesatnya perkembangan wilayah, dengan komitmen kuat dari pemerintah daerah dan tokoh masyarakat dalam meningkatkan mutu serta pemerataan pendidikan, sekolah ini resmi dinegerikan pada tahun 2004 berdasarkan Surat Keputusan Bupati No 421.3/KEP/07/2004. Sejak saat itu, SMA Negeri 1 Halmahera Timur terus bertransformasi menjadi institusi rujukan yang melahirkan putra-putri berprestasi, berkarakter luhur, dan siap bersaing di tingkat nasional.',
    'Unggul dalam prestasi, memiliki karakter pembelajar, terampil dan kreatif menghargai keberagaman serta tangguh dan mandiri berdasarkan delapan dimensi profil lulusan.',
    '1. Menyelenggarakan proses pendidikan yang berorientasi pada pencapaian prestasi akademik dan non-akademik berstandar mutu tinggi.
2. Menumbuhkembangkan budaya pembelajar sepanjang hayat yang kritis, terampil, inovatif, dan berdaya cipta.
3. Menanamkan nilai-nilai keimanan, ketakwaan, dan budi pekerti luhur dalam bingkai kearifan lokal serta penghargaan terhadap keberagaman.
4. Membentuk kepribadian peserta didik yang tangguh, mandiri, disiplin, dan bertanggung jawab.
5. Mewujudkan lingkungan sekolah yang sehat, aman, inklusif, dan berwawasan lingkungan global.',
    '1. Menghasilkan lulusan yang memiliki kompetensi akademik unggul dan berdaya saing tinggi untuk menembus perguruan tinggi terkemuka.
2. Mengembangkan potensi peserta didik dalam bidang sains, teknologi, seni budaya, dan olahraga hingga tingkat daerah maupun nasional.
3. Terbentuknya karakter lulusan yang mencerminkan delapan dimensi profil lulusan yang tangguh, berintegritas, dan berakhlak mulia.
4. Meningkatkan tata kelola kelembagaan pendidikan yang transparan, akuntabel, dan berbasis teknologi digital.',
    'Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat dan karunia-Nya, sehingga website resmi SMA Negeri 1 Halmahera Timur ini dapat hadir sebagai jendela informasi dan komunikasi bagi seluruh civitas akademika, orang tua siswa, alumni, dan masyarakat luas.

Di era disrupsi digital ini, keterbukaan informasi dan pemanfaatan teknologi merupakan keniscayaan. Kami berkomitmen untuk terus menghadirkan ekosistem pembelajaran yang berkualitas, berkarakter, dan berdaya saing global tanpa melupakan akar budaya luhur Bumi Moloku Kie Raha.

Mari bersama-sama kita songsong masa depan gemilang dengan semangat integritas, dedikasi, dan prestasi!',
    'Drs. H. M. Taher, M.Pd.',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop'
);

