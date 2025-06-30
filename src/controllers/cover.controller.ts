// controllers/cover.controller.ts
import { Request, Response } from "express";
import { getCoverDesign } from "../configs/cloudinary.config";

export const getCoverDesigns = async (req: Request, res: Response) => {
  try {
    const covers = await getCoverDesign();
    res.json({ covers });
  } catch (error) {
    console.error("Failed to fetch cover designs:", error);
    res.status(500).json({ error: "Failed to load cover designs" });
  }
};
