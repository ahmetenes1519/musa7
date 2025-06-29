// LocalStorage tabanlı veritabanı sistemi
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  verified: boolean;
  role: 'user' | 'admin' | 'moderator';
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  type: 'text' | 'image' | 'video';
  media_url: string | null;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
}

export interface DuaRequest {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_urgent: boolean;
  is_anonymous: boolean;
  tags: string[];
  prayers_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string | null;
  dua_request_id: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string | null;
  dua_request_id: string | null;
  content: string;
  is_prayer: boolean;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  is_private: boolean;
  cover_image: string | null;
  location: string | null;
  member_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location_name: string;
  location_address: string;
  location_city: string;
  organizer_name: string;
  organizer_contact: string | null;
  capacity: number;
  attendees_count: number;
  price: number;
  is_online: boolean;
  image_url: string | null;
  tags: string[];
  requirements: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string | null;
  dua_request_id: string | null;
  created_at: string;
}

// Yardımcı fonksiyonlar
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// LocalStorage yönetimi
class LocalStorageDB {
  constructor() {
    // Sayfa yüklendiğinde veritabanını başlat
    this.initializeDatabase();
  }

  getTable<T>(tableName: string): T[] {
    try {
      const data = localStorage.getItem(`islamic_platform_${tableName}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading table ${tableName}:`, error);
      return [];
    }
  }

  setTable<T>(tableName: string, data: T[]): void {
    try {
      localStorage.setItem(`islamic_platform_${tableName}`, JSON.stringify(data));
      
      // Broadcast change event for real-time updates
      window.dispatchEvent(new CustomEvent('localDBChange', {
        detail: { table: tableName, data }
      }));
    } catch (error) {
      console.error(`Error writing table ${tableName}:`, error);
    }
  }

  // Kullanıcı işlemleri
  getUsers(): User[] {
    return this.getTable<User>('users');
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: generateId(),
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };
    users.push(newUser);
    this.setTable('users', users);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updated_at: getCurrentTimestamp()
    };
    this.setTable('users', users);
    return users[userIndex];
  }

  // Gönderi işlemleri
  getPosts(): Post[] {
    return this.getTable<Post>('posts').sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getPostById(id: string): Post | null {
    const posts = this.getPosts();
    return posts.find(post => post.id === id) || null;
  }

  createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'shares_count'>): Post {
    const posts = this.getPosts();
    const newPost: Post = {
      ...postData,
      id: generateId(),
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };
    posts.unshift(newPost);
    this.setTable('posts', posts);
    return newPost;
  }

  deletePost(id: string, userId: string): boolean {
    const posts = this.getPosts();
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    
    // Admin veya gönderi sahibi silebilir
    const postIndex = posts.findIndex(post => 
      post.id === id && (post.user_id === userId || user?.role === 'admin')
    );
    
    if (postIndex === -1) return false;

    posts.splice(postIndex, 1);
    this.setTable('posts', posts);

    // İlgili beğeni ve yorumları da sil
    this.deleteLikesByPostId(id);
    this.deleteCommentsByPostId(id);
    this.deleteBookmarksByPostId(id);
    
    return true;
  }

  // Dua talepleri işlemleri
  getDuaRequests(): DuaRequest[] {
    return this.getTable<DuaRequest>('dua_requests').sort((a, b) => {
      // Acil olanları önce göster, sonra tarihe göre sırala
      if (a.is_urgent && !b.is_urgent) return -1;
      if (!a.is_urgent && b.is_urgent) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  createDuaRequest(duaData: Omit<DuaRequest, 'id' | 'created_at' | 'updated_at' | 'prayers_count' | 'comments_count'>): DuaRequest {
    const duaRequests = this.getDuaRequests();
    const newDua: DuaRequest = {
      ...duaData,
      id: generateId(),
      prayers_count: 0,
      comments_count: 0,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };
    duaRequests.unshift(newDua);
    this.setTable('dua_requests', duaRequests);
    return newDua;
  }

  // Beğeni işlemleri
  getLikes(): Like[] {
    return this.getTable<Like>('likes');
  }

  getLikesByPostId(postId: string): Like[] {
    return this.getLikes().filter(like => like.post_id === postId);
  }

  getLikesByDuaRequestId(duaRequestId: string): Like[] {
    return this.getLikes().filter(like => like.dua_request_id === duaRequestId);
  }

  getUserLike(userId: string, postId?: string, duaRequestId?: string): Like | null {
    const likes = this.getLikes();
    return likes.find(like => 
      like.user_id === userId && 
      (postId ? like.post_id === postId : like.dua_request_id === duaRequestId)
    ) || null;
  }

  toggleLike(userId: string, postId?: string, duaRequestId?: string): { liked: boolean } {
    const likes = this.getLikes();
    const existingLike = this.getUserLike(userId, postId, duaRequestId);

    if (existingLike) {
      // Beğeniyi kaldır
      const likeIndex = likes.findIndex(like => like.id === existingLike.id);
      likes.splice(likeIndex, 1);
      this.setTable('likes', likes);

      // Sayacı güncelle
      if (postId) {
        this.updatePostLikesCount(postId, -1);
      } else if (duaRequestId) {
        this.updateDuaPrayersCount(duaRequestId, -1);
      }

      return { liked: false };
    } else {
      // Beğeni ekle
      const newLike: Like = {
        id: generateId(),
        user_id: userId,
        post_id: postId || null,
        dua_request_id: duaRequestId || null,
        created_at: getCurrentTimestamp()
      };
      likes.push(newLike);
      this.setTable('likes', likes);

      // Sayacı güncelle
      if (postId) {
        this.updatePostLikesCount(postId, 1);
      } else if (duaRequestId) {
        this.updateDuaPrayersCount(duaRequestId, 1);
      }

      return { liked: true };
    }
  }

  private updatePostLikesCount(postId: string, change: number): void {
    const posts = this.getPosts();
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].likes_count += change;
      this.setTable('posts', posts);
    }
  }

  private updateDuaPrayersCount(duaRequestId: string, change: number): void {
    const duaRequests = this.getDuaRequests();
    const duaIndex = duaRequests.findIndex(dua => dua.id === duaRequestId);
    if (duaIndex !== -1) {
      duaRequests[duaIndex].prayers_count += change;
      this.setTable('dua_requests', duaRequests);
    }
  }

  private deleteLikesByPostId(postId: string): void {
    const likes = this.getLikes().filter(like => like.post_id !== postId);
    this.setTable('likes', likes);
  }

  private deleteCommentsByPostId(postId: string): void {
    const comments = this.getComments().filter(comment => comment.post_id !== postId);
    this.setTable('comments', comments);
  }

  private deleteBookmarksByPostId(postId: string): void {
    const bookmarks = this.getBookmarks().filter(bookmark => bookmark.post_id !== postId);
    this.setTable('bookmarks', bookmarks);
  }

  // Yorum işlemleri
  getComments(): Comment[] {
    return this.getTable<Comment>('comments');
  }

  getCommentsByPostId(postId: string): Comment[] {
    try {
      return this.getComments()
        .filter(comment => comment.post_id === postId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } catch (error) {
      console.error('Error getting comments by post ID:', error);
      return [];
    }
  }

  getCommentsByDuaRequestId(duaRequestId: string): Comment[] {
    try {
      return this.getComments()
        .filter(comment => comment.dua_request_id === duaRequestId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } catch (error) {
      console.error('Error getting comments by dua request ID:', error);
      return [];
    }
  }

  createComment(commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Comment {
    const comments = this.getComments();
    const newComment: Comment = {
      ...commentData,
      id: generateId(),
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };
    comments.push(newComment);
    this.setTable('comments', comments);

    // Yorum sayacını güncelle
    if (commentData.post_id) {
      this.updatePostCommentsCount(commentData.post_id, 1);
    } else if (commentData.dua_request_id) {
      this.updateDuaCommentsCount(commentData.dua_request_id, 1);
    }

    return newComment;
  }

  private updatePostCommentsCount(postId: string, change: number): void {
    const posts = this.getPosts();
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].comments_count += change;
      this.setTable('posts', posts);
    }
  }

  private updateDuaCommentsCount(duaRequestId: string, change: number): void {
    const duaRequests = this.getDuaRequests();
    const duaIndex = duaRequests.findIndex(dua => dua.id === duaRequestId);
    if (duaIndex !== -1) {
      duaRequests[duaIndex].comments_count += change;
      this.setTable('dua_requests', duaRequests);
    }
  }

  // Yer imi işlemleri
  getBookmarks(): Bookmark[] {
    return this.getTable<Bookmark>('bookmarks');
  }

  getUserBookmarks(userId: string): Bookmark[] {
    return this.getBookmarks().filter(bookmark => bookmark.user_id === userId);
  }

  toggleBookmark(userId: string, postId?: string, duaRequestId?: string): { bookmarked: boolean } {
    const bookmarks = this.getBookmarks();
    const existingBookmark = bookmarks.find(bookmark => 
      bookmark.user_id === userId && 
      (postId ? bookmark.post_id === postId : bookmark.dua_request_id === duaRequestId)
    );

    if (existingBookmark) {
      // Yer imini kaldır
      const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id === existingBookmark.id);
      bookmarks.splice(bookmarkIndex, 1);
      this.setTable('bookmarks', bookmarks);
      return { bookmarked: false };
    } else {
      // Yer imi ekle
      const newBookmark: Bookmark = {
        id: generateId(),
        user_id: userId,
        post_id: postId || null,
        dua_request_id: duaRequestId || null,
        created_at: getCurrentTimestamp()
      };
      bookmarks.push(newBookmark);
      this.setTable('bookmarks', bookmarks);
      return { bookmarked: true };
    }
  }

  // Topluluk işlemleri
  getCommunities(): Community[] {
    return this.getTable<Community>('communities').sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  createCommunity(communityData: Omit<Community, 'id' | 'created_at' | 'updated_at' | 'member_count'>): Community {
    const communities = this.getCommunities();
    const newCommunity: Community = {
      ...communityData,
      id: generateId(),
      member_count: 1,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };
    communities.unshift(newCommunity);
    this.setTable('communities', communities);
    return newCommunity;
  }

  // Etkinlik işlemleri
  getEvents(): Event[] {
    return this.getTable<Event>('events').sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'attendees_count'>): Event {
    const events = this.getEvents();
    const newEvent: Event = {
      ...eventData,
      id: generateId(),
      attendees_count: 0,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };
    events.push(newEvent);
    this.setTable('events', events);
    return newEvent;
  }

  // Paylaşım sayacını güncelle
  incrementShareCount(postId: string): void {
    const posts = this.getPosts();
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].shares_count += 1;
      this.setTable('posts', posts);
    }
  }

  // Veritabanını başlat (örnek verilerle)
  initializeDatabase(): void {
    // Eğer veriler yoksa örnek verileri ekle
    if (this.getUsers().length === 0) {
      this.seedDatabase();
    }
  }

  private seedDatabase(): void {
    // Örnek kullanıcılar
    const users = [
      {
        email: 'ahmet@example.com',
        password: '123456',
        name: 'Ahmet Yılmaz',
        username: 'ahmetyilmaz',
        avatar_url: null,
        bio: 'İslami değerlere bağlı bir kardeşiniz. Hayır işlerinde aktif olmaya çalışıyorum.',
        location: 'İstanbul',
        website: null,
        verified: true,
        role: 'user' as const
      },
      {
        email: 'fatma@example.com',
        password: '123456',
        name: 'Fatma Kaya',
        username: 'fatmakaya',
        avatar_url: null,
        bio: 'Kur\'an kursu öğretmeni. İlim öğrenmeyi ve öğretmeyi seviyorum.',
        location: 'Ankara',
        website: null,
        verified: true,
        role: 'user' as const
      },
      {
        email: 'admin@islamic.com',
        password: '123456',
        name: 'Platform Yöneticisi',
        username: 'islamadmin',
        avatar_url: null,
        bio: 'İslami paylaşım platformunun yöneticisi. Topluluk kurallarını koruyorum.',
        location: 'İstanbul',
        website: null,
        verified: true,
        role: 'admin' as const
      }
    ];

    const createdUsers = users.map(user => this.createUser(user));

    // Örnek gönderiler
    const posts = [
      {
        user_id: createdUsers[0].id,
        content: 'Selamün aleyküm kardeşlerim! Bu güzel platformda olmaktan çok mutluyum. Allah hepimizi hayırda birleştirsin. 🤲\n📍 İstanbul, Fatih',
        type: 'text' as const,
        media_url: null,
        category: 'Genel',
        tags: ['selam', 'kardeşlik', 'hayır']
      },
      {
        user_id: createdUsers[1].id,
        content: 'Bugün çok güzel bir hadis okudum: "Müslüman, elinden ve dilinden Müslümanların emin olduğu kimsedir." (Buhari) 📖\n\nBu hadis bize kardeşlerimize karşı nasıl davranmamız gerektiğini gösteriyor.',
        type: 'text' as const,
        media_url: null,
        category: 'Hadis',
        tags: ['hadis', 'İslam', 'öğüt']
      },
      {
        user_id: createdUsers[2].id,
        content: 'İslami paylaşım platformumuza hoş geldiniz! Burada güzel paylaşımlar yapabilir, kardeşlerimizle etkileşimde bulunabilirsiniz. 🕌\n\nLütfen topluluk kurallarına uyalım ve birbirimize saygı gösterelim.',
        type: 'text' as const,
        media_url: null,
        category: 'Duyuru',
        tags: ['hoşgeldin', 'platform', 'duyuru']
      },
      {
        user_id: createdUsers[0].id,
        content: 'Cuma namazından sonra camide güzel bir sohbet vardı. "Sabır ve Şükür" konusu işlendi. Allah razı olsun hocamızdan. 🕌\n📍 Merkez Camii, İstanbul',
        type: 'text' as const,
        media_url: null,
        category: 'Sohbet',
        tags: ['cuma', 'sohbet', 'sabır', 'şükür']
      },
      {
        user_id: createdUsers[1].id,
        content: 'Çocuklarımıza Kur\'an-ı Kerim öğretirken sabırlı olmak çok önemli. Her çocuğun öğrenme hızı farklıdır. Allah kolaylık versin. 👶📚\n\n#Ramazan2024 ayında özel kurslarımız başlıyor!',
        type: 'text' as const,
        media_url: null,
        category: 'Eğitim',
        tags: ['eğitim', 'çocuk', 'kuran', 'sabır', 'Ramazan2024']
      },
      {
        user_id: createdUsers[0].id,
        content: 'Bugün çok güzel bir #Tefsir dersi dinledim. Bakara suresinin ilk ayetleri hakkında. İlim öğrenmek ne kadar güzel! 📚✨',
        type: 'text' as const,
        media_url: null,
        category: 'Tefsir',
        tags: ['Tefsir', 'ilim', 'bakara']
      }
    ];

    posts.forEach(post => this.createPost(post));

    // Örnek dua talepleri
    const duaRequests = [
      {
        user_id: createdUsers[0].id,
        title: 'Annem için şifa duası',
        content: 'Sevgili kardeşlerim, annem rahatsız. Şifa bulması için dua eder misiniz? Allah razı olsun hepinizden.',
        category: 'Sağlık',
        is_urgent: true,
        is_anonymous: false,
        tags: ['şifa', 'anne', 'sağlık']
      },
      {
        user_id: createdUsers[1].id,
        title: 'İş bulma konusunda dua',
        content: 'Uzun süredir iş arıyorum. Helal rızık bulabilmem için dualarınızı bekliyorum. Allah hepimize nasip etsin.',
        category: 'İş',
        is_urgent: false,
        is_anonymous: false,
        tags: ['iş', 'rızık', 'hayır']
      },
      {
        user_id: createdUsers[0].id,
        title: 'Evlilik için dua',
        content: 'Hayırlı bir eş bulabilmem için dua eder misiniz? Allah hepimizi hayırlı eşlerle buluştursun.',
        category: 'Evlilik',
        is_urgent: false,
        is_anonymous: true,
        tags: ['evlilik', 'eş', 'hayır']
      }
    ];

    duaRequests.forEach(dua => this.createDuaRequest(dua));

    // Örnek topluluklar
    const communities = [
      {
        name: 'İstanbul Gençlik Topluluğu',
        description: 'İstanbul\'da yaşayan genç Müslümanların buluşma noktası. Birlikte etkinlikler düzenliyor, sohbetler yapıyoruz.',
        category: 'Gençlik',
        is_private: false,
        cover_image: null,
        location: 'İstanbul',
        created_by: createdUsers[0].id
      },
      {
        name: 'Kur\'an Öğrenme Grubu',
        description: 'Kur\'an-ı Kerim öğrenmek isteyenler için oluşturulmuş topluluk. Hafızlık ve tecvid dersleri düzenliyoruz.',
        category: 'Eğitim',
        is_private: false,
        cover_image: null,
        location: 'Ankara',
        created_by: createdUsers[1].id
      },
      {
        name: 'Aile Danışmanlığı',
        description: 'İslami perspektiften aile danışmanlığı ve rehberlik hizmetleri. Uzman psikologlarımızla birlikte.',
        category: 'Aile',
        is_private: false,
        cover_image: null,
        location: 'Online',
        created_by: createdUsers[2].id
      }
    ];

    communities.forEach(community => this.createCommunity(community));

    // Örnek etkinlikler
    const events = [
      {
        title: 'Cuma Sohbeti',
        description: 'Her Cuma akşamı düzenlediğimiz İslami sohbet programı. Bu hafta konumuz: "Sabır ve Şükür"',
        type: 'Sohbet',
        date: '2024-12-20',
        time: '20:00',
        location_name: 'Merkez Camii',
        location_address: 'Atatürk Caddesi No:15',
        location_city: 'İstanbul',
        organizer_name: 'Ahmet Yılmaz',
        organizer_contact: 'ahmet@example.com',
        capacity: 50,
        price: 0,
        is_online: false,
        image_url: null,
        tags: ['sohbet', 'cuma', 'sabır'],
        requirements: [],
        created_by: createdUsers[0].id
      },
      {
        title: 'Kur\'an Kursu Açılışı',
        description: 'Yeni dönem Kur\'an kursumuzun açılış programı. Tüm yaş grupları için kurslarımız mevcut.',
        type: 'Eğitim',
        date: '2024-12-22',
        time: '14:00',
        location_name: 'Eğitim Merkezi',
        location_address: 'Kızılay Meydanı No:8',
        location_city: 'Ankara',
        organizer_name: 'Fatma Kaya',
        organizer_contact: 'fatma@example.com',
        capacity: 100,
        price: 0,
        is_online: false,
        image_url: null,
        tags: ['kuran', 'eğitim', 'kurs'],
        requirements: [],
        created_by: createdUsers[1].id
      },
      {
        title: 'Online İslam Tarihi Semineri',
        description: 'İslam tarihinin önemli dönemlerini ele alacağımız online seminer serisi.',
        type: 'Eğitim',
        date: '2024-12-25',
        time: '19:00',
        location_name: 'Zoom',
        location_address: 'Online',
        location_city: 'Online',
        organizer_name: 'Platform Yöneticisi',
        organizer_contact: 'admin@islamic.com',
        capacity: 200,
        price: 0,
        is_online: true,
        image_url: null,
        tags: ['tarih', 'online', 'seminer'],
        requirements: ['Zoom uygulaması'],
        created_by: createdUsers[2].id
      }
    ];

    events.forEach(event => this.createEvent(event));

    // Bazı beğeniler ve yorumlar ekle
    const allPosts = this.getPosts();
    const allDuas = this.getDuaRequests();

    // Beğeniler
    if (allPosts.length > 0) {
      this.toggleLike(createdUsers[1].id, allPosts[0].id);
      this.toggleLike(createdUsers[2].id, allPosts[0].id);
      this.toggleLike(createdUsers[0].id, allPosts[1].id);
    }

    if (allDuas.length > 0) {
      this.toggleLike(createdUsers[1].id, undefined, allDuas[0].id);
      this.toggleLike(createdUsers[2].id, undefined, allDuas[0].id);
    }

    // Yorumlar
    if (allPosts.length > 0) {
      this.createComment({
        user_id: createdUsers[1].id,
        post_id: allPosts[0].id,
        dua_request_id: null,
        content: 'Aleykümselam kardeşim, hoş geldin! 🤗',
        is_prayer: false
      });
      
      this.createComment({
        user_id: createdUsers[2].id,
        post_id: allPosts[1].id,
        dua_request_id: null,
        content: 'Çok güzel bir hadis, Allah razı olsun paylaştığın için.',
        is_prayer: false
      });
    }

    if (allDuas.length > 0) {
      this.createComment({
        user_id: createdUsers[1].id,
        post_id: null,
        dua_request_id: allDuas[0].id,
        content: 'Anneniz için dua ediyorum, Allah şifa versin. 🤲',
        is_prayer: true
      });
    }

    // Yer imleri
    if (allPosts.length > 0) {
      this.toggleBookmark(createdUsers[0].id, allPosts[1].id);
      this.toggleBookmark(createdUsers[1].id, allPosts[0].id);
    }
  }
}

// Singleton instance
export const localDB = new LocalStorageDB();