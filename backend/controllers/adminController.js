import Incident from "../models/Incident.js";
import User from "../models/User.js";

// @route GET /api/admin/incidents
// Supports: ?numberPlate=UK07&status=pending&from=...&to=...
export const getAllIncidents = async (req, res) => {
  try {
    const { numberPlate, status, from, to } = req.query;
    const filter = {};

    if (numberPlate) {
      filter.numberPlate = { $regex: numberPlate.toUpperCase(), $options: "i" };
    }
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const incidents = await Incident.find(filter)
      .populate("ownerUser", "name email phone")
      .sort({ createdAt: -1 });

    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/admin/analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalIncidents = await Incident.countDocuments();
    const pending = await Incident.countDocuments({ status: "pending" });
    const notified = await Incident.countDocuments({ status: "notified" });
    const resolved = await Incident.countDocuments({ status: "resolved" });
    const totalUsers = await User.countDocuments();

    const mostReported = await Incident.aggregate([
      { $group: { _id: "$numberPlate", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalIncidents,
      pending,
      notified,
      resolved,
      totalUsers,
      mostReported,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};