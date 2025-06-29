import React, { useState } from 'react';
import { User, MapPin, Calendar, Link as LinkIcon, Edit, Settings, Heart, MessageCircle, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { useRealTimePosts as usePosts } from '../hooks/useRealTimePosts';

const ProfilePage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { posts } = usePosts();
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.user_metadata?.full_name || '',
    bio: '',
    location: '',
    website: ''
  });

  const tabs = [
    { id: 'posts', label: 'Gönderiler', icon: MessageCircle },
    { id: 'likes', label: 'Beğeniler', icon: Heart },
    { id: 'communities', label: 'Topluluklar', icon: Users },
  ];

  const userPosts = posts.filter(post => post.user_id === user?.id);
  const userStats = {
    posts: userPosts.length,
    followers: 245,
    following: 189,
    likes: userPosts.reduce((sum, post) => sum + post.likes_count, 0)
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the user profile
    console.log('Updating profile:', editData);
    setShowEditModal(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Giriş yapmanız gerekiyor
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Profilinizi görüntülemek için lütfen giriş yapın.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className={`
          rounded-xl border p-8 mb-8
          ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
            theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }
        `}>
          {/* Cover Image */}
          <div className={`
            h-32 -mx-8 -mt-8 mb-8 rounded-t-xl bg-gradient-to-r
            ${theme === 'islamic' ? 'from-emerald-400 to-teal-500' :
              theme === 'ramadan' ? 'from-amber-400 to-yellow-500' :
              'from-primary-400 to-blue-500'
            }
          `}></div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between -mt-16 relative">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 mb-4 sm:mb-0">
                <span className="text-white font-bold text-2xl">
                  {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                </span>
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.user_metadata?.full_name || 'İsimsiz Kullanıcı'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  @{user.user_metadata?.username || 'kullanici'}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  İslami değerlere bağlı bir kardeşiniz. Hayır işlerinde aktif olmaya çalışıyorum.
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setShowEditModal(true)}
              className={`
                mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200
                hover:shadow-md hover:scale-105
                ${theme === 'islamic' ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-100' :
                  theme === 'ramadan' ? 'border-amber-300 text-amber-700 hover:bg-amber-100' :
                  'border-gray-300 text-gray-700 hover:bg-gray-100'
                }
                dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700
              `}
            >
              <Edit size={16} />
              <span>Profili Düzenle</span>
            </button>
          </div>

          {/* Profile Info */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin size={16} />
              <span>İstanbul, Türkiye</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>Ocak 2024'te katıldı</span>
            </div>
            <div className="flex items-center space-x-1">
              <LinkIcon size={16} />
              <a href="#" className="text-primary-600 hover:underline">
                islamicblog.com
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats.posts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Gönderi
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats.followers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Takipçi
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats.following}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Takip
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats.likes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Beğeni
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 justify-center
                  ${activeTab === id
                    ? (theme === 'islamic' ? 'bg-emerald-600 text-white' :
                       theme === 'ramadan' ? 'bg-amber-600 text-white' :
                       'bg-primary-500 text-white')
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Henüz gönderi yok
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    İlk gönderinizi paylaşın!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="text-center py-12">
              <Heart size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Beğeniler
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Beğendiğiniz gönderiler burada görünecek.
              </p>
            </div>
          )}

          {activeTab === 'communities' && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Topluluklar
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Katıldığınız topluluklar burada görünecek.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`
            w-full max-w-2xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto
            ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900' :
              theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900' :
              'bg-white dark:bg-gray-800'
            }
          `}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Profili Düzenle
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biyografi
                </label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Kendinizden bahsedin..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Konum
                </label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="İstanbul, Türkiye"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={editData.website}
                  onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-200
                    hover:shadow-md hover:scale-105
                    ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                      theme === 'ramadan' ? 'bg-amber-600 hover:bg-amber-700' :
                      'bg-primary-500 hover:bg-primary-600'
                    }
                    text-white
                  `}
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;