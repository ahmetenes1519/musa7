import React, { useState, useRef } from 'react';
import { Image, Smile, Calendar, X, Upload, Video, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useRealTimePosts } from '../hooks/useRealTimePosts';

const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { createPost } = useRealTimePosts();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [showMediaUrlInput, setShowMediaUrlInput] = useState(false);
  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [category, setCategory] = useState('Genel');
  const [tags, setTags] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Genel', 'Hadis', 'Dua', 'Sohbet', 'Eğitim', 'Duyuru', 'Ramazan', 'Hac', 'Umre'];

  // YouTube URL'lerini iframe'e dönüştürme fonksiyonu
  const convertToEmbeddableUrl = (url: string): string => {
    // YouTube URL pattern'lerini kontrol et
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    // Vimeo URL pattern
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // Eğer bilinen bir video servisi değilse, orijinal URL'yi döndür
    return url;
  };
  
  const emojis = [
    // İslami emojiler
    '🤲', '☪️', '🕌', '📿', '📖', '🌙', '⭐', '💫', '🌟', '✨', '🙏', '🕋', '📚', '🤍', '💚',
    // Kalp ve sevgi
    '❤️', '💛', '💙', '💜', '🧡', '🖤', '🤍', '💖', '💕', '💗', '💓', '💝', '💘', '💞', '💌',
    // Doğa
    '🌹', '🌺', '🌸', '🌼', '🌻', '🌷', '🌱', '🌿', '🍃', '🌳', '🌲', '🌴', '🌵', '🌾', '🌊',
    // Gökyüzü
    '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☄️', '💫', '🌟', '✨', '⭐', '🌠',
    // Yüzler ve duygular
    '😊', '😌', '😍', '🥰', '😘', '😚', '😙', '😗', '🤗', '🤲', '🙂', '😇', '😴', '😪', '💤',
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙃', '😉', '😊', '😋', '😎', '🤓', '🧐',
    // Pozitif ifadeler
    '👍', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👏', '🙌', '👐', '🤲', '🙏', '✍️', '💪', '🦾',
    // Objeler
    '💎', '👑', '🏆', '🥇', '🎁', '🎈', '🎉', '🎊', '🎀', '🎂', '🕯️', '🎭', '🎨', '🎪', '🎡',
    // Teknoloji
    '📱', '💻', '⌨️', '🖱️', '🖥️', '📷', '📹', '🎥', '📞', '☎️', '📠', '📺', '📻', '🎵', '🎶'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedMedia) return;

    setLoading(true);
    
    try {
      let finalMediaUrl = null;
      let postType: 'text' | 'image' | 'video' = 'text';

      if (selectedMedia) {
        // Gerçek uygulamada burada dosya yükleme servisi kullanılır
        // Şimdilik base64 olarak saklayacağız (demo amaçlı)
        finalMediaUrl = mediaPreview;
        postType = mediaType || 'text';
      } else if (mediaUrl && mediaUrl.trim()) {
        // URL ile resim paylaşımı
        finalMediaUrl = mediaUrl.trim();
        postType = 'image';
      } else if (videoUrl && videoUrl.trim()) {
        // URL ile video paylaşımı (YouTube, etc.)
        finalMediaUrl = convertToEmbeddableUrl(videoUrl.trim());
        postType = 'video';
      }

      const postContent = content;
      const postTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      const { error } = await createPost(postContent, postType, finalMediaUrl, category, postTags);
      
      if (!error) {
        setContent('');
        setSelectedMedia(null);
        setMediaPreview(null);
        setMediaType(null);
        setMediaUrl('');
        setVideoUrl('');
        setShowMediaUrlInput(false);
        setShowVideoUrlInput(false);
        setCategory('Genel');
        setTags('');
        setIsExpanded(false);
        
        // Başarı mesajı göster
        console.log('Mesaj başarıyla gönderildi');
        
        // Sadece manuel yenileme tetikle, otomatik yenileme yok
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('refreshPosts'));
        }, 500);
      }
    } catch (error) {
      console.error('Gönderi oluşturma hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Dosya boyutu 10MB\'dan küçük olmalıdır.');
      return;
    }

    setSelectedMedia(file);
    setMediaType(type);

    // Önizleme oluştur
    const reader = new FileReader();
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const insertEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };



  if (!user) return null;

  return (
    <div className={`
      rounded-xl p-6 mb-6 border transition-all duration-300
      ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
        theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }
    `}>
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-lg">
              {user.name?.[0] || user.email?.[0]?.toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="Neler düşünüyorsun?"
              className={`
                w-full p-3 rounded-lg border resize-none transition-all duration-200
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${theme === 'islamic' ? 'bg-white dark:bg-emerald-800 border-emerald-300 dark:border-emerald-600' :
                  theme === 'ramadan' ? 'bg-white dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600' :
                  'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }
                text-gray-900 dark:text-white placeholder-gray-500
              `}
              rows={isExpanded ? 4 : 2}
              disabled={loading}
            />

            {/* Media Preview */}
            {mediaPreview && (
              <div className="mt-3 relative">
                {mediaType === 'image' ? (
                  <img 
                    src={mediaPreview} 
                    alt="Önizleme" 
                    className="max-h-64 rounded-lg object-cover"
                  />
                ) : (
                  <video 
                    src={mediaPreview} 
                    controls 
                    className="max-h-64 rounded-lg"
                  />
                )}
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}


            
            {isExpanded && (
              <div className="mt-4 animate-slide-up space-y-4">
                {/* Category and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kategori
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Etiketler
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="etiket1, etiket2"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                {/* Media URL Inputs */}
                {showMediaUrlInput && (
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="Resim URL'sini buraya yapıştırın..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    {mediaUrl && (
                      <img src={mediaUrl} alt="URL Önizleme" className="max-h-32 rounded-lg object-cover" />
                    )}
                  </div>
                )}

                {showVideoUrlInput && (
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="YouTube/Vimeo video URL'sini buraya yapıştırın..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    {videoUrl && (
                      <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Video: {videoUrl}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="grid grid-cols-10 gap-2">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => insertEmoji(emoji)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-lg transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Photo Upload */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <Image size={18} />
                      <span className="hidden sm:inline">Fotoğraf</span>
                    </button>

                    {/* Photo URL */}
                    <button
                      type="button"
                      onClick={() => setShowMediaUrlInput(!showMediaUrlInput)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <Upload size={18} />
                      <span className="hidden sm:inline">Resim URL</span>
                    </button>

                    {/* Video URL */}
                    <button
                      type="button"
                      onClick={() => setShowVideoUrlInput(!showVideoUrlInput)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <Video size={18} />
                      <span className="hidden sm:inline">Video URL</span>
                    </button>
                    
                    {/* Emoji Button */}
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <Smile size={18} />
                      <span className="hidden sm:inline">Emoji</span>
                    </button>
                    

                  </div>
                  
                  <div className="flex items-center space-x-3 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false);
                        setContent('');
                        setSelectedMedia(null);
                        setMediaPreview(null);

                        setShowEmojiPicker(false);
                        setCategory('Genel');
                        setTags('');
                      }}
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                      disabled={loading}
                    >
                      İptal
                    </button>
                    
                    <button
                      type="submit"
                      disabled={(!content.trim() && !selectedMedia) || loading}
                      className={`
                        px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:shadow-md hover:scale-105
                        ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                          theme === 'ramadan' ? 'bg-yellow-600 hover:bg-yellow-700' :
                          'bg-emerald-600 hover:bg-emerald-700'
                        }
                        text-white
                      `}
                    >
                      {loading ? 'Paylaşılıyor...' : 'Paylaş'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e, 'image')}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => handleFileSelect(e, 'video')}
          className="hidden"
        />
      </form>
    </div>
  );
};

export default CreatePost;