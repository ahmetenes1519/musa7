/*
  # Sample Data Migration

  1. Sample Data
    - Test users with unique identifiers
    - Sample posts, communities, events, dua requests
    - Likes, comments, bookmarks, and relationships
  
  2. Security
    - All data respects existing RLS policies
    - Uses proper foreign key relationships
*/

-- First, let's check and insert users with completely unique identifiers
DO $$
BEGIN
  -- Insert sample users only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'test.ahmet@islamic.com') THEN
    INSERT INTO users (id, email, name, username, bio, location, verified, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'test.ahmet@islamic.com', 'Ahmet Yılmaz', 'testahmet2024', 'İslami değerlere bağlı bir kardeşiniz. Hayır işlerinde aktif olmaya çalışıyorum.', 'İstanbul', true, 'user');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'test.fatma@islamic.com') THEN
    INSERT INTO users (id, email, name, username, bio, location, verified, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', 'test.fatma@islamic.com', 'Fatma Kaya', 'testfatma2024', 'Kur''an kursu öğretmeni. İlim öğrenmeyi ve öğretmeyi seviyorum.', 'Ankara', true, 'user');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'test.mehmet@islamic.com') THEN
    INSERT INTO users (id, email, name, username, bio, location, verified, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 'test.mehmet@islamic.com', 'Mehmet Demir', 'testmehmet2024', 'Gençlik çalışmaları koordinatörü. İslami gençlik faaliyetleri düzenliyorum.', 'İzmir', false, 'user');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'test.admin@islamic.com') THEN
    INSERT INTO users (id, email, name, username, bio, location, verified, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440004', 'test.admin@islamic.com', 'Test Admin', 'testadmin2024', 'Platform test yöneticisi', 'İstanbul', true, 'admin');
  END IF;
END $$;

-- Insert sample posts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM posts WHERE id = '880e8400-e29b-41d4-a716-446655440001') THEN
    INSERT INTO posts (id, user_id, content, category, tags, likes_count, comments_count) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Selamün aleyküm kardeşlerim! Bu güzel platformda olmaktan çok mutluyum. Allah hepimizi hayırda birleştirsin. 🤲', 'Genel', ARRAY['selam', 'kardeşlik'], 15, 3),
    ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Bugün çok güzel bir hadis okudum: "Müslüman, elinden ve dilinden Müslümanların emin olduğu kimsedir." 📖', 'Hadis', ARRAY['hadis', 'İslam', 'öğüt'], 28, 7),
    ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Gençlerimizle birlikte düzenlediğimiz Kur''an kursu çok güzel geçiyor. Allah razı olsun herkesten. 📚', 'Eğitim', ARRAY['gençlik', 'eğitim', 'Kuran'], 12, 4),
    ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Cuma namazından sonra camide güzel bir sohbet vardı. "Sabır ve Şükür" konusu işlendi. 🕌', 'Sohbet', ARRAY['cuma', 'sohbet', 'sabır'], 22, 8);
  END IF;
END $$;

-- Insert sample communities
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM communities WHERE id = '660e8400-e29b-41d4-a716-446655440001') THEN
    INSERT INTO communities (id, name, description, category, created_by, member_count) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Test İstanbul Gençlik Topluluğu', 'İstanbul''da yaşayan genç Müslümanların buluşma noktası. Birlikte etkinlikler düzenliyor, sohbetler yapıyoruz.', 'Gençlik', '550e8400-e29b-41d4-a716-446655440003', 156),
    ('660e8400-e29b-41d4-a716-446655440002', 'Test Kur''an Öğrenme Grubu', 'Kur''an-ı Kerim öğrenmek isteyenler için oluşturulmuş topluluk. Hafızlık ve tecvid dersleri düzenliyoruz.', 'Eğitim', '550e8400-e29b-41d4-a716-446655440002', 89),
    ('660e8400-e29b-41d4-a716-446655440003', 'Test Aile Danışmanlığı', 'İslami perspektiften aile danışmanlığı ve rehberlik hizmetleri. Uzman psikologlarımızla birlikte.', 'Aile', '550e8400-e29b-41d4-a716-446655440002', 234);
  END IF;
END $$;

-- Insert community memberships
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM community_members WHERE community_id = '660e8400-e29b-41d4-a716-446655440001' AND user_id = '550e8400-e29b-41d4-a716-446655440003') THEN
    INSERT INTO community_members (community_id, user_id, role) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'admin'),
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'member'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'admin'),
    ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'admin');
  END IF;
END $$;

-- Insert sample events
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM events WHERE id = '770e8400-e29b-41d4-a716-446655440001') THEN
    INSERT INTO events (id, title, description, type, date, time, location_name, location_address, location_city, organizer_name, created_by, capacity, attendees_count) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Test Cuma Sohbeti', 'Her Cuma akşamı düzenlediğimiz İslami sohbet programı. Bu hafta konumuz: "Sabır ve Şükür"', 'Sohbet', '2024-12-20', '20:00', 'Merkez Camii', 'Atatürk Caddesi No:15', 'İstanbul', 'Ahmet Yılmaz', '550e8400-e29b-41d4-a716-446655440001', 50, 23),
    ('770e8400-e29b-41d4-a716-446655440002', 'Test Kur''an Kursu Açılışı', 'Yeni dönem Kur''an kursumuzun açılış programı. Tüm yaş grupları için kurslarımız mevcut.', 'Eğitim', '2024-12-22', '14:00', 'Eğitim Merkezi', 'Kızılay Meydanı No:8', 'Ankara', 'Fatma Kaya', '550e8400-e29b-41d4-a716-446655440002', 100, 67),
    ('770e8400-e29b-41d4-a716-446655440003', 'Test Gençlik Buluşması', 'İstanbul''daki genç Müslümanların buluşma etkinliği. Oyunlar, sohbet ve yemek.', 'Sosyal', '2024-12-25', '15:00', 'Gençlik Merkezi', 'Beşiktaş Meydanı No:12', 'İstanbul', 'İstanbul Gençlik Topluluğu', '550e8400-e29b-41d4-a716-446655440003', 80, 34);
  END IF;
END $$;

-- Insert sample dua requests
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM dua_requests WHERE id = '990e8400-e29b-41d4-a716-446655440001') THEN
    INSERT INTO dua_requests (id, user_id, title, content, category, is_urgent, tags, prayers_count) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Annem için şifa duası', 'Sevgili kardeşlerim, annem rahatsız. Şifa bulması için dua eder misiniz? Allah razı olsun.', 'Sağlık', true, ARRAY['şifa', 'anne', 'sağlık'], 45),
    ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'İş bulma konusunda dua', 'Uzun süredir iş arıyorum. Helal rızık bulabilmem için dualarınızı bekliyorum.', 'İş', false, ARRAY['iş', 'rızık'], 23),
    ('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Evlilik için dua', 'Hayırlı bir eş bulabilmem için dua eder misiniz? Allah hepimizi hayırlı eşlerle buluştursun.', 'Evlilik', false, ARRAY['evlilik', 'eş'], 67);
  END IF;
END $$;

-- Insert some likes for posts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM likes WHERE user_id = '550e8400-e29b-41d4-a716-446655440002' AND post_id = '880e8400-e29b-41d4-a716-446655440001') THEN
    INSERT INTO likes (user_id, post_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002'),
    ('550e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440003');
  END IF;
END $$;

-- Insert some dua prayers (likes for dua requests)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM likes WHERE user_id = '550e8400-e29b-41d4-a716-446655440002' AND dua_request_id = '990e8400-e29b-41d4-a716-446655440001') THEN
    INSERT INTO likes (user_id, dua_request_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002'),
    ('550e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003');
  END IF;
END $$;

-- Insert some comments for posts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM comments WHERE id = 'aa0e8400-e29b-41d4-a716-446655440001') THEN
    INSERT INTO comments (id, user_id, post_id, content) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'Aleykümselam kardeşim, hoş geldin!'),
    ('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', 'Çok güzel bir hadis, Allah razı olsun paylaştığın için.'),
    ('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 'Masha Allah, çok güzel bir çalışma.'),
    ('aa0e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'Cuma sohbetleri çok faydalı oluyor.');
  END IF;
END $$;

-- Insert some dua comments (prayers)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM comments WHERE id = 'aa0e8400-e29b-41d4-a716-446655440004') THEN
    INSERT INTO comments (id, user_id, dua_request_id, content, is_prayer) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', 'Allah şifa versin, dua ediyorum.', true),
    ('aa0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440002', 'Allah hayırlı bir iş nasip etsin.', true),
    ('aa0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003', 'Allah hayırlı bir eş nasip etsin.', true);
  END IF;
END $$;

-- Insert event attendees
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM event_attendees WHERE event_id = '770e8400-e29b-41d4-a716-446655440001' AND user_id = '550e8400-e29b-41d4-a716-446655440002') THEN
    INSERT INTO event_attendees (event_id, user_id) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004');
  END IF;
END $$;

-- Insert some bookmarks for posts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM bookmarks WHERE user_id = '550e8400-e29b-41d4-a716-446655440001' AND post_id = '880e8400-e29b-41d4-a716-446655440002') THEN
    INSERT INTO bookmarks (user_id, post_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002'),
    ('550e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003'),
    ('550e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004');
  END IF;
END $$;

-- Insert dua bookmarks
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM bookmarks WHERE user_id = '550e8400-e29b-41d4-a716-446655440001' AND dua_request_id = '990e8400-e29b-41d4-a716-446655440002') THEN
    INSERT INTO bookmarks (user_id, dua_request_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002'),
    ('550e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440003'),
    ('550e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440001');
  END IF;
END $$;