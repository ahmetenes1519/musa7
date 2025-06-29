import React, { useState } from 'react';
import { Users, Plus, Search, MapPin, Crown, Shield, User as UserIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { useCommunities } from '../hooks/useCommunities';

const CommunitiesPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { communities, loading, createCommunity, joinCommunity } = useCommunities();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Gençlik',
    location: '',
    is_private: false
  });

  const categories = ['Gençlik', 'Eğitim', 'Aile', 'Sohbet', 'Yardımlaşma', 'Spor', 'Sanat', 'Genel'];
  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'joined', label: 'Katıldığım' },
    { id: 'popular', label: 'Popüler' },
    { id: 'new', label: 'Yeni' }
  ];

  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case 'admin':
        return <Crown className="text-yellow-500" size={16} />;
      case 'moderator':
        return <Shield className="text-blue-500" size={16} />;
      default:
        return <UserIcon className="text-gray-500" size={16} />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await createCommunity(formData);
    
    if (!error) {
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        category: 'Gençlik',
        location: '',
        is_private: false
      });
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    await joinCommunity(communityId);
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeFilter) {
      case 'joined':
        return matchesSearch && community.isJoined;
      case 'popular':
        return matchesSearch && community.member_count > 100;
      case 'new':
        return matchesSearch; // In real app, filter by creation date
      default:
        return matchesSearch;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Topluluklar
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              İlgi alanlarınıza uygun toplulukları keşfedin ve katılın
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className={`
                mt-4 sm:mt-0 flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                hover:shadow-md hover:scale-105
                ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  theme === 'ramadan' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  'bg-primary-500 hover:bg-primary-600'
                }
                text-white
              `}
            >
              <Plus size={20} />
              <span>Topluluk Oluştur</span>
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Topluluk ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${theme === 'islamic' ? 'bg-white dark:bg-emerald-800 border-emerald-300 dark:border-emerald-600' :
                  theme === 'ramadan' ? 'bg-white dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600' :
                  'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                }
                text-gray-900 dark:text-white placeholder-gray-500
              `}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {filters.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={`
                  px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200
                  ${activeFilter === id
                    ? (theme === 'islamic' ? 'bg-emerald-600 text-white' :
                       theme === 'ramadan' ? 'bg-yellow-600 text-white' :
                       'bg-primary-500 text-white')
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className={`
                rounded-xl border transition-all duration-300 hover:shadow-lg overflow-hidden
                ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                  theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                  'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }
              `}
            >
              {/* Cover Image */}
              <div className={`
                h-32 bg-gradient-to-r
                ${theme === 'islamic' ? 'from-emerald-400 to-teal-500' :
                  theme === 'ramadan' ? 'from-yellow-400 to-amber-500' :
                  'from-primary-400 to-blue-500'
                }
              `}>
                <div className="h-full flex items-center justify-center">
                  <Users className="text-white" size={32} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
                    {community.name}
                  </h3>
                  {community.isJoined && (
                    <div className="flex items-center space-x-1 ml-2">
                      {getRoleIcon(community.userRole || null)}
                    </div>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {community.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Kategori:</span>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                      {community.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Üye:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {community.member_count}
                    </span>
                  </div>

                  {community.location && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin size={14} />
                      <span>{community.location}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {community.users.name} tarafından
                  </span>
                  
                  {user && !community.isJoined ? (
                    <button
                      onClick={() => handleJoinCommunity(community.id)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        hover:shadow-md hover:scale-105
                        ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                          theme === 'ramadan' ? 'bg-yellow-600 hover:bg-yellow-700' :
                          'bg-primary-500 hover:bg-primary-600'
                        }
                        text-white
                      `}
                    >
                      Katıl
                    </button>
                  ) : community.isJoined ? (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      Üyesin
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Topluluk bulunamadı
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Arama kriterlerinizi değiştirin veya yeni bir topluluk oluşturun.
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`
            w-full max-w-2xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto
            ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900' :
              theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900' :
              'bg-white dark:bg-gray-800'
            }
          `}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Yeni Topluluk Oluştur
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topluluk Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Konum (İsteğe bağlı)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="İstanbul, Ankara, Online..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.is_private}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_private: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Özel topluluk (sadece davetliler katılabilir)</span>
                </label>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
                      theme === 'ramadan' ? 'bg-yellow-600 hover:bg-yellow-700' :
                      'bg-primary-500 hover:bg-primary-600'
                    }
                    text-white
                  `}
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;