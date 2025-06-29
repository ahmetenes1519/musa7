/*
  # RPC Fonksiyonları - Sayaç Güncellemeleri

  1. Post Sayaçları
    - Beğeni sayısı artırma/azaltma
    - Yorum sayısı artırma
    - Paylaşım sayısı artırma

  2. Dua Request Sayaçları
    - Dua sayısı artırma/azaltma
    - Yorum sayısı artırma

  3. Güvenlik
    - Sadece authenticated kullanıcılar erişebilir
    - Atomik işlemler
*/

-- Post beğeni sayısını artır
CREATE OR REPLACE FUNCTION increment_post_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET likes_count = likes_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Post beğeni sayısını azalt
CREATE OR REPLACE FUNCTION decrement_post_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Post yorum sayısını artır
CREATE OR REPLACE FUNCTION increment_post_comments(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET comments_count = comments_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Post paylaşım sayısını artır
CREATE OR REPLACE FUNCTION increment_post_shares(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET shares_count = shares_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dua request dua sayısını artır
CREATE OR REPLACE FUNCTION increment_dua_prayers(dua_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE dua_requests 
  SET prayers_count = prayers_count + 1 
  WHERE id = dua_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dua request dua sayısını azalt
CREATE OR REPLACE FUNCTION decrement_dua_prayers(dua_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE dua_requests 
  SET prayers_count = GREATEST(prayers_count - 1, 0)
  WHERE id = dua_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dua request yorum sayısını artır
CREATE OR REPLACE FUNCTION increment_dua_comments(dua_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE dua_requests 
  SET comments_count = comments_count + 1 
  WHERE id = dua_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonksiyon izinleri
GRANT EXECUTE ON FUNCTION increment_post_likes(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_post_likes(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_post_comments(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_post_shares(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_dua_prayers(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_dua_prayers(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_dua_comments(uuid) TO authenticated;