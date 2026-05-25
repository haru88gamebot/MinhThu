import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 12 + 4,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20, // Negative delay to start immediately at random points
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/40 blur-[1px]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}vw`,
            top: `${p.y}vh`,
          }}
          animate={{
            y: ["0vh", "-100vh"],
            x: ["0vw", "5vw", "-5vw", "0vw"],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
