import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CreatePost from './components/CreatePost';
import PostCard from './components/PostCard';
import LoginModal from './components/LoginModal';
import SystemHealth from './components/SystemHealth';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import DuaRequestsPage from './pages/DuaRequestsPage';
import CommunitiesPage from './pages/CommunitiesPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import BookmarksPage from './pages/BookmarksPage';
import AdminReportsPage from './pages/AdminReportsPage';
import { useRealTimePosts as usePosts } from './hooks/useRealTimePosts';
// Using new API client instead of Supabase

const HomePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const { posts, isLoading: postsLoading, error } = usePosts();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [newPostNotification, setNewPostNotification] = useState<string | null>(null);

  // Yeni gönderi bildirimi için
  useEffect(() => {
    const handleNewPost = (event: CustomEvent) => {
      const newPost = event.detail;
      if (newPost && newPost.user_id !== user?.id) {
        const userName = newPost.users?.name || 'Bir kullanıcı';
        setNewPostNotification(`${userName} yeni bir gönderi paylaştı!`);
        setTimeout(() => setNewPostNotification(null), 5000);
      }
    };

    window.addEventListener('postCreated', handleNewPost as EventListener);
    return () => window.removeEventListener('postCreated', handleNewPost as EventListener);
  }, [user?.id]);

  // Login modal açma eventi dinle
  useEffect(() => {
    const handleOpenLoginModal = () => {
      setShowLoginModal(true);
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal);
    return () => window.removeEventListener('openLoginModal', handleOpenLoginModal);
  }, []);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? undefined : tag);
  };

  // Show loading only if auth is still loading AND we don't have posts yet
  if (authLoading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Uygulama başlatılıyor...</p>
          <p className="text-blue-600 dark:text-blue-400 text-sm mt-2">
            Using API client
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      {/* API client notification */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              ✓ <strong>API Mode:</strong> Using server-side PostgreSQL database with Drizzle ORM.
            </p>
          </div>
        </div>
      </div>
      
      {/* Yeni gönderi bildirimi */}
      {newPostNotification && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-up">
          {newPostNotification}
        </div>
      )}

      {/* Tag filtresi bildirimi */}
      {selectedTag && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-up">
          <div className="flex items-center space-x-2">
            <span>#{selectedTag} etiketli gönderiler gösteriliyor</span>
            <button 
              onClick={() => setSelectedTag(undefined)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Sidebar - Sol */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {user && <CreatePost />}
            
            <div className="space-y-4 lg:space-y-6">
              {postsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">Gönderiler yüklenirken hata oluştu: {error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Yeniden Dene
                  </button>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {selectedTag 
                      ? `No posts found with #${selectedTag} tag.`
                      : 'No posts yet. Share the first post!'
                    }
                  </p>
                  {!user && (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Giriş Yap
                    </button>
                  )}
                </div>
              ) : (
                posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar - Sağ */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="space-y-6">
                {/* Trending Topics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                    Trend Konular
                  </h3>
                  <div className="space-y-3">
                    {['Ramazan2024', 'İslam', 'Dua', 'Hadis', 'Tefsir'].map((tag, index) => (
                      <div 
                        key={index} 
                        className={`
                          cursor-pointer p-3 rounded-lg transition-colors group
                          ${selectedTag === tag 
                            ? 'bg-primary-100 dark:bg-primary-900/20 border border-primary-300' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }
                        `}
                        onClick={() => handleTagClick(tag)}
                      >
                        <span className={`
                          font-semibold
                          ${selectedTag === tag 
                            ? 'text-primary-700 dark:text-primary-300' 
                            : 'text-primary-600 dark:text-primary-400'
                          }
                        `}>
                          #{tag}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.floor(Math.random() * 10) + 1}K gönderi
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sistem Sağlığı */}
                <SystemHealth />
                
                {/* Platform Durumu */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                    Platform Durumu
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {posts.length} gönderi yüklendi
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${postsLoading ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {postsLoading ? 'Yükleniyor...' : 'Hazır'}
                      </span>
                    </div>
                    {selectedTag && (
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          #{selectedTag} filtresi aktif
                        </span>
                      </div>
                    )}
                    {user && (
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          {user.name} olarak giriş yapıldı
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/dua-requests" element={<DuaRequestsPage />} />
              <Route path="/communities" element={<CommunitiesPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;