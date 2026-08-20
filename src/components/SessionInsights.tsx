import { motion, AnimatePresence } from 'framer-motion';


interface SessionInsightsProps {
  visible: boolean;
  reelsViewed: number;
  totalWatchTime: number;
  quickSkips: number;
  onClose: () => void;
  onReset: () => void;
}

function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return '<1 min';
  return `${mins} min`;
}

export default function SessionInsights({ visible, reelsViewed, totalWatchTime, quickSkips, onClose, onReset }: SessionInsightsProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#0a0a0b]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex flex-col items-center gap-10 max-w-sm text-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-[#555] text-xs tracking-[0.3em] uppercase">Your Session</p>

            <div className="grid grid-cols-3 gap-8 w-full">
              <motion.div
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-4xl font-light text-white">{reelsViewed}</span>
                <span className="text-[#666] text-xs">videos viewed</span>
              </motion.div>

              <motion.div
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="text-4xl font-light text-white">{formatDuration(totalWatchTime)}</span>
                <span className="text-[#666] text-xs">scrolling</span>
              </motion.div>

              <motion.div
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <span className="text-4xl font-light text-white">{quickSkips}</span>
                <span className="text-[#666] text-xs">quick skips</span>
              </motion.div>
            </div>

            <motion.p
              className="text-white/60 text-base font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              Did you find what you came here for?
            </motion.p>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              {['Yes', 'Not really', "I'm not sure"].map((label) => (
                <button
                  key={label}
                  onClick={onClose}
                  className="px-5 py-2 border border-[#333] rounded-full text-xs text-[#888] hover:text-white hover:border-[#555] transition-all duration-300 cursor-pointer bg-transparent"
                >
                  {label}
                </button>
              ))}
            </motion.div>

            <motion.button
              onClick={onReset}
              className="mt-2 text-[#444] text-xs underline hover:text-[#777] transition-colors cursor-pointer bg-transparent border-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              Start over
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
