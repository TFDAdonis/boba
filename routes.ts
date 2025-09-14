import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMediaSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Server-side upload route to bypass CORS
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { title, project, lat, lng, accuracy, userId } = req.body;

      // Validate required fields
      if (!title || !project || !lat || !lng || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // For now, create a temporary URL using the file buffer as base64
      // In production, this would be uploaded to Firebase Storage
      const base64Data = req.file.buffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;

      // Generate file path for future Firebase integration
      const timestamp = Date.now();
      const fileName = `${timestamp}_${req.file.originalname}`;
      const filePath = `users/${userId}/media/${fileName}`;

      // Save to database
      const mediaData = {
        title,
        project,
        url: dataUrl, // Using data URL for now
        firebasePath: filePath,
        mimetype: req.file.mimetype,
        fileSize: req.file.size,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        accuracy: parseFloat(accuracy),
        userId
      };

      const validatedData = insertMediaSchema.parse(mediaData);
      const media = await storage.createMedia(validatedData);

      res.json({
        success: true,
        media,
        url: dataUrl,
        path: filePath,
        size: req.file.size
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: "Upload failed", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Media routes
  app.post("/api/media", async (req, res) => {
    try {
      const validatedData = insertMediaSchema.parse(req.body);
      const media = await storage.createMedia(validatedData);
      res.json(media);
    } catch (error) {
      console.error('Error creating media:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid media data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create media" });
      }
    }
  });

  app.get("/api/media", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const media = await storage.getUserMedia(userId);
      res.json(media);
    } catch (error) {
      console.error('Error fetching media:', error);
      res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      const media = await storage.getMedia(req.params.id);
      if (!media) {
        res.status(404).json({ error: "Media not found" });
        return;
      }
      res.json(media);
    } catch (error) {
      console.error('Error fetching media:', error);
      res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  app.delete("/api/media/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMedia(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: "Media not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting media:', error);
      res.status(500).json({ error: "Failed to delete media" });
    }
  });

  app.put("/api/media/:id", async (req, res) => {
    try {
      const updates = insertMediaSchema.partial().parse(req.body);
      const media = await storage.updateMedia(req.params.id, updates);
      if (!media) {
        res.status(404).json({ error: "Media not found" });
        return;
      }
      res.json(media);
    } catch (error) {
      console.error('Error updating media:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid media data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update media" });
      }
    }
  });

  // Storage capacity endpoint
  app.get("/api/storage/capacity", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const userMedia = await storage.getUserMedia(userId);
      
      const totalFiles = userMedia.length;
      const totalSize = userMedia.reduce((sum, media) => sum + (media.fileSize || 0), 0);
      const maxStorage = 1024 * 1024 * 1024; // 1GB limit
      const usedPercentage = Math.round((totalSize / maxStorage) * 100);
      
      res.json({
        totalFiles,
        totalSize,
        maxStorage,
        usedPercentage,
        remainingStorage: maxStorage - totalSize,
        isNearLimit: usedPercentage > 80
      });
    } catch (error) {
      console.error('Error calculating storage:', error);
      res.status(500).json({ error: "Failed to calculate storage capacity" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
