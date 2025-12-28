
/* 
  SUPABASE SQL SETUP SCRIPT
  -----------------------------------------
  DİKKAT: Supabase SQL Editor'a yapıştırırken SADECE 
  aşağıdaki çizgiden sonraki kodları kopyalayın!
  -----------------------------------------

-- 1. UZANTILAR
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLOLAR (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'user', 
  bio text,
  avatar_url text,
  visibility text DEFAULT 'public',
  followers text[] DEFAULT '{}',
  following text[] DEFAULT '{}',
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. TABLOLAR (Products)
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  "brandId" text,
  "brandName" text,
  "brandLogo" text,
  name text NOT NULL,
  description text,
  price numeric,
  currency text DEFAULT '₺',
  "imageUrl" text,
  category text,
  "buyLink" text,
  likes integer DEFAULT 0,
  views integer DEFAULT 0,
  "trendScore" numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 4. TABLOLAR (Challenges)
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  tag text,
  description text,
  rules text[],
  "linkedProductId" text,
  deadline text,
  prize text,
  participants integer DEFAULT 0,
  "bannerImage" text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 5. RLS AKTIF ETME
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- 6. POLITIKALAR
DROP POLICY IF EXISTS "Herkes profilleri görebilir" ON public.profiles;
CREATE POLICY "Herkes profilleri görebilir" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Kullanıcılar kendi profilini güncelleyebilir" ON public.profiles;
CREATE POLICY "Kullanıcılar kendi profilini güncelleyebilir" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Herkes ürünleri görebilir" ON public.products;
CREATE POLICY "Herkes ürünleri görebilir" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Herkes yarışmaları görebilir" ON public.challenges;
CREATE POLICY "Herkes yarışmaları görebilir" ON public.challenges FOR SELECT USING (true);

-- 7. OTOMATIK PROFIL OLUSTURMA FONKSIYONU
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. TRIGGER TANIMLAMA
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. ADMIN YETKISI TANIMLAMA
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'mert.akmut44@gmail.com';

*/

export {};
