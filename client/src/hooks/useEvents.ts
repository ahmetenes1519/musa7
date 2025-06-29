import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location_name: string;
  location_address: string;
  location_city: string;
  organizer_name: string;
  organizer_contact: string | null;
  capacity: number;
  attendees_count: number;
  price: number;
  is_online: boolean;
  image_url: string | null;
  tags: string[];
  requirements: string[];
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
  isAttending?: boolean;
}

export const useEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: {
    title: string;
    description: string;
    type: string;
    date: string;
    time: string;
    location_name: string;
    location_address: string;
    location_city: string;
    organizer_name: string;
    capacity?: number;
    price?: number;
    is_online?: boolean;
  }) => {
    if (!user) return { data: null, error: { message: 'Giriş yapmanız gerekli' } };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: eventData.title,
          description: eventData.description,
          type: eventData.type,
          date: eventData.date,
          time: eventData.time,
          location_name: eventData.location_name,
          location_address: eventData.location_address,
          location_city: eventData.location_city,
          organizer_name: eventData.organizer_name,
          organizer_contact: user.email || 'contact@example.com',
          capacity: eventData.capacity || 50,
          price: eventData.price || 0,
          is_online: eventData.is_online || false,
          created_by: '8c661c6c-04a2-4323-a63a-895886883f7c' // Use valid UUID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const newEvent = await response.json();
      
      // Add to local state
      const eventWithUser: Event = {
        ...newEvent,
        users: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar_url: user.avatar_url || null,
          verified: user.verified
        },
        isAttending: true
      };

      setEvents(prev => [...prev, eventWithUser].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
      return { data: eventWithUser, error: null };
    } catch (err: any) {
      console.error('Error creating event:', err);
      return { data: null, error: { message: err.message } };
    }
  };

  const attendEvent = async (eventId: string) => {
    if (!user) return { data: null, error: { message: 'Giriş yapmanız gerekli' } };

    try {
      // TODO: Implement actual event attendance logic
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              isAttending: true,
              attendees_count: event.attendees_count + 1
            }
          : event
      ));

      return { data: { success: true }, error: null };
    } catch (err: any) {
      console.error('Error attending event:', err);
      return { data: null, error: { message: err.message } };
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  return {
    events,
    loading,
    error,
    createEvent,
    attendEvent,
    refetch: fetchEvents
  };
};