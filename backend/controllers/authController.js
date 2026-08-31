import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Incident from "../models/Incident.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, numberPlate } = req.body;

    if (!name || !email || !password || !phone || !numberPlate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const plateFormatted = numberPlate.replace(/\s+/g, "").toUpperCase();

    const existingUser = await User.findOne({
      $or: [{ email }, { numberPlate: plateFormatted }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or number plate already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      numberPlate: plateFormatted,
    });

    
        // Normalizes common OCR mix-ups: O<->0 and I/L<->1
    const normalize = (plate) => plate.replace(/O/g, "0").replace(/I|L/g, "1");

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

    // Link any past "pending" incidents (reported before this owner existed
    // on the platform) to this new account, and notify them retroactively.
    // Uses fuzzy matching since OCR text may not exactly match the plate
    // the owner typed in manually.
    const orphanIncidents = await Incident.find({ ownerUser: { $exists: false } });
    const normalizedPlate = normalize(plateFormatted);

    const matchedIncidents = orphanIncidents.filter((incident) => {
      const normalizedIncidentPlate = normalize(incident.numberPlate);
      return editDistance(normalizedIncidentPlate, normalizedPlate) <= 2;
    });

    if (matchedIncidents.length > 0) {
      const idsToUpdate = matchedIncidents.map((i) => i._id);
      await Incident.updateMany(
        { _id: { $in: idsToUpdate } },
        { $set: { ownerUser: user._id, status: "notified" } }
      );
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      numberPlate: user.numberPlate,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      pastIncidentsLinked: matchedIncidents.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      numberPlate: user.numberPlate,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};