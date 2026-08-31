import express from "express";
import multer from "multer";
import { scanAndNotify } from "../controllers/scanController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// store image in memory (buffer), we don't need to save it to disk
const upload = multer({ storage: multer.memoryStorage() });

// protect this route so only logged-in users can send a notify request
router.post("/", protect, upload.single("plateImage"), scanAndNotify);

export default router;
