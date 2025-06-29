import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Clock, Users, DollarSign, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { useEvents } from '../hooks/useEvents';

const EventsPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { events, loading, createEvent, attendEvent } = useEvents();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Sohbet',
    date: '',
    time: '',
    location_name: '',
    location_address: '',
    location_city: '',
    organizer_name: user?.user_metadata?.full_name || '',
    capacity: 50,
    price: 0,
    is_online: false
  });

  const eventTypes = ['Sohbet', 'Eğitim', 'Yardım', 'Spor', 'Kültür', 'Dini', 'Sosyal'];
  const filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'today', label: 'Bugün' },
    { id: 'week', label: 'Bu Hafta' },
    { id: 'month', label: 'Bu Ay' },
    { id: 'attending', label: 'Katılacağım' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await createEvent(formData);
    
    if (!error) {
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        type: 'Sohbet',
        date: '',
        time: '',
        location_name: '',
        location_address: '',
        location_city: '',
        organizer_name: user?.user_metadata?.full_name || '',
        capacity: 50,
        price: 0,
        is_online: false
      });
    }
  };

  const handleAttendEvent = async (eventId: string) => {
    await attendEvent(eventId);
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    switch (activeFilter) {
      case 'today':
        return eventDate.toDateString() === today.toDateString();
      case 'week':
        return eventDate >= today && eventDate <= weekFromNow;
      case 'month':
        return eventDate >= today && eventDate <= monthFromNow;
      case 'attending':
        return event.isAttending;
      default:
        return true;
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
              Etkinlikler
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              İslami etkinlikleri keşfedin ve katılın
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
              <span>Etkinlik Oluştur</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
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

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`
                rounded-xl border transition-all duration-300 hover:shadow-lg overflow-hidden
                ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                  theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                  'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }
              `}
            >
              {/* Event Image/Header */}
              <div className={`
                h-32 bg-gradient-to-r flex items-center justify-center
                ${theme === 'islamic' ? 'from-emerald-400 to-teal-500' :
                  theme === 'ramadan' ? 'from-yellow-400 to-amber-500' :
                  'from-primary-400 to-blue-500'
                }
              `}>
                <Calendar className="text-white" size={32} />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2">
                    {event.title}
                  </h3>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm ml-2">
                    {event.type}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={16} />
                    <span>{new Date(event.date).toLocaleDateString('tr-TR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock size={16} />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    {event.is_online ? <Globe size={16} /> : <MapPin size={16} />}
                    <span>
                      {event.is_online 
                        ? 'Online Etkinlik' 
                        : `${event.location_name}, ${event.location_city}`
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Users size={16} />
                      <span>{event.attendees_count}/{event.capacity} katılımcı</span>
                    </div>
                    
                    {event.price > 0 && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <DollarSign size={16} />
                        <span>{event.price} TL</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`
                        h-2 rounded-full
                        ${theme === 'islamic' ? 'bg-emerald-600' :
                          theme === 'ramadan' ? 'bg-yellow-600' :
                          'bg-primary-500'
                        }
                      `}
                      style={{ width: `${(event.attendees_count / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {event.organizer_name} tarafından
                  </span>
                  
                  {user && !event.isAttending ? (
                    <button
                      onClick={() => handleAttendEvent(event.id)}
                      disabled={event.attendees_count >= event.capacity}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                        ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                          theme === 'ramadan' ? 'bg-yellow-600 hover:bg-yellow-700' :
                          'bg-primary-500 hover:bg-primary-600'
                        }
                        text-white
                      `}
                    >
                      {event.attendees_count >= event.capacity ? 'Dolu' : 'Katıl'}
                    </button>
                  ) : event.isAttending ? (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      Katılıyorsun
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Etkinlik bulunamadı
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Seçili filtrelere uygun etkinlik bulunmuyor.
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`
            w-full max-w-3xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto
            ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900' :
              theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900' :
              'bg-white dark:bg-gray-800'
            }
          `}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Yeni Etkinlik Oluştur
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Etkinlik Başlığı
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
                    Etkinlik Türü
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tarih
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Saat
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.is_online}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_online: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Online etkinlik</span>
                </label>
              </div>

              {!formData.is_online && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mekan Adı
                    </label>
                    <input
                      type="text"
                      value={formData.location_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={!formData.is_online}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adres
                    </label>
                    <input
                      type="text"
                      value={formData.location_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_address: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={!formData.is_online}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Şehir
                    </label>
                    <input
                      type="text"
                      value={formData.location_city}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_city: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={!formData.is_online}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kapasite
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ücret (TL)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
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

export default EventsPage;