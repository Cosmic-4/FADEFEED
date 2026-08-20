import { motion, AnimatePresence } from 'framer-motion';


interface ReflectionOverlayProps {
  visible: boolean;
  message: string;
  onContinue: () => void;
}

const MESSAGES = [
  "Hold on.",
  "You've been moving fast.",
  "Still looking for something?",
  "Take your time.",
  "You don't have to stop.",
  "Just don't let the next reel choose for you.",
  "Breathe.",
  "What are you looking for?",
];

export function getRandomMessage(): string {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

export default function ReflectionOverlay({ visible, message, onContinue }: ReflectionOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0b]/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex flex-col items-center gap-6 max-w-sm text-center px-6"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-1 h-1 rounded-full bg-white/40 animate-breathe" />

            <motion.p
              className="text-2xl md:text-3xl text-white font-light leading-snug tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {message}
            </motion.p>

            <motion.button
              onClick={onContinue}
              className="mt-4 px-6 py-2.5 border border-white/20 rounded-full text-sm text-white/60 hover:text-white hover:border-white/40 transition-all duration-300 cursor-pointer bg-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Keep scrolling
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
