import express from "express";
import {
  getMyIncidents,
  resolveIncident,
  getRepeatOffenders,
} from "../controllers/incidentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyIncidents);
router.patch("/:id/resolve", protect, resolveIncident);
router.get("/repeat-offenders", protect, getRepeatOffenders);

export default router;