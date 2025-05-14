import { 
  phones, 
  comparisons, 
  guides, 
  userPreferences,
  type Phone, 
  type InsertPhone, 
  type Comparison, 
  type InsertComparison,
  type Guide,
  type InsertGuide,
  type UserPreference,
  type InsertUserPreference
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Phone operations
  getPhones(): Promise<Phone[]>;
  getPhone(id: number): Promise<Phone | undefined>;
  getPhoneByModel(model: string): Promise<Phone | undefined>;
  createPhone(phone: InsertPhone): Promise<Phone>;
  
  // Comparison operations
  getComparisons(): Promise<Comparison[]>;
  getComparison(id: number): Promise<Comparison | undefined>;
  createComparison(comparison: InsertComparison): Promise<Comparison>;
  incrementComparisonViewCount(id: number): Promise<Comparison | undefined>;
  getPopularComparisons(limit: number): Promise<Comparison[]>;
  
  // Guide operations
  getGuides(): Promise<Guide[]>;
  getGuide(id: number): Promise<Guide | undefined>;
  createGuide(guide: InsertGuide): Promise<Guide>;
  
  // User preference operations
  createUserPreference(preference: InsertUserPreference): Promise<UserPreference>;
}

export class MemStorage implements IStorage {
  private phones: Map<number, Phone>;
  private comparisons: Map<number, Comparison>;
  private guides: Map<number, Guide>;
  private userPreferences: Map<number, UserPreference>;
  private phoneIdCounter: number;
  private comparisonIdCounter: number;
  private guideIdCounter: number;
  private userPreferenceIdCounter: number;

  constructor() {
    this.phones = new Map();
    this.comparisons = new Map();
    this.guides = new Map();
    this.userPreferences = new Map();
    this.phoneIdCounter = 1;
    this.comparisonIdCounter = 1;
    this.guideIdCounter = 1;
    this.userPreferenceIdCounter = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  // Phone operations
  async getPhones(): Promise<Phone[]> {
    return Array.from(this.phones.values());
  }

  async getPhone(id: number): Promise<Phone | undefined> {
    return this.phones.get(id);
  }

  async getPhoneByModel(model: string): Promise<Phone | undefined> {
    return Array.from(this.phones.values()).find(
      phone => phone.model.toLowerCase() === model.toLowerCase()
    );
  }

  async createPhone(phone: InsertPhone): Promise<Phone> {
    const id = this.phoneIdCounter++;
    const newPhone: Phone = { ...phone, id };
    this.phones.set(id, newPhone);
    return newPhone;
  }

  // Comparison operations
  async getComparisons(): Promise<Comparison[]> {
    return Array.from(this.comparisons.values());
  }

  async getComparison(id: number): Promise<Comparison | undefined> {
    return this.comparisons.get(id);
  }

  async createComparison(comparison: InsertComparison): Promise<Comparison> {
    const id = this.comparisonIdCounter++;
    const newComparison: Comparison = { ...comparison, id, viewCount: 0 };
    this.comparisons.set(id, newComparison);
    return newComparison;
  }

  async incrementComparisonViewCount(id: number): Promise<Comparison | undefined> {
    const comparison = this.comparisons.get(id);
    if (!comparison) return undefined;
    
    const updatedComparison = { 
      ...comparison, 
      viewCount: comparison.viewCount + 1 
    };
    
    this.comparisons.set(id, updatedComparison);
    return updatedComparison;
  }

  async getPopularComparisons(limit: number): Promise<Comparison[]> {
    return Array.from(this.comparisons.values())
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
  }

  // Guide operations
  async getGuides(): Promise<Guide[]> {
    return Array.from(this.guides.values());
  }

  async getGuide(id: number): Promise<Guide | undefined> {
    return this.guides.get(id);
  }

  async createGuide(guide: InsertGuide): Promise<Guide> {
    const id = this.guideIdCounter++;
    const newGuide: Guide = { ...guide, id };
    this.guides.set(id, newGuide);
    return newGuide;
  }

  // User preference operations
  async createUserPreference(preference: InsertUserPreference): Promise<UserPreference> {
    const id = this.userPreferenceIdCounter++;
    const newPreference: UserPreference = { ...preference, id };
    this.userPreferences.set(id, newPreference);
    return newPreference;
  }

  // Initialize with sample data
  private initSampleData() {
    // Sample phones
    const samplePhones: InsertPhone[] = [
      {
        model: "Galaxy S24",
        brand: "Samsung",
        series: "S",
        year: 2024,
        displaySize: "6.2 inches",
        displayType: "Dynamic AMOLED 2X",
        resolution: "2340 x 1080",
        processor: "Snapdragon 8 Gen 3",
        ram: "8GB",
        storageOptions: "128GB, 256GB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 10MP Telephoto",
        frontCamera: "12MP",
        battery: "4000 mAh",
        price: 799,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s921blbhmea/gallery/levant-galaxy-s24-s921-sm-s921blbhmea-thumb-536833401",
        isActive: true,
        features: "IP68, Wireless Charging, Galaxy AI, Ultra HDR"
      },
      {
        model: "Galaxy S24+",
        brand: "Samsung",
        series: "S",
        year: 2024,
        displaySize: "6.7 inches",
        displayType: "Dynamic AMOLED 2X",
        resolution: "3120 x 1440",
        processor: "Snapdragon 8 Gen 3",
        ram: "12GB",
        storageOptions: "256GB, 512GB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 10MP Telephoto",
        frontCamera: "12MP",
        battery: "4900 mAh",
        price: 999,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s926blbhmea/gallery/levant-galaxy-s24-plus-s926-sm-s926blbhmea-thumb-536833416",
        isActive: true,
        features: "IP68, Wireless Charging, Galaxy AI, Ultra HDR"
      },
      {
        model: "Galaxy S24 Ultra",
        brand: "Samsung",
        series: "S",
        year: 2024,
        displaySize: "6.8 inches",
        displayType: "Dynamic AMOLED 2X",
        resolution: "3120 x 1440",
        processor: "Snapdragon 8 Gen 3",
        ram: "12GB",
        storageOptions: "256GB, 512GB, 1TB",
        mainCamera: "200MP Wide, 12MP Ultra-wide, 50MP Telephoto, 10MP Telephoto",
        frontCamera: "12MP",
        battery: "5000 mAh",
        price: 1299,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s928bzghmea/gallery/levant-galaxy-s24-ultra-s928-sm-s928bzghmea-thumb-536833430",
        isActive: true,
        features: "IP68, S Pen, Wireless Charging, Galaxy AI, Titanium Frame"
      },
      {
        model: "Galaxy A54",
        brand: "Samsung",
        series: "A",
        year: 2023,
        displaySize: "6.4 inches",
        displayType: "Super AMOLED",
        resolution: "2340 x 1080",
        processor: "Exynos 1380",
        ram: "6GB, 8GB",
        storageOptions: "128GB, 256GB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 5MP Macro",
        frontCamera: "32MP",
        battery: "5000 mAh",
        price: 449,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-a546blvcxeu/gallery/uk-galaxy-a54-5g-sm-a546-sm-a546blvcxeu-536509628",
        isActive: true,
        features: "IP67, microSD support, 120Hz refresh rate"
      },
      {
        model: "Galaxy Z Flip5",
        brand: "Samsung",
        series: "Z",
        year: 2023,
        displaySize: "6.7 inches (main), 3.4 inches (cover)",
        displayType: "Dynamic AMOLED 2X (main), Super AMOLED (cover)",
        resolution: "2640 x 1080 (main), 720 x 748 (cover)",
        processor: "Snapdragon 8 Gen 2",
        ram: "8GB",
        storageOptions: "256GB, 512GB",
        mainCamera: "12MP Wide, 12MP Ultra-wide",
        frontCamera: "10MP",
        battery: "3700 mAh",
        price: 999,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-f731blgatrm/gallery/uk-galaxy-z-flip5-f731-sm-f731blgatrm-thumb-536641767",
        isActive: true,
        features: "Foldable display, Flex Mode, IPX8, Wireless Charging"
      },
      {
        model: "Galaxy Z Fold5",
        brand: "Samsung",
        series: "Z",
        year: 2023,
        displaySize: "7.6 inches (main), 6.2 inches (cover)",
        displayType: "Dynamic AMOLED 2X",
        resolution: "2176 x 1812 (main), 2316 x 904 (cover)",
        processor: "Snapdragon 8 Gen 2",
        ram: "12GB",
        storageOptions: "256GB, 512GB, 1TB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 10MP Telephoto",
        frontCamera: "4MP (under display), 10MP (cover)",
        battery: "4400 mAh",
        price: 1799,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-f946begatrm/gallery/uk-galaxy-z-fold5-f946-sm-f946begatrm-thumb-536841199",
        isActive: true,
        features: "Foldable display, S Pen support, IPX8, Wireless Charging"
      },
      {
        model: "Galaxy S23",
        brand: "Samsung",
        series: "S",
        year: 2023,
        displaySize: "6.1 inches",
        displayType: "Dynamic AMOLED 2X",
        resolution: "2340 x 1080",
        processor: "Snapdragon 8 Gen 2",
        ram: "8GB",
        storageOptions: "128GB, 256GB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 10MP Telephoto",
        frontCamera: "12MP",
        battery: "3900 mAh",
        price: 699,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-s911bzadeub/gallery/uk-galaxy-s23-s911-sm-s911bzadeub-thumb-534863401",
        isActive: true,
        features: "IP68, Wireless Charging, Night photography"
      },
      {
        model: "Galaxy S23+",
        brand: "Samsung",
        series: "S",
        year: 2023,
        displaySize: "6.6 inches",
        displayType: "Dynamic AMOLED 2X",
        resolution: "2340 x 1080",
        processor: "Snapdragon 8 Gen 2",
        ram: "8GB",
        storageOptions: "256GB, 512GB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 10MP Telephoto",
        frontCamera: "12MP",
        battery: "4700 mAh",
        price: 899,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-s916bzadeub/gallery/uk-galaxy-s23-plus-s916-sm-s916bzadeub-thumb-534863416",
        isActive: true,
        features: "IP68, Wireless Charging, 45W Fast Charging"
      }
    ];

    // Create phones
    samplePhones.forEach(phone => {
      this.createPhone(phone);
    });

    // Sample comparisons
    const sampleComparisons: InsertComparison[] = [
      { phoneId1: 1, phoneId2: 2 }, // S24 vs S24+
      { phoneId1: 7, phoneId2: 8 }, // S23 vs S23+
      { phoneId1: 1, phoneId2: 7 }, // S24 vs S23
      { phoneId1: 5, phoneId2: 6 }, // Z Flip5 vs Z Fold5
      { phoneId1: 3, phoneId2: 6 }, // S24 Ultra vs Z Fold5
      { phoneId1: 1, phoneId2: 4 }  // S24 vs A54
    ];

    // Create comparisons and add view counts
    sampleComparisons.forEach((comparison, index) => {
      this.createComparison(comparison).then(comp => {
        // Add some view counts to make them "popular"
        const viewCounts = [5234, 3891, 2156, 7645, 4523, 1890];
        for (let i = 0; i < viewCounts[index]; i++) {
          this.incrementComparisonViewCount(comp.id);
        }
      });
    });

    // Sample guides
    const sampleGuides: InsertGuide[] = [
      {
        title: "Ultimate Galaxy Camera Tips",
        description: "Master night mode, portrait photography, and pro settings on your Galaxy phone",
        imageUrl: "https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        content: "Learn how to take professional photos with your Galaxy phone...",
        createdAt: "2023-06-15",
        readTime: 5
      },
      {
        title: "Extend Your Galaxy Battery Life",
        description: "Simple tweaks and settings to maximize battery performance on Samsung devices",
        imageUrl: "https://images.unsplash.com/photo-1603539947369-c5fda2f3ddf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        content: "Follow these simple tips to extend your battery life...",
        createdAt: "2023-05-20",
        readTime: 4
      },
      {
        title: "Hidden One UI Features",
        description: "Discover powerful Samsung features you didn't know existed on your device",
        imageUrl: "https://images.unsplash.com/photo-1611174275813-8e0e249f2fd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        content: "One UI includes many hidden features that can enhance your experience...",
        createdAt: "2023-07-10",
        readTime: 7
      }
    ];

    // Create guides
    sampleGuides.forEach(guide => {
      this.createGuide(guide);
    });
  }
}

export class DatabaseStorage implements IStorage {
  // Phone operations
  async getPhones(): Promise<Phone[]> {
    return await db.select().from(phones);
  }

  async getPhone(id: number): Promise<Phone | undefined> {
    const results = await db.select().from(phones).where(eq(phones.id, id));
    return results[0];
  }

  async getPhoneByModel(model: string): Promise<Phone | undefined> {
    const results = await db.select().from(phones).where(eq(phones.model, model));
    return results[0];
  }

  async createPhone(phone: InsertPhone): Promise<Phone> {
    const results = await db.insert(phones).values(phone).returning();
    return results[0];
  }

  // Comparison operations
  async getComparisons(): Promise<Comparison[]> {
    return await db.select().from(comparisons);
  }

  async getComparison(id: number): Promise<Comparison | undefined> {
    const results = await db.select().from(comparisons).where(eq(comparisons.id, id));
    return results[0];
  }

  async createComparison(comparison: InsertComparison): Promise<Comparison> {
    const results = await db.insert(comparisons)
      .values({ ...comparison, viewCount: 0 })
      .returning();
    return results[0];
  }

  async incrementComparisonViewCount(id: number): Promise<Comparison | undefined> {
    const comparison = await this.getComparison(id);
    if (!comparison) return undefined;
    
    const results = await db
      .update(comparisons)
      .set({ viewCount: comparison.viewCount + 1 })
      .where(eq(comparisons.id, id))
      .returning();
    
    return results[0];
  }

  async getPopularComparisons(limit: number): Promise<Comparison[]> {
    return await db
      .select()
      .from(comparisons)
      .orderBy(desc(comparisons.viewCount))
      .limit(limit);
  }

  // Guide operations
  async getGuides(): Promise<Guide[]> {
    return await db.select().from(guides);
  }

  async getGuide(id: number): Promise<Guide | undefined> {
    const results = await db.select().from(guides).where(eq(guides.id, id));
    return results[0];
  }

  async createGuide(guide: InsertGuide): Promise<Guide> {
    const results = await db.insert(guides).values(guide).returning();
    return results[0];
  }

  // User preference operations
  async createUserPreference(preference: InsertUserPreference): Promise<UserPreference> {
    const results = await db.insert(userPreferences).values(preference).returning();
    return results[0];
  }

  // Initialize sample data in the database
  async initSampleData() {
    // Check if we already have data in the database
    const existingPhones = await db.select().from(phones);
    if (existingPhones.length > 0) {
      console.log("Database already contains data. Skipping sample data initialization.");
      return;
    }

    console.log("Initializing database with sample data...");
    
    // Sample phones from MemStorage
    const samplePhones: InsertPhone[] = [
      {
        model: "Galaxy S24",
        brand: "Samsung",
        series: "S",
        year: 2024,
        displaySize: "6.2 inches",
        displayType: "Dynamic AMOLED 2X",
        resolution: "2340 x 1080",
        processor: "Snapdragon 8 Gen 3",
        ram: "8GB",
        storageOptions: "128GB, 256GB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 10MP Telephoto",
        frontCamera: "12MP",
        battery: "4000 mAh",
        price: 799,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s921blbhmea/gallery/levant-galaxy-s24-s921-sm-s921blbhmea-thumb-536833401",
        isActive: true,
        features: "IP68, Wireless Charging, Galaxy AI, Ultra HDR"
      },
      {
        model: "Galaxy S24+",
        brand: "Samsung",
        series: "S",
        year: 2024,
        displaySize: "6.7 inches",
        displayType: "Dynamic AMOLED 2X",
        resolution: "3120 x 1440",
        processor: "Snapdragon 8 Gen 3",
        ram: "12GB",
        storageOptions: "256GB, 512GB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 10MP Telephoto",
        frontCamera: "12MP",
        battery: "4900 mAh",
        price: 999,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s926blbhmea/gallery/levant-galaxy-s24-plus-s926-sm-s926blbhmea-thumb-536833416",
        isActive: true,
        features: "IP68, Wireless Charging, Galaxy AI, Ultra HDR"
      },
      {
        model: "Galaxy S24 Ultra",
        brand: "Samsung",
        series: "S",
        year: 2024,
        displaySize: "6.8 inches",
        displayType: "Dynamic AMOLED 2X",
        resolution: "3120 x 1440",
        processor: "Snapdragon 8 Gen 3",
        ram: "12GB",
        storageOptions: "256GB, 512GB, 1TB",
        mainCamera: "200MP Wide, 12MP Ultra-wide, 50MP Telephoto, 10MP Telephoto",
        frontCamera: "12MP",
        battery: "5000 mAh",
        price: 1299,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s928bzghmea/gallery/levant-galaxy-s24-ultra-s928-sm-s928bzghmea-thumb-536833430",
        isActive: true,
        features: "IP68, S Pen, Wireless Charging, Galaxy AI, Titanium Frame"
      },
      {
        model: "Galaxy A54",
        brand: "Samsung",
        series: "A",
        year: 2023,
        displaySize: "6.4 inches",
        displayType: "Super AMOLED",
        resolution: "2340 x 1080",
        processor: "Exynos 1380",
        ram: "6GB, 8GB",
        storageOptions: "128GB, 256GB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 5MP Macro",
        frontCamera: "32MP",
        battery: "5000 mAh",
        price: 449,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-a546blvcxeu/gallery/uk-galaxy-a54-5g-sm-a546-sm-a546blvcxeu-536509628",
        isActive: true,
        features: "IP67, microSD support, 120Hz refresh rate"
      },
      {
        model: "Galaxy Z Flip5",
        brand: "Samsung",
        series: "Z",
        year: 2023,
        displaySize: "6.7 inches (main), 3.4 inches (cover)",
        displayType: "Dynamic AMOLED 2X (main), Super AMOLED (cover)",
        resolution: "2640 x 1080 (main), 720 x 748 (cover)",
        processor: "Snapdragon 8 Gen 2",
        ram: "8GB",
        storageOptions: "256GB, 512GB",
        mainCamera: "12MP Wide, 12MP Ultra-wide",
        frontCamera: "10MP",
        battery: "3700 mAh",
        price: 999,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-f731blgatrm/gallery/uk-galaxy-z-flip5-f731-sm-f731blgatrm-thumb-536641767",
        isActive: true,
        features: "Foldable display, Flex Mode, IPX8, Wireless Charging"
      },
      {
        model: "Galaxy Z Fold5",
        brand: "Samsung",
        series: "Z",
        year: 2023,
        displaySize: "7.6 inches (main), 6.2 inches (cover)",
        displayType: "Dynamic AMOLED 2X",
        resolution: "2176 x 1812 (main), 2316 x 904 (cover)",
        processor: "Snapdragon 8 Gen 2",
        ram: "12GB",
        storageOptions: "256GB, 512GB, 1TB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 10MP Telephoto",
        frontCamera: "4MP (under display), 10MP (cover)",
        battery: "4400 mAh",
        price: 1799,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-f946begatrm/gallery/uk-galaxy-z-fold5-f946-sm-f946begatrm-thumb-536841199",
        isActive: true,
        features: "Foldable display, S Pen support, IPX8, Wireless Charging"
      },
      {
        model: "Galaxy S23",
        brand: "Samsung",
        series: "S",
        year: 2023,
        displaySize: "6.1 inches",
        displayType: "Dynamic AMOLED 2X",
        resolution: "2340 x 1080",
        processor: "Snapdragon 8 Gen 2",
        ram: "8GB",
        storageOptions: "128GB, 256GB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 10MP Telephoto",
        frontCamera: "12MP",
        battery: "3900 mAh",
        price: 699,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-s911bzadeub/gallery/uk-galaxy-s23-s911-sm-s911bzadeub-thumb-534863401",
        isActive: true,
        features: "IP68, Wireless Charging, Night photography"
      },
      {
        model: "Galaxy S23+",
        brand: "Samsung",
        series: "S",
        year: 2023,
        displaySize: "6.6 inches",
        displayType: "Dynamic AMOLED 2X",
        resolution: "2340 x 1080",
        processor: "Snapdragon 8 Gen 2",
        ram: "8GB",
        storageOptions: "256GB, 512GB",
        mainCamera: "50MP Wide, 12MP Ultra-wide, 10MP Telephoto",
        frontCamera: "12MP",
        battery: "4700 mAh",
        price: 899,
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-s916bzadeub/gallery/uk-galaxy-s23-plus-s916-sm-s916bzadeub-thumb-534863416",
        isActive: true,
        features: "IP68, Wireless Charging, 45W Fast Charging"
      }
    ];

    // Insert phones
    const phoneInsertResults = await db.insert(phones).values(samplePhones).returning({
      id: phones.id
    });

    console.log(`${phoneInsertResults.length} phones added to database`);

    // Create mapping from array index to actual DB IDs
    const phoneIdsMap = new Map<number, number>();
    phoneInsertResults.forEach((result, index) => {
      phoneIdsMap.set(index + 1, result.id);
    });

    // Sample comparisons
    const sampleComparisons = [
      { 
        phoneId1: phoneIdsMap.get(1)!, // S24
        phoneId2: phoneIdsMap.get(3)!, // S24 Ultra
        viewCount: 5280
      },
      { 
        phoneId1: phoneIdsMap.get(1)!, // S24
        phoneId2: phoneIdsMap.get(7)!, // S23
        viewCount: 3450
      },
      { 
        phoneId1: phoneIdsMap.get(4)!, // A54
        phoneId2: phoneIdsMap.get(7)!, // S23
        viewCount: 2180
      },
      { 
        phoneId1: phoneIdsMap.get(3)!, // S24 Ultra
        phoneId2: phoneIdsMap.get(6)!, // Z Fold5
        viewCount: 7645
      },
      { 
        phoneId1: phoneIdsMap.get(5)!, // Z Flip5
        phoneId2: phoneIdsMap.get(1)!, // S24
        viewCount: 1920
      }
    ];

    const comparisonResults = await db.insert(comparisons).values(sampleComparisons).returning();
    console.log(`${comparisonResults.length} comparisons added to database`);

    // Sample guides
    const sampleGuides = [
      {
        title: "Ultimate Galaxy Camera Tips",
        description: "Master your Samsung Galaxy camera with these pro tips and tricks",
        content: "Samsung Galaxy phones are known for their exceptional camera capabilities...",
        imageUrl: "https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        createdAt: "2024-02-15",
        readTime: 5
      },
      {
        title: "One UI 6 Hidden Features",
        description: "Discover the hidden gems in Samsung's latest One UI 6 update",
        imageUrl: "https://images.unsplash.com/photo-1603539947369-c5fda2f3ddf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        content: "Samsung's One UI 6 is packed with features that might not be immediately obvious...",
        createdAt: "2024-01-20",
        readTime: 8
      },
      {
        title: "Maximizing Galaxy Battery Life",
        description: "Get more hours from your Galaxy phone with these battery optimization tips",
        imageUrl: "https://images.unsplash.com/photo-1611174275813-8e0e249f2fd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        content: "Battery life is crucial for modern smartphones, and Samsung Galaxy devices...",
        createdAt: "2024-03-05",
        readTime: 6
      }
    ];

    const guideResults = await db.insert(guides).values(sampleGuides).returning();
    console.log(`${guideResults.length} guides added to database`);

    console.log("Sample data initialization complete");
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
