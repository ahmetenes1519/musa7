// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token yönetimi
const getToken = () => localStorage.getItem('auth_token');
const setToken = (token) => localStorage.setItem('auth_token', token);
const removeToken = () => localStorage.removeItem('auth_token');

// API isteği helper'ı
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API isteği başarısız');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  logout: () => {
    removeToken();
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  verifyToken: async () => {
    return apiRequest('/auth/verify-token', { method: 'POST' });
  },
};

// Posts API
export const postsAPI = {
  getPosts: async (page = 1, limit = 20) => {
    return apiRequest(`/posts?page=${page}&limit=${limit}`);
  },

  createPost: async (postData) => {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  likePost: async (postId) => {
    return apiRequest(`/posts/${postId}/like`, { method: 'POST' });
  },

  bookmarkPost: async (postId) => {
    return apiRequest(`/posts/${postId}/bookmark`, { method: 'POST' });
  },

  deletePost: async (postId) => {
    return apiRequest(`/posts/${postId}`, { method: 'DELETE' });
  },

  addComment: async (postId, content) => {
    return apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

// Dua Requests API
export const duaAPI = {
  getDuaRequests: async (page = 1, limit = 20) => {
    return apiRequest(`/duas?page=${page}&limit=${limit}`);
  },

  createDuaRequest: async (duaData) => {
    return apiRequest('/duas', {
      method: 'POST',
      body: JSON.stringify(duaData),
    });
  },

  prayForDua: async (duaId, message = '') => {
    return apiRequest(`/duas/${duaId}/pray`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};

// Communities API
export const communitiesAPI = {
  getCommunities: async (page = 1, limit = 20) => {
    return apiRequest(`/communities?page=${page}&limit=${limit}`);
  },

  createCommunity: async (communityData) => {
    return apiRequest('/communities', {
      method: 'POST',
      body: JSON.stringify(communityData),
    });
  },

  joinCommunity: async (communityId) => {
    return apiRequest(`/communities/${communityId}/join`, { method: 'POST' });
  },
};

// Events API
export const eventsAPI = {
  getEvents: async (page = 1, limit = 20) => {
    return apiRequest(`/events?page=${page}&limit=${limit}`);
  },

  createEvent: async (eventData) => {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  attendEvent: async (eventId) => {
    return apiRequest(`/events/${eventId}/attend`, { method: 'POST' });
  },
};

// Users API
export const usersAPI = {
  updateProfile: async (profileData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  searchUsers: async (query) => {
    return apiRequest(`/users/search?q=${encodeURIComponent(query)}`);
  },

  getUserProfile: async (username) => {
    return apiRequest(`/users/${username}`);
  },
};

// Upload API
export const uploadAPI = {
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest('/upload/media', {
      method: 'POST',
      headers: {}, // FormData için Content-Type header'ını kaldır
      body: formData,
    });
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiRequest('/upload/avatar', {
      method: 'POST',
      headers: {}, // FormData için Content-Type header'ını kaldır
      body: formData,
    });
  },
};

export { getToken, setToken, removeToken };