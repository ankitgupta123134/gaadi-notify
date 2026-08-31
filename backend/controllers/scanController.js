import Tesseract from "tesseract.js";
import User from "../models/User.js";
import Incident from "../models/Incident.js";
import { sendNotificationEmail } from "../utils/sendEmail.js";

const cleanPlateText = (text) => {
  return text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
};

const editDistance = (a, b) => {
  const dp = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[a.length][b.length];
};

const normalize = (plate) => plate.replace(/O/g, "0").replace(/I|L/g, "1");

export const scanAndNotify = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // location comes from frontend (optional)
    const { lat, lng } = req.body;

    const {
      data: { text, confidence },
    } = await Tesseract.recognize(req.file.buffer, "eng");

    const detectedPlate = cleanPlateText(text);

    // convert uploaded image to base64 for evidence storage
    const evidencePhoto = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    if (!detectedPlate) {
      return res.status(422).json({
        message: "Could not read a number plate from this image. Try a clearer photo.",
      });
    }

    let owner = await User.findOne({ numberPlate: detectedPlate });

    if (!owner) {
      const allUsers = await User.find({});
      const normalizedDetected = normalize(detectedPlate);
      let bestMatch = null;
      let bestDistance = Infinity;

      allUsers.forEach((u) => {
        const normalizedStored = normalize(u.numberPlate);
        const distance = editDistance(normalizedStored, normalizedDetected);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestMatch = u;
        }
      });

      if (bestMatch && bestDistance <= 2) owner = bestMatch;
    }

    // Create incident record regardless of match — this is our audit trail
    const incident = await Incident.create({
      numberPlate: owner ? owner.numberPlate : detectedPlate,
      ownerUser: owner ? owner._id : undefined,
      ocrConfidence: Math.round(confidence),
      evidencePhoto,
      location: lat && lng ? { lat, lng } : undefined,
      status: owner ? "notified" : "pending",
    });

    if (!owner) {
      return res.status(404).json({
        message: "This number plate is not registered on Gaadi Notify.",
        detectedPlate,
        incidentId: incident._id,
      });
    }

    console.log(
      `[NOTIFY] Owner ${owner.name} (${owner.phone}) - your car ${owner.numberPlate} is blocking someone.`
    );


   sendNotificationEmail(owner.email, owner.name, owner.numberPlate);

    res.json({
      message: "Owner has been notified successfully.",
      detectedPlate,
      confidence: Math.round(confidence),
      incidentId: incident._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};