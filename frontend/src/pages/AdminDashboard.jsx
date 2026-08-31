import { useEffect, useState } from "react";
import api from "../api";

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [searchPlate, setSearchPlate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/admin/analytics");
      setAnalytics(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load analytics");
    }
  };

  const fetchIncidents = async () => {
    try {
      const params = new URLSearchParams();
      if (searchPlate) params.append("numberPlate", searchPlate);
      if (statusFilter) params.append("status", statusFilter);

      const res = await api.get(`/admin/incidents?${params.toString()}`);
      setIncidents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load incidents");
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIncidents();
  };

  const openMap = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-page page-transition">
      <h2>Admin Dashboard</h2>

      {analytics && (
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-number">{analytics.totalIncidents}</p>
            <p className="stat-label">Total Reports</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{analytics.pending}</p>
            <p className="stat-label">Pending</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{analytics.notified}</p>
            <p className="stat-label">Notified</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{analytics.resolved}</p>
            <p className="stat-label">Resolved</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{analytics.totalUsers}</p>
            <p className="stat-label">Total Users</p>
          </div>
        </div>
      )}

      {analytics?.mostReported?.length > 0 && (
        <div className="most-reported">
          <h3>Most Reported Vehicles</h3>
          <ul>
            {analytics.mostReported.map((item) => (
              <li key={item._id}>
                {item._id} — {item.count} reports
              </li>
            ))}
          </ul>
        </div>
      )}

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search by number plate"
          value={searchPlate}
          onChange={(e) => setSearchPlate(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="notified">Notified</option>
          <option value="resolved">Resolved</option>
        </select>
        <button type="submit">Search</button>
      </form>

      <div className="incident-list">
        {incidents.map((incident) => (
          <div key={incident._id} className="incident-card">
            {incident.evidencePhoto && (
              <img src={incident.evidencePhoto} alt="evidence" className="evidence-thumb" />
            )}
            <div className="incident-details">
              <p>
                <strong>{incident.numberPlate}</strong>
              </p>
              <p>Status: {incident.status}</p>
              {incident.ownerUser && (
                <p>
                  Owner: {incident.ownerUser.name} ({incident.ownerUser.email})
                </p>
              )}
              {incident.location?.lat && (
                <p>
                  📍{" "}
                  <span
                    onClick={() => openMap(incident.location.lat, incident.location.lng)}
                    style={{ color: "#4f8cff", cursor: "pointer", textDecoration: "underline" }}
                  >
                    View on map
                  </span>
                </p>
              )}
              <p className="date">{new Date(incident.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;