import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * SuccessCelebration — A classy, celebratory success state with
 * radial burst particles, pulsing glow, and staggered entrance.
 * 
 * Drop-in replacement for the green-circle + text pattern used
 * across all modals (ApplicationModal, ReferralFormModal,
 * RespondModal, CreateJobPage, CreateProjectPage, etc.)
 */

interface SuccessCelebrationProps {
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

/* ── Particle burst configuration ── */

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  shape: 'circle' | 'square' | 'diamond';
}

const BRAND_COLORS = [
  '#1e40af', // Royal Blue
  '#14b8a6', // Teal
  '#3b82f6', // Blue 500
  '#10b981', // Emerald 500
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#0d9488', // Teal 600
  '#2563eb', // Blue 600
];

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const distance = 60 + Math.random() * 100;
    particles.push({
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 3 + Math.random() * 5,
      color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
      delay: Math.random() * 0.3,
      duration: 0.6 + Math.random() * 0.4,
      shape: (['circle', 'square', 'diamond'] as const)[Math.floor(Math.random() * 3)],
    });
  }
  return particles;
}

/* ── Sparkle ring dots ── */
function generateRingDots(count: number): { angle: number; delay: number; size: number }[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * 360,
    delay: i * 0.05,
    size: 2 + Math.random() * 2,
  }));
}

export function SuccessCelebration({
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: SuccessCelebrationProps) {
  const [show, setShow] = useState(false);
  const [particles] = useState(() => generateParticles(24));
  const [ringDots] = useState(() => generateRingDots(12));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center text-center w-full max-w-md mx-auto px-2">
      {/* ── Celebration icon area ── */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        {/* Pulsing glow rings */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 50%, transparent 70%)',
            animation: show ? 'celebration-glow 2s ease-in-out infinite' : 'none',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 96,
            height: 96,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(16,185,129,0.12)',
            animation: show ? 'celebration-ring-expand 1.5s ease-out forwards' : 'none',
            opacity: 0,
          }}
        />

        {/* Burst particles */}
        {show && particles.map((p) => {
          const shapeStyle: React.CSSProperties = {
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : '1px',
            transform: p.shape === 'diamond' ? 'rotate(45deg)' : undefined,
            top: '50%',
            left: '50%',
            opacity: 0,
            animation: `celebration-burst ${p.duration}s ease-out ${p.delay}s forwards`,
            // Custom properties for the animation
            '--burst-x': `${p.x}px`,
            '--burst-y': `${p.y}px`,
          } as React.CSSProperties;

          return <div key={p.id} style={shapeStyle} />;
        })}

        {/* Sparkle ring */}
        {show && ringDots.map((dot, i) => (
          <div
            key={`ring-${i}`}
            className="absolute"
            style={{
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              backgroundColor: BRAND_COLORS[i % BRAND_COLORS.length],
              top: '50%',
              left: '50%',
              opacity: 0,
              animation: `celebration-sparkle-ring 1.8s ease-out ${0.2 + dot.delay}s forwards`,
              '--ring-angle': `${dot.angle}deg`,
              '--ring-radius': '52px',
            } as React.CSSProperties}
          />
        ))}

        {/* Main icon */}
        <div
          ref={containerRef}
          className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
            boxShadow: '0 8px 32px rgba(16,185,129,0.25), 0 0 0 6px rgba(16,185,129,0.08)',
            transform: show ? 'scale(1)' : 'scale(0.3)',
            opacity: show ? 1 : 0,
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out',
          }}
        >
          <CheckCircle2
            size={36}
            className="text-emerald-600"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.3))',
            }}
          />
        </div>
      </div>

      {/* ── Text content ── */}
      <div
        style={{
          transform: show ? 'translateY(0)' : 'translateY(12px)',
          opacity: show ? 1 : 0,
          transition: 'transform 0.5s ease-out 0.2s, opacity 0.5s ease-out 0.2s',
        }}
      >
        <p className="text-gray-900 mb-2" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>
          {title}
        </p>
        <p className="text-gray-500 mb-8" style={{ fontSize: 14, lineHeight: 1.7 }}>
          {subtitle}
        </p>
      </div>

      {/* ── Actions ── */}
      <div
        className="flex flex-col gap-2.5 w-full"
        style={{
          transform: show ? 'translateY(0)' : 'translateY(16px)',
          opacity: show ? 1 : 0,
          transition: 'transform 0.5s ease-out 0.35s, opacity 0.5s ease-out 0.35s',
        }}
      >
        <button
          onClick={onAction}
          className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-semibold hover:bg-brand-primary/90 transition-all active:scale-[0.98] shadow-sm"
          style={{ fontSize: 14 }}
        >
          {actionLabel}
        </button>
        {secondaryLabel && onSecondary && (
          <button
            onClick={onSecondary}
            className="w-full py-3 rounded-xl font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
            style={{ fontSize: 13 }}
          >
            {secondaryLabel}
          </button>
        )}
      </div>

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes celebration-glow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        @keyframes celebration-ring-expand {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          50% { opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }

        @keyframes celebration-burst {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          60% {
            opacity: 0.8;
          }
          100% {
            transform: translate(
              calc(-50% + var(--burst-x)),
              calc(-50% + var(--burst-y))
            ) scale(1);
            opacity: 0;
          }
        }

        @keyframes celebration-sparkle-ring {
          0% {
            transform: translate(-50%, -50%) rotate(var(--ring-angle)) translateX(0px) scale(0);
            opacity: 0;
          }
          30% {
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--ring-angle)) translateX(var(--ring-radius)) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
