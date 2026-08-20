import { motion } from 'framer-motion';

interface LandingProps {
  onEnter: () => void;
}

export default function Landing({ onEnter }: LandingProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0b] z-50">
      <motion.div
        className="flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-light tracking-[-0.06em] text-white"
          initial={{ opacity: 0, letterSpacing: '0.15em' }}
          animate={{ opacity: 1, letterSpacing: '-0.06em' }}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
        >
          FADEFEED
        </motion.h1>

        <motion.p
          className="text-[#666] text-lg md:text-xl font-light max-w-xs text-center leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          A feed that slows down
          <br />
          when you stop choosing.
        </motion.p>

        <motion.button
          onClick={onEnter}
          className="mt-4 px-8 py-3 border border-[#333] rounded-full text-sm tracking-widest uppercase text-[#aaa] hover:text-white hover:border-[#555] transition-all duration-300 cursor-pointer bg-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Enter the feed
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute bottom-8 text-[#333] text-xs tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
      >
        Scroll. Notice. Choose.
      </motion.div>
    </div>
  );
}
