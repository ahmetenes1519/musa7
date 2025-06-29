import { pgTable, text, uuid, integer, boolean, timestamp, numeric, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  avatar_url: text("avatar_url"),
  bio: text("bio"),
  location: text("location"),
  website: text("website"),
  verified: boolean("verified").default(false),
  role: text("role").default('user').$type<'user' | 'admin' | 'moderator'>(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// Posts table
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  type: text("type").default('text').$type<'text' | 'image' | 'video'>(),
  media_url: text("media_url"),
  category: text("category").default('Genel'),
  tags: text("tags").array().default([]),
  likes_count: integer("likes_count").default(0),
  comments_count: integer("comments_count").default(0),
  shares_count: integer("shares_count").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// Dua requests table
export const duaRequests = pgTable("dua_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  is_urgent: boolean("is_urgent").default(false),
  is_anonymous: boolean("is_anonymous").default(false),
  tags: text("tags").array().default([]),
  prayers_count: integer("prayers_count").default(0),
  comments_count: integer("comments_count").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// Likes table
export const likes = pgTable("likes", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  post_id: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  dua_request_id: uuid("dua_request_id").references(() => duaRequests.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow()
});

// Comments table
export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  post_id: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  dua_request_id: uuid("dua_request_id").references(() => duaRequests.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  is_prayer: boolean("is_prayer").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// Bookmarks table
export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  post_id: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  dua_request_id: uuid("dua_request_id").references(() => duaRequests.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow()
});

// Communities table
export const communities = pgTable("communities", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  is_private: boolean("is_private").default(false),
  cover_image: text("cover_image"),
  location: text("location"),
  member_count: integer("member_count").default(1),
  created_by: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// Community members table
export const communityMembers = pgTable("community_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  community_id: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").default('member').$type<'member' | 'admin' | 'moderator'>(),
  joined_at: timestamp("joined_at").defaultNow()
});

// Events table
export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  date: date("date").notNull(),
  time: time("time").notNull(),
  location_name: text("location_name").notNull(),
  location_address: text("location_address").notNull(),
  location_city: text("location_city").notNull(),
  organizer_name: text("organizer_name").notNull(),
  organizer_contact: text("organizer_contact"),
  capacity: integer("capacity").default(100),
  attendees_count: integer("attendees_count").default(0),
  price: numeric("price", { precision: 10, scale: 2 }).default('0'),
  is_online: boolean("is_online").default(false),
  image_url: text("image_url"),
  tags: text("tags").array().default([]),
  requirements: text("requirements").array().default([]),
  created_by: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// Event attendees table
export const eventAttendees = pgTable("event_attendees", {
  id: uuid("id").defaultRandom().primaryKey(),
  event_id: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  registered_at: timestamp("registered_at").defaultNow()
});

// Reports table
export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporter_id: uuid("reporter_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reported_user_id: uuid("reported_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  post_id: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  dua_request_id: uuid("dua_request_id").references(() => duaRequests.id, { onDelete: "cascade" }),
  reason: text("reason").$type<'spam' | 'inappropriate' | 'harassment' | 'fake' | 'other'>(),
  description: text("description"),
  status: text("status").default('pending').$type<'pending' | 'reviewed' | 'resolved' | 'dismissed'>(),
  admin_notes: text("admin_notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// User bans table
export const userBans = pgTable("user_bans", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  banned_by: uuid("banned_by").notNull().references(() => users.id),
  reason: text("reason").notNull(),
  ban_type: text("ban_type").default('temporary').$type<'temporary' | 'permanent'>(),
  expires_at: timestamp("expires_at"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  duaRequests: many(duaRequests),
  likes: many(likes),
  comments: many(comments),
  bookmarks: many(bookmarks),
  communities: many(communities),
  communityMemberships: many(communityMembers),
  events: many(events),
  eventAttendances: many(eventAttendees)
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.user_id],
    references: [users.id]
  }),
  likes: many(likes),
  comments: many(comments),
  bookmarks: many(bookmarks)
}));

export const duaRequestsRelations = relations(duaRequests, ({ one, many }) => ({
  user: one(users, {
    fields: [duaRequests.user_id],
    references: [users.id]
  }),
  likes: many(likes),
  comments: many(comments),
  bookmarks: many(bookmarks)
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  likes_count: true,
  comments_count: true,
  shares_count: true,
  created_at: true,
  updated_at: true
});

export const insertDuaRequestSchema = createInsertSchema(duaRequests).omit({
  id: true,
  prayers_count: true,
  comments_count: true,
  created_at: true,
  updated_at: true
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
  member_count: true,
  created_at: true,
  updated_at: true
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  attendees_count: true,
  created_at: true,
  updated_at: true
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertUserBanSchema = createInsertSchema(userBans).omit({
  id: true,
  created_at: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type DuaRequest = typeof duaRequests.$inferSelect;
export type InsertDuaRequest = z.infer<typeof insertDuaRequestSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Community = typeof communities.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Like = typeof likes.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type CommunityMember = typeof communityMembers.$inferSelect;
export type EventAttendee = typeof eventAttendees.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type UserBan = typeof userBans.$inferSelect;
export type InsertUserBan = z.infer<typeof insertUserBanSchema>;
