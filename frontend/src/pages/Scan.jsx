import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Scan() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setStatus("");
    }
  };

  // wraps the browser's geolocation API in a promise so we can await it
  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 15000, enableHighAccuracy: false }
      );
    });
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setStatus("");

    try {
      const location = await getLocation();

      const formData = new FormData();
      formData.append("plateImage", image);
      if (location) {
        formData.append("lat", location.lat);
        formData.append("lng", location.lng);
      }

      const res = await api.post("/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus(`✅ ${res.data.message} (Detected: ${res.data.detectedPlate})`);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      const detected = err.response?.data?.detectedPlate;
      setStatus(
        `❌ ${err.response?.data?.message || "Something went wrong"}${
          detected ? ` (OCR ne padha: ${detected})` : ""
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-card page-transition">
      <h2>Scan a Number Plate</h2>
      <p className="subtitle">
        Take or upload a photo of the plate. We'll notify the owner — their phone number
        is never shown to you.
      </p>

      <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} />

      {preview && <img src={preview} alt="preview" className="preview-img" />}

      <button onClick={handleScan} disabled={!image || loading}>
        {loading ? "Scanning..." : "Scan & Notify Owner"}
      </button>

      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default Scan;