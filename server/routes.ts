import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { openai } from "./replit_integrations/audio/client"; // Use configured openai client

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // === FARMS ===

  app.get(api.farms.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    let farmsList = await storage.getFarms(userId);

    // SEED DATA FOR NEW USERS
    if (farmsList.length === 0) {
      console.log("Seeding data for new user:", userId);
      const farm = await storage.createFarm({
        userId,
        name: "Green Valley Farm",
        location: "California, USA",
        size: 150,
        sizeUnit: "acres",
      });

      const field1 = await storage.createField({
        farmId: farm.id,
        name: "North Field",
        area: 50,
        soilType: "Loam",
      });

      const field2 = await storage.createField({
        farmId: farm.id,
        name: "South Pasture",
        area: 100,
        soilType: "Clay",
      });

      await storage.createCrop({
        fieldId: field1.id,
        name: "Corn",
        variety: "Golden Harvest",
        sowingDate: new Date("2024-04-15"),
        status: "active",
      });

      await storage.createCrop({
        fieldId: field2.id,
        name: "Wheat",
        variety: "Winter Red",
        sowingDate: new Date("2023-11-10"),
        status: "harvested",
        actualHarvestDate: new Date("2024-06-20"),
        yieldAmount: 4.5,
        yieldUnit: "tons/acre"
      });
      
      await storage.createActivity({
        fieldId: field1.id,
        type: "sowing",
        date: new Date("2024-04-15"),
        notes: "Sowed corn seeds under optimal conditions.",
      });

      await storage.createActivity({
        fieldId: field1.id,
        type: "irrigation",
        date: new Date("2024-05-01"),
        notes: "Drip irrigation applied.",
      });

      // Refetch to include seeded data
      farmsList = await storage.getFarms(userId);
    }

    res.json(farmsList);
  });

  app.post(api.farms.create.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const input = api.farms.create.input.parse(req.body);
      const farm = await storage.createFarm({ ...input, userId });
      res.status(201).json(farm);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.farms.get.path, isAuthenticated, async (req, res) => {
    const farmId = Number(req.params.id);
    const farm = await storage.getFarm(farmId);
    if (!farm) return res.status(404).json({ message: "Farm not found" });
    
    // Check ownership
    const userId = (req.user as any).claims.sub;
    if (farm.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

    const fields = await storage.getFields(farmId);
    res.json({ ...farm, fields });
  });

  app.put(api.farms.update.path, isAuthenticated, async (req, res) => {
    const farmId = Number(req.params.id);
    const farm = await storage.getFarm(farmId);
    if (!farm) return res.status(404).json({ message: "Farm not found" });

    const userId = (req.user as any).claims.sub;
    if (farm.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

    const input = api.farms.update.input.parse(req.body);
    const updated = await storage.updateFarm(farmId, input);
    res.json(updated);
  });

  app.delete(api.farms.delete.path, isAuthenticated, async (req, res) => {
    const farmId = Number(req.params.id);
    const farm = await storage.getFarm(farmId);
    if (!farm) return res.status(404).json({ message: "Farm not found" });

    const userId = (req.user as any).claims.sub;
    if (farm.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

    await storage.deleteFarm(farmId);
    res.status(204).send();
  });

  // === FIELDS ===

  app.get(api.fields.list.path, isAuthenticated, async (req, res) => {
    const farmId = Number(req.params.farmId);
    // TODO: Verify farm ownership
    const fields = await storage.getFields(farmId);
    res.json(fields);
  });

  app.post(api.fields.create.path, isAuthenticated, async (req, res) => {
    const farmId = Number(req.params.farmId);
    const input = api.fields.create.input.parse(req.body);
    const field = await storage.createField({ ...input, farmId });
    res.status(201).json(field);
  });

  app.get(api.fields.get.path, isAuthenticated, async (req, res) => {
    const id = Number(req.params.id);
    const field = await storage.getField(id);
    if (!field) return res.status(404).json({ message: "Field not found" });
    res.json(field);
  });

  // === CROPS ===

  app.get(api.crops.list.path, isAuthenticated, async (req, res) => {
    const fieldId = Number(req.params.fieldId);
    const crops = await storage.getCrops(fieldId);
    res.json(crops);
  });

  app.post(api.crops.create.path, isAuthenticated, async (req, res) => {
    const fieldId = Number(req.params.fieldId);
    const input = api.crops.create.input.parse(req.body);
    const crop = await storage.createCrop({ ...input, fieldId });
    res.status(201).json(crop);
  });

  // === ACTIVITIES ===

  app.get(api.activities.list.path, isAuthenticated, async (req, res) => {
    const fieldId = req.query.fieldId ? Number(req.query.fieldId) : undefined;
    const cropId = req.query.cropId ? Number(req.query.cropId) : undefined;
    const activities = await storage.getActivities({ fieldId, cropId });
    res.json(activities);
  });

  app.post(api.activities.create.path, isAuthenticated, async (req, res) => {
    const input = api.activities.create.input.parse(req.body);
    const activity = await storage.createActivity(input);
    res.status(201).json(activity);
  });

  // === ADVISORIES ===

  app.get(api.advisories.list.path, isAuthenticated, async (req, res) => {
    const advisories = await storage.getAdvisories();
    res.json(advisories);
  });

  app.post(api.advisories.generate.path, isAuthenticated, async (req, res) => {
    try {
      const { fieldId, cropId, context } = req.body;
      
      // Construct prompt for AI
      const prompt = `
        You are an expert agricultural advisor.
        Provide actionable farming advice based on the following context:
        ${context ? `Context: ${context}` : ''}
        ${fieldId ? `Field ID: ${fieldId}` : ''}
        ${cropId ? `Crop ID: ${cropId}` : ''}
        
        Focus on practical steps for sowing, irrigation, pest control, or harvest.
        Keep it concise and relevant to the crop cycle stage.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        max_completion_tokens: 500,
      });

      const adviceContent = response.choices[0]?.message?.content || "No advice generated.";
      const title = "AI Advisory"; // Could ask AI to generate a title too

      const advisory = await storage.createAdvisory({
        fieldId,
        cropId,
        title,
        content: adviceContent,
        isRead: false,
      });

      res.status(201).json(advisory);
    } catch (error: any) {
      console.error("AI Advisory Error:", error);
      res.status(500).json({ message: "Failed to generate advisory" });
    }
  });

  return httpServer;
}
