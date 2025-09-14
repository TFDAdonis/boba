import { type User, type InsertUser, type Media, type InsertMedia } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Media operations
  createMedia(media: InsertMedia): Promise<Media>;
  getMedia(id: string): Promise<Media | undefined>;
  getAllMedia(): Promise<Media[]>;
  getUserMedia(userId?: string): Promise<Media[]>;
  deleteMedia(id: string): Promise<boolean>;
  updateMedia(id: string, updates: Partial<InsertMedia>): Promise<Media | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private media: Map<string, Media>;

  constructor() {
    this.users = new Map();
    this.media = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const id = randomUUID();
    const timestamp = new Date();
    const media: Media = { 
      ...insertMedia, 
      id, 
      timestamp,
      firebasePath: insertMedia.firebasePath || null,
      fileSize: insertMedia.fileSize || null,
      accuracy: insertMedia.accuracy || null,
      userId: insertMedia.userId || null
    };
    this.media.set(id, media);
    return media;
  }

  async getMedia(id: string): Promise<Media | undefined> {
    return this.media.get(id);
  }

  async getAllMedia(): Promise<Media[]> {
    return Array.from(this.media.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getUserMedia(userId?: string): Promise<Media[]> {
    if (!userId) {
      return this.getAllMedia();
    }
    return Array.from(this.media.values())
      .filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async deleteMedia(id: string): Promise<boolean> {
    return this.media.delete(id);
  }

  async updateMedia(id: string, updates: Partial<InsertMedia>): Promise<Media | undefined> {
    const existing = this.media.get(id);
    if (!existing) return undefined;
    
    const updated: Media = { ...existing, ...updates };
    this.media.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
