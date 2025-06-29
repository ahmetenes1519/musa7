import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Calendar, Settings, Check, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';

const NotificationsPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'likes', label: 'Beğeniler' },
    { id: 'comments', label: 'Yorumlar' },
    { id: 'follows', label: 'Takipçiler' },
    { id: 'events', label: 'Etkinlikler' },
  ];

  const notifications = [
    {
      id: 1,
      type: 'like',
      user: 'Ahmet Yılmaz',
      action: 'gönderinizi beğendi',
      content: 'Selamün aleyküm kardeşlerim! Bu güzel platformda...',
      time: '2 saat önce',
      read: false,
      avatar: 'A'
    },
    {
      id: 2,
      type: 'comment',
      user: 'Fatma Kaya',
      action: 'gönderinize yorum yaptı',
      content: 'Çok güzel bir paylaşım, Allah razı olsun!',
      time: '4 saat önce',
      read: false,
      avatar: 'F'
    },
    {
      id: 3,
      type: 'follow',
      user: 'Mehmet Demir',
      action: 'sizi takip etmeye başladı',
      content: '',
      time: '1 gün önce',
      read: true,
      avatar: 'M'
    },
    {
      id: 4,
      type: 'event',
      user: 'İstanbul Gençlik Topluluğu',
      action: 'etkinliğine davet etti',
      content: 'Cuma Sohbeti - Sabır ve Şükür',
      time: '2 gün önce',
      read: true,
      avatar: 'İ'
    },
    {
      id: 5,
      type: 'like',
      user: 'Zeynep Özkan',
      action: 'dua talebinizi beğendi',
      content: 'Annem için şifa duası',
      time: '3 gün önce',
      read: true,
      avatar: 'Z'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="text-red-500" size={20} />;
      case 'comment':
        return <MessageCircle className="text-blue-500" size={20} />;
      case 'follow':
        return <UserPlus className="text-green-500" size={20} />;
      case 'event':
        return <Calendar className="text-purple-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => {
        switch (activeFilter) {
          case 'likes':
            return n.type === 'like';
          case 'comments':
            return n.type === 'comment';
          case 'follows':
            return n.type === 'follow';
          case 'events':
            return n.type === 'event';
          default:
            return true;
        }
      });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bildirimler
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Son aktivitelerinizi takip edin
            </p>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings className="text-gray-500" size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {filters.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={`
                  px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200
                  ${activeFilter === id
                    ? (theme === 'islamic' ? 'bg-emerald-600 text-white' :
                       theme === 'ramadan' ? 'bg-amber-600 text-white' :
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

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                p-6 rounded-xl border transition-all duration-300 hover:shadow-lg
                ${!notification.read ? 'border-l-4 border-l-primary-500' : ''}
                ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                  theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                  'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }
                ${!notification.read ? 'bg-opacity-80' : ''}
              `}
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">
                    {notification.avatar}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getNotificationIcon(notification.type)}
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {notification.user}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {notification.action}
                        </span>
                      </div>
                      
                      {notification.content && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                          {notification.content}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {notification.time}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors">
                          <Check className="text-green-600" size={16} />
                        </button>
                      )}
                      <button className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                        <X className="text-red-600" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Henüz bildirim yok
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Yeni bildirimleriniz burada görünecek.
            </p>
          </div>
        )}

        {/* Mark All as Read */}
        {filteredNotifications.some(n => !n.read) && (
          <div className="mt-8 text-center">
            <button className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-200
              hover:shadow-md hover:scale-105
              ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                theme === 'ramadan' ? 'bg-amber-600 hover:bg-amber-700' :
                'bg-primary-500 hover:bg-primary-600'
              }
              text-white
            `}>
              Tümünü Okundu Olarak İşaretle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;