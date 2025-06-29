import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Ban, 
  Mail, 
  Globe, 
  Trash2, 
  Eye, 
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  UserX,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { useRealTimePosts as usePosts } from '../hooks/useRealTimePosts';


interface BannedUser {
  id: string;
  email: string;
  name: string;
  reason: string;
  bannedAt: string;
  bannedBy: string;
  ipAddress?: string;
  deviceInfo?: string;
}

interface ReportedContent {
  id: string;
  type: 'post' | 'comment' | 'user';
  contentId: string;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { posts, deletePost } = usePosts();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [reports, setReports] = useState<ReportedContent[]>([]);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banReason, setBanReason] = useState('');
  const [banType, setBanType] = useState<'email' | 'ip' | 'device'>('email');

  // Admin kontrolü
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Shield size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Erişim Reddedildi
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Bu sayfaya erişim için admin yetkisi gereklidir.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Kullanıcı Yönetimi', icon: Users },
    { id: 'content', label: 'İçerik Yönetimi', icon: MessageSquare },
    { id: 'reports', label: 'Şikayetler', icon: AlertTriangle },
    { id: 'bans', label: 'Yasaklılar', icon: Ban },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  const users = localDB.getUsers();
  const allPosts = localDB.getPosts();
  const comments = localDB.getComments();

  const handleBanUser = (targetUser: any) => {
    setSelectedUser(targetUser);
    setShowBanModal(true);
  };

  const executeBan = () => {
    if (!selectedUser || !banReason.trim()) return;

    const newBan: BannedUser = {
      id: Date.now().toString(),
      email: selectedUser.email,
      name: selectedUser.name,
      reason: banReason,
      bannedAt: new Date().toISOString(),
      bannedBy: user.email,
      ipAddress: banType === 'ip' ? '192.168.1.1' : undefined,
      deviceInfo: banType === 'device' ? 'Chrome/Windows' : undefined
    };

    setBannedUsers(prev => [...prev, newBan]);
    
    // LocalStorage'a kaydet
    const existingBans = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    localStorage.setItem('bannedUsers', JSON.stringify([...existingBans, newBan]));

    setShowBanModal(false);
    setBanReason('');
    setSelectedUser(null);
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) {
      await deletePost(postId);
    }
  };

  const handleUnban = (banId: string) => {
    setBannedUsers(prev => prev.filter(ban => ban.id !== banId));
    const updatedBans = bannedUsers.filter(ban => ban.id !== banId);
    localStorage.setItem('bannedUsers', JSON.stringify(updatedBans));
  };

  // Load banned users from localStorage
  useEffect(() => {
    const savedBans = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    setBannedUsers(savedBans);
  }, []);

  const stats = {
    totalUsers: users.length,
    totalPosts: allPosts.length,
    totalComments: comments.length,
    bannedUsers: bannedUsers.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    activeUsers: users.filter(u => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-red-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Paneli
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Platform yönetimi ve moderasyon araçları
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                  ${activeTab === id
                    ? (theme === 'islamic' ? 'bg-emerald-600 text-white' :
                       theme === 'ramadan' ? 'bg-amber-600 text-white' :
                       'bg-primary-500 text-white')
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon size={18} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Toplam Kullanıcı', value: stats.totalUsers, icon: Users, color: 'blue' },
                  { label: 'Toplam Gönderi', value: stats.totalPosts, icon: MessageSquare, color: 'green' },
                  { label: 'Toplam Yorum', value: stats.totalComments, icon: MessageSquare, color: 'purple' },
                  { label: 'Yasaklı Kullanıcı', value: stats.bannedUsers, icon: Ban, color: 'red' },
                  { label: 'Bekleyen Şikayet', value: stats.pendingReports, icon: AlertTriangle, color: 'yellow' },
                  { label: 'Aktif Kullanıcı (7 gün)', value: stats.activeUsers, icon: Users, color: 'indigo' },
                ].map((stat, index) => (
                  <div key={index} className={`
                    p-6 rounded-xl border
                    ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                      theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }
                  `}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      </div>
                      <stat.icon className={`text-${stat.color}-500`} size={32} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className={`
                rounded-xl border p-6
                ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                  theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                  'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }
              `}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Son Aktiviteler
                </h3>
                <div className="space-y-3">
                  {allPosts.slice(0, 5).map((post) => {
                    const postUser = users.find(u => u.id === post.user_id);
                    return (
                      <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {postUser?.name} yeni gönderi paylaştı
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {post.content.substring(0, 50)}...
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(post.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Kullanıcı ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className={`
                rounded-xl border overflow-hidden
                ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                  theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                  'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }
              `}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Kullanıcı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          E-posta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Kayıt Tarihi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {users
                        .filter(u => 
                          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((targetUser) => (
                        <tr key={targetUser.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  {targetUser.name[0]}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {targetUser.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  @{targetUser.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {targetUser.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`
                              px-2 py-1 text-xs rounded-full
                              ${targetUser.role === 'admin' ? 'bg-red-100 text-red-800' :
                                targetUser.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }
                            `}>
                              {targetUser.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(targetUser.created_at).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleBanUser(targetUser)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                disabled={targetUser.role === 'admin'}
                              >
                                <Ban size={16} />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900 transition-colors">
                                <Eye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Content Management */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                İçerik Yönetimi
              </h3>
              
              <div className="grid gap-6">
                {allPosts.map((post) => {
                  const postUser = users.find(u => u.id === post.user_id);
                  return (
                    <div key={post.id} className={`
                      p-6 rounded-xl border
                      ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                        theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }
                    `}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {postUser?.name[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {postUser?.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(post.created_at).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            {post.content}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{post.likes_count} beğeni</span>
                            <span>{post.comments_count} yorum</span>
                            <span>{post.shares_count} paylaşım</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Banned Users */}
          {activeTab === 'bans' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Yasaklı Kullanıcılar
              </h3>
              
              {bannedUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Ban size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Henüz yasaklı kullanıcı bulunmuyor.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bannedUsers.map((ban) => (
                    <div key={ban.id} className={`
                      p-6 rounded-xl border
                      ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                        theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }
                    `}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {ban.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {ban.email}
                          </p>
                          <p className="text-sm text-red-600 mt-1">
                            Sebep: {ban.reason}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Yasaklayan: {ban.bannedBy} • {new Date(ban.bannedAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnban(ban.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Yasağı Kaldır
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`
            w-full max-w-md rounded-2xl p-6
            ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900' :
              theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900' :
              'bg-white dark:bg-gray-800'
            }
          `}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Kullanıcıyı Yasakla
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yasaklama Türü
                </label>
                <select
                  value={banType}
                  onChange={(e) => setBanType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="email">E-posta Yasağı</option>
                  <option value="ip">IP Adresi Yasağı</option>
                  <option value="device">Cihaz Yasağı</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yasaklama Sebebi
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Yasaklama sebebini açıklayın..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => setShowBanModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={executeBan}
                disabled={!banReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Yasakla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;