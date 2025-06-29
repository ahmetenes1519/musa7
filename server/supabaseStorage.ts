import { createClient } from '@supabase/supabase-js';
import type { IStorage } from './storage';
import type { 
  User, InsertUser, 
  Post, InsertPost,
  DuaRequest, InsertDuaRequest,
  Comment, InsertComment,
  Like, Bookmark,
  Community, InsertCommunity,
  CommunityMember,
  Event, InsertEvent,
  EventAttendee,
  Report, InsertReport,
  UserBan, InsertUserBan
} from '@shared/schema';

const supabaseUrl = process.env.SUPABASE_URL || 'https://yiqwkfqultpriwkobklt.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcXdrZnF1bHRwcml3a29ia2x0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDY5MzE1NCwiZXhwIjoyMDY2MjY5MTU0fQ.MEJz9Jyevnlw0pPCx8Nf3cbYDDnjaISiDipEH_8-oxI';

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    return data || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return data || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const { data } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    return data || undefined;
  }

  async getPosts(limit = 50): Promise<(Post & { users: User })[]> {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        users (*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  async getPostById(id: string): Promise<(Post & { users: User }) | undefined> {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        users (*)
      `)
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deletePost(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    return !error;
  }

  async getDuaRequests(limit = 50): Promise<(DuaRequest & { users: User })[]> {
    const { data } = await supabase
      .from('dua_requests')
      .select(`
        *,
        users (*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  async getDuaRequestById(id: string): Promise<(DuaRequest & { users: User }) | undefined> {
    const { data } = await supabase
      .from('dua_requests')
      .select(`
        *,
        users (*)
      `)
      .eq('id', id)
      .single();
    return data || undefined;
  }

  async createDuaRequest(duaRequest: InsertDuaRequest): Promise<DuaRequest> {
    const { data, error } = await supabase
      .from('dua_requests')
      .insert(duaRequest)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getCommentsByPostId(postId: string): Promise<(Comment & { users: User })[]> {
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        users (*)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    return data || [];
  }

  async getCommentsByDuaRequestId(duaRequestId: string): Promise<(Comment & { users: User })[]> {
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        users (*)
      `)
      .eq('dua_request_id', duaRequestId)
      .order('created_at', { ascending: true });
    return data || [];
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserLike(userId: string, postId?: string, duaRequestId?: string): Promise<Like | undefined> {
    let query = supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId);

    if (postId) {
      query = query.eq('post_id', postId);
    }
    if (duaRequestId) {
      query = query.eq('dua_request_id', duaRequestId);
    }

    const { data } = await query.single();
    return data || undefined;
  }

  async toggleLike(userId: string, postId?: string, duaRequestId?: string): Promise<{ liked: boolean }> {
    const existingLike = await this.getUserLike(userId, postId, duaRequestId);

    if (existingLike) {
      await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);
      return { liked: false };
    } else {
      await supabase
        .from('likes')
        .insert({
          user_id: userId,
          post_id: postId || null,
          dua_request_id: duaRequestId || null
        });
      return { liked: true };
    }
  }

  async getUserBookmark(userId: string, postId?: string, duaRequestId?: string): Promise<Bookmark | undefined> {
    let query = supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId);

    if (postId) {
      query = query.eq('post_id', postId);
    }
    if (duaRequestId) {
      query = query.eq('dua_request_id', duaRequestId);
    }

    const { data } = await query.single();
    return data || undefined;
  }

  async toggleBookmark(userId: string, postId?: string, duaRequestId?: string): Promise<{ bookmarked: boolean }> {
    const existingBookmark = await this.getUserBookmark(userId, postId, duaRequestId);

    if (existingBookmark) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('id', existingBookmark.id);
      return { bookmarked: false };
    } else {
      await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          post_id: postId || null,
          dua_request_id: duaRequestId || null
        });
      return { bookmarked: true };
    }
  }

  async getCommunities(limit = 50): Promise<(Community & { users: User })[]> {
    const { data } = await supabase
      .from('communities')
      .select(`
        *,
        users (*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  async createCommunity(community: InsertCommunity): Promise<Community> {
    const { data, error } = await supabase
      .from('communities')
      .insert(community)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async joinCommunity(communityId: string, userId: string): Promise<CommunityMember> {
    const { data, error } = await supabase
      .from('community_members')
      .insert({
        community_id: communityId,
        user_id: userId,
        role: 'member'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getEvents(limit = 50): Promise<(Event & { users: User })[]> {
    const { data } = await supabase
      .from('events')
      .select(`
        *,
        users (*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async attendEvent(eventId: string, userId: string): Promise<EventAttendee> {
    const { data, error } = await supabase
      .from('event_attendees')
      .insert({
        event_id: eventId,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async createReport(report: InsertReport): Promise<Report> {
    console.log('Creating report in Supabase:', report);
    const { data, error } = await supabase
      .from('reports')
      .insert(report)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase createReport error:', error);
      throw new Error(`Supabase error: ${error.message} - ${JSON.stringify(error)}`);
    }
    return data;
  }

  async getReports(limit = 50): Promise<(Report & { reporter: User; reportedUser: User; post?: Post; duaRequest?: DuaRequest })[]> {
    const { data } = await supabase
      .from('reports')
      .select(`
        *,
        reporter:users!reports_reporter_id_fkey (*),
        reportedUser:users!reports_reported_user_id_fkey (*),
        post:posts (*),
        duaRequest:dua_requests (*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  async updateReportStatus(reportId: string, status: string, adminNotes?: string): Promise<Report | undefined> {
    const { data } = await supabase
      .from('reports')
      .update({ 
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();
    return data || undefined;
  }

  async banUser(ban: InsertUserBan): Promise<UserBan> {
    const { data, error } = await supabase
      .from('user_bans')
      .insert(ban)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserBans(userId: string): Promise<UserBan[]> {
    const { data } = await supabase
      .from('user_bans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  }

  async isUserBanned(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('user_bans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();
    return !!data;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}