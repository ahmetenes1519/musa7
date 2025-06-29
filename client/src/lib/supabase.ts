// Legacy Supabase compatibility layer
// This file is deprecated - all database operations now use the API

export const hasValidCredentials = false;
export const supabase = null;
export const isSupabaseConfigured = false;

console.log('Using PostgreSQL database via API endpoints');

// Database Types for backward compatibility
export type Database = {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string; name: string; username: string; bio?: string; location?: string; verified: boolean; role: string; };
        Insert: { email: string; name: string; username: string; bio?: string; location?: string; role?: string; };
        Update: { name?: string; bio?: string; location?: string; };
      };
      posts: {
        Row: { id: string; user_id: string; content: string; category: string; tags: string[]; likes_count: number; comments_count: number; };
        Insert: { user_id: string; content: string; category?: string; tags?: string[]; };
        Update: { content?: string; category?: string; tags?: string[]; };
      };
    };
  };
};

// Compatibility helpers - all operations now go through API
export const dbHelpers = {
  async getUser() { return { data: null, error: { message: 'Use API client instead' } }; },
  async updateUser() { return { data: null, error: { message: 'Use API client instead' } }; },
  async getPosts() { return { data: [], error: null }; },
  async createPost() { return { data: null, error: { message: 'Use API client instead' } }; },
  async getDuaRequests() { return { data: [], error: null }; },
  async createDuaRequest() { return { data: null, error: { message: 'Use API client instead' } }; },
  async getPostComments() { return { data: [], error: null }; },
  async createComment() { return { data: null, error: { message: 'Use API client instead' } }; },
  async toggleLike() { return { data: null, error: { message: 'Use API client instead' } }; },
  async toggleBookmark() { return { data: null, error: { message: 'Use API client instead' } }; }
};