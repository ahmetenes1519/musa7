# Dual Storage Sistemi Kurulum Talimatları

Bu sistem hem PostgreSQL hem de Supabase veritabanlarını senkronize şekilde kullanır. Veriler her iki veritabanına da kaydedilir ve biri pasif olduğunda diğerinden yararlanır.

## 1. PostgreSQL (Ana Veritabanı)

PostgreSQL zaten yapılandırılmış durumda. Herhangi bir işlem yapmanıza gerek yok.

## 2. Supabase Projesi Oluşturma

### Adım 1: Supabase Hesabı ve Proje Oluşturma
1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. Yeni bir hesap oluşturun veya mevcut hesabınızla giriş yapın
3. "New Project" butonuna tıklayın
4. Proje adı: `islamic-platform-backup`
5. Güçlü bir veritabanı şifresi belirleyin
6. Bölge seçin (tercihen yakın bir bölge)
7. "Create new project" butonuna tıklayın

### Adım 2: Veritabanı Tablolarını Oluşturma
Proje oluşturulduktan sonra SQL Editor'a gidin ve aşağıdaki tabloları oluşturun:

```sql
-- Users tablosu
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts tablosu
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'video')),
  media_url TEXT,
  category TEXT DEFAULT 'Genel',
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dua Requests tablosu
CREATE TABLE dua_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT FALSE,
  is_anonymous BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  prayers_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments tablosu
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  dua_request_id UUID REFERENCES dua_requests(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_prayer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK ((post_id IS NOT NULL) OR (dua_request_id IS NOT NULL))
);

-- Likes tablosu
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  dua_request_id UUID REFERENCES dua_requests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK ((post_id IS NOT NULL) OR (dua_request_id IS NOT NULL)),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, dua_request_id)
);

-- Bookmarks tablosu
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  dua_request_id UUID REFERENCES dua_requests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK ((post_id IS NOT NULL) OR (dua_request_id IS NOT NULL)),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, dua_request_id)
);

-- Communities tablosu
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  cover_image TEXT,
  location TEXT,
  member_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Members tablosu
CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Events tablosu
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location_name TEXT NOT NULL,
  location_address TEXT NOT NULL,
  location_city TEXT NOT NULL,
  organizer_name TEXT NOT NULL,
  organizer_contact TEXT,
  capacity INTEGER DEFAULT 100,
  attendees_count INTEGER DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  is_online BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  tags TEXT[],
  requirements TEXT[],
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Attendees tablosu
CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
```

### Adım 3: API Anahtarlarını Alma
1. Supabase projenizde "Settings" > "API" bölümüne gidin
2. Aşağıdaki bilgileri not edin:
   - **Project URL**: `https://yourproject.supabase.co`
   - **anon (public) key**: `eyJ...` ile başlayan anahtar
   - **service_role key**: `eyJ...` ile başlayan anahtar (gizli tut)

## 3. Environment Variables Ayarlama

Replit'te "Secrets" (Gizli anahtarlar) bölümüne gidin ve aşağıdaki değişkenleri ekleyin:

### Server-side Environment Variables (Secrets)
```
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Client-side Environment Variables (Secrets)
```
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Önemli**: 
- `service_role` anahtarını sadece sunucu tarafında kullanın
- `anon` anahtarını hem sunucu hem istemci tarafında kullanabilirsiniz
- Asla `service_role` anahtarını istemci kodunda kullanmayın

## 4. Sistem Nasıl Çalışır

### Dual Storage Mantığı:
1. **Ana İşlem**: Tüm veriler önce PostgreSQL'e kaydedilir
2. **Senkronizasyon**: Başarılı PostgreSQL işleminden sonra aynı veri Supabase'e de kaydedilir
3. **Fallback**: PostgreSQL çalışmıyorsa sistem otomatik olarak Supabase'i kullanır
4. **Sağlık Kontrolü**: Her 30 saniyede bir sistem her iki veritabanının durumunu kontrol eder

### Sistem Durumları:
- **Healthy (Sağlıklı)**: Her iki veritabanı da çalışıyor
- **Degraded (Kısmi)**: Sadece bir veritabanı çalışıyor
- **Down (Çevrimdışı)**: Hiçbir veritabanı çalışmıyor

## 5. Test Etme

1. Replit projenizi yeniden başlatın
2. Ana sayfaya gidin
3. Sağ tarafta "Sistem Durumu" kartını kontrol edin
4. PostgreSQL ve Supabase bağlantı durumlarını gözlemleyin

## 6. İzleme

- Ana sayfada sistem sağlığını gerçek zamanlı olarak izleyebilirsiniz
- `/api/health` endpoint'ine GET isteği göndererek programatik olarak durum kontrol edebilirsiniz
- Konsol loglarında senkronizasyon durumlarını görüntüleyebilirsiniz

## Sorun Giderme

### Supabase Bağlantı Hatası
- API anahtarlarının doğruluğunu kontrol edin
- Supabase projesi URL'sinin doğruluğunu kontrol edin
- Supabase projesi aktif durumda olduğunu doğrulayın

### PostgreSQL Bağlantı Hatası
- DATABASE_URL değişkeninin doğruluğunu kontrol edin
- Replit'te PostgreSQL servisinin çalıştığını doğrulayın

Bu kurulum tamamlandığında sisteminiz hem PostgreSQL hem de Supabase kullanarak yüksek kullanılabilirlik sağlayacaktır.