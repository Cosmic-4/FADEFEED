import { motion, AnimatePresence } from 'framer-motion';
import type { SessionData } from '../lib/frictionEngine';

interface DemoControlsProps {
  session: SessionData;
  onReset: () => void;
  onToggleDemo: () => void;
  visible: boolean;
  onToggleVisibility: () => void;
}

export default function DemoControls({ session, onReset, onToggleDemo, visible, onToggleVisibility }: DemoControlsProps) {
  return (
    <>
      <button
        onClick={onToggleVisibility}
        className="fixed top-4 right-4 z-[70] w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/10 transition-all cursor-pointer text-xs"
        title="Demo controls"
      >
        D
      </button>

      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed top-14 right-4 z-[70] bg-[#111] border border-[#222] rounded-xl p-4 w-56"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[#666] text-[10px] tracking-wider uppercase">Demo Mode</span>
                <button
                  onClick={onToggleDemo}
                  className={`w-9 h-5 rounded-full transition-all duration-300 cursor-pointer border-none ${
                    session.isDemoMode ? 'bg-purple-600' : 'bg-[#333]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                      session.isDemoMode ? 'translate-x-[18px]' : 'translate-x-[2px]'
                    }`}
                  />
                </button>
              </div>

              <div className="h-px bg-[#222]" />

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#555] block">Score</span>
                  <span className="text-white">{Math.round(session.mindlessScrollScore)}</span>
                </div>
                <div>
                  <span className="text-[#555] block">Level</span>
                  <span className="text-white">{session.frictionLevel}</span>
                </div>
                <div>
                  <span className="text-[#555] block">Rapid swipes</span>
                  <span className="text-white">{session.consecutiveRapidSwipes}</span>
                </div>
                <div>
                  <span className="text-[#555] block">Viewed</span>
                  <span className="text-white">{session.reelsViewed}</span>
                </div>
              </div>

              <div className="h-px bg-[#222]" />

              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-[#222] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500"
                    animate={{ width: `${session.mindlessScrollScore}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-[#555] text-[10px]">{Math.round(session.mindlessScrollScore)}%</span>
              </div>

              <button
                onClick={onReset}
                className="w-full py-1.5 border border-[#333] rounded-lg text-[#888] text-[11px] hover:text-white hover:border-[#555] transition-all cursor-pointer bg-transparent"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
