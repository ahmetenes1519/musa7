import React, { useState } from 'react';
import { Heart, Plus, Filter, Clock, MessageCircle, User, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import DuaRequestCard from '../components/DuaRequestCard';
import { useDuaRequests } from '../hooks/useDuaRequests';

const DuaRequestsPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { duaRequests, loading, createDuaRequest } = useDuaRequests();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Sağlık',
    is_urgent: false,
    is_anonymous: false,
    tags: ''
  });

  const categories = ['Sağlık', 'İş', 'Evlilik', 'Aile', 'Eğitim', 'Maddi', 'Manevi', 'Genel'];
  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'urgent', label: 'Acil' },
    { id: 'recent', label: 'Yeni' },
    { id: 'popular', label: 'Popüler' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    const { error } = await createDuaRequest({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      is_urgent: formData.is_urgent,
      is_anonymous: formData.is_anonymous,
      tags
    });

    if (!error) {
      setShowCreateModal(false);
      setFormData({
        title: '',
        content: '',
        category: 'Sağlık',
        is_urgent: false,
        is_anonymous: false,
        tags: ''
      });
    }
  };

  const filteredRequests = duaRequests.filter(request => {
    switch (activeFilter) {
      case 'urgent':
        return request.is_urgent;
      case 'recent':
        return new Date(request.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
      case 'popular':
        return request.prayers_count > 5;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dua Talepleri
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kardeşlerimizin dua taleplerini görün ve dua edin
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className={`
                mt-4 sm:mt-0 flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                hover:shadow-md hover:scale-105
                ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  theme === 'ramadan' ? 'bg-amber-600 hover:bg-amber-700' :
                  'bg-primary-500 hover:bg-primary-600'
                }
                text-white
              `}
            >
              <Plus size={20} />
              <span>Dua Talebi Oluştur</span>
            </button>
          )}
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

        {/* Dua Requests Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <DuaRequestCard key={request.id} duaRequest={request} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Heart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Henüz dua talebi yok
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              İlk dua talebini sen oluştur.
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
              theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900' :
              'bg-white dark:bg-gray-800'
            }
          `}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Yeni Dua Talebi
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İçerik
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
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
                  Etiketler (virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="sağlık, şifa, aile"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.is_urgent}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_urgent: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Acil dua talebi</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.is_anonymous}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_anonymous: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Anonim olarak paylaş</span>
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
                      theme === 'ramadan' ? 'bg-amber-600 hover:bg-amber-700' :
                      'bg-primary-500 hover:bg-primary-600'
                    }
                    text-white
                  `}
                >
                  Paylaş
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuaRequestsPage;