# Multi-Platform Deployment Guide

Bu İslami sosyal platform projesi hem Replit hem de Bolt.new üzerinde çalışacak şekilde optimize edilmiştir.

## Platform Karşılaştırması

| Özellik | Replit | Bolt.new |
|---------|--------|----------|
| Port Konfigürasyonu | 5000 (Sabit) | process.env.PORT (Dinamik) |
| Environment Variables | Secrets Tab | Environment Settings |
| Build Process | Otomatik | Manuel npm run build |
| Database | PostgreSQL modülü | External PostgreSQL |
| Hot Reload | Vite HMR | Vite HMR |
| Production | Deploy butonu | Build + Start |

## Replit Deployment

### 1. Mevcut Konfigürasyon
- Port: 5000 (otomatik)
- Environment: Secrets tabından eklendi
- Database: PostgreSQL modülü aktif
- Build: Otomatik workflow

### 2. Çalıştırma
```bash
npm run dev
```

## Bolt.new Deployment

### 1. Proje Kurulumu
```bash
git clone <repo-url>
cd islamic-social-platform
npm install
```

### 2. Environment Variables
`.env` dosyası oluşturun:
```bash
cp .env.bolt .env
# Değerleri güncelleyin
```

### 3. Database Kurulumu
```bash
# PostgreSQL tabloları
npm run db:push

# Supabase tabloları (SQL Editor'da)
# KURULUM_TALİMATLARI.md dosyasındaki SQL komutlarını çalıştırın
```

### 4. Development
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm start
```

## Cross-Platform Optimizasyonlar

### 1. Port Flexibility
```typescript
const port = process.env.PORT || 5000;
```

### 2. Host Configuration
```typescript
server.listen({
  port,
  host: "0.0.0.0",
  reusePort: true
});
```

### 3. Build Scripts
- `npm run dev`: Development sunucu
- `npm run build`: Production build
- `npm start`: Production sunucu
- `npm run preview`: Build + start

### 4. Environment Detection
```typescript
if (app.get("env") === "development") {
  await setupVite(app, server);
} else {
  serveStatic(app);
}
```

## Dual Storage Sistem

### Konfigürasyon
- PostgreSQL: Ana veritabanı
- Supabase: İkincil veritabanı
- Otomatik senkronizasyon
- Fallback mekanizması

### Health Monitoring
- Endpoint: `/api/health`
- Real-time status
- Database connectivity check

## Test Checklist

### Replit
- [ ] Environment variables aktif
- [ ] PostgreSQL bağlı
- [ ] Supabase senkronize
- [ ] Health check yeşil
- [ ] Frontend yükleniyor

### Bolt.new
- [ ] .env dosyası oluşturuldu
- [ ] npm install tamamlandı
- [ ] Database migration yapıldı
- [ ] Development sunucu çalışıyor
- [ ] Production build başarılı

## Troubleshooting

### Port Issues
```bash
# Port kullanımda hatası
lsof -i :5000
kill -9 <PID>
```

### Environment Variables
```bash
# Değişkenleri kontrol et
echo $DATABASE_URL
echo $SUPABASE_URL
```

### Build Errors
```bash
# Cache temizle
rm -rf node_modules dist
npm install
npm run build
```

### Database Connection
```bash
# Health check
curl http://localhost:5000/api/health
```

## Öneriler

1. **Development**: Replit kullanın (daha hızlı setup)
2. **Production**: Bolt.new ile deploy edin (daha esnek)
3. **Testing**: Her iki platformda da test edin
4. **Monitoring**: Health endpoint'i düzenli kontrol edin

Bu konfigürasyon ile proje her iki platformda da sorunsuz çalışacaktır.