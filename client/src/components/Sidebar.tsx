import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  BookOpen, 
  Heart,
  Star,
  Clock,
  MessageSquare,
  MapPin,
  UserPlus,
  Bookmark,
  Settings,
  Shield
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: Heart, label: 'Dua Talepleri', href: '/dua-requests', color: 'text-red-500' },
    { icon: Users, label: 'Topluluklar', href: '/communities', color: 'text-blue-500' },
    { icon: Calendar, label: 'Etkinlikler', href: '/events', color: 'text-green-500' },
    { icon: BookOpen, label: 'İslami İçerik', href: '/islamic-content', color: 'text-purple-500' },
    { icon: Bookmark, label: 'Yer İmleri', href: '/bookmarks', color: 'text-yellow-500' },
    { icon: Settings, label: 'Ayarlar', href: '/settings', color: 'text-gray-500' },
  ];

  // Admin için özel menü öğesi
  if (user?.role === 'admin') {
    menuItems.unshift({
      icon: Shield,
      label: 'Admin Paneli',
      href: '/admin',
      color: 'text-red-600'
    });
  }

  const islamicContent = [
    { title: 'Günün Duası', content: 'Rabbena atina fi\'d-dunya hasaneten...', icon: Heart },
    { title: 'Hadis-i Şerif', content: 'İnsanların en hayırlısı insanlara faydalı olandır.', icon: Star },
    { title: 'Namaz Vakitleri', content: 'İmsak: 05:30, Güneş: 07:15, Öğle: 13:45', icon: Clock },
  ];

  const suggestedUsers = [
    { name: 'Ahmet Yılmaz', username: 'ahmetyilmaz', followers: '2.3K', verified: true },
    { name: 'Fatma Kaya', username: 'fatmakaya', followers: '1.8K', verified: false },
    { name: 'Mehmet Demir', username: 'mehmetdemir', followers: '945', verified: true },
  ];

  const quickActions = [
    { icon: Heart, label: 'Dua Talebi Oluştur', action: () => window.location.href = '/dua-requests' },
    { icon: Users, label: 'Topluluk Oluştur', action: () => window.location.href = '/communities' },
    { icon: Calendar, label: 'Etkinlik Oluştur', action: () => window.location.href = '/events' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="space-y-6">
      {/* Navigation Menu */}
      <div className={`
        rounded-xl p-6 border transition-all duration-300
        ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
          theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
          'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }
      `}>
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
          Menü
        </h3>
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`
                flex items-center space-x-3 p-3 rounded-lg transition-colors group
                ${isActive(item.href) 
                  ? (theme === 'islamic' ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300' :
                     theme === 'ramadan' ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300' :
                     'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300')
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <item.icon size={20} className={`${isActive(item.href) ? '' : item.color} group-hover:scale-110 transition-transform`} />
              <span className={`font-medium ${isActive(item.href) ? '' : 'text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      {user && (
        <div className={`
          rounded-xl p-6 border transition-all duration-300
          ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
            theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }
        `}>
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
            Hızlı İşlemler
          </h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group text-left"
              >
                <action.icon size={18} className="text-primary-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* İslami İçerik */}
      <div className={`
        rounded-xl p-6 border transition-all duration-300
        ${theme === 'islamic' ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800' :
          theme === 'ramadan' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800' :
          'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700'
        }
      `}>
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center">
          <BookOpen className="mr-2" size={20} />
          İslami İçerik
        </h3>
        <div className="space-y-4">
          {islamicContent.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
                <div className={`
                  p-2 rounded-lg
                  ${theme === 'islamic' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-300' :
                    theme === 'ramadan' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-300' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300'
                  }
                `}>
                  <item.icon size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Takip Edilecek Kişiler */}
      {user && (
        <div className={`
          rounded-xl p-6 border
          ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
            theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }
        `}>
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center">
            <UserPlus className="mr-2" size={20} />
            Takip Edilecek Kişiler
          </h3>
          <div className="space-y-4">
            {suggestedUsers.map((suggestedUser, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {suggestedUser.name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {suggestedUser.name}
                      </span>
                      {suggestedUser.verified && (
                        <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      @{suggestedUser.username} • {suggestedUser.followers} takipçi
                    </span>
                  </div>
                </div>
                <button className={`
                  px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                  hover:shadow-md hover:scale-105
                  ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                    theme === 'ramadan' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    'bg-primary-500 hover:bg-primary-600'
                  }
                  text-white
                `}>
                  Takip Et
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform İstatistikleri */}
      <div className={`
        rounded-xl p-6 border
        ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
          theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
          'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }
      `}>
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
          Platform İstatistikleri
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Toplam Kullanıcı</span>
            <span className="font-semibold text-gray-900 dark:text-white">12.5K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Bugünkü Dua</span>
            <span className="font-semibold text-gray-900 dark:text-white">234</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Aktif Topluluk</span>
            <span className="font-semibold text-gray-900 dark:text-white">89</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Bu Ay Etkinlik</span>
            <span className="font-semibold text-gray-900 dark:text-white">15</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;