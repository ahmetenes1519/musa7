/*
  # Auth Tetikleyicisi - Yeni Kullanıcı Otomatik Profil Oluşturma

  1. Fonksiyon
    - Auth.users tablosuna eklenen her yeni kullanıcı için otomatik profil oluşturma
    - E-posta bazlı admin rolü atama
    - Hata durumlarında güvenli işleme

  2. Tetikleyici
    - Auth signup sonrası otomatik çalışma
    - Profil oluşturma işlemini otomatikleştirme
*/

-- Yeni kullanıcı işleme fonksiyonu
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
      WHEN new.email = 'admin@islamic.com' THEN 'admin'::text
      ELSE 'user'::text
    END
  );
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Kullanıcı zaten mevcut, sadece devam et
    RETURN new;
  WHEN OTHERS THEN
    -- Hata durumunda uyarı ver ama auth işlemini engelleme
    RAISE WARNING 'Kullanıcı profili oluşturma hatası: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mevcut tetikleyiciyi kaldır
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Yeni kullanıcı tetikleyicisi
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Fonksiyon izinleri
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;