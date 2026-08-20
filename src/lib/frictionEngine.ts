export interface SessionData {
  sessionStartTime: number;
  reelsViewed: number;
  totalWatchTime: number;
  currentReelStartTime: number;
  quickSkips: number;
  consecutiveRapidSwipes: number;
  lastSwipeTime: number;
  interactionCount: number;
  mindlessScrollScore: number;
  frictionLevel: FrictionLevel;
  isDemoMode: boolean;
  demoSwipeCount: number;
}

export type FrictionLevel = 0 | 1 | 2 | 3 | 4;

const RAPID_SWIPE_THRESHOLD_MS = 1500;
const QUICK_SKIP_THRESHOLD_MS = 5000;
const DEMO_MODE_MULTIPLIER = 3;

export function createSession(): SessionData {
  return {
    sessionStartTime: Date.now(),
    reelsViewed: 0,
    totalWatchTime: 0,
    currentReelStartTime: Date.now(),
    quickSkips: 0,
    consecutiveRapidSwipes: 0,
    lastSwipeTime: 0,
    interactionCount: 0,
    mindlessScrollScore: 0,
    frictionLevel: 0,
    isDemoMode: false,
    demoSwipeCount: 0,
  };
}

export function onReelViewed(session: SessionData): SessionData {
  const now = Date.now();
  const watchTime = now - session.currentReelStartTime;
  const isRapidSwipe = now - session.lastSwipeTime < RAPID_SWIPE_THRESHOLD_MS;
  const isQuickSkip = watchTime < QUICK_SKIP_THRESHOLD_MS;

  let scoreDelta = 0;
  let rapidSwipes = session.consecutiveRapidSwipes;
  let quickSkips = session.quickSkips;

  if (isRapidSwipe) {
    rapidSwipes += 1;
    scoreDelta += 8 * (session.isDemoMode ? DEMO_MODE_MULTIPLIER : 1);
  } else {
    rapidSwipes = 0;
  }

  if (isQuickSkip) {
    quickSkips += 1;
    scoreDelta += 3 * (session.isDemoMode ? DEMO_MODE_MULTIPLIER : 1);
  } else if (watchTime > 10000) {
    scoreDelta -= 12;
  } else if (watchTime > 5000) {
    scoreDelta -= 5;
  }

  const newScore = Math.max(0, Math.min(100, session.mindlessScrollScore + scoreDelta));
  const level = getFrictionLevel(newScore, rapidSwipes, session.isDemoMode);

  return {
    ...session,
    reelsViewed: session.reelsViewed + 1,
    totalWatchTime: session.totalWatchTime + watchTime,
    currentReelStartTime: now,
    lastSwipeTime: now,
    consecutiveRapidSwipes: rapidSwipes,
    quickSkips,
    interactionCount: session.interactionCount + 1,
    mindlessScrollScore: newScore,
    frictionLevel: level,
    demoSwipeCount: session.isDemoMode ? session.demoSwipeCount + 1 : session.demoSwipeCount,
  };
}


export function getFrictionLevel(score: number, rapidSwipes: number, isDemoMode: boolean): FrictionLevel {
  if (isDemoMode) {
    const demoScore = rapidSwipes * 12;
    if (demoScore >= 60) return 4;
    if (demoScore >= 40) return 3;
    if (demoScore >= 20) return 2;
    if (demoScore >= 8) return 1;
    return 0;
  }

  if (score >= 75 || rapidSwipes >= 12) return 4;
  if (score >= 55 || rapidSwipes >= 8) return 3;
  if (score >= 35 || rapidSwipes >= 5) return 2;
  if (score >= 15 || rapidSwipes >= 3) return 1;
  return 0;
}

export function getFrictionDelay(level: FrictionLevel, rapidSwipes: number): number {
  const base = level === 0 ? 0
    : level === 1 ? 2500
    : level === 2 ? 4000
    : level === 3 ? 6000
    : 9000;

  const progressive = Math.min(rapidSwipes * 1000, 15000);

  return base + progressive;
}

export function getFrictionBlur(level: FrictionLevel): number {
  switch (level) {
    case 0: return 0;
    case 1: return 0;
    case 2: return 1.5;
    case 3: return 3;
    case 4: return 5;
    default: return 0;
  }
}


