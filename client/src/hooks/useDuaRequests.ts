import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface DuaRequest {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_urgent: boolean;
  is_anonymous: boolean;
  tags: string[];
  prayers_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
    verified: boolean;
  };
  isPrayed?: boolean;
}

export const useDuaRequests = () => {
  const { user } = useAuth();
  const [duaRequests, setDuaRequests] = useState<DuaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDuaRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dua-requests');
      if (!response.ok) {
        throw new Error('Failed to fetch dua requests');
      }
      
      const data = await response.json();
      setDuaRequests(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching dua requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDuaRequest = async (duaData: {
    title: string;
    content: string;
    category: string;
    is_urgent?: boolean;
    is_anonymous?: boolean;
    tags?: string[];
  }) => {
    if (!user) return { data: null, error: { message: 'Giriş yapmanız gerekli' } };

    try {
      const response = await fetch('/api/dua-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: '8c661c6c-04a2-4323-a63a-895886883f7c', // Use valid UUID
          title: duaData.title,
          content: duaData.content,
          category: duaData.category,
          is_urgent: duaData.is_urgent || false,
          is_anonymous: duaData.is_anonymous || false,
          tags: duaData.tags || []
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create dua request');
      }

      const newDua = await response.json();
      
      // Add to local state
      const duaWithUser: DuaRequest = {
        ...newDua,
        users: {
          id: user.id,
          name: newDua.is_anonymous ? 'Anonim Kullanıcı' : user.name,
          username: newDua.is_anonymous ? 'anonim' : user.username,
          avatar_url: newDua.is_anonymous ? null : (user.avatar_url || null),
          verified: newDua.is_anonymous ? false : user.verified
        },
        isPrayed: false
      };

      setDuaRequests(prev => [duaWithUser, ...prev]);
      return { data: duaWithUser, error: null };
    } catch (err: any) {
      console.error('Error creating dua request:', err);
      return { data: null, error: { message: err.message } };
    }
  };

  const togglePrayer = async (duaRequestId: string) => {
    if (!user) return { data: null, error: { message: 'Giriş yapmanız gerekli' } };

    try {
      const result = localDB.toggleLike(user.id, undefined, duaRequestId);
      
      // Local state'i güncelle
      setDuaRequests(prev => prev.map(dua => 
        dua.id === duaRequestId 
          ? { 
              ...dua, 
              isPrayed: result.liked,
              prayers_count: result.liked ? dua.prayers_count + 1 : dua.prayers_count - 1
            }
          : dua
      ));

      return { data: result, error: null };
    } catch (err: any) {
      console.error('Error toggling prayer:', err);
      return { data: null, error: { message: err.message } };
    }
  };

  useEffect(() => {
    fetchDuaRequests();
  }, [user]);

  return {
    duaRequests,
    loading,
    error,
    createDuaRequest,
    togglePrayer,
    refetch: fetchDuaRequests
  };
};