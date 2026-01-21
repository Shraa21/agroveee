import { db } from "./db";
import { 
  farms, fields, crops, activities, advisories,
  type InsertFarm, type InsertField, type InsertCrop, type InsertActivity, type InsertAdvisory,
  type Farm, type Field, type Crop, type Activity, type Advisory
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Farms
  getFarms(userId: string): Promise<Farm[]>;
  getFarm(id: number): Promise<Farm | undefined>;
  createFarm(farm: InsertFarm): Promise<Farm>;
  updateFarm(id: number, farm: Partial<InsertFarm>): Promise<Farm | undefined>;
  deleteFarm(id: number): Promise<void>;

  // Fields
  getFields(farmId: number): Promise<Field[]>;
  getField(id: number): Promise<Field | undefined>;
  createField(field: InsertField): Promise<Field>;
  updateField(id: number, field: Partial<InsertField>): Promise<Field | undefined>;
  deleteField(id: number): Promise<void>;

  // Crops
  getCrops(fieldId: number): Promise<Crop[]>;
  getCrop(id: number): Promise<Crop | undefined>;
  createCrop(crop: InsertCrop): Promise<Crop>;
  updateCrop(id: number, crop: Partial<InsertCrop>): Promise<Crop | undefined>;

  // Activities
  getActivities(filters?: { fieldId?: number; cropId?: number }): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Advisories
  getAdvisories(filters?: { fieldId?: number; cropId?: number }): Promise<Advisory[]>;
  createAdvisory(advisory: InsertAdvisory): Promise<Advisory>;
}

export class DatabaseStorage implements IStorage {
  // Farms
  async getFarms(userId: string): Promise<Farm[]> {
    return await db.select().from(farms).where(eq(farms.userId, userId));
  }

  async getFarm(id: number): Promise<Farm | undefined> {
    const [farm] = await db.select().from(farms).where(eq(farms.id, id));
    return farm;
  }

  async createFarm(insertFarm: InsertFarm): Promise<Farm> {
    const [farm] = await db.insert(farms).values(insertFarm).returning();
    return farm;
  }

  async updateFarm(id: number, updateFarm: Partial<InsertFarm>): Promise<Farm | undefined> {
    const [updated] = await db.update(farms).set(updateFarm).where(eq(farms.id, id)).returning();
    return updated;
  }

  async deleteFarm(id: number): Promise<void> {
    await db.delete(farms).where(eq(farms.id, id));
  }

  // Fields
  async getFields(farmId: number): Promise<Field[]> {
    return await db.select().from(fields).where(eq(fields.farmId, farmId));
  }

  async getField(id: number): Promise<Field | undefined> {
    const [field] = await db.select().from(fields).where(eq(fields.id, id));
    return field;
  }

  async createField(insertField: InsertField): Promise<Field> {
    const [field] = await db.insert(fields).values(insertField).returning();
    return field;
  }

  async updateField(id: number, updateField: Partial<InsertField>): Promise<Field | undefined> {
    const [updated] = await db.update(fields).set(updateField).where(eq(fields.id, id)).returning();
    return updated;
  }

  async deleteField(id: number): Promise<void> {
    await db.delete(fields).where(eq(fields.id, id));
  }

  // Crops
  async getCrops(fieldId: number): Promise<Crop[]> {
    return await db.select().from(crops).where(eq(crops.fieldId, fieldId));
  }

  async getCrop(id: number): Promise<Crop | undefined> {
    const [crop] = await db.select().from(crops).where(eq(crops.id, id));
    return crop;
  }

  async createCrop(insertCrop: InsertCrop): Promise<Crop> {
    const [crop] = await db.insert(crops).values(insertCrop).returning();
    return crop;
  }

  async updateCrop(id: number, updateCrop: Partial<InsertCrop>): Promise<Crop | undefined> {
    const [updated] = await db.update(crops).set(updateCrop).where(eq(crops.id, id)).returning();
    return updated;
  }

  // Activities
  async getActivities(filters?: { fieldId?: number; cropId?: number }): Promise<Activity[]> {
    let query = db.select().from(activities).orderBy(desc(activities.date));
    
    if (filters?.fieldId) {
      query.where(eq(activities.fieldId, filters.fieldId));
    }
    if (filters?.cropId) {
      query.where(eq(activities.cropId, filters.cropId));
    }
    
    return await query;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(insertActivity).returning();
    return activity;
  }

  // Advisories
  async getAdvisories(filters?: { fieldId?: number; cropId?: number }): Promise<Advisory[]> {
    // For now, simple list. Could filter if needed.
    return await db.select().from(advisories).orderBy(desc(advisories.generatedAt));
  }

  async createAdvisory(insertAdvisory: InsertAdvisory): Promise<Advisory> {
    const [advisory] = await db.insert(advisories).values(insertAdvisory).returning();
    return advisory;
  }
}

export const storage = new DatabaseStorage();
