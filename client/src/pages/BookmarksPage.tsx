import React, { useState, useEffect } from 'react';
import { Bookmark, Filter, Search, Grid, List, Calendar, Tag } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import DuaRequestCard from '../components/DuaRequestCard';
import type { Post, DuaRequest, User } from '@shared/schema';

interface BookmarkedPost extends Post {
  users: User;
  bookmarked_at: string;
}

interface BookmarkedDuaRequest extends DuaRequest {
  users: User;
  bookmarked_at: string;
}

const BookmarksPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkedPost[]>([]);
  const [bookmarkedDuaRequests, setBookmarkedDuaRequests] = useState<BookmarkedDuaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'posts' | 'dua-requests'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'category'>('recent');

  const categories = ['Genel', 'Hadis', 'Dua', 'Sohbet', 'Eğitim', 'Duyuru', 'Ramazan', 'Hac', 'Umre'];

  useEffect(() => {
    loadBookmarks();
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load bookmarked posts
      const postsResponse = await fetch('/api/bookmarks/posts', {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      });
      
      if (postsResponse.ok) {
        const posts = await postsResponse.json();
        setBookmarkedPosts(posts);
      }

      // Load bookmarked dua requests
      const duaResponse = await fetch('/api/bookmarks/dua-requests', {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      });
      
      if (duaResponse.ok) {
        const duaRequests = await duaResponse.json();
        setBookmarkedDuaRequests(duaRequests);
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      // Fallback to demo data
      loadDemoBookmarks();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoBookmarks = () => {
    // Demo bookmarked posts
    const demoPosts: BookmarkedPost[] = [
      {
        id: 'bookmark-post-1',
        user_id: user?.id || '',
        content: 'Güzel bir İslami paylaşım örneği. Bu gönderi kaydedilmiş durumda.',
        category: 'Hadis',
        tags: ['hadis', 'ilim'],
        type: 'text',
        media_url: null,
        likes_count: 15,
        comments_count: 8,
        shares_count: 3,
        created_at: new Date('2024-12-20').toISOString(),
        updated_at: new Date('2024-12-20').toISOString(),
        users: {
          id: 'user-1',
          name: 'Ali Veli',
          username: 'aliveli',
          email: 'ali@example.com',
          avatar_url: null,
          bio: 'İslami paylaşımlar',
          location: 'İstanbul',
          website: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        bookmarked_at: new Date('2024-12-22').toISOString()
      },
      {
        id: 'bookmark-post-2',
        user_id: user?.id || '',
        content: 'Ramazan ayına hazırlık için güzel bir dua metni.',
        category: 'Ramazan',
        tags: ['ramazan', 'dua', 'hazırlık'],
        type: 'text',
        media_url: null,
        likes_count: 25,
        comments_count: 12,
        shares_count: 7,
        created_at: new Date('2024-12-18').toISOString(),
        updated_at: new Date('2024-12-18').toISOString(),
        users: {
          id: 'user-2',
          name: 'Fatma Hanım',
          username: 'fatmahanim',
          email: 'fatma@example.com',
          avatar_url: null,
          bio: 'Dua ve zikir paylaşımları',
          location: 'Ankara',
          website: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        bookmarked_at: new Date('2024-12-21').toISOString()
      }
    ];

    // Demo bookmarked dua requests
    const demoDuaRequests: BookmarkedDuaRequest[] = [
      {
        id: 'bookmark-dua-1',
        user_id: user?.id || '',
        title: 'Sınav için dua talebi',
        content: 'Yaklaşan sınavlarım için dua eder misiniz?',
        category: 'Eğitim',
        tags: ['sınav', 'eğitim'],
        is_urgent: false,
        is_anonymous: false,
        prayer_count: 45,
        created_at: new Date('2024-12-19').toISOString(),
        updated_at: new Date('2024-12-19').toISOString(),
        users: {
          id: 'user-3',
          name: 'Mehmet Öğrenci',
          username: 'mehmetogrenci',
          email: 'mehmet@example.com',
          avatar_url: null,
          bio: 'Üniversite öğrencisi',
          location: 'İzmir',
          website: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        bookmarked_at: new Date('2024-12-23').toISOString()
      }
    ];

    setBookmarkedPosts(demoPosts);
    setBookmarkedDuaRequests(demoDuaRequests);
  };

  const filteredContent = () => {
    let posts = bookmarkedPosts;
    let duaRequests = bookmarkedDuaRequests;

    // Filter by search query
    if (searchQuery) {
      posts = posts.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      duaRequests = duaRequests.filter(dua => 
        dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      posts = posts.filter(post => post.category === selectedCategory);
      duaRequests = duaRequests.filter(dua => dua.category === selectedCategory);
    }

    // Filter by type
    if (selectedType === 'posts') {
      duaRequests = [];
    } else if (selectedType === 'dua-requests') {
      posts = [];
    }

    // Sort content
    const sortItems = (items: any[]) => {
      switch (sortBy) {
        case 'oldest':
          return items.sort((a, b) => new Date(a.bookmarked_at).getTime() - new Date(b.bookmarked_at).getTime());
        case 'category':
          return items.sort((a, b) => a.category.localeCompare(b.category));
        default: // recent
          return items.sort((a, b) => new Date(b.bookmarked_at).getTime() - new Date(a.bookmarked_at).getTime());
      }
    };

    return {
      posts: sortItems([...posts]),
      duaRequests: sortItems([...duaRequests])
    };
  };

  const { posts, duaRequests } = filteredContent();
  const totalBookmarks = bookmarkedPosts.length + bookmarkedDuaRequests.length;
  const filteredTotal = posts.length + duaRequests.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-20">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Kaydedilen gönderiler yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
              <Bookmark className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Kaydedilen Gönderiler
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {totalBookmarks} kayıt • {filteredTotal} gösteriliyor
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Kaydedilen gönderilerde ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Tüm Türler</option>
                <option value="posts">Sadece Gönderiler</option>
                <option value="dua-requests">Sadece Dua Talepleri</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="recent">En Yeni Kaydedilenler</option>
                <option value="oldest">En Eski Kaydedilenler</option>
                <option value="category">Kategoriye Göre</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                >
                  <List size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                >
                  <Grid size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredTotal === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery || selectedCategory !== 'all' || selectedType !== 'all' 
                ? 'Arama kriterlerinize uygun kayıt bulunamadı'
                : 'Henüz hiçbir gönderi kaydetmediniz'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || selectedCategory !== 'all' || selectedType !== 'all'
                ? 'Filtreleri değiştirerek tekrar deneyebilirsiniz'
                : 'Beğendiğiniz gönderileri kaydetmek için kalp ikonunun yanındaki bookmark ikonuna tıklayın'
              }
            </p>
            {(searchQuery || selectedCategory !== 'all' || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }>
            {/* Render Posts */}
            {posts.map((post) => (
              <div key={`post-${post.id}`} className="relative">
                <PostCard post={post} />
                <div className="absolute top-4 right-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full text-xs font-medium">
                  {new Date(post.bookmarked_at).toLocaleDateString('tr-TR')} tarihinde kaydedildi
                </div>
              </div>
            ))}

            {/* Render Dua Requests */}
            {duaRequests.map((duaRequest) => (
              <div key={`dua-${duaRequest.id}`} className="relative">
                <DuaRequestCard duaRequest={duaRequest} />
                <div className="absolute top-4 right-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full text-xs font-medium">
                  {new Date(duaRequest.bookmarked_at).toLocaleDateString('tr-TR')} tarihinde kaydedildi
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;