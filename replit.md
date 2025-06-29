# İslami Sosyal Platform - Replit Projesi

## Proje Özeti
İslami değerlere uygun sosyal medya platformu. Kullanıcılar gönderi paylaşabilir, dua talebinde bulunabilir, topluluklar oluşturabilir ve etkinlik düzenleyebilir.

## Teknoloji Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: Dual system - PostgreSQL (primary) + Supabase (backup) + Drizzle ORM
- **Authentication**: Custom session-based auth
- **Deployment**: Replit platform
- **High Availability**: Automatic failover between databases

## Mimari
- **Client/Server Separation**: Frontend ve backend tamamen ayrılmış
- **API-First**: Tüm veri işlemleri REST API üzerinden
- **Database**: PostgreSQL ile Drizzle ORM kullanarak type-safe queries
- **Security**: Row Level Security (RLS) politikaları

## Recent Changes (2025-06-27)
✓ Supabase'den PostgreSQL'e başarılı migration tamamlandı
✓ Drizzle ORM ile server-side database operations kuruldu
✓ Sample data eklendi (users, posts, dua_requests, communities, events)
✓ API endpoints test edildi ve çalışır durumda
✓ Client-side compatibility layer oluşturuldu
✓ Güvenlik: Client/server separation sağlandı
✓ Konum paylaşımı özelliği gönderilerden kaldırıldı
✓ CreatePost ve PostCard componentlerinden location kodları temizlendi
✓ Dual database system kuruldu (PostgreSQL primary, Supabase backup)
✓ Automatic failover ve data synchronization eklendi
✓ Health monitoring ve database status tracking eklendi
✓ Supabase credentials configured and connected successfully
✓ Message posting functionality restored with dual database support
✓ Automatic failover working: PostgreSQL -> Supabase when needed
✓ Mobile compatibility improvements added
✓ Error boundary and global error handling for mobile devices
✓ Runtime error overlay disabled for mobile to prevent crashes
✓ Comment system fixed to work with dual database architecture
✓ Comments now properly load from API endpoints
✓ Real-time comment creation and display implemented
✓ UUID validation issues in comment creation resolved
✓ Comment count synchronization fixed across both databases
✓ Manual validation bypass for comment posting stability
✓ All pages migrated to use API endpoints instead of localStorage
✓ Dua requests, communities, and events fully functional
✓ Complete site functionality verification completed
✓ All hooks converted to dual database system
✓ Admin, Profile, Settings, and all other pages working
✓ Settings/Help and Support page completed with comprehensive content
✓ Detailed help topics, FAQ, contact information added
✓ Islamic guidance and community values integrated
✓ Professional support contact methods provided
✓ Complete Privacy Policy and Terms of Service sections
✓ Comprehensive FAQ with Islamic platform specific answers
✓ Professional contact methods with response times
✓ Data security and user responsibility guidelines
✓ Bookmarks page created with category filtering
✓ Save posts and dua requests functionality
✓ Advanced filtering by type, category, and date
✓ Grid and list view modes for bookmarks
✓ Report system implemented for posts and dua requests
✓ Admin moderation dashboard with report management
✓ User ban system with temporary and permanent bans
✓ Report modal with categorized complaint reasons
✓ Admin actions: delete content, ban users, manage reports
✓ Database schema extended with reports and user_bans tables
✓ Bookmarks page created with category filtering
✓ Saved posts display with search and sort functionality
✓ Grid and list view modes for bookmarked content
✓ Bookmark management and removal features
✓ Migration to Replit completed successfully (2025-06-27)
✓ Content moderation system implemented with Turkish profanity filter
✓ Image and video URL sharing functionality added
✓ 100+ emoji collection integrated
✓ Theme visibility issues fixed (white buttons on white background)
✓ Report system fully functional with PostgreSQL integration
✓ Automatic content filtering and admin notifications working

## Kullanılabilir Özellikler
- Kullanıcı kayıt/giriş sistemi
- Gönderi oluşturma ve görüntüleme
- Dua talepleri sistemi
- Beğeni ve yorum sistemi
- Topluluk yönetimi
- Etkinlik organizasyonu
- Yer imi (bookmark) sistemi

## Veritabanı Şeması
- **users**: Kullanıcı profilleri
- **posts**: Gönderiler
- **dua_requests**: Dua talepleri
- **comments**: Yorumlar
- **likes**: Beğeniler
- **bookmarks**: Yer imleri
- **communities**: Topluluklar
- **community_members**: Topluluk üyelikleri
- **events**: Etkinlikler
- **event_attendees**: Etkinlik katılımcıları

## API Endpoints
- `GET /api/posts` - Gönderileri listele
- `POST /api/posts` - Yeni gönderi oluştur
- `GET /api/dua-requests` - Dua taleplerini listele
- `POST /api/dua-requests` - Yeni dua talebi oluştur
- `GET /api/communities` - Toplulukları listele
- `GET /api/events` - Etkinlikleri listele
- `GET /api/health` - Sistem sağlık durumu

## Geliştirme
```bash
npm run dev     # Development server
npm run build   # Production build
npm run db:push # Database schema push
```

## User Preferences
- Turkish language interface preferred
- Islamic values and terminology
- Clean, professional UI design
- Focus on community features