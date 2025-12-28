
/* 
  TryonX - ULTIMATE DATABASE SCHEMA v17.0
  -------------------------------------------------------------
  TALİMAT: Bu kodu Supabase SQL Editor'da çalıştırın.
  -------------------------------------------------------------
*/

export const SQL_SCHEMA = `
-- 0. EKLENTİLER
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLOLAR
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
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  "brandId" text, 
  "brandName" text, 
  "brandLogo" text,
  name text NOT NULL, 
  price numeric NOT NULL, 
  currency text DEFAULT '₺',
  "imageUrl" text NOT NULL, 
  category text, 
  "buyLink" text,
  likes integer DEFAULT 0, 
  views integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL, 
  tag text, 
  description text,
  deadline text, 
  prize text, 
  "bannerImage" text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. RLS AYARLARI
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runway_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
    CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Posts are public" ON public.runway_posts;
    CREATE POLICY "Posts are public" ON public.runway_posts FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can insert posts" ON public.runway_posts;
    CREATE POLICY "Users can insert posts" ON public.runway_posts FOR INSERT WITH CHECK (auth.uid() = "userId");

    DROP POLICY IF EXISTS "Products are public" ON public.products;
    CREATE POLICY "Products are public" ON public.products FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
    CREATE POLICY "Admin can manage products" ON public.products FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'brand'))
    );

    DROP POLICY IF EXISTS "Challenges are public" ON public.challenges;
    CREATE POLICY "Challenges are public" ON public.challenges FOR SELECT USING (true);
END $$;

-- 3. TRIGGERLAR
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. ÖNEMLİ: ADMIN ATAMA KOMUTU
-- Kendinizi admin yapmak için aşağıdaki satırı kendi mailinizle güncelleyip çalıştırın:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'EPOSTANIZ@GMAIL.COM';
`;
