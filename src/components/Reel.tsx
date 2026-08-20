import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Reel } from '../lib/reelData';
import type { FrictionLevel } from '../lib/frictionEngine';
import { getFrictionBlur } from '../lib/frictionEngine';
import ReelControls from './ReelControls';

interface ReelProps {
  reel: Reel;
  isActive: boolean;
  frictionLevel: FrictionLevel;
  isMuted: boolean;
  onToggleMute: () => void;
  onWatchUpdate: () => void;
  showReflection: boolean;
}

const REEL_GRADIENTS: [string, string][] = [
  ['#1a1a2e', '#16213e'],
  ['#0f3460', '#533483'],
  ['#2c003e', '#512b58'],
];

export default function Reel({ reel, isActive, frictionLevel, isMuted, onToggleMute, onWatchUpdate, showReflection }: ReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const blur = getFrictionBlur(frictionLevel);
  const gradient = REEL_GRADIENTS[(reel.id - 1) % REEL_GRADIENTS.length];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isActive && !showReflection) {
      v.play().catch(() => {
        setVideoFailed(true);
      });
    } else {
      v.pause();
    }
  }, [isActive, showReflection]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleTimeUpdate = () => {
      if (v.duration) {
        setProgress((v.currentTime / v.duration) * 100);
      }
    };

    v.addEventListener('timeupdate', handleTimeUpdate);
    return () => v.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(onWatchUpdate, 1000);
    return () => clearInterval(interval);
  }, [isActive, onWatchUpdate]);

  const handleClick = useCallback(() => {
    if (videoFailed || !videoLoaded) return;
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [videoFailed, videoLoaded]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        preload={isActive ? 'auto' : 'metadata'}
        onError={() => setVideoFailed(true)}
        onLoadedData={() => setVideoLoaded(true)}
        style={{
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          transition: 'filter 0.8s ease',
          display: videoFailed || !videoLoaded ? 'none' : 'block',
        }}
        onClick={handleClick}
      />

      {(videoFailed || !videoLoaded) && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            filter: blur > 0 ? `blur(${blur}px)` : undefined,
            transition: 'filter 0.8s ease',
          }}
        >
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center"
              style={{
                animation: 'pulse-ring 3s ease-in-out infinite',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-6 h-6 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${40 + i * 20}px`,
                  height: `${40 + i * 20}px`,
                  left: `${15 + i * 12}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  background: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)`,
                  animation: `breathe ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          background: frictionLevel >= 2
            ? `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${0.1 + frictionLevel * 0.05}) 100%)`
            : undefined,
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-10" />

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
            {reel.username.charAt(1).toUpperCase()}
          </div>
          <span className="text-white text-sm font-medium">{reel.username}</span>
        </div>
        <button className="text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>
      </div>

      <ReelControls
        reel={reel}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onLike={() => setIsLiked(!isLiked)}
        isLiked={isLiked}
      />

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
        <motion.div
          className="h-full bg-white/70"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  );
}
