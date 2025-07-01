import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

/**
 * FloatingParticles Component
 * 
 * Creates animated floating particles in the background with theme-aware colors.
 * Particles have different colors and animations for light and dark modes.
 */
export const FloatingParticles: React.FC = () => {
  const { isDark } = useTheme();

  // Generate random particles with theme-aware colors
  const particles: Particle[] = React.useMemo(() => {
    const lightColors = ['#FFD1DC', '#B5EAD7', '#C7CEEA', '#F8BBD9', '#E4C1F9'];
    const darkColors = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
    const colors = isDark ? darkColors : lightColors;
    
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: isDark ? 0.4 : 0.6,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 1],
            opacity: isDark ? [0.4, 0.6, 0.4] : [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Additional sparkle effects with theme awareness */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, isDark ? 0.8 : 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
              fill={isDark ? "#ec4899" : "#FFD1DC"}
              opacity={isDark ? "0.6" : "0.8"}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};