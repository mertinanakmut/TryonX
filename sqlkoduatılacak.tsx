
/* 
  TryonX - ULTIMATE DATABASE SCHEMA v23.0 (FULL ARENA & VISIBILITY SYNC)
  -------------------------------------------------------------
  TALİMAT: Bu kodun tamamını kopyalayın ve Supabase 
  SQL Editor (Dashboard -> SQL Editor -> New Query) 
  üzerinde yapıştırıp "Run" butonuna basın.
  -------------------------------------------------------------
*/

export const SQL_SCHEMA = `
-- 0. TEMEL YAPILANDIRMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLOLAR

-- PROFİLLER (Genişletilmiş Görünürlük Ayarlarıyla)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'brand')), 
  bio text,
  avatar_url text,
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'brands', 'private')),
  followers text[] DEFAULT '{}',
  following text[] DEFAULT '{}',
  saved_posts text[] DEFAULT '{}',
  lookbook jsonb DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- ÜRÜNLER (MARKETPLACE)
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  "brandId" text, 
  "brandName" text, 
  "brandLogo" text,
  name text NOT NULL, 
  description text,
  price numeric NOT NULL, 
  currency text DEFAULT '₺',
  "imageUrl" text NOT NULL, 
  category text, 
  "buyLink" text,
  likes integer DEFAULT 0, 
  views integer DEFAULT 0,
  comments jsonb DEFAULT '[]'::jsonb,
  "trendScore" numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- ARENA GÖNDERİLERİ (RUNWAY - Manuel ve Nöral Filtreli)
CREATE TABLE IF NOT EXISTS public.runway_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  "userId" uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  "userName" text,
  "userAvatar" text,
  "resultImage" text NOT NULL,
  "garmentImage" text,
  category text,
  vibe text,
  likes integer DEFAULT 0,
  liked_by text[] DEFAULT '{}',
  saved_by text[] DEFAULT '{}',
  comments jsonb DEFAULT '[]'::jsonb,
  is_manual boolean DEFAULT false,
  trend_score numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- YARIŞMALAR
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL, 
  tag text, 
  description text,
  deadline text, 
  prize text, 
  "bannerImage" text,
  "linkedProductId" uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. ETKİLEŞİM FONKSİYONLARI (RPC)

-- Arena Gönderisi Beğeni İşlemi (Aynı kullanıcı sadece bir kez beğenebilir)
CREATE OR REPLACE FUNCTION increment_runway_like(post_id uuid, user_id text) RETURNS void AS $$
BEGIN
    UPDATE runway_posts 
    SET likes = likes + 1, 
        liked_by = array_append(liked_by, user_id),
        trend_score = trend_score + 15 
    WHERE id = post_id AND NOT (liked_by @> ARRAY[user_id]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Arena Gönderisi Yorum Ekleme
CREATE OR REPLACE FUNCTION add_runway_comment(post_id uuid, new_comment jsonb) RETURNS void AS $$
BEGIN
    UPDATE runway_posts 
    SET comments = COALESCE(comments, '[]'::jsonb) || new_comment,
        trend_score = trend_score + 10 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ürün Beğenisi
CREATE OR REPLACE FUNCTION increment_product_like(pid uuid) RETURNS void AS $$
BEGIN
    UPDATE products 
    SET likes = likes + 1, 
        "trendScore" = "trendScore" + 10 
    WHERE id = pid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ürün Yorumu Ekleme
CREATE OR REPLACE FUNCTION add_product_comment(pid uuid, new_comment jsonb) RETURNS void AS $$
BEGIN
    UPDATE products 
    SET comments = COALESCE(comments, '[]'::jsonb) || new_comment,
        "trendScore" = "trendScore" + 5
    WHERE id = pid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ürün Görüntüleme Artışı
CREATE OR REPLACE FUNCTION increment_product_view(pid uuid) RETURNS void AS $$
BEGIN
    UPDATE products 
    SET views = views + 1, 
        "trendScore" = "trendScore" + 1 
    WHERE id = pid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RLS GÜVENLİK POLİTİKALARI (Arena Görünürlük Mantığıyla Uyumlu)

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runway_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Runway Gönderileri: Herkes görebilir (Filtreleme JS tarafında profile.visibility'ye göre yapılır)
    DROP POLICY IF EXISTS "Runway public select" ON public.runway_posts;
    CREATE POLICY "Runway public select" ON public.runway_posts FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can post to Arena" ON public.runway_posts;
    CREATE POLICY "Users can post to Arena" ON public.runway_posts FOR INSERT WITH CHECK (auth.uid() = "userId");

    DROP POLICY IF EXISTS "Users can delete own posts" ON public.runway_posts;
    CREATE POLICY "Users can delete own posts" ON public.runway_posts FOR DELETE USING (auth.uid() = "userId");

    -- Profil Verileri: Herkes görebilir
    DROP POLICY IF EXISTS "Profiles public select" ON public.profiles;
    CREATE POLICY "Profiles public select" ON public.profiles FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
    CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

    -- Ürünler ve Yarışmalar: Herkes görebilir, Sadece admin/brand ekleyebilir (Simüle edilmiş admin kontrolü)
    DROP POLICY IF EXISTS "Products public select" ON public.products;
    CREATE POLICY "Products public select" ON public.products FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Challenges public select" ON public.challenges;
    CREATE POLICY "Challenges public select" ON public.challenges FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Admin product insert" ON public.products;
    CREATE POLICY "Admin product insert" ON public.products FOR INSERT WITH CHECK (true); -- Dashboard üzerinden yetki kontrolü yapılır

    DROP POLICY IF EXISTS "Admin challenge insert" ON public.challenges;
    CREATE POLICY "Admin challenge insert" ON public.challenges FOR INSERT WITH CHECK (true);
END $$;

-- 4. OTOMATİK PROFİL TETİKLEYİCİSİ (Yeni Kayıtlar İçin)
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, visibility)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    'user',
    'public'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;
