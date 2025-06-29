/*
  # Sample Data Migration - Fixed Duplicate Key Issue

  1. Sample Users
    - Create test users with ON CONFLICT handling
    - Includes regular users and admin
    - Proper error handling for existing data

  2. Sample Content
    - Posts with various categories
    - Dua requests for community support
    - Comments and interactions

  3. Communities and Events
    - Sample communities for different interests
    - Upcoming events with registration
    - Community memberships

  4. Interactions
    - Likes, comments, and bookmarks
    - Event attendees
    - Community members
*/

-- Test kullanıcıları oluştur (duplicate key hatalarını önle)
DO $$
DECLARE
  user_id_1 uuid;
  user_id_2 uuid;
  admin_id uuid;
  community_id_1 uuid := gen_random_uuid();
  community_id_2 uuid := gen_random_uuid();
  event_id_1 uuid := gen_random_uuid();
  event_id_2 uuid := gen_random_uuid();
BEGIN
  -- Mevcut kullanıcıları kontrol et ve gerekirse oluştur
  
  -- Ahmet kullanıcısını kontrol et/oluştur
  SELECT id INTO user_id_1 FROM public.users WHERE email = 'ahmet@example.com';
  IF user_id_1 IS NULL THEN
    user_id_1 := gen_random_uuid();
    INSERT INTO public.users (id, email, name, username, role, bio, verified, location) VALUES
    (user_id_1, 'ahmet@example.com', 'Ahmet Yılmaz', 'ahmetyilmaz', 'user', 'İslami değerlere bağlı bir kardeşiniz. Hayır işlerinde aktif olmaya çalışıyorum.', true, 'İstanbul');
  END IF;

  -- Fatma kullanıcısını kontrol et/oluştur
  SELECT id INTO user_id_2 FROM public.users WHERE email = 'fatma@example.com';
  IF user_id_2 IS NULL THEN
    user_id_2 := gen_random_uuid();
    INSERT INTO public.users (id, email, name, username, role, bio, verified, location) VALUES
    (user_id_2, 'fatma@example.com', 'Fatma Kaya', 'fatmakaya', 'user', 'Kur''an-ı Kerim öğretmeni. İslami eğitim alanında çalışıyorum.', true, 'Ankara');
  END IF;

  -- Admin kullanıcısını kontrol et/oluştur
  SELECT id INTO admin_id FROM public.users WHERE email = 'admin@islamic.com';
  IF admin_id IS NULL THEN
    admin_id := gen_random_uuid();
    INSERT INTO public.users (id, email, name, username, role, bio, verified, location) VALUES
    (admin_id, 'admin@islamic.com', 'Platform Yöneticisi', 'islamadmin', 'admin', 'İslami paylaşım platformunun yöneticisi', true, 'İstanbul');
  END IF;

  -- Örnek gönderiler (sadece yoksa ekle)
  IF NOT EXISTS (SELECT 1 FROM public.posts WHERE user_id = user_id_1 AND content LIKE 'Selamün aleyküm kardeşlerim!%') THEN
    INSERT INTO public.posts (user_id, content, category, tags, likes_count, comments_count) VALUES
    (user_id_1, 'Selamün aleyküm kardeşlerim! Bu güzel platformda olmaktan çok mutluyum. Allah hepimizi hayırda birleştirsin. 🤲', 'Genel', ARRAY['selam', 'kardeşlik', 'hayır'], 15, 3);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.posts WHERE user_id = user_id_2 AND content LIKE 'Bugün çok güzel bir hadis okudum:%') THEN
    INSERT INTO public.posts (user_id, content, category, tags, likes_count, comments_count) VALUES
    (user_id_2, 'Bugün çok güzel bir hadis okudum: "Müslüman, elinden ve dilinden Müslümanların emin olduğu kimsedir." (Buhari) 📖', 'Hadis', ARRAY['hadis', 'İslam', 'öğüt'], 28, 7);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.posts WHERE user_id = admin_id AND content LIKE 'İslami paylaşım platformumuza hoş geldiniz!%') THEN
    INSERT INTO public.posts (user_id, content, category, tags, likes_count, comments_count) VALUES
    (admin_id, 'İslami paylaşım platformumuza hoş geldiniz! Burada güzel paylaşımlar yapabilir, kardeşlerimizle etkileşimde bulunabilirsiniz. 🕌', 'Duyuru', ARRAY['hoşgeldin', 'platform', 'duyuru'], 42, 12);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.posts WHERE user_id = user_id_1 AND content LIKE 'Ramazan ayı yaklaşıyor.%') THEN
    INSERT INTO public.posts (user_id, content, category, tags, likes_count, comments_count) VALUES
    (user_id_1, 'Ramazan ayı yaklaşıyor. Hazırlıklarımızı yapmaya başlayalım. Oruç tutmaya niyetlenenler için güzel bir rehber hazırladım. 🌙', 'Ramazan', ARRAY['ramazan', 'hazırlık', 'oruç'], 35, 8);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.posts WHERE user_id = user_id_2 AND content LIKE 'Çocuklarımıza Kur''an-ı Kerim öğretirken%') THEN
    INSERT INTO public.posts (user_id, content, category, tags, likes_count, comments_count) VALUES
    (user_id_2, 'Çocuklarımıza Kur''an-ı Kerim öğretirken sabırlı olmak çok önemli. Her çocuğun öğrenme hızı farklıdır. 👶📚', 'Eğitim', ARRAY['eğitim', 'çocuk', 'kuran'], 22, 5);
  END IF;

  -- Örnek dua talepleri (sadece yoksa ekle)
  IF NOT EXISTS (SELECT 1 FROM public.dua_requests WHERE user_id = user_id_1 AND title = 'Annem için şifa duası') THEN
    INSERT INTO public.dua_requests (user_id, title, content, category, tags, is_urgent, prayers_count, comments_count) VALUES
    (user_id_1, 'Annem için şifa duası', 'Sevgili kardeşlerim, annem hasta. Şifa bulması için dualarınızı rica ediyorum. Allah hepimizi hastalıklardan korusun.', 'Sağlık', ARRAY['sağlık', 'şifa', 'anne'], true, 45, 12);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.dua_requests WHERE user_id = user_id_2 AND title = 'İş bulma konusunda dua') THEN
    INSERT INTO public.dua_requests (user_id, title, content, category, tags, is_urgent, prayers_count, comments_count) VALUES
    (user_id_2, 'İş bulma konusunda dua', 'Uzun süredir iş arıyorum. Hayırlı bir iş bulabilmem için dua eder misiniz? Allah rızkımızı bol etsin.', 'İş', ARRAY['iş', 'rızık', 'hayır'], false, 23, 6);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.dua_requests WHERE user_id = user_id_1 AND title = 'Evlilik için dua') THEN
    INSERT INTO public.dua_requests (user_id, title, content, category, tags, is_urgent, prayers_count, comments_count) VALUES
    (user_id_1, 'Evlilik için dua', 'Hayırlı bir eş bulabilmem için dualarınızı istiyorum. Allah hepimizi hayırlı eşlerle buluştursun.', 'Evlilik', ARRAY['evlilik', 'eş', 'hayır'], false, 18, 4);
  END IF;

  -- Örnek topluluklar (sadece yoksa ekle)
  IF NOT EXISTS (SELECT 1 FROM public.communities WHERE name = 'İstanbul Gençlik Topluluğu') THEN
    INSERT INTO public.communities (id, name, description, category, created_by, member_count, location) VALUES
    (community_id_1, 'İstanbul Gençlik Topluluğu', 'İstanbul''da yaşayan genç Müslümanların buluşma noktası. Birlikte etkinlikler düzenliyor, sohbetler yapıyoruz.', 'Gençlik', user_id_1, 156, 'İstanbul');
  ELSE
    SELECT id INTO community_id_1 FROM public.communities WHERE name = 'İstanbul Gençlik Topluluğu';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.communities WHERE name = 'Kur''an Öğrenme Grubu') THEN
    INSERT INTO public.communities (id, name, description, category, created_by, member_count, location) VALUES
    (community_id_2, 'Kur''an Öğrenme Grubu', 'Kur''an-ı Kerim öğrenmek isteyenler için oluşturulmuş topluluk. Hafızlık ve tecvid dersleri düzenliyoruz.', 'Eğitim', user_id_2, 89, 'Ankara');
  ELSE
    SELECT id INTO community_id_2 FROM public.communities WHERE name = 'Kur''an Öğrenme Grubu';
  END IF;

  -- Topluluk üyelikleri (sadece yoksa ekle)
  INSERT INTO public.community_members (community_id, user_id, role) 
  SELECT community_id_1, user_id_1, 'admin'
  WHERE NOT EXISTS (SELECT 1 FROM public.community_members WHERE community_id = community_id_1 AND user_id = user_id_1);

  INSERT INTO public.community_members (community_id, user_id, role) 
  SELECT community_id_1, user_id_2, 'member'
  WHERE NOT EXISTS (SELECT 1 FROM public.community_members WHERE community_id = community_id_1 AND user_id = user_id_2);

  INSERT INTO public.community_members (community_id, user_id, role) 
  SELECT community_id_1, admin_id, 'member'
  WHERE NOT EXISTS (SELECT 1 FROM public.community_members WHERE community_id = community_id_1 AND user_id = admin_id);

  INSERT INTO public.community_members (community_id, user_id, role) 
  SELECT community_id_2, user_id_2, 'admin'
  WHERE NOT EXISTS (SELECT 1 FROM public.community_members WHERE community_id = community_id_2 AND user_id = user_id_2);

  INSERT INTO public.community_members (community_id, user_id, role) 
  SELECT community_id_2, user_id_1, 'member'
  WHERE NOT EXISTS (SELECT 1 FROM public.community_members WHERE community_id = community_id_2 AND user_id = user_id_1);

  -- Örnek etkinlikler (sadece yoksa ekle)
  IF NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Cuma Sohbeti') THEN
    INSERT INTO public.events (id, title, description, type, date, time, location_name, location_address, location_city, organizer_name, organizer_contact, capacity, attendees_count, price, tags, created_by) VALUES
    (event_id_1, 'Cuma Sohbeti', 'Her Cuma akşamı düzenlediğimiz İslami sohbet programı. Bu hafta konumuz: "Sabır ve Şükür"', 'Sohbet', CURRENT_DATE + INTERVAL '3 days', '20:00', 'Merkez Camii', 'Atatürk Caddesi No:15', 'İstanbul', 'Ahmet Yılmaz', 'ahmet@example.com', 50, 23, 0, ARRAY['sohbet', 'cuma', 'sabır'], user_id_1);
  ELSE
    SELECT id INTO event_id_1 FROM public.events WHERE title = 'Cuma Sohbeti';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Kur''an Kursu Açılışı') THEN
    INSERT INTO public.events (id, title, description, type, date, time, location_name, location_address, location_city, organizer_name, organizer_contact, capacity, attendees_count, price, tags, created_by) VALUES
    (event_id_2, 'Kur''an Kursu Açılışı', 'Yeni dönem Kur''an kursumuzun açılış programı. Tüm yaş grupları için kurslarımız mevcut.', 'Eğitim', CURRENT_DATE + INTERVAL '7 days', '14:00', 'Eğitim Merkezi', 'Kızılay Meydanı No:8', 'Ankara', 'Fatma Kaya', 'fatma@example.com', 100, 67, 0, ARRAY['kuran', 'eğitim', 'kurs'], user_id_2);
  ELSE
    SELECT id INTO event_id_2 FROM public.events WHERE title = 'Kur''an Kursu Açılışı';
  END IF;

  -- Etkinlik katılımcıları (sadece yoksa ekle)
  INSERT INTO public.event_attendees (event_id, user_id) 
  SELECT event_id_1, user_id_1
  WHERE NOT EXISTS (SELECT 1 FROM public.event_attendees WHERE event_id = event_id_1 AND user_id = user_id_1);

  INSERT INTO public.event_attendees (event_id, user_id) 
  SELECT event_id_1, user_id_2
  WHERE NOT EXISTS (SELECT 1 FROM public.event_attendees WHERE event_id = event_id_1 AND user_id = user_id_2);

  INSERT INTO public.event_attendees (event_id, user_id) 
  SELECT event_id_2, user_id_2
  WHERE NOT EXISTS (SELECT 1 FROM public.event_attendees WHERE event_id = event_id_2 AND user_id = user_id_2);

  INSERT INTO public.event_attendees (event_id, user_id) 
  SELECT event_id_2, admin_id
  WHERE NOT EXISTS (SELECT 1 FROM public.event_attendees WHERE event_id = event_id_2 AND user_id = admin_id);

  -- Örnek yorumlar (sadece yoksa ekle)
  IF NOT EXISTS (SELECT 1 FROM public.comments WHERE user_id = user_id_2 AND content = 'Çok güzel bir paylaşım, Allah razı olsun kardeşim! 🤲') THEN
    INSERT INTO public.comments (user_id, post_id, content) 
    SELECT user_id_2, p.id, 'Çok güzel bir paylaşım, Allah razı olsun kardeşim! 🤲'
    FROM public.posts p WHERE p.user_id = user_id_1 LIMIT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.comments WHERE user_id = user_id_2 AND content = 'Anneniz için dua ediyorum, Allah şifa versin. 🤲' AND is_prayer = true) THEN
    INSERT INTO public.comments (user_id, dua_request_id, content, is_prayer) 
    SELECT user_id_2, d.id, 'Anneniz için dua ediyorum, Allah şifa versin. 🤲', true
    FROM public.dua_requests d WHERE d.user_id = user_id_1 AND d.category = 'Sağlık' LIMIT 1;
  END IF;

  -- Örnek beğeniler (sadece yoksa ekle)
  INSERT INTO public.likes (user_id, post_id) 
  SELECT user_id_2, p.id
  FROM public.posts p 
  WHERE p.user_id = user_id_1 
  AND NOT EXISTS (SELECT 1 FROM public.likes WHERE user_id = user_id_2 AND post_id = p.id)
  LIMIT 2;

  INSERT INTO public.likes (user_id, dua_request_id) 
  SELECT user_id_1, d.id
  FROM public.dua_requests d 
  WHERE d.user_id = user_id_2 
  AND NOT EXISTS (SELECT 1 FROM public.likes WHERE user_id = user_id_1 AND dua_request_id = d.id)
  LIMIT 1;

END $$;