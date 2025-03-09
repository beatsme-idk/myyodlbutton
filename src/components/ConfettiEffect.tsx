
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  size: number;
  color: string;
  delay: number;
}

const ConfettiEffect = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    const colors = ["#FF5A5F", "#FFB400", "#007A87", "#8CE071", "#7B0051", "#00D1C1"];
    const confettiCount = 150;
    const newConfetti: ConfettiPiece[] = [];
    
    for (let i = 0; i < confettiCount; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100, // Random position (0-100%)
        size: Math.random() * 0.7 + 0.3, // Random size (0.3-1)
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 3, // Random delay (0-3s)
      });
    }
    
    setConfetti(newConfetti);
    
    // Clear confetti after animation completes
    const timer = setTimeout(() => {
      setConfetti([]);
    }, 7000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: "-20px",
            width: `${piece.size * 15}px`,
            height: `${piece.size * 15}px`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            opacity: 0,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
