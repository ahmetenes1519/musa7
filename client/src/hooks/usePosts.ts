import { useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';
import { useAuth } from '../contexts/AuthContext';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  type: 'text' | 'image' | 'video';
  media_url: string | null;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
    verified: boolean;
    role: string;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
}

// Global event emitter for real-time updates
class PostEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, data?: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Event callback error:', error);
      }
    });
  }
}

const postEventEmitter = new PostEventEmitter();

// Mock data for when Supabase is not configured
const mockPosts: Post[] = [
  {
    id: 'mock-1',
    user_id: 'demo-user-1',
    content: 'Selamün aleyküm kardeşlerim! Bu güzel platformda olmaktan çok mutluyum. Allah hepimizi hayırda birleştirsin. 🤲',
    type: 'text',
    media_url: null,
    category: 'Genel',
    tags: ['selam', 'kardeşlik', 'hayır'],
    likes_count: 15,
    comments_count: 3,
    shares_count: 2,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    users: {
      id: 'demo-user-1',
      name: 'Ahmet Yılmaz',
      username: 'ahmetyilmaz',
      avatar_url: null,
      verified: true,
      role: 'user'
    },
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 'mock-2',
    user_id: 'demo-user-2',
    content: 'Bugün çok güzel bir hadis okudum: "Müslüman, elinden ve dilinden Müslümanların emin olduğu kimsedir." (Buhari) 📖\n\nBu hadis bize kardeşlerimize karşı nasıl davranmamız gerektiğini gösteriyor.',
    type: 'text',
    media_url: null,
    category: 'Hadis',
    tags: ['hadis', 'İslam', 'öğüt'],
    likes_count: 28,
    comments_count: 7,
    shares_count: 5,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    users: {
      id: 'demo-user-2',
      name: 'Fatma Kaya',
      username: 'fatmakaya',
      avatar_url: null,
      verified: true,
      role: 'user'
    },
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 'mock-3',
    user_id: 'demo-admin-1',
    content: 'İslami paylaşım platformumuza hoş geldiniz! Burada güzel paylaşımlar yapabilir, kardeşlerimizle etkileşimde bulunabilirsiniz. 🕌\n\nLütfen topluluk kurallarına uyalım ve birbirimize saygı gösterelim.',
    type: 'text',
    media_url: null,
    category: 'Duyuru',
    tags: ['hoşgeldin', 'platform', 'duyuru'],
    likes_count: 42,
    comments_count: 12,
    shares_count: 8,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    users: {
      id: 'demo-admin-1',
      name: 'Platform Yöneticisi',
      username: 'islamadmin',
      avatar_url: null,
      verified: true,
      role: 'admin'
    },
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 'mock-4',
    user_id: 'demo-user-1',
    content: 'Cuma namazından sonra camide güzel bir sohbet vardı. "Sabır ve Şükür" konusu işlendi. Allah razı olsun hocamızdan. 🕌\n📍 Merkez Camii, İstanbul',
    type: 'text',
    media_url: null,
    category: 'Sohbet',
    tags: ['cuma', 'sohbet', 'sabır', 'şükür'],
    likes_count: 22,
    comments_count: 8,
    shares_count: 3,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    users: {
      id: 'demo-user-1',
      name: 'Ahmet Yılmaz',
      username: 'ahmetyilmaz',
      avatar_url: null,
      verified: true,
      role: 'user'
    },
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 'mock-5',
    user_id: 'demo-user-2',
    content: 'Çocuklarımıza Kur\'an-ı Kerim öğretirken sabırlı olmak çok önemli. Her çocuğun öğrenme hızı farklıdır. Allah kolaylık versin. 👶📚\n\n#Ramazan2024 ayında özel kurslarımız başlıyor!',
    type: 'text',
    media_url: null,
    category: 'Eğitim',
    tags: ['eğitim', 'çocuk', 'kuran', 'sabır', 'Ramazan2024'],
    likes_count: 35,
    comments_count: 14,
    shares_count: 6,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    users: {
      id: 'demo-user-2',
      name: 'Fatma Kaya',
      username: 'fatmakaya',
      avatar_url: null,
      verified: true,
      role: 'user'
    },
    isLiked: false,
    isBookmarked: false
  }
];

export const usePosts = (filterTag?: string) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to check if user has a demo ID
  const isDemoUser = (userId?: string) => {
    return userId && userId.startsWith('demo-');
  };

  // Load posts from localStorage
  const loadStoredPosts = () => {
    try {
      const storedPosts = localStorage.getItem('demoPosts');
      if (storedPosts) {
        return JSON.parse(storedPosts);
      }
    } catch (error) {
      console.warn('Error loading stored posts:', error);
    }
    return [];
  };

  // Save posts to localStorage
  const savePostsToStorage = (postsToSave: Post[]) => {
    try {
      localStorage.setItem('demoPosts', JSON.stringify(postsToSave));
    } catch (error) {
      console.warn('Error saving posts:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Always use demo mode for now
      console.log('🔄 Loading demo posts...');
      
      // Simulate realistic loading time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load stored posts first
      const storedPosts = loadStoredPosts();
      
      // Combine with mock posts, avoiding duplicates
      const allPosts = [...storedPosts];
      
      // Add mock posts if no stored posts exist
      if (storedPosts.length === 0) {
        allPosts.push(...mockPosts);
        savePostsToStorage(allPosts);
      }
      
      // Sort by creation date (newest first)
      allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      let filteredPosts = allPosts;
      
      if (filterTag) {
        filteredPosts = allPosts.filter(post => 
          post.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())) || 
          post.category.toLowerCase().includes(filterTag.toLowerCase()) ||
          post.content.toLowerCase().includes(filterTag.toLowerCase())
        );
      }
      
      setPosts(filteredPosts);
      console.log('✅ Demo posts loaded:', filteredPosts.length);
      
    } catch (err: any) {
      console.warn('⚠️ Error loading posts:', err.message);
      setError(null); // Don't show error in demo mode
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (
    content: string, 
    type: 'text' | 'image' | 'video' = 'text', 
    media?: string | null,
    category: string = 'Genel',
    tags: string[] = []
  ) => {
    if (!user) return { data: null, error: { message: 'Giriş yapmanız gerekli' } };

    try {
      // Create demo post
      const newPost: Post = {
        id: `post-${Date.now()}`,
        user_id: user.id,
        content,
        type,
        media_url: media || null,
        category,
        tags,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        users: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar_url: user.avatar_url || null,
          verified: user.verified,
          role: user.role
        },
        isLiked: false,
        isBookmarked: false
      };

      // Update local state
      setPosts(prev => {
        const updated = [newPost, ...prev];
        savePostsToStorage(updated);
        return updated;
      });
      
      // Emit event for real-time updates
      postEventEmitter.emit('newPost', newPost);
      
      console.log('✅ Demo post created:', newPost.content.substring(0, 50) + '...');
      return { data: newPost, error: null };

    } catch (err: any) {
      console.error('Error creating post:', err);
      return { data: null, error: { message: err.message } };
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return { data: null, error: { message: 'Giriş yapmanız gerekli' } };

    try {
      // Demo like toggle
      setPosts(prev => {
        const updated = prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isLiked: !post.isLiked,
                likes_count: post.isLiked ? post.likes_count - 1 : post.likes_count + 1
              }
            : post
        );
        savePostsToStorage(updated);
        return updated;
      });
      
      return { data: { liked: true }, error: null };
    } catch (err: any) {
      console.error('Error toggling like:', err);
      return { data: null, error: { message: err.message } };
    }
  };

  const toggleBookmark = async (postId: string) => {
    if (!user) return { data: null, error: { message: 'Giriş yapmanız gerekli' } };

    try {
      setPosts(prev => {
        const updated = prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isBookmarked: !post.isBookmarked
              }
            : post
        );
        savePostsToStorage(updated);
        return updated;
      });
      
      return { data: { bookmarked: true }, error: null };
    } catch (err: any) {
      console.error('Error toggling bookmark:', err);
      return { data: null, error: { message: err.message } };
    }
  };

  const sharePost = async (postId: string) => {
    if (!user) return { data: null, error: { message: 'Giriş yapmanız gerekli' } };

    try {
      setPosts(prev => {
        const updated = prev.map(post => 
          post.id === postId 
            ? { ...post, shares_count: post.shares_count + 1 }
            : post
        );
        savePostsToStorage(updated);
        return updated;
      });
      
      return { data: { success: true }, error: null };
    } catch (err: any) {
      console.error('Error sharing post:', err);
      return { data: null, error: { message: err.message } };
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return { error: { message: 'Giriş yapmanız gerekli' } };

    try {
      setPosts(prev => {
        const updated = prev.filter(post => {
          // Allow deletion if user owns the post or is admin
          return !(post.id === postId && (post.user_id === user.id || user.role === 'admin'));
        });
        savePostsToStorage(updated);
        return updated;
      });
      
      return { error: null };
    } catch (err: any) {
      console.error('Error deleting post:', err);
      return { error: { message: err.message } };
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return { data: null, error: { message: 'Giriş yapmanız gerekli' } };

    try {
      const mockComment = {
        id: `comment-${Date.now()}`,
        user_id: user.id,
        post_id: postId,
        content: content.trim(),
        is_prayer: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        users: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar_url: user.avatar_url || null,
          verified: user.verified,
          role: user.role
        }
      };

      setPosts(prev => {
        const updated = prev.map(post => 
          post.id === postId 
            ? { ...post, comments_count: post.comments_count + 1 }
            : post
        );
        savePostsToStorage(updated);
        return updated;
      });

      return { data: mockComment, error: null };
    } catch (err: any) {
      console.error('Error adding comment:', err);
      return { data: null, error: { message: err.message } };
    }
  };

  // Gerçek zamanlı güncellemeler için event listener'lar
  useEffect(() => {
    const handleNewPost = (newPost: Post) => {
      if (newPost.user_id !== user?.id) {
        setPosts(prev => {
          if (prev.find(p => p.id === newPost.id)) return prev;
          const updated = [newPost, ...prev];
          savePostsToStorage(updated);
          return updated;
        });
      }
    };

    const handlePostLiked = ({ postId, liked, userId }: { postId: string, liked: boolean, userId: string }) => {
      if (userId !== user?.id) {
        setPosts(prev => {
          const updated = prev.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  likes_count: liked ? post.likes_count + 1 : post.likes_count - 1
                }
              : post
          );
          savePostsToStorage(updated);
          return updated;
        });
      }
    };

    const handlePostShared = ({ postId, userId }: { postId: string, userId: string }) => {
      if (userId !== user?.id) {
        setPosts(prev => {
          const updated = prev.map(post => 
            post.id === postId 
              ? { ...post, shares_count: post.shares_count + 1 }
              : post
          );
          savePostsToStorage(updated);
          return updated;
        });
      }
    };

    const handlePostDeleted = ({ postId, userId }: { postId: string, userId: string }) => {
      if (userId !== user?.id) {
        setPosts(prev => {
          const updated = prev.filter(post => post.id !== postId);
          savePostsToStorage(updated);
          return updated;
        });
      }
    };

    const handleCommentAdded = ({ postId, userId }: { postId: string, userId: string }) => {
      if (userId !== user?.id) {
        setPosts(prev => {
          const updated = prev.map(post => 
            post.id === postId 
              ? { ...post, comments_count: post.comments_count + 1 }
              : post
          );
          savePostsToStorage(updated);
          return updated;
        });
      }
    };

    postEventEmitter.on('newPost', handleNewPost);
    postEventEmitter.on('postLiked', handlePostLiked);
    postEventEmitter.on('postShared', handlePostShared);
    postEventEmitter.on('postDeleted', handlePostDeleted);
    postEventEmitter.on('commentAdded', handleCommentAdded);

    return () => {
      postEventEmitter.off('newPost', handleNewPost);
      postEventEmitter.off('postLiked', handlePostLiked);
      postEventEmitter.off('postShared', handlePostShared);
      postEventEmitter.off('postDeleted', handlePostDeleted);
      postEventEmitter.off('commentAdded', handleCommentAdded);
    };
  }, [user?.id]);

  useEffect(() => {
    fetchPosts();
  }, [filterTag]);

  return {
    posts,
    loading,
    error,
    createPost,
    toggleLike,
    toggleBookmark,
    sharePost,
    deletePost,
    addComment,
    refetch: fetchPosts
  };
};

export { postEventEmitter };