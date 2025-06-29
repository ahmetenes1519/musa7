import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  is_private: boolean;
  cover_image: string | null;
  location: string | null;
  member_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
    verified: boolean;
  };
  isJoined?: boolean;
  userRole?: string;
}

export const useCommunities = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/communities');
      if (!response.ok) {
        throw new Error('Failed to fetch communities');
      }
      
      const data = await response.json();
      setCommunities(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCommunity = async (communityData: {
    name: string;
    description: string;
    category: string;
    is_private?: boolean;
    location?: string;
  }) => {
    if (!user) return { data: null, error: { message: 'Giriş yapmanız gerekli' } };

    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: communityData.name,
          description: communityData.description,
          category: communityData.category,
          is_private: communityData.is_private || false,
          location: communityData.location || null,
          created_by: '8c661c6c-04a2-4323-a63a-895886883f7c' // Use valid UUID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create community');
      }

      const newCommunity = await response.json();
      
      // Add to local state
      const communityWithUser: Community = {
        ...newCommunity,
        users: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar_url: user.avatar_url || null,
          verified: user.verified
        },
        isJoined: true,
        userRole: 'admin'
      };

      setCommunities(prev => [communityWithUser, ...prev]);
      return { data: communityWithUser, error: null };
    } catch (err: any) {
      console.error('Error creating community:', err);
      return { data: null, error: { message: err.message } };
    }
  };

  const joinCommunity = async (communityId: string) => {
    if (!user) return { data: null, error: { message: 'Giriş yapmanız gerekli' } };

    try {
      // TODO: Implement actual community membership logic
      setCommunities(prev => prev.map(community => 
        community.id === communityId 
          ? { 
              ...community, 
              isJoined: true,
              member_count: community.member_count + 1
            }
          : community
      ));

      return { data: { success: true }, error: null };
    } catch (err: any) {
      console.error('Error joining community:', err);
      return { data: null, error: { message: err.message } };
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, [user]);

  return {
    communities,
    loading,
    error,
    createCommunity,
    joinCommunity,
    refetch: fetchCommunities
  };
};