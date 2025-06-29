# İslami Sosyal Platform - Bolt.new Deployment

Bu proje hem Replit hem de Bolt.new üzerinde çalışacak şekilde optimize edilmiştir.

## Bolt.new için Hızlı Başlangıç

### 1. Proje Klonlama
```bash
git clone <repository-url>
cd islamic-social-platform
```

### 2. Bağımlılıkları Yükleme
```bash
npm install
```

### 3. Environment Variables Ayarlama

`.env` dosyası oluşturun ve aşağıdaki değerleri ekleyin:

```env
# PostgreSQL Database
DATABASE_URL="your-postgresql-connection-string"

# Supabase Configuration
SUPABASE_URL="https://yourproject.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-key"

# Client Environment Variables
VITE_SUPABASE_URL="https://yourproject.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### 4. Veritabanı Kurulumu

#### PostgreSQL (Ana Veritabanı)
```bash
npm run db:push
```

#### Supabase (İkincil Veritabanı)
Supabase SQL Editor'da `KURULUM_TALİMATLARI.md` dosyasındaki SQL komutlarını çalıştırın.

### 5. Geliştirme Sunucusu
```bash
npm run dev
```

Uygulama http://localhost:5000 adresinde çalışacaktır.

### 6. Production Build
```bash
npm run build
npm start
```

## Bolt.new Özel Konfigürasyonu

### Port Ayarları
- Development: 5000
- Production: process.env.PORT || 5000
- Host: 0.0.0.0 (Bolt.new uyumluluğu için)

### Build Optimizasyonları
- Frontend: Vite ile optimized build
- Backend: ESBuild ile Node.js bundle
- Static assets: `/server/public` dizininde

### Environment Variables
Bolt.new'de environment variables Secrets sekmesinden eklenmelidir:

**Server-side:**
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

**Client-side:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Özellikler

### Dual Storage Sistemi
- **Ana Veritabanı:** PostgreSQL (Neon)
- **İkincil Veritabanı:** Supabase
- **Senkronizasyon:** Otomatik veri senkronizasyonu
- **Fallback:** Bir veritabanı çalışmıyorsa diğeri devreye girer

### Sistem Sağlığı Monitörleme
- Gerçek zamanlı veritabanı durumu
- Health check endpoint: `/api/health`
- 30 saniyede bir otomatik kontrol

### İslami Sosyal Platform Özellikleri
- Gönderi paylaşımı ve etkileşim
- Dua istekleri sistemi
- İslami topluluklar
- Etkinlik yönetimi
- Mesajlaşma sistemi
- Bildirimler

## Bolt.new Deployment Kontrol Listesi

- [ ] Environment variables eklendi
- [ ] PostgreSQL bağlantısı test edildi
- [ ] Supabase tabloları oluşturuldu
- [ ] Health check endpoint çalışıyor
- [ ] Frontend build edildi
- [ ] Production sunucu başlatıldı

## Sorun Giderme

### Veritabanı Bağlantı Sorunu
1. Environment variables'ları kontrol edin
2. `/api/health` endpoint'ini test edin
3. Console loglarını inceleyin

### Build Hatası
1. Node.js version 18+ kullandığınızdan emin olun
2. `npm install` komutu ile bağımlılıkları yeniden yükleyin
3. TypeScript hatalarını kontrol edin

### Port Çakışması
Bolt.new'de port otomatik atanır, manuel değişiklik gerekmez.

## Teknik Detaylar

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Supabase (Dual Storage)
- **ORM:** Drizzle ORM
- **UI:** Shadcn/ui + Tailwind CSS
- **Build:** Vite + ESBuild
- **Deployment:** Bolt.new ready

Daha fazla bilgi için `KURULUM_TALİMATLARI.md` dosyasını inceleyin.