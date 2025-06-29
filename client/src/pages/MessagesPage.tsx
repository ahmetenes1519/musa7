import React, { useState } from 'react';
import { MessageCircle, Search, Plus, Phone, Video, MoreHorizontal, Send, Smile, Paperclip } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';

const MessagesPage: React.FC = () => {
  const { theme } = useTheme();
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      lastMessage: 'Selamün aleyküm, nasılsınız?',
      time: '10:30',
      unread: 2,
      online: true,
      avatar: 'A'
    },
    {
      id: 2,
      name: 'Fatma Kaya',
      lastMessage: 'Cuma sohbetine gelecek misiniz?',
      time: 'Dün',
      unread: 0,
      online: false,
      avatar: 'F'
    },
    {
      id: 3,
      name: 'İstanbul Gençlik Topluluğu',
      lastMessage: 'Yeni etkinlik duyurusu',
      time: '2 gün önce',
      unread: 1,
      online: true,
      avatar: 'İ',
      isGroup: true
    },
    {
      id: 4,
      name: 'Mehmet Demir',
      lastMessage: 'Teşekkür ederim kardeşim',
      time: '1 hafta önce',
      unread: 0,
      online: false,
      avatar: 'M'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Ahmet Yılmaz',
      content: 'Selamün aleyküm kardeşim',
      time: '10:25',
      isOwn: false
    },
    {
      id: 2,
      sender: 'Ben',
      content: 'Aleykümselam, nasılsınız?',
      time: '10:26',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Ahmet Yılmaz',
      content: 'Elhamdülillah iyiyiz. Siz nasılsınız? Cuma sohbetine gelecek misiniz?',
      time: '10:27',
      isOwn: false
    },
    {
      id: 4,
      sender: 'Ben',
      content: 'İnşallah gelirim. Konu neydi?',
      time: '10:28',
      isOwn: true
    },
    {
      id: 5,
      sender: 'Ahmet Yılmaz',
      content: 'Bu hafta "Sabır ve Şükür" konusunu işleyeceğiz. Çok güzel bir konu.',
      time: '10:30',
      isOwn: false
    }
  ];

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Here you would typically send the message to your backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className={`
            rounded-xl border overflow-hidden
            ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
              theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
              'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }
          `}>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Mesajlar
                </h2>
                <button className={`
                  p-2 rounded-lg transition-colors
                  ${theme === 'islamic' ? 'hover:bg-emerald-100 dark:hover:bg-emerald-800' :
                    theme === 'ramadan' ? 'hover:bg-yellow-100 dark:hover:bg-yellow-800' :
                    'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}>
                  <Plus className="text-gray-600 dark:text-gray-400" size={20} />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Sohbet ara..."
                  className={`
                    w-full pl-9 pr-4 py-2 rounded-lg border text-sm
                    focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    ${theme === 'islamic' ? 'bg-white dark:bg-emerald-800 border-emerald-300 dark:border-emerald-600' :
                      theme === 'ramadan' ? 'bg-white dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600' :
                      'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }
                    text-gray-900 dark:text-white placeholder-gray-500
                  `}
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`
                    p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors
                    ${selectedChat === conversation.id
                      ? (theme === 'islamic' ? 'bg-emerald-100 dark:bg-emerald-800' :
                         theme === 'ramadan' ? 'bg-yellow-100 dark:bg-yellow-800' :
                         'bg-primary-50 dark:bg-primary-900/20')
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {conversation.avatar}
                        </span>
                      </div>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {conversation.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`
            lg:col-span-2 rounded-xl border overflow-hidden flex flex-col
            ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
              theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
              'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }
          `}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {selectedConversation.avatar}
                          </span>
                        </div>
                        {selectedConversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {selectedConversation.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedConversation.online ? 'Çevrimiçi' : 'Son görülme: 2 saat önce'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Phone className="text-gray-600 dark:text-gray-400" size={20} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Video className="text-gray-600 dark:text-gray-400" size={20} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MoreHorizontal className="text-gray-600 dark:text-gray-400" size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-xs lg:max-w-md px-4 py-2 rounded-lg
                          ${message.isOwn
                            ? (theme === 'islamic' ? 'bg-emerald-600 text-white' :
                               theme === 'ramadan' ? 'bg-yellow-600 text-white' :
                               'bg-primary-500 text-white')
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isOwn ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Paperclip className="text-gray-600 dark:text-gray-400" size={20} />
                    </button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        className={`
                          w-full px-4 py-2 pr-10 rounded-lg border
                          focus:ring-2 focus:ring-primary-500 focus:border-transparent
                          ${theme === 'islamic' ? 'bg-white dark:bg-emerald-800 border-emerald-300 dark:border-emerald-600' :
                            theme === 'ramadan' ? 'bg-white dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600' :
                            'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                          }
                          text-gray-900 dark:text-white placeholder-gray-500
                        `}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Smile className="text-gray-600 dark:text-gray-400" size={16} />
                      </button>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className={`
                        p-2 rounded-lg transition-all duration-200 disabled:opacity-50
                        ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                          theme === 'ramadan' ? 'bg-yellow-600 hover:bg-yellow-700' :
                          'bg-primary-500 hover:bg-primary-600'
                        }
                        text-white
                      `}
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Bir sohbet seçin
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Mesajlaşmaya başlamak için sol taraftan bir sohbet seçin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;