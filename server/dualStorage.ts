import { SupabaseStorage } from "./supabaseStorage";
import { DatabaseStorage } from "./storage";
import type { IStorage } from "./storage";
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
} from "@shared/schema";

// Original Supabase-based storage
export class DualStorage implements IStorage {
  private supabaseStorage: SupabaseStorage;
  private databaseStorage: DatabaseStorage;

  constructor() {
    this.supabaseStorage = new SupabaseStorage();
    this.databaseStorage = new DatabaseStorage();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.supabaseStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.supabaseStorage.getUserByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.supabaseStorage.getUserByEmail(email);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.supabaseStorage.createUser(user);
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    return this.supabaseStorage.updateUser(id, userData);
  }

  async getPosts(limit = 50): Promise<(Post & { users: User })[]> {
    return this.supabaseStorage.getPosts(limit);
  }

  async getPostById(id: string): Promise<(Post & { users: User }) | undefined> {
    return this.supabaseStorage.getPostById(id);
  }

  async createPost(post: InsertPost): Promise<Post> {
    return this.supabaseStorage.createPost(post);
  }

  async deletePost(id: string): Promise<boolean> {
    return this.supabaseStorage.deletePost(id);
  }

  async getDuaRequests(limit = 50): Promise<(DuaRequest & { users: User })[]> {
    return this.supabaseStorage.getDuaRequests(limit);
  }

  async getDuaRequestById(id: string): Promise<(DuaRequest & { users: User }) | undefined> {
    return this.supabaseStorage.getDuaRequestById(id);
  }

  async createDuaRequest(duaRequest: InsertDuaRequest): Promise<DuaRequest> {
    return this.supabaseStorage.createDuaRequest(duaRequest);
  }

  async getCommentsByPostId(postId: string): Promise<(Comment & { users: User })[]> {
    return this.supabaseStorage.getCommentsByPostId(postId);
  }

  async getCommentsByDuaRequestId(duaRequestId: string): Promise<(Comment & { users: User })[]> {
    return this.supabaseStorage.getCommentsByDuaRequestId(duaRequestId);
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    return this.supabaseStorage.createComment(comment);
  }

  async getUserLike(userId: string, postId?: string, duaRequestId?: string): Promise<Like | undefined> {
    return this.supabaseStorage.getUserLike(userId, postId, duaRequestId);
  }

  async toggleLike(userId: string, postId?: string, duaRequestId?: string): Promise<{ liked: boolean }> {
    return this.supabaseStorage.toggleLike(userId, postId, duaRequestId);
  }

  async getUserBookmark(userId: string, postId?: string, duaRequestId?: string): Promise<Bookmark | undefined> {
    return this.supabaseStorage.getUserBookmark(userId, postId, duaRequestId);
  }

  async toggleBookmark(userId: string, postId?: string, duaRequestId?: string): Promise<{ bookmarked: boolean }> {
    return this.supabaseStorage.toggleBookmark(userId, postId, duaRequestId);
  }

  async getCommunities(limit = 50): Promise<(Community & { users: User })[]> {
    return this.supabaseStorage.getCommunities(limit);
  }

  async createCommunity(community: InsertCommunity): Promise<Community> {
    return this.supabaseStorage.createCommunity(community);
  }

  async joinCommunity(communityId: string, userId: string): Promise<CommunityMember> {
    return this.supabaseStorage.joinCommunity(communityId, userId);
  }

  async getEvents(limit = 50): Promise<(Event & { users: User })[]> {
    return this.supabaseStorage.getEvents(limit);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    return this.supabaseStorage.createEvent(event);
  }

  async attendEvent(eventId: string, userId: string): Promise<EventAttendee> {
    return this.supabaseStorage.attendEvent(eventId, userId);
  }

  async createReport(report: InsertReport): Promise<Report> {
    try {
      const { data, error } = await this.supabaseStorage.supabase
        .from('reports')
        .insert(report)
        .select()
        .single();
      
      if (error) {
        console.log('Supabase reports table issue, using direct PostgreSQL...', error);
        // PostgreSQL veritabanını direkt kullan
        const { db } = await import('./db');
        const { reports } = await import('@shared/schema');
        const [newReport] = await db.insert(reports).values(report as any).returning();
        return newReport;
      }
      return data;
    } catch (error) {
      console.log('Fallback to PostgreSQL for reports...', error);
      const { db } = await import('./db');
      const { reports } = await import('@shared/schema');
      const [newReport] = await db.insert(reports).values(report as any).returning();
      return newReport;
    }
  }

  async getReports(limit?: number): Promise<(Report & { reporter: User; reportedUser: User; post?: Post; duaRequest?: DuaRequest })[]> {
    return this.supabaseStorage.getReports(limit);
  }

  async updateReportStatus(reportId: string, status: string, adminNotes?: string): Promise<Report | undefined> {
    return this.supabaseStorage.updateReportStatus(reportId, status, adminNotes);
  }

  async banUser(ban: InsertUserBan): Promise<UserBan> {
    return this.supabaseStorage.banUser(ban);
  }

  async getUserBans(userId: string): Promise<UserBan[]> {
    return this.supabaseStorage.getUserBans(userId);
  }

  async isUserBanned(userId: string): Promise<boolean> {
    return this.supabaseStorage.isUserBanned(userId);
  }

  getDatabaseStatus() {
    return {
      postgresql: { status: 'disabled', enabled: false },
      supabase: { status: 'healthy', enabled: true }
    };
  }

  async checkHealth(): Promise<boolean> {
    return this.supabaseStorage.checkHealth();
  }
}

export const storage = new DualStorage();