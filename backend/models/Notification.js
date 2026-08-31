import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    numberPlate: { type: String, required: true, uppercase: true },
    ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, default: "Your car is blocking someone. Please move it." },
    status: {
      type: String,
      enum: ["sent", "no_owner_found"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
