import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import Auth Models
import { users } from "./models/auth";
export * from "./models/auth";
export * from "./models/chat";

// === TABLE DEFINITIONS ===

export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Links to auth users.id (which is a string)
  name: text("name").notNull(),
  location: text("location").notNull(),
  size: doublePrecision("size").notNull(), // in acres/hectares
  sizeUnit: text("size_unit").default("acres").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fields = pgTable("fields", {
  id: serial("id").primaryKey(),
  farmId: integer("farm_id").notNull(),
  name: text("name").notNull(),
  area: doublePrecision("area").notNull(),
  soilType: text("soil_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  fieldId: integer("field_id").notNull(),
  name: text("name").notNull(), // e.g., "Wheat", "Corn"
  variety: text("variety"),
  sowingDate: timestamp("sowing_date").notNull(),
  expectedHarvestDate: timestamp("expected_harvest_date"),
  actualHarvestDate: timestamp("actual_harvest_date"),
  status: text("status").default("active").notNull(), // active, harvested, failed
  yieldAmount: doublePrecision("yield_amount"), // optional, filled on harvest
  yieldUnit: text("yield_unit"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  fieldId: integer("field_id").notNull(), // Activity can be field-level
  cropId: integer("crop_id"), // Optional: specific to a crop cycle
  type: text("type").notNull(), // sowing, irrigation, fertilization, harvesting, scouting, other
  date: timestamp("date").notNull(),
  notes: text("notes"),
  details: jsonb("details"), // { amount: 10, unit: "kg", product: "Urea" } etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const advisories = pgTable("advisories", {
  id: serial("id").primaryKey(),
  cropId: integer("crop_id"), // Linked to a specific crop context if applicable
  fieldId: integer("field_id"), // Or just a field
  title: text("title").notNull(),
  content: text("content").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});

// === RELATIONS ===

export const farmsRelations = relations(farms, ({ one, many }) => ({
  fields: many(fields),
}));

export const fieldsRelations = relations(fields, ({ one, many }) => ({
  farm: one(farms, {
    fields: [fields.farmId],
    references: [farms.id],
  }),
  crops: many(crops),
  activities: many(activities),
}));

export const cropsRelations = relations(crops, ({ one, many }) => ({
  field: one(fields, {
    fields: [crops.fieldId],
    references: [fields.id],
  }),
  activities: many(activities),
  advisories: many(advisories),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  field: one(fields, {
    fields: [activities.fieldId],
    references: [fields.id],
  }),
  crop: one(crops, {
    fields: [activities.cropId],
    references: [crops.id],
  }),
}));

export const advisoriesRelations = relations(advisories, ({ one }) => ({
  crop: one(crops, {
    fields: [advisories.cropId],
    references: [crops.id],
  }),
  field: one(fields, {
    fields: [advisories.fieldId],
    references: [fields.id],
  }),
}));

// === INSERTS & SCHEMAS ===

export const insertFarmSchema = createInsertSchema(farms).omit({ id: true, createdAt: true });
export const insertFieldSchema = createInsertSchema(fields).omit({ id: true, createdAt: true });
export const insertCropSchema = createInsertSchema(crops).omit({ id: true, createdAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });
export const insertAdvisorySchema = createInsertSchema(advisories).omit({ id: true, generatedAt: true });

// === TYPES ===

export type Farm = typeof farms.$inferSelect;
export type InsertFarm = z.infer<typeof insertFarmSchema>;

export type Field = typeof fields.$inferSelect;
export type InsertField = z.infer<typeof insertFieldSchema>;

export type Crop = typeof crops.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Advisory = typeof advisories.$inferSelect;
export type InsertAdvisory = z.infer<typeof insertAdvisorySchema>;

// === API DTOs ===

// Request types
export type CreateFarmRequest = InsertFarm;
export type UpdateFarmRequest = Partial<InsertFarm>;

export type CreateFieldRequest = InsertField;
export type UpdateFieldRequest = Partial<InsertField>;

export type CreateCropRequest = InsertCrop;
export type UpdateCropRequest = Partial<InsertCrop>;

export type CreateActivityRequest = InsertActivity;
export type UpdateActivityRequest = Partial<InsertActivity>;

// Response types (can be extended to include relations)
export type FarmResponse = Farm & { fields?: Field[] };
export type FieldResponse = Field & { crops?: Crop[] };
export type CropResponse = Crop & { activities?: Activity[] };
