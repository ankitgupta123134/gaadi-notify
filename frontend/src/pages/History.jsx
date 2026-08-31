import { useEffect, useState } from "react";
import api from "../api";

function History() {
  const [incidents, setIncidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const query = statusFilter ? `?status=${statusFilter}` : "";
      const res = await api.get(`/incidents${query}`);
      setIncidents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleResolve = async (id) => {
    try {
      await api.patch(`/incidents/${id}/resolve`);
      fetchIncidents();
    } catch (err) {
      setError(err.response?.data?.message || "Could not resolve");
    }
  };

  return (
    <div className="history-page page-transition">
      <h2>Incident History</h2>

      <div className="filters">
        <label>Filter by status: </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="notified">Notified</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && incidents.length === 0 && <p>No incidents found.</p>}

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
              {incident.ocrConfidence !== undefined && (
                <p>OCR Confidence: {incident.ocrConfidence}%</p>
              )}
              <p className="date">{new Date(incident.createdAt).toLocaleString()}</p>
              {incident.status !== "resolved" && (
                <button onClick={() => handleResolve(incident._id)}>Mark Resolved</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;