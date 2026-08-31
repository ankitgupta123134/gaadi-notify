import Incident from "../models/Incident.js";

// @route GET /api/incidents
// Returns incidents where the logged-in user is the car owner
// Supports optional query filters: ?status=pending&from=2026-01-01&to=2026-12-31
export const getMyIncidents = async (req, res) => {
  try {
    const { status, from, to } = req.query;

    const filter = { ownerUser: req.userId };

    if (status) filter.status = status;

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const incidents = await Incident.find(filter).sort({ createdAt: -1 });

    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PATCH /api/incidents/:id/resolve
export const resolveIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    incident.status = "resolved";
    await incident.save();
    res.json(incident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/incidents/repeat-offenders
// Returns number plates that have been reported 3+ times
export const getRepeatOffenders = async (req, res) => {
  try {
    const results = await Incident.aggregate([
      { $group: { _id: "$numberPlate", count: { $sum: 1 } } },
      { $match: { count: { $gte: 3 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};