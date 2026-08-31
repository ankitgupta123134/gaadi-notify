import express from "express";
import { getAllIncidents, getAnalytics } from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/incidents", protect, adminOnly, getAllIncidents);
router.get("/analytics", protect, adminOnly, getAnalytics);

export default router;