/*
  # Örnek Veriler - İslami Sosyal Platform

  1. Test Kullanıcıları
    - Normal kullanıcılar
    - Admin kullanıcı
    - Doğrulanmış hesaplar

  2. İçerik
    - Örnek gönderiler
    - Dua talepleri
    - Topluluklar ve etkinlikler
    - Etkileşimler (beğeni, yorum)

  3. Güvenlik
    - Tüm veriler RLS politikalarına uygun
    - Gerçek kullanım senaryolarını yansıtan örnekler
*/

-- Test kullanıcıları oluştur
DO $$
DECLARE
  user_id_1 uuid := '550e8400-e29b-41d4-a716-446655440001';
  user_id_2 uuid := '550e8400-e29b-41d4-a716-446655440002';
  user_id_3 uuid := '550e8400-e29b-41d4-a716-446655440003';
  admin_id uuid := '550e8400-e29b-41d4-a716-446655440004';
  
  post_id_1 uuid := '880e8400-e29b-41d4-a716-446655440001';
  post_id_2 uuid := '880e8400-e29b-41d4-a716-446655440002';
  post_id_3 uuid := '880e8400-e29b-41d4-a716-446655440003';
  post_id_4 uuid := '880e8400-e29b-41d4-a716-446655440004';
  
  dua_id_1 uuid := '990e8400-e29b-41d4-a716-446655440001';
  dua_id_2 uuid := '990e8400-e29b-41d4-a716-446655440002';
  dua_id_3 uuid := '990e8400-e29b-41d4-a716-446655440003';
  
  community_id_1 uuid := '660e8400-e29b-41d4-a716-446655440001';
  community_id_2 uuid := '660e8400-e29b-41d4-a716-446655440002';
  
  event_id_1 uuid := '770e8400-e29b-41d4-a716-446655440001';
  event_id_2 uuid := '770e8400-e29b-41d4-a716-446655440002';
BEGIN
  -- Kullanıcıları ekle (sadece yoksa)
  INSERT INTO users (id, email, name, username, bio, location, verified, role) VALUES
  (user_id_1, 'ahmet@example.com', 'Ahmet Yılmaz', 'ahmetyilmaz', 'İslami değerlere bağlı bir kardeşiniz. Hayır işlerinde aktif olmaya çalışıyorum.', 'İstanbul', true, 'user'),
  (user_id_2, 'fatma@example.com', 'Fatma Kaya', 'fatmakaya', 'Kur''an kursu öğretmeni. İlim öğrenmeyi ve öğretmeyi seviyorum.', 'Ankara', true, 'user'),
  (user_id_3, 'mehmet@example.com', 'Mehmet Demir', 'mehmetdemir', 'Gençlik çalışmaları koordinatörü. İslami gençlik faaliyetleri düzenliyorum.', 'İzmir', false, 'user'),
  (admin_id, 'admin@islamic.com', 'Platform Yöneticisi', 'islamadmin', 'İslami paylaşım platformunun yöneticisi. Topluluk kurallarını koruyorum.', 'İstanbul', true, 'admin')
  ON CONFLICT (id) DO NOTHING;

  -- Örnek gönderiler
  INSERT INTO posts (id, user_id, content, category, tags, likes_count, comments_count) VALUES
  (post_id_1, user_id_1, 'Selamün aleyküm kardeşlerim! Bu güzel platformda olmaktan çok mutluyum. Allah hepimizi hayırda birleştirsin. 🤲', 'Genel', ARRAY['selam', 'kardeşlik', 'hayır'], 15, 3),
  (post_id_2, user_id_2, 'Bugün çok güzel bir hadis okudum: "Müslüman, elinden ve dilinden Müslümanların emin olduğu kimsedir." (Buhari) 📖', 'Hadis', ARRAY['hadis', 'İslam', 'öğüt'], 28, 7),
  (post_id_3, admin_id, 'İslami paylaşım platformumuza hoş geldiniz! Burada güzel paylaşımlar yapabilir, kardeşlerimizle etkileşimde bulunabilirsiniz. 🕌', 'Duyuru', ARRAY['hoşgeldin', 'platform', 'duyuru'], 42, 12),
  (post_id_4, user_id_1, 'Cuma namazından sonra camide güzel bir sohbet vardı. "Sabır ve Şükür" konusu işlendi. Allah razı olsun hocamızdan. 🕌', 'Sohbet', ARRAY['cuma', 'sohbet', 'sabır'], 22, 8)
  ON CONFLICT (id) DO NOTHING;

  -- Örnek dua talepleri
  INSERT INTO dua_requests (id, user_id, title, content, category, is_urgent, tags, prayers_count) VALUES
  (dua_id_1, user_id_1, 'Annem için şifa duası', 'Sevgili kardeşlerim, annem rahatsız. Şifa bulması için dua eder misiniz? Allah razı olsun hepinizden.', 'Sağlık', true, ARRAY['şifa', 'anne', 'sağlık'], 45),
  (dua_id_2, user_id_2, 'İş bulma konusunda dua', 'Uzun süredir iş arıyorum. Helal rızık bulabilmem için dualarınızı bekliyorum. Allah hepimize nasip etsin.', 'İş', false, ARRAY['iş', 'rızık', 'hayır'], 23),
  (dua_id_3, user_id_3, 'Evlilik için dua', 'Hayırlı bir eş bulabilmem için dua eder misiniz? Allah hepimizi hayırlı eşlerle buluştursun.', 'Evlilik', false, ARRAY['evlilik', 'eş', 'hayır'], 67)
  ON CONFLICT (id) DO NOTHING;

  -- Örnek topluluklar
  INSERT INTO communities (id, name, description, category, created_by, member_count, location) VALUES
  (community_id_1, 'İstanbul Gençlik Topluluğu', 'İstanbul''da yaşayan genç Müslümanların buluşma noktası. Birlikte etkinlikler düzenliyor, sohbetler yapıyoruz.', 'Gençlik', user_id_3, 156, 'İstanbul'),
  (community_id_2, 'Kur''an Öğrenme Grubu', 'Kur''an-ı Kerim öğrenmek isteyenler için oluşturulmuş topluluk. Hafızlık ve tecvid dersleri düzenliyoruz.', 'Eğitim', user_id_2, 89, 'Ankara')
  ON CONFLICT (id) DO NOTHING;

  -- Topluluk üyelikleri
  INSERT INTO community_members (community_id, user_id, role) VALUES
  (community_id_1, user_id_3, 'admin'),
  (community_id_1, user_id_1, 'member'),
  (community_id_1, user_id_2, 'member'),
  (community_id_2, user_id_2, 'admin'),
  (community_id_2, user_id_1, 'member')
  ON CONFLICT (community_id, user_id) DO NOTHING;

  -- Örnek etkinlikler
  INSERT INTO events (id, title, description, type, date, time, location_name, location_address, location_city, organizer_name, created_by, capacity, attendees_count) VALUES
  (event_id_1, 'Cuma Sohbeti', 'Her Cuma akşamı düzenlediğimiz İslami sohbet programı. Bu hafta konumuz: "Sabır ve Şükür"', 'Sohbet', '2024-12-20', '20:00', 'Merkez Camii', 'Atatürk Caddesi No:15', 'İstanbul', 'Ahmet Yılmaz', user_id_1, 50, 23),
  (event_id_2, 'Kur''an Kursu Açılışı', 'Yeni dönem Kur''an kursumuzun açılış programı. Tüm yaş grupları için kurslarımız mevcut.', 'Eğitim', '2024-12-22', '14:00', 'Eğitim Merkezi', 'Kızılay Meydanı No:8', 'Ankara', 'Fatma Kaya', user_id_2, 100, 67)
  ON CONFLICT (id) DO NOTHING;

  -- Etkinlik katılımcıları
  INSERT INTO event_attendees (event_id, user_id) VALUES
  (event_id_1, user_id_1),
  (event_id_1, user_id_2),
  (event_id_1, user_id_3),
  (event_id_2, user_id_2),
  (event_id_2, admin_id)
  ON CONFLICT (event_id, user_id) DO NOTHING;

  -- Örnek beğeniler
  INSERT INTO likes (user_id, post_id) VALUES
  (user_id_2, post_id_1),
  (user_id_3, post_id_1),
  (admin_id, post_id_1),
  (user_id_1, post_id_2),
  (user_id_3, post_id_2),
  (admin_id, post_id_2)
  ON CONFLICT DO NOTHING;

  -- Dua beğenileri
  INSERT INTO likes (user_id, dua_request_id) VALUES
  (user_id_2, dua_id_1),
  (user_id_3, dua_id_1),
  (admin_id, dua_id_1),
  (user_id_1, dua_id_2),
  (user_id_3, dua_id_2)
  ON CONFLICT DO NOTHING;

  -- Örnek yorumlar
  INSERT INTO comments (user_id, post_id, content) VALUES
  (user_id_2, post_id_1, 'Aleykümselam kardeşim, hoş geldin! 🤗'),
  (user_id_3, post_id_1, 'Masha Allah, çok güzel bir platform olmuş.'),
  (admin_id, post_id_2, 'Çok güzel bir hadis, Allah razı olsun paylaştığın için.'),
  (user_id_1, post_id_3, 'Teşekkür ederiz, çok güzel bir platform.');

  -- Dua yorumları
  INSERT INTO comments (user_id, dua_request_id, content, is_prayer) VALUES
  (user_id_2, dua_id_1, 'Anneniz için dua ediyorum, Allah şifa versin. 🤲', true),
  (user_id_3, dua_id_1, 'Allah acil şifa versin, amin.', true),
  (admin_id, dua_id_2, 'Allah hayırlı bir iş nasip etsin kardeşim.', true),
  (user_id_1, dua_id_3, 'Allah hayırlı bir eş nasip etsin.', true);

  -- Örnek yer imleri
  INSERT INTO bookmarks (user_id, post_id) VALUES
  (user_id_1, post_id_2),
  (user_id_2, post_id_3),
  (user_id_3, post_id_1)
  ON CONFLICT DO NOTHING;

  -- Dua yer imleri
  INSERT INTO bookmarks (user_id, dua_request_id) VALUES
  (user_id_2, dua_id_1),
  (user_id_3, dua_id_2),
  (admin_id, dua_id_3)
  ON CONFLICT DO NOTHING;

END $$;