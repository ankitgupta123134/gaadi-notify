import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    numberPlate: { type: String, required: true, uppercase: true },
    ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // OCR result details
    ocrConfidence: { type: Number }, // 0-100, how sure Tesseract was

    // Evidence photo (stored as base64 for simplicity — no cloud storage needed)
    evidencePhoto: { type: String },

    // Where the incident was reported from
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },

    status: {
      type: String,
      enum: ["pending", "notified", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Incident", incidentSchema);