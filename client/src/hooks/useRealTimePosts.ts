import { useEffect, useState } from 'react';
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

export const useRealTimePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load posts from API with fallback
  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading posts from API...');
      const response = await fetch('/api/posts');
      
      if (response.ok) {
        const apiPosts = await response.json();
        setPosts(apiPosts);
        console.log('Posts loaded from API:', apiPosts.length);
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      console.warn('API failed, using demo data:', error);
      
      // Fallback demo posts
      const demoPosts: Post[] = [
        {
          id: 'demo-1',
          user_id: 'demo-user-1',
          content: 'Selamün aleyküm kardeşlerim! Bu güzel platformda olmaktan çok mutluyum.',
          type: 'text',
          media_url: null,
          category: 'Genel',
          tags: ['selam', 'kardeşlik'],
          likes_count: 15,
          comments_count: 3,
          shares_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
        }
      ];
      
      setPosts(demoPosts);
      console.log('Demo posts loaded:', demoPosts.length);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new post
  const createPost = async (
    content: string, 
    type: 'text' | 'image' | 'video' = 'text', 
    mediaUrl?: string, 
    category: string = 'Genel', 
    tags: string[] = []
  ) => {
    if (!user) return { error: 'Kullanıcı girişi gerekli' };

    const postData = {
      user_id: user.id,
      user_name: user.name,
      content,
      type,
      media_url: mediaUrl || null,
      category,
      tags
    };

    try {
      console.log('Creating post via API...');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        const newPost = await response.json();
        console.log('Post created successfully:', newPost);
        
        // Immediately add to local state
        setPosts(prev => [newPost, ...prev]);
        
        // Trigger cross-device event
        window.dispatchEvent(new CustomEvent('postCreated', { detail: newPost }));
        
        // Trigger refresh for other clients
        setTimeout(() => loadPosts(), 1000);
        
        return { data: newPost, error: null };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }
    } catch (error) {
      console.error('Post creation error:', error);
      return { data: null, error: 'Gönderi oluşturulamadı' };
    }
  };

  // Initial load and manual refresh only
  useEffect(() => {
    loadPosts();
    
    // Listen for manual refresh events only
    const handleRefresh = () => loadPosts();
    const handleLogin = () => loadPosts();
    
    window.addEventListener('refreshPosts', handleRefresh);
    window.addEventListener('userLoggedIn', handleLogin);
    
    return () => {
      window.removeEventListener('refreshPosts', handleRefresh);
      window.removeEventListener('userLoggedIn', handleLogin);
    };
  }, [user]);

  return {
    posts,
    isLoading,
    error,
    createPost,
    refetch: loadPosts
  };
};