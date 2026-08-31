import { useEffect, useState } from "react";
import "./AnimationBackground.css";

const particles = Array.from({ length: 18 });

export default function AnimatedBackground() {
  const [mouse, setMouse] = useState({
    x: 50,
    y: 50,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="animated-background">

      {/* Aurora */}
      <div className="aurora aurora-one"></div>
      <div className="aurora aurora-two"></div>
      <div className="aurora aurora-three"></div>

      {/* Grid */}
      <div className="digital-grid"></div>

      {/* Particles */}
      <div className="particles">
        {particles.map((_, index) => (
          <span
            key={index}
            className="particle"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 53) % 100}%`,
              animationDelay: `${index * -0.6}s`,
              animationDuration: `${6 + index * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* Cursor Glow */}
      <div
        className="cursor-glow"
        style={{
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
        }}
      />

    </div>
  );
}