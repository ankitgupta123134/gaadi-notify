import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Scan from "./pages/Scan.jsx";
import History from "./pages/History.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import DeveloperBadge from "./components/DeveloperBadge";
import AnimatedBackground from "./components/AnimationBackground";
import SplashScreen from "./components/SplashScreen";
import { useState } from "react";
function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
      />
    );
  }
  return (
    <div className="app-container">
       <AnimatedBackground />
      <header className="site-header">
        <h1 className="brand">
          <span className="brand-icon">🚗</span> Gaadi Notify
        </h1>
        <nav className="nav-bar">
  <NavLink
    to="/scan"
    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
  >
    Scan
  </NavLink>

  <NavLink
    to="/history"
    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
  >
    History
  </NavLink>

  <NavLink
    to="/admin"
    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
  >
    Admin
  </NavLink>

  <NavLink
    to="/login"
    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
  >
    Login
  </NavLink>

  <NavLink
    to="/register"
    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
  >
    Register
  </NavLink>
</nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <DeveloperBadge />
    </div>
  );
}

export default App;