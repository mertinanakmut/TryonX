
/* 
  TryonX - FULL NEURAL DATABASE SCHEMA v3.0 (Eksiksiz & Güncel)
  -----------------------------------------
  TALİMATLAR:
  1. Supabase Dashboard -> SQL Editor kısmına gidin.
  2. "New Query" butonuna basın.
  3. Aşağıdaki tırnak içindeki DATABASE_SCHEMA_SQL içeriğini TAMAMINI kopyalayıp yapıştırın ve "Run" butonuna basın.
  -----------------------------------------
*/

export const DATABASE_SCHEMA_SQL = `
-- 1. Eklentileri Etkinleştir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiller Tablosu (Users)
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
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. Ürünler Tablosu (Marketplace)
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
  category text CHECK (category IN ('tops', 'bottoms', 'one-piece')),
  "buyLink" text,
  likes integer DEFAULT 0,
  views integer DEFAULT 0,
  "trendScore" numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 4. Yarışmalar Tablosu (Arena)
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  tag text,
  description text,
  rules text[] DEFAULT '{}',
  "linkedProductId" text,
  deadline text,
  prize text,
  participants integer DEFAULT 0,
  "bannerImage" text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 5. Runway Paylaşımları (Posts)
CREATE TABLE IF NOT EXISTS public.runway_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  "userId" uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  "userName" text,
  "userAvatar" text,
  "resultImage" text NOT NULL,
  "garmentImage" text,
  category text,
  vibe text,
  votes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 6. Yorumlar Tablosu (Comments for Products & Posts)
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  "targetId" uuid NOT NULL, -- product_id veya post_id
  "userId" uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  "userName" text,
  "userAvatar" text,
  text text NOT NULL,
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 7. RLS (Row Level Security) Ayarları
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runway_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 8. RLS Politikaları
-- Profiller: Herkes görebilir, sadece sahibi güncelleyebilir
DROP POLICY IF EXISTS "Public Profiles Access" ON public.profiles;
CREATE POLICY "Public Profiles Access" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Owners can update profiles" ON public.profiles;
CREATE POLICY "Owners can update profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Ürünler & Yarışmalar: Herkes görebilir, Admin ekleyebilir/silebilir
DROP POLICY IF EXISTS "Public Products Access" ON public.products;
CREATE POLICY "Public Products Access" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Product Control" ON public.products;
CREATE POLICY "Admin Product Control" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'brand'))
);

DROP POLICY IF EXISTS "Public Challenges Access" ON public.challenges;
CREATE POLICY "Public Challenges Access" ON public.challenges FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Challenge Control" ON public.challenges;
CREATE POLICY "Admin Challenge Control" ON public.challenges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Runway & Yorumlar
DROP POLICY IF EXISTS "Public Runway Access" ON public.runway_posts;
CREATE POLICY "Public Runway Access" ON public.runway_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can post to runway" ON public.runway_posts;
CREATE POLICY "Users can post to runway" ON public.runway_posts FOR INSERT WITH CHECK (auth.uid() = "userId");

DROP POLICY IF EXISTS "Public Comments Access" ON public.comments;
CREATE POLICY "Public Comments Access" ON public.comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can comment" ON public.comments;
CREATE POLICY "Authenticated users can comment" ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 9. Otomatik Profil Oluşturma Tetikleyicisi (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, role)
  VALUES (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    name = coalesce(excluded.name, profiles.name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. Admin Tanımlama
-- Not: Kayıt olduktan sonra email adresinizle admin yetkisi verir.
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'mert.akmut44@gmail.com';
`;
