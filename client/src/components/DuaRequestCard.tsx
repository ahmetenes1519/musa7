import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Clock, 
  AlertCircle,
  Send,
  MoreHorizontal,
  Trash2,
  Flag
} from 'lucide-react';
import ReportModal from './ReportModal';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useDuaRequests, DuaRequest } from '../hooks/useDuaRequests';


interface DuaRequestCardProps {
  duaRequest: DuaRequest;
}

const DuaRequestCard: React.FC<DuaRequestCardProps> = ({ duaRequest }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { togglePrayer } = useDuaRequests();
  const [isPrayed, setIsPrayed] = useState(duaRequest.isPrayed || false);
  const [prayersCount, setPrayersCount] = useState(duaRequest.prayers_count);
  const [commentsCount, setCommentsCount] = useState(duaRequest.comments_count);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePray = async () => {
    if (!user) return;
    
    setLoading(true);
    const { error } = await togglePrayer(duaRequest.id);
    
    if (!error) {
      setIsPrayed(!isPrayed);
      setPrayersCount(prev => isPrayed ? prev - 1 : prev + 1);
    }
    setLoading(false);
  };

  const handleShowComments = async () => {
    if (!showComments) {
      setLoading(true);
      try {
        const response = await fetch(`/api/comments/dua/${duaRequest.id}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data || []);
        }
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setLoading(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dua_request_id: duaRequest.id,
          user_id: '8c661c6c-04a2-4323-a63a-895886883f7c',
          content: newComment.trim()
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [...prev, {
          ...comment,
          users: { 
            id: user.id,
            name: user.name,
            username: user.username,
            avatar_url: user.avatar_url 
          }
        }]);
        setCommentsCount(prev => prev + 1);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInHours < 48) return 'Dün';
    return `${Math.floor(diffInHours / 24)} gün önce`;
  };

  return (
    <div className={`
      p-6 rounded-xl border transition-all duration-300 hover:shadow-lg mb-6
      ${duaRequest.is_urgent ? 'border-l-4 border-l-red-500' : ''}
      ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
        theme === 'ramadan' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {duaRequest.is_anonymous ? '?' : duaRequest.users.name[0]}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {duaRequest.is_anonymous ? 'Anonim Kullanıcı' : duaRequest.users.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock size={14} />
              <span>{formatTimestamp(duaRequest.created_at)}</span>
              {duaRequest.is_urgent && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertCircle size={14} />
                    <span>Acil</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
            {duaRequest.category}
          </span>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreHorizontal size={20} className="text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="py-2">
                  {user?.id === duaRequest.user_id && (
                    <button
                      disabled={loading}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      <span>Sil</span>
                    </button>
                  )}
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span>Şikayet Et</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="py-2">
                <button 
                  onClick={() => {
                    setShowReportModal(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Flag size={16} />
                  <span>Şikayet Et</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {duaRequest.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {duaRequest.content}
        </p>
      </div>

      {/* Tags */}
      {duaRequest.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {duaRequest.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          <button
            onClick={handlePray}
            disabled={loading || !user}
            className={`
              flex items-center space-x-2 transition-all duration-200 hover:scale-105 disabled:opacity-50
              ${isPrayed ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}
            `}
          >
            <Heart size={20} className={isPrayed ? 'fill-current' : ''} />
            <span className="text-sm font-medium">
              {prayersCount} Dua
            </span>
          </button>

          <button 
            onClick={handleShowComments}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-all duration-200 hover:scale-105"
          >
            <MessageCircle size={20} />
            <span className="text-sm font-medium">
              {commentsCount} Yorum
            </span>
          </button>
        </div>

        {user && (
          <button
            onClick={handlePray}
            disabled={loading}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              hover:shadow-md hover:scale-105 disabled:opacity-50
              ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                theme === 'ramadan' ? 'bg-amber-600 hover:bg-amber-700' :
                'bg-primary-500 hover:bg-primary-600'
              }
              text-white
            `}
          >
            {isPrayed ? 'Dua Ettim ✓' : 'Dua Et'}
          </button>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Comments List */}
          <div className="space-y-3 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">
                    {comment.user?.name?.[0] || '?'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {comment.user?.name || 'Bilinmeyen'}
                      </span>
                      {comment.is_prayer && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Dua
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          {user && (
            <form onSubmit={handleAddComment} className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {user.name[0]}
                </span>
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Dua et veya yorum yaz..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50
                    ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                      theme === 'ramadan' ? 'bg-amber-600 hover:bg-amber-700' :
                      'bg-primary-500 hover:bg-primary-600'
                    }
                    text-white
                  `}
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        duaRequestId={duaRequest.id}
        reportedUserId={duaRequest.user_id}
        contentType="dua-request"
      />
    </div>
  );
};

export default DuaRequestCard;