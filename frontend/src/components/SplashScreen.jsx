import { useEffect, useState } from "react";
import "./SplashScreen.css";

export default function SplashScreen({ onFinish }) {
  const [loading, setLoading] = useState(0);
  useEffect(() => {
  const interval = setInterval(() => {
    setLoading((prev) => {
      if (prev >= 100) {
        clearInterval(interval);
        return 100;
      }

      return prev + 1;
    });
  }, 30);

  const timer = setTimeout(() => {
    onFinish();
  }, 3000);

  return () => {
    clearInterval(interval);
    clearTimeout(timer);
  };
}, [onFinish]);  
  
  return (
    <div className="splash-screen">

      {/* Background glow */}
      <div className="splash-glow splash-glow-one"></div>
      <div className="splash-glow splash-glow-two"></div>

      <div className="splash-content">

        {/* Car Icon */}
        <div className="splash-car">
          🚗
        </div>

        {/* Logo */}
        <h1 className="splash-title">
          Gaadi <span>Notify</span>
        </h1>

        <p className="splash-subtitle">
          Vehicle Intelligence Platform
        </p>

        {/* Loading */}
        <div className="splash-loader">

          <div className="loader-track">
            <div
              className="loader-progress"
              style={{ width: `${loading}%` }}
            ></div>
          </div>

          <div className="loader-info">
            <span>Initializing system...</span>
            <span>{loading}%</span>
          </div>

        </div>

        {/* Bottom text */}
        <div className="splash-status">
          <span className="status-pulse"></span>
          Secure • Smart • Private
        </div>

      </div>
    </div>
  );
}