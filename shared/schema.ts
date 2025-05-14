import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Phone model schema
export const phones = pgTable("phones", {
  id: serial("id").primaryKey(),
  model: text("model").notNull(),
  brand: text("brand").notNull().default("Samsung"),
  series: text("series").notNull(),
  year: integer("year").notNull(),
  displaySize: text("display_size").notNull(),
  displayType: text("display_type").notNull(),
  resolution: text("resolution").notNull(),
  processor: text("processor").notNull(),
  ram: text("ram").notNull(),
  storageOptions: text("storage_options").notNull(),
  mainCamera: text("main_camera").notNull(),
  frontCamera: text("front_camera").notNull(),
  battery: text("battery").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  features: text("features").notNull(),
});

export const insertPhoneSchema = createInsertSchema(phones).omit({
  id: true,
});

// Comparison schema
export const comparisons = pgTable("comparisons", {
  id: serial("id").primaryKey(),
  phoneId1: integer("phone_id_1").notNull(),
  phoneId2: integer("phone_id_2").notNull(),
  viewCount: integer("view_count").notNull().default(0),
});

export const insertComparisonSchema = createInsertSchema(comparisons).omit({
  id: true,
  viewCount: true,
});

// Feature guides schema
export const guides = pgTable("guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").notNull(),
  readTime: integer("read_time").notNull(),
});

export const insertGuideSchema = createInsertSchema(guides).omit({
  id: true,
});

// User preferences for recommendations
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  currentPhone: text("current_phone").notNull(),
  currentStorage: text("current_storage").notNull(),
  usageType: text("usage_type").notNull(),
  budget: integer("budget").notNull(),
  priorities: text("priorities").notNull(),
  includeTradeIn: boolean("include_trade_in").notNull().default(false),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
});

// Types
export type Phone = typeof phones.$inferSelect;
export type InsertPhone = typeof insertPhoneSchema._type;
export type Comparison = typeof comparisons.$inferSelect;
export type InsertComparison = typeof insertComparisonSchema._type;
export type Guide = typeof guides.$inferSelect;
export type InsertGuide = typeof insertGuideSchema._type;
export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof insertUserPreferencesSchema._type;

// Recommendation request and response types
export interface RecommendationRequest {
  currentPhone: string;
  currentStorage: string;
  usageType: string;
  budget: number;
  priorities: string[];
  includeTradeIn: boolean;
}

export interface PhoneRecommendation {
  phone: Phone;
  match: number;
  reasons: string[];
  tradeInValue?: number;
}

export interface RecommendationResponse {
  bestMatch: PhoneRecommendation;
  alternatives: PhoneRecommendation[];
}
