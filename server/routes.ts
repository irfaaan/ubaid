import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserPreferencesSchema, 
  RecommendationRequest,
  RecommendationResponse,
  Phone
} from "@shared/schema";
import { getPhoneRecommendations } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // API routes
  app.get("/api/phones", async (req: Request, res: Response) => {
    try {
      const phones = await storage.getPhones();
      res.json(phones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch phones", error: (error as Error).message });
    }
  });

  app.get("/api/phones/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid phone ID" });
      }

      const phone = await storage.getPhone(id);
      if (!phone) {
        return res.status(404).json({ message: "Phone not found" });
      }

      res.json(phone);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch phone", error: (error as Error).message });
    }
  });

  app.get("/api/comparisons", async (req: Request, res: Response) => {
    try {
      const comparisons = await storage.getComparisons();
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comparisons", error: (error as Error).message });
    }
  });

  app.get("/api/comparisons/popular", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const popularComparisons = await storage.getPopularComparisons(limit);
      
      // Get the full phone details for each comparison
      const populatedComparisons = await Promise.all(
        popularComparisons.map(async (comparison) => {
          const phone1 = await storage.getPhone(comparison.phoneId1);
          const phone2 = await storage.getPhone(comparison.phoneId2);
          return {
            id: comparison.id,
            viewCount: comparison.viewCount,
            phone1,
            phone2
          };
        })
      );
      
      res.json(populatedComparisons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular comparisons", error: (error as Error).message });
    }
  });

  app.post("/api/comparisons", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        phoneId1: z.number(),
        phoneId2: z.number()
      });

      const validatedData = schema.parse(req.body);
      
      // Check if both phones exist
      const phone1 = await storage.getPhone(validatedData.phoneId1);
      const phone2 = await storage.getPhone(validatedData.phoneId2);
      
      if (!phone1 || !phone2) {
        return res.status(404).json({ message: "One or both phones not found" });
      }

      const comparison = await storage.createComparison(validatedData);
      res.status(201).json(comparison);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comparison", error: (error as Error).message });
    }
  });

  app.get("/api/comparisons/:id/view", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid comparison ID" });
      }

      const comparison = await storage.incrementComparisonViewCount(id);
      if (!comparison) {
        return res.status(404).json({ message: "Comparison not found" });
      }

      res.json(comparison);
    } catch (error) {
      res.status(500).json({ message: "Failed to increment view count", error: (error as Error).message });
    }
  });

  app.get("/api/guides", async (req: Request, res: Response) => {
    try {
      const guides = await storage.getGuides();
      res.json(guides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch guides", error: (error as Error).message });
    }
  });

  app.get("/api/guides/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid guide ID" });
      }

      const guide = await storage.getGuide(id);
      if (!guide) {
        return res.status(404).json({ message: "Guide not found" });
      }

      res.json(guide);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch guide", error: (error as Error).message });
    }
  });

  app.post("/api/recommend", async (req: Request, res: Response) => {
    try {
      // Validate the recommendation request
      const schema = z.object({
        currentPhone: z.string(),
        currentStorage: z.string(),
        usageType: z.string(),
        budget: z.number(),
        priorities: z.array(z.string()),
        includeTradeIn: z.boolean()
      });

      const validatedData = schema.parse(req.body) as RecommendationRequest;
      
      // Save user preferences
      await storage.createUserPreference({
        currentPhone: validatedData.currentPhone,
        currentStorage: validatedData.currentStorage,
        usageType: validatedData.usageType,
        budget: validatedData.budget,
        priorities: validatedData.priorities.join(','),
        includeTradeIn: validatedData.includeTradeIn
      });

      // Get all phones within budget
      const allPhones = await storage.getPhones();
      const affordablePhones = allPhones.filter(phone => phone.price <= validatedData.budget);
      
      if (affordablePhones.length === 0) {
        return res.status(404).json({ message: "No phones found within your budget" });
      }

      try {
        // Get AI-based recommendations with proper error handling
        const recommendations = await getPhoneRecommendations(validatedData, affordablePhones);
        return res.json(recommendations);
      } catch (aiError) {
        console.error("AI recommendation error:", aiError);
        
        // Fallback to rule-based recommendations when AI fails
        const fallbackRecommendations = generateFallbackRecommendations(validatedData, affordablePhones);
        return res.json(fallbackRecommendations);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to generate recommendations", error: (error as Error).message });
    }
  });

  // Helper function for fallback recommendations when OpenAI is unavailable
  function generateFallbackRecommendations(request: RecommendationRequest, phones: Phone[]): RecommendationResponse {
    // Sort phones by considering priorities
    let sortedPhones = [...phones];
    
    // Consider usage type
    if (request.usageType === "professional" || request.usageType === "heavy") {
      // Sort by higher specs for power users
      sortedPhones.sort((a, b) => b.price - a.price);
    } else if (request.usageType === "light") {
      // Sort by value for light users
      sortedPhones.sort((a, b) => {
        // Simple value score calculation
        const aValue = a.price / 1000;
        const bValue = b.price / 1000;
        return aValue - bValue;
      });
    }
    
    // Apply priority filtering
    if (request.priorities.includes("camera")) {
      sortedPhones.sort((a, b) => {
        const getMP = (str: string) => {
          const match = str.match(/(\d+)MP/);
          return match ? parseInt(match[1]) : 0;
        };
        return getMP(b.mainCamera) - getMP(a.mainCamera);
      });
    } else if (request.priorities.includes("battery")) {
      sortedPhones.sort((a, b) => {
        const getCapacity = (str: string) => {
          const match = str.match(/(\d+)\s*mAh/);
          return match ? parseInt(match[1]) : 0;
        };
        return getCapacity(b.battery) - getCapacity(a.battery);
      });
    } else if (request.priorities.includes("gaming")) {
      // Put phones with better processors at the top
      sortedPhones.sort((a, b) => {
        const aHasGen = a.processor.includes("Gen");
        const bHasGen = b.processor.includes("Gen");
        if (aHasGen && !bHasGen) return -1;
        if (!aHasGen && bHasGen) return 1;
        return b.price - a.price; // Higher price often means better performance
      });
    }
    
    // Get best match and alternatives
    const bestMatch = sortedPhones[0];
    const alternatives = sortedPhones.slice(1, 3);
    
    // Generate reasons based on features
    const generateReasons = (phone: Phone, isTopChoice: boolean): string[] => {
      const reasons = [];
      
      if (isTopChoice) {
        reasons.push(`Best overall match for your ${request.usageType} usage needs`);
      }
      
      if (phone.series === "S" && request.usageType === "professional") {
        reasons.push("Flagship performance ideal for professional users");
      }
      
      if (phone.mainCamera.includes("108MP") || phone.mainCamera.includes("200MP")) {
        reasons.push("Exceptional camera system for photography enthusiasts");
      }
      
      if (request.priorities.includes("battery") && phone.battery.includes("5000mAh")) {
        reasons.push("Large battery capacity for all-day usage");
      }
      
      if (request.priorities.includes("gaming") && phone.processor.includes("Snapdragon")) {
        reasons.push("Powerful processor optimized for gaming performance");
      }
      
      if (request.priorities.includes("display") && phone.displayType.includes("AMOLED")) {
        reasons.push("Premium display with vibrant colors and deep blacks");
      }
      
      // Add at least one reason if none were generated
      if (reasons.length === 0) {
        reasons.push(`Good balance of features within your $${request.budget} budget`);
      }
      
      return reasons;
    };
    
    // Calculate trade-in value if requested
    let tradeInValue: number | undefined = undefined;
    if (request.includeTradeIn && request.currentPhone) {
      const tradeInValues: Record<string, number> = {
        "Samsung Galaxy S23": 350,
        "Samsung Galaxy S22": 250,
        "Samsung Galaxy S21": 200,
        "Samsung Galaxy A54": 150,
        "Samsung Galaxy A53": 100,
        "Samsung Galaxy Note 20": 200,
        "Other Samsung": 100,
        "Other Brand": 50
      };
      tradeInValue = tradeInValues[request.currentPhone] || 0;
    }
    
    return {
      bestMatch: {
        phone: bestMatch,
        match: 95, // Confidence score for best match
        reasons: generateReasons(bestMatch, true),
        tradeInValue
      },
      alternatives: alternatives.map((phone, index) => ({
        phone,
        match: 90 - (index * 10), // Decreasing confidence for alternatives
        reasons: generateReasons(phone, false),
        tradeInValue
      }))
    };
  }

  app.get("/api/trade-in/:model", async (req: Request, res: Response) => {
    try {
      const model = req.params.model;
      
      // In a real app, this would query a database or external API
      // For this demo, we'll use a simple mapping of trade-in values
      const tradeInValues: Record<string, number> = {
        "Samsung Galaxy S23": 350,
        "Samsung Galaxy S23+": 400,
        "Samsung Galaxy S23 Ultra": 500,
        "Samsung Galaxy S22": 250,
        "Samsung Galaxy S22+": 300,
        "Samsung Galaxy S22 Ultra": 400,
        "Samsung Galaxy S21": 200,
        "Samsung Galaxy S21+": 250,
        "Samsung Galaxy S21 Ultra": 300,
        "Samsung Galaxy A54": 150,
        "Samsung Galaxy A53": 100,
        "Samsung Galaxy Note 20": 200,
        "Samsung Galaxy Note 20 Ultra": 250,
        "Samsung Galaxy Z Flip4": 300,
        "Samsung Galaxy Z Fold4": 500
      };
      
      const tradeInValue = tradeInValues[model] || 0;
      
      res.json({ model, tradeInValue });
    } catch (error) {
      res.status(500).json({ message: "Failed to get trade-in value", error: (error as Error).message });
    }
  });

  return httpServer;
}
