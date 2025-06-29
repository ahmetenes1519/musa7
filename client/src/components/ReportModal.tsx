import React, { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  duaRequestId?: string;
  reportedUserId: string;
  contentType: 'post' | 'dua-request';
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  postId,
  duaRequestId,
  reportedUserId,
  contentType
}) => {
  const { user } = useAuth();
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasonOptions = [
    { value: 'spam', label: 'Spam veya Reklam' },
    { value: 'inappropriate', label: 'Uygunsuz İçerik' },
    { value: 'harassment', label: 'Taciz veya Zorbalık' },
    { value: 'fake', label: 'Sahte Bilgi' },
    { value: 'other', label: 'Diğer' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason || !user) return;

    setIsSubmitting(true);
    
    try {
      const reportData = {
        reporter_id: user.id,
        reported_user_id: reportedUserId,
        post_id: postId || null,
        dua_request_id: duaRequestId || null,
        reason,
        description: description.trim() || null
      };

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });

      if (response.ok) {
        alert('Şikayetiniz başarıyla gönderildi. İnceleme sürecine alındı.');
        onClose();
        setReason('');
        setDescription('');
      } else {
        alert('Şikayet gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Report submission error:', error);
      alert('Şikayet gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Flag className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  İçerik Şikayet Et
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {contentType === 'post' ? 'Gönderiyi' : 'Dua talebini'} şikayet ediyorsunuz
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="text-amber-600 dark:text-amber-400 mt-0.5" size={16} />
              <div className="text-sm">
                <p className="text-amber-800 dark:text-amber-200 font-medium mb-1">
                  Önemli Uyarı
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  Lütfen yalnızca gerçekten uygunsuz olan içerikleri şikayet edin. 
                  Yanlış şikayetler hesabınızın kısıtlanmasına neden olabilir.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Reason Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şikayet Sebebi *
              </label>
              <div className="space-y-2">
                {reasonOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="reason"
                      value={option.value}
                      checked={reason === option.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-4 h-4 text-red-600 border-gray-300 dark:border-gray-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Açıklama (İsteğe bağlı)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Şikayetinizle ilgili ek bilgi verebilirsiniz..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description.length}/500 karakter
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={!reason || isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Şikayet Et'}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
            Şikayetiniz moderatörlerimiz tarafından incelenecek ve gerekli işlemler yapılacaktır.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;