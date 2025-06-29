import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Clock,
  Trash2,
  Send,
  ExternalLink,
  Shield,
  Ban,
  Pin,
  Flag
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePosts, Post, postEventEmitter } from '../hooks/usePosts';
import { localDB } from '../lib/localStorageDB';
import ReportModal from './ReportModal';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { toggleLike, toggleBookmark, sharePost, deletePost, addComment } = usePosts();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [sharesCount, setSharesCount] = useState(post.shares_count);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Admin kontrolü
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.id === post.user_id;
  const canDelete = isOwner || isAdmin;
  const canModerate = isAdmin;

  // Gerçek zamanlı güncellemeler için
  useEffect(() => {
    const handlePostLiked = ({ postId, liked }: { postId: string, liked: boolean }) => {
      if (postId === post.id) {
        setLikesCount(prev => liked ? prev + 1 : prev - 1);
      }
    };

    const handlePostShared = ({ postId }: { postId: string }) => {
      if (postId === post.id) {
        setSharesCount(prev => prev + 1);
      }
    };

    const handleCommentAdded = ({ postId }: { postId: string }) => {
      if (postId === post.id) {
        setCommentsCount(prev => prev + 1);
        // Eğer yorumlar açıksa, yeni yorumu ekle
        if (showComments) {
          loadComments();
        }
      }
    };

    postEventEmitter.on('postLiked', handlePostLiked);
    postEventEmitter.on('postShared', handlePostShared);
    postEventEmitter.on('commentAdded', handleCommentAdded);

    return () => {
      postEventEmitter.off('postLiked', handlePostLiked);
      postEventEmitter.off('postShared', handlePostShared);
      postEventEmitter.off('commentAdded', handleCommentAdded);
    };
  }, [post.id, showComments]);

  const handleLike = async () => {
    if (!user) return;
    
    setLoading(true);
    const { error } = await toggleLike(post.id);
    
    if (!error) {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    }
    setLoading(false);
  };

  const handleBookmark = async () => {
    if (!user) return;
    
    const { error } = await toggleBookmark(post.id);
    if (!error) {
      setIsBookmarked(!isBookmarked);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const shareText = `${post.content}\n\n${postUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'İslami Paylaşım',
          text: post.content,
          url: postUrl
        });
        
        // Paylaşım sayısını artır
        if (user) {
          await sharePost(post.id);
          setSharesCount(prev => prev + 1);
        }
      } catch (error) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Gönderi panoya kopyalandı!');
        
        // Paylaşım sayısını artır
        if (user) {
          await sharePost(post.id);
          setSharesCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('Panoya kopyalama hatası:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert('Gönderi panoya kopyalandı!');
          
          // Paylaşım sayısını artır
          if (user) {
            await sharePost(post.id);
            setSharesCount(prev => prev + 1);
          }
        } catch (fallbackError) {
          console.error('Fallback kopyalama hatası:', fallbackError);
          alert('Paylaşım başarısız oldu. Lütfen manuel olarak kopyalayın.');
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    
    const confirmMessage = isAdmin && !isOwner 
      ? 'Bu gönderiyi admin yetkisiyle silmek istediğinizden emin misiniz?'
      : 'Bu gönderiyi silmek istediğinizden emin misiniz?';
    
    if (confirm(confirmMessage)) {
      setLoading(true);
      await deletePost(post.id);
      setLoading(false);
      // Sayfa yenileme
      window.location.reload();
    }
    setShowMenu(false);
  };

  const handleModerateUser = async () => {
    if (!isAdmin) return;
    
    if (confirm(`${post.users.name} kullanıcısını uyarmak istediğinizden emin misiniz?`)) {
      // Burada kullanıcı uyarma işlemi yapılabilir
      alert('Kullanıcı uyarıldı.');
    }
    setShowMenu(false);
  };

  const handleBanUser = async () => {
    if (!isAdmin) return;
    
    if (confirm(`${post.users.name} kullanıcısını banlamak istediğinizden emin misiniz?`)) {
      // Burada kullanıcı banlama işlemi yapılabilir
      alert('Kullanıcı banlandı.');
    }
    setShowMenu(false);
  };

  const handlePinPost = async () => {
    if (!isAdmin) return;
    
    // Burada gönderi sabitleme işlemi yapılabilir
    alert('Gönderi sabitlendi.');
    setShowMenu(false);
  };

  const handleToggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const response = await fetch(`/api/comments/post/${post.id}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data || []);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error('Failed to load comments:', error);
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const commentData = {
        post_id: post.id,
        user_id: '8c661c6c-04a2-4323-a63a-895886883f7c', // Use valid UUID for now
        content: newComment.trim()
      };

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      const comment = await response.json();
      
      // Add comment to local state with user info
      const commentWithUser = {
        ...comment,
        users: { 
          id: user.id,
          name: user.name,
          username: user.username || user.name,
          avatar_url: user.avatar_url 
        }
      };

      setComments(prev => [...prev, commentWithUser]);
      setCommentsCount(prev => prev + 1);
      setNewComment('');
      
      console.log('Comment created successfully:', comment);
    } catch (error) {
      console.error('Yorum eklenirken hata:', error);
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

  // İçeriği göster
  const mainContent = post.content;

  return (
    <div className={`
      rounded-xl p-4 sm:p-6 mb-4 transition-all duration-300 hover:shadow-lg border animate-fade-in
      ${theme === 'islamic' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
        theme === 'ramadan' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center flex-shrink-0">
            {post.users.avatar_url ? (
              <img 
                src={post.users.avatar_url} 
                alt={post.users.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm sm:text-lg">
                {post.users.name[0]}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                {post.users.name}
              </h3>
              {post.users.verified && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              {isAdmin && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0" title="Admin">
                  <Shield className="text-white" size={10} />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span className="truncate">@{post.users.username}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock size={12} />
                <span className="whitespace-nowrap">{formatTimestamp(post.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative flex-shrink-0">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="py-2">
                {/* Kullanıcı işlemleri */}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    <span>{isAdmin && !isOwner ? 'Sil (Admin)' : 'Sil'}</span>
                  </button>
                )}
                
                {/* Admin işlemleri */}
                {canModerate && !isOwner && (
                  <>
                    <button
                      onClick={handlePinPost}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Pin size={16} />
                      <span>Sabitle</span>
                    </button>
                    <button
                      onClick={handleModerateUser}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      <Shield size={16} />
                      <span>Kullanıcıyı Uyar</span>
                    </button>
                    <button
                      onClick={handleBanUser}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Ban size={16} />
                      <span>Kullanıcıyı Banla</span>
                    </button>
                  </>
                )}
                
                {/* Genel işlemler */}
                <button 
                  onClick={handleBookmark}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Bookmark size={16} />
                  <span>{isBookmarked ? 'Yer imini kaldır' : 'Yer imi ekle'}</span>
                </button>
                {!isOwner && (
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
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
          {mainContent}
        </p>
        

      </div>

      {/* Media */}
      {post.media_url && (
        <div className="mb-4">
          {post.type === 'image' ? (
            <img 
              src={post.media_url} 
              alt="Post media"
              className="w-full rounded-lg object-cover max-h-96 cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(post.media_url!, '_blank')}
            />
          ) : post.type === 'video' ? (
            <video 
              src={post.media_url} 
              controls
              className="w-full rounded-lg max-h-96"
              preload="metadata"
            />
          ) : null}
        </div>
      )}

      {/* Category and Tags */}
      {(post.category !== 'Genel' || post.tags.length > 0) && (
        <div className="mb-4 flex items-center flex-wrap gap-2">
          {post.category !== 'Genel' && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
              {post.category}
            </span>
          )}
          {post.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button 
            onClick={handleLike}
            disabled={loading || !user}
            className={`
              flex items-center space-x-1 sm:space-x-2 transition-all duration-200 hover:scale-105 disabled:opacity-50
              ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}
            `}
          >
            <Heart 
              size={18} 
              className={isLiked ? 'fill-current' : ''} 
            />
            <span className="text-xs sm:text-sm font-medium">{likesCount}</span>
          </button>

          <button 
            onClick={handleToggleComments}
            className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-blue-500 transition-all duration-200 hover:scale-105"
          >
            <MessageCircle size={18} />
            <span className="text-xs sm:text-sm font-medium">{commentsCount}</span>
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-green-500 transition-all duration-200 hover:scale-105"
          >
            <Share2 size={18} />
            <span className="text-xs sm:text-sm font-medium">{sharesCount}</span>
          </button>
        </div>

        <button 
          onClick={handleBookmark}
          disabled={!user}
          className={`
            p-2 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50
            ${isBookmarked ? 'text-primary-500' : 'text-gray-500 hover:text-primary-500'}
          `}
        >
          <Bookmark 
            size={18} 
            className={isBookmarked ? 'fill-current' : ''} 
          />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Comments List */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {loadingComments ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                Yorumlar yükleniyor...
              </p>
            ) : comments.length > 0 ? comments.map((comment) => (
              <div key={comment.id} className="flex space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-semibold">
                    {comment.users?.name?.[0] || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                        {comment.users?.name || 'Bilinmeyen'}
                      </span>
                      {comment.users?.role === 'admin' && (
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0" title="Admin">
                          <Shield className="text-white" size={8} />
                        </div>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatTimestamp(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                Henüz yorum yok. İlk yorumu sen yap!
              </p>
            )}
          </div>

          {/* Add Comment */}
          {user && (
            <div className="flex space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs sm:text-sm font-semibold">
                  {user.name[0]}
                </span>
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Yorum yaz..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || loading}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 flex-shrink-0 bg-primary-500 hover:bg-primary-600 text-white"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        postId={post.id}
        reportedUserId={post.user_id}
        contentType="post"
      />
    </div>
  );
};

export default PostCard;