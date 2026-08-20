import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateFeedOrder } from '../lib/reelData';
import type { Reel as ReelData } from '../lib/reelData';
import {
  createSession,
  onReelViewed,
  getFrictionDelay,
} from '../lib/frictionEngine';
import type { SessionData, FrictionLevel } from '../lib/frictionEngine';
import ReelComponent from './Reel';
import ReflectionOverlay, { getRandomMessage } from './ReflectionOverlay';
import SessionInsights from './SessionInsights';
import DemoControls from './DemoControls';

const INSIGHTS_INTERVAL = 10;
const REFLECTION_COOLDOWN_MS = 8000;

function BufferingOverlay({ visible, level }: { visible: boolean; level: FrictionLevel }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Darkened backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Buffering spinner */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                <motion.circle
                  cx="28" cy="28" r="24" fill="none"
                  stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray="150" strokeDashoffset="110"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: 'center' }}
                />
                {level >= 3 && (
                  <motion.circle
                    cx="28" cy="28" r="16" fill="none"
                    stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"
                    strokeDasharray="100" strokeDashoffset="70"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: 'center' }}
                  />
                )}
              </svg>
            </div>

            {level >= 3 && (
              <motion.p
                className="text-white/30 text-xs font-mono tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {level >= 4 ? 'buffering...' : 'loading...'}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Feed() {
  const [session, setSession] = useState<SessionData>(() => createSession());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedReels, setFeedReels] = useState<ReelData[]>(() => generateFeedOrder(0));
  const [isMuted, setIsMuted] = useState(true);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionMessage, setReflectionMessage] = useState('');
  const [showInsights, setShowInsights] = useState(false);
  const [demoVisible, setDemoVisible] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  const transitioningRef = useRef(false);
  const feedCycleRef = useRef(0);
  const lastReflectionTime = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isScrollingRef = useRef(false);
  const sessionRef = useRef(session);
  const pendingDirRef = useRef<'next' | 'prev' | null>(null);

  sessionRef.current = session;

  const currentReel = feedReels[currentIndex] ?? feedReels[0];

  const handleWatchUpdate = useCallback(() => {}, []);

  const doNavigate = useCallback((direction: 'next' | 'prev') => {
    setIsBuffering(false);
    setSession((s) => onReelViewed(s));

    if (direction === 'next') {
      setCurrentIndex((prevIdx) => {
        const maxIdx = feedReels.length - 1;
        if (prevIdx >= maxIdx) {
          feedCycleRef.current += 1;
          setFeedReels(generateFeedOrder(feedCycleRef.current));
          return 0;
        }
        return prevIdx + 1;
      });
    } else {
      setCurrentIndex((i) => Math.max(0, i - 1));
    }
    setTransitionKey((k) => k + 1);
  }, [feedReels.length]);

  const navigateToReel = useCallback((direction: 'next' | 'prev') => {
    if (transitioningRef.current) return;

    const level = sessionRef.current.frictionLevel;
    const rapidSwipes = sessionRef.current.consecutiveRapidSwipes;
    const delay = getFrictionDelay(level, rapidSwipes);

    if (level >= 4) {
      const now = Date.now();
      if (now - lastReflectionTime.current > REFLECTION_COOLDOWN_MS) {
        setReflectionMessage(getRandomMessage());
        setShowReflection(true);
        pendingDirRef.current = direction;
        lastReflectionTime.current = now;
        return;
      }
    }

    if (delay > 0) {
      transitioningRef.current = true;
      setIsBuffering(true);
      setTimeout(() => {
        doNavigate(direction);
        transitioningRef.current = false;
      }, delay);
    } else {
      doNavigate(direction);
    }
  }, [doNavigate]);

  const handleReflectionContinue = useCallback(() => {
    setShowReflection(false);
    const dir = pendingDirRef.current;
    if (dir) {
      pendingDirRef.current = null;
      setIsBuffering(true);
      transitioningRef.current = true;
      const level = sessionRef.current.frictionLevel;
      const rapidSwipes = sessionRef.current.consecutiveRapidSwipes;
      const extraDelay = getFrictionDelay(level, rapidSwipes);
      setTimeout(() => {
        doNavigate(dir);
        transitioningRef.current = false;
      }, Math.max(extraDelay, 300));
    }
  }, [doNavigate]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (Math.abs(e.deltaY) < 30) return;
    if (isScrollingRef.current) return;

    isScrollingRef.current = true;
    setTimeout(() => { isScrollingRef.current = false; }, 100);

    if (e.deltaY > 0) {
      navigateToReel('next');
    } else {
      navigateToReel('prev');
    }
  }, [navigateToReel]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? 0;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const deltaY = touchStartY.current - touch.clientY;
    if (Math.abs(deltaY) < 50) return;

    if (deltaY > 0) {
      navigateToReel('next');
    } else {
      navigateToReel('prev');
    }
  }, [navigateToReel]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      navigateToReel('next');
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateToReel('prev');
    }
  }, [navigateToReel]);

  const handleReset = useCallback(() => {
    setSession((s) => ({ ...createSession(), isDemoMode: s.isDemoMode }));
    setCurrentIndex(0);
    setFeedReels(generateFeedOrder(0));
    feedCycleRef.current = 0;
    setShowReflection(false);
    setShowInsights(false);
    setIsBuffering(false);
    pendingDirRef.current = null;
    transitioningRef.current = false;
  }, []);

  const handleToggleDemo = useCallback(() => {
    setSession((s) => ({
      ...s,
      isDemoMode: !s.isDemoMode,
      mindlessScrollScore: 0,
      consecutiveRapidSwipes: 0,
      frictionLevel: 0 as FrictionLevel,
    }));
  }, []);

  useEffect(() => {
    if (session.reelsViewed >= INSIGHTS_INTERVAL && session.reelsViewed % INSIGHTS_INTERVAL === 0) {
      setShowInsights(true);
    }
  }, [session.reelsViewed]);

  if (!currentReel) return null;

  const level = session.frictionLevel;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden outline-none touch-none select-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={transitionKey}
          className="absolute inset-0"
          initial={{
            y: '100%',
            opacity: 0.5,
            scale: level >= 2 ? 0.98 : 1,
          }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{
            y: level >= 3 ? '-15%' : '-30%',
            opacity: 0,
            scale: level >= 2 ? 1.01 : 1,
          }}
          transition={{
            duration: level >= 3 ? 0.7 : level >= 1 ? 0.45 : 0.3,
            ease: level >= 3
              ? [0.36, 0, 0.66, -0.56]
              : level >= 2
                ? [0.45, 0, 0.55, 1]
                : [0.32, 0.72, 0, 1],
          }}
        >
          <ReelComponent
            reel={currentReel}
            isActive={true}
            frictionLevel={level}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            onWatchUpdate={handleWatchUpdate}
            showReflection={showReflection}
          />
        </motion.div>
      </AnimatePresence>

      <BufferingOverlay visible={isBuffering} level={level} />

      {level >= 3 && !showReflection && !isBuffering && (
        <div className="absolute inset-0 pointer-events-none z-30">
          <div
            className="absolute inset-0 animate-breathe"
            style={{
              background: `radial-gradient(circle at center, transparent 30%, rgba(0,0,0,${0.03 * level}) 100%)`,
            }}
          />
        </div>
      )}

      <ReflectionOverlay
        visible={showReflection}
        message={reflectionMessage}
        onContinue={handleReflectionContinue}
      />

      <SessionInsights
        visible={showInsights}
        reelsViewed={session.reelsViewed}
        totalWatchTime={session.totalWatchTime}
        quickSkips={session.quickSkips}
        onClose={() => setShowInsights(false)}
        onReset={handleReset}
      />

      <DemoControls
        session={session}
        onReset={handleReset}
        onToggleDemo={handleToggleDemo}
        visible={demoVisible}
        onToggleVisibility={() => setDemoVisible(!demoVisible)}
      />
    </div>
  );
}
