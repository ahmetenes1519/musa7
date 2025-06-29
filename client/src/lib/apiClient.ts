// API Client to replace Supabase functionality
class ApiClient {
  private baseUrl = '/api';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T | null; error: any }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        return { data: null, error };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Auth
  async signUp(userData: { email: string; name: string; username: string; role?: string }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signIn(credentials: { email: string; password: string }) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Users
  async getUser(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async updateUser(userId: string, updates: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Posts
  async getPosts(limit = 50) {
    return this.request(`/posts?limit=${limit}`);
  }

  async getPost(postId: string) {
    return this.request(`/posts/${postId}`);
  }

  async createPost(postData: any) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(postId: string) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Dua Requests
  async getDuaRequests(limit = 50) {
    return this.request(`/dua-requests?limit=${limit}`);
  }

  async createDuaRequest(duaData: any) {
    return this.request('/dua-requests', {
      method: 'POST',
      body: JSON.stringify(duaData),
    });
  }

  // Comments
  async getPostComments(postId: string) {
    return this.request(`/comments/post/${postId}`);
  }

  async getDuaComments(duaRequestId: string) {
    return this.request(`/comments/dua/${duaRequestId}`);
  }

  async createComment(commentData: any) {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async getCommentsByPostId(postId: string) {
    return this.request(`/comments/post/${postId}`);
  }

  // Likes
  async toggleLike(userId: string, postId?: string, duaRequestId?: string) {
    return this.request('/likes/toggle', {
      method: 'POST',
      body: JSON.stringify({ userId, postId, duaRequestId }),
    });
  }

  // Bookmarks
  async toggleBookmark(userId: string, postId?: string, duaRequestId?: string) {
    return this.request('/bookmarks/toggle', {
      method: 'POST',
      body: JSON.stringify({ userId, postId, duaRequestId }),
    });
  }

  // Communities
  async getCommunities(limit = 50) {
    return this.request(`/communities?limit=${limit}`);
  }

  async createCommunity(communityData: any) {
    return this.request('/communities', {
      method: 'POST',
      body: JSON.stringify(communityData),
    });
  }

  async joinCommunity(communityId: string, userId: string) {
    return this.request(`/communities/${communityId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Events
  async getEvents(limit = 50) {
    return this.request(`/events?limit=${limit}`);
  }

  async createEvent(eventData: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async attendEvent(eventId: string, userId: string) {
    return this.request(`/events/${eventId}/attend`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // System Health
  async getSystemHealth() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;