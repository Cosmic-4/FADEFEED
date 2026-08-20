import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

interface LoadingStage {
  label: string;
  duration: number;
}

const STAGES: LoadingStage[] = [
  { label: 'Initializing feed...', duration: 1000 },
  { label: 'Loading content pipeline...', duration: 1500 },
  { label: 'Buffering video streams...', duration: 2000 },
  { label: 'Calibrating adaptive friction...', duration: 2500 },
  { label: 'Preparing your experience...', duration: 3000 },
];

const TOTAL_DURATION = STAGES.reduce((sum, s) => sum + s.duration, 0);

export default function Preloader({ onComplete }: PreloaderProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const mountedRef = useRef(true);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    let elapsed = 0;
    let lastFrame = performance.now();
    let animId: number;

    const tick = (now: number) => {
      if (!mountedRef.current) return;

      const delta = now - lastFrame;
      lastFrame = now;
      elapsed += delta;

      const overallProgress = Math.min(100, (elapsed / TOTAL_DURATION) * 100);
      setProgress(overallProgress);

      let accumulated = 0;
      for (let i = 0; i < STAGES.length; i++) {
        accumulated += STAGES[i].duration;
        if (elapsed < accumulated) {
          setCurrentStage(i);
          break;
        }
      }

      if (elapsed >= TOTAL_DURATION) {
        setIsComplete(true);
        completeTimerRef.current = setTimeout(() => {
          if (mountedRef.current) onComplete();
        }, 800);
        return;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(animId);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0b]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />

          <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
            <svg width="100%" height="100%">
              <filter id="grain-preload">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#grain-preload)" />
            </svg>
          </div>

          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                <motion.circle
                  cx="40" cy="40" r="36" fill="none"
                  stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray="226" strokeDashoffset="170"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: 'center' }}
                />
                <motion.circle
                  cx="40" cy="40" r="24" fill="none"
                  stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round"
                  strokeDasharray="150" strokeDashoffset="100"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: 'center' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/60 text-xs font-mono tabular-nums">
                  {Math.round(progress)}
                </span>
              </div>
            </div>

            <motion.h1
              className="text-3xl md:text-4xl font-light tracking-[-0.04em] text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              FADEFEED
            </motion.h1>

            <div className="w-48 h-[1px] bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-white/50"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentStage}
                className="text-[#555] text-xs font-mono tracking-wider"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {STAGES[currentStage]?.label}
              </motion.p>
            </AnimatePresence>

            <div className="flex flex-col gap-1 mt-2">
              {STAGES.slice(0, currentStage + 1).map((stage, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 text-[10px] font-mono"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className={i < currentStage ? 'text-emerald-500/60' : 'text-white/30'}>
                    {i < currentStage ? '[OK]' : '[..]'}
                  </span>
                  <span className="text-white/20">{stage.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
