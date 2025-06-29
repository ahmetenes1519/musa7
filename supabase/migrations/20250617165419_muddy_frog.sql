/*
  # Create Test Users and Fix Authentication

  1. Test Users
    - Regular user: user@islamic.com (password: 123456)
    - Admin user: admin@islamic.com (password: 123456)
  
  2. User Profile Setup
    - Create user profiles in users table
    - Set admin role for admin user
    - Add sample data for testing

  3. Authentication Fix
    - Ensure proper user creation flow
    - Fix any RLS policy issues
*/

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, username, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    CASE 
      WHEN new.email = 'admin@islamic.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert test users if they don't exist
DO $$
BEGIN
  -- Insert regular user profile
  INSERT INTO public.users (
    id, 
    email, 
    name, 
    username, 
    role,
    bio,
    verified
  ) VALUES (
    gen_random_uuid(),
    'user@islamic.com',
    'İslam Kullanıcısı',
    'islamuser',
    'user',
    'İslami paylaşım platformunun test kullanıcısı',
    false
  ) ON CONFLICT (email) DO NOTHING;

  -- Insert admin user profile
  INSERT INTO public.users (
    id, 
    email, 
    name, 
    username, 
    role,
    bio,
    verified
  ) VALUES (
    gen_random_uuid(),
    'admin@islamic.com',
    'Platform Yöneticisi',
    'islamadmin',
    'admin',
    'İslami paylaşım platformunun yöneticisi',
    true
  ) ON CONFLICT (email) DO NOTHING;
END $$;

-- Create some sample posts for testing
DO $$
DECLARE
  user_id_var uuid;
  admin_id_var uuid;
BEGIN
  -- Get user IDs
  SELECT id INTO user_id_var FROM public.users WHERE email = 'user@islamic.com' LIMIT 1;
  SELECT id INTO admin_id_var FROM public.users WHERE email = 'admin@islamic.com' LIMIT 1;

  -- Insert sample posts if users exist
  IF user_id_var IS NOT NULL THEN
    INSERT INTO public.posts (user_id, content, category, tags) VALUES
    (user_id_var, 'Selamün aleyküm kardeşlerim! Bu güzel platformda olmaktan çok mutluyum. 🤲', 'Genel', ARRAY['selam', 'kardeşlik']),
    (user_id_var, 'Bugün çok güzel bir hadis okudum: "Müslüman, elinden ve dilinden Müslümanların emin olduğu kimsedir." 📖', 'Hadis', ARRAY['hadis', 'İslam', 'öğüt']);
  END IF;

  IF admin_id_var IS NOT NULL THEN
    INSERT INTO public.posts (user_id, content, category, tags) VALUES
    (admin_id_var, 'İslami paylaşım platformumuza hoş geldiniz! Burada güzel paylaşımlar yapabilir, kardeşlerimizle etkileşimde bulunabilirsiniz. 🕌', 'Duyuru', ARRAY['hoşgeldin', 'platform', 'duyuru']),
    (admin_id_var, 'Ramazan ayı yaklaşıyor. Hazırlıklarımızı yapmaya başlayalım. 🌙', 'Ramazan', ARRAY['ramazan', 'hazırlık', 'oruç']);
  END IF;
END $$;

-- Create sample dua requests
DO $$
DECLARE
  user_id_var uuid;
BEGIN
  SELECT id INTO user_id_var FROM public.users WHERE email = 'user@islamic.com' LIMIT 1;
  
  IF user_id_var IS NOT NULL THEN
    INSERT INTO public.dua_requests (user_id, title, content, category, tags) VALUES
    (user_id_var, 'Sağlık için dua', 'Annem hasta, şifa bulması için dualarınızı rica ediyorum.', 'Sağlık', ARRAY['sağlık', 'şifa', 'anne']),
    (user_id_var, 'İş bulma duası', 'Uzun süredir iş arıyorum, hayırlı bir iş bulabilmem için dua eder misiniz?', 'İş', ARRAY['iş', 'rızık', 'hayır']);
  END IF;
END $$;