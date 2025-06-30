// routes/cover.routes.ts
import express from "express";
import { getCoverDesigns } from "../controllers/cover.controller";

const router = express.Router();

router.get("/", getCoverDesigns);

export default router;
