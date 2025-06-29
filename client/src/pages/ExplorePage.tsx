import React, { useState } from 'react';
import { Search, TrendingUp, Users, Calendar, Hash, Filter } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { useRealTimePosts as usePosts } from '../hooks/useRealTimePosts';

const ExplorePage: React.FC = () => {
  const { theme } = useTheme();
  const { posts } = usePosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Tümü', icon: TrendingUp },
    { id: 'trending', label: 'Trend', icon: TrendingUp },
    { id: 'people', label: 'Kişiler', icon: Users },
    { id: 'events', label: 'Etkinlikler', icon: Calendar },
    { id: 'hashtags', label: 'Etiketler', icon: Hash },
  ];

  const trendingTopics = [
    { tag: '#Ramazan2024', posts: '12.5K', growth: '+15%' },
    { tag: '#İslam', posts: '8.9K', growth: '+8%' },
    { tag: '#Dua', posts: '6.3K', growth: '+12%' },
    { tag: '#Hadis', posts: '4.7K', growth: '+5%' },
    { tag: '#Tefsir', posts: '3.2K', growth: '+18%' },
  ];

  const suggestedPeople = [
    { name: 'Dr. Mehmet Özkan', username: 'drmehmetozkan', followers: '45.2K', verified: true, bio: 'İslam Tarihi Uzmanı' },
    { name: 'Fatma Hanım', username: 'fatmahanim', followers: '23.1K', verified: true, bio: 'Kur\'an Kursu Öğretmeni' },
    { name: 'Ahmed Yılmaz', username: 'ahmedyilmaz', followers: '18.7K', verified: false, bio: 'İslami İçerik Üreticisi' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Keşfet
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Kişi, konu veya etiket ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${theme === 'islamic' ? 'bg-white dark:bg-emerald-800 border-emerald-300 dark:border-emerald-600' :
                  theme === 'ramadan' ? 'bg-white dark:bg-amber-800 border-amber-300 dark:border-amber-600' :
                  'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                }
                text-gray-900 dark:text-white placeholder-gray-500
              `}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {filters.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200
                  ${activeFilter === id
                    ? (theme === 'islamic' ? 'bg-emerald-600 text-white' :
                       theme === 'ramadan' ? 'bg-amber-600 text-white' :
                       'bg-primary-500 text-white')
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeFilter === 'all' || activeFilter === 'trending' ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Trend Gönderiler
                </h2>
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : activeFilter === 'people' ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Önerilen Kişiler
                </h2>
                <div className="grid gap-4">
                  {suggestedPeople.map((person, index) => (
                    <div key={index} className={`
                      p-6 rounded-xl border transition-all duration-300 hover:shadow-lg
                      ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                        theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }
                    `}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                              {person.name[0]}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {person.name}
                              </h3>
                              {person.verified && (
                                <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                              @{person.username} • {person.followers} takipçi
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {person.bio}
                            </p>
                          </div>
                        </div>
                        <button className={`
                          px-6 py-2 rounded-lg font-medium transition-all duration-200
                          hover:shadow-md hover:scale-105
                          ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                            theme === 'ramadan' ? 'bg-amber-600 hover:bg-amber-700' :
                            'bg-primary-500 hover:bg-primary-600'
                          }
                          text-white
                        `}>
                          Takip Et
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Filter size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Bu kategori için içerik hazırlanıyor
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Yakında bu bölümde daha fazla içerik bulabileceksiniz.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className={`
              rounded-xl p-6 border
              ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }
            `}>
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="mr-2" size={20} />
                Trend Konular
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="group cursor-pointer p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                          {topic.tag}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {topic.posts} gönderi
                        </p>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        {topic.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`
              rounded-xl p-6 border
              ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }
            `}>
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                Hızlı Erişim
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users className="text-blue-500" size={20} />
                    <span className="text-gray-900 dark:text-white">Yeni Topluluklar</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-green-500" size={20} />
                    <span className="text-gray-900 dark:text-white">Yaklaşan Etkinlikler</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Hash className="text-purple-500" size={20} />
                    <span className="text-gray-900 dark:text-white">Popüler Etiketler</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;