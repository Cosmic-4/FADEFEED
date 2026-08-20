import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Reel } from '../lib/reelData';
import { formatLikes } from '../lib/reelData';

interface ReelControlsProps {
  reel: Reel;
  isMuted: boolean;
  onToggleMute: () => void;
  onLike: () => void;
  isLiked: boolean;
}

export default function ReelControls({ reel, isMuted, onToggleMute, onLike, isLiked }: ReelControlsProps) {
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = useCallback(() => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-5 pb-8 z-10">
      <div className="flex items-end justify-between">
        <div className="flex-1 mr-4 max-w-[75%]">
          <p className="text-white font-semibold text-sm mb-1">{reel.username}</p>
          <p className="text-white/80 text-sm leading-snug">{reel.caption}</p>
          <div className="flex items-center gap-2 mt-2 text-white/50 text-xs">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
              Original audio
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5">
          <button
            onClick={onLike}
            className="flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none"
          >
            <motion.div
              whileTap={{ scale: 1.4 }}
              animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="w-7 h-7"
                fill={isLiked ? '#ef4444' : 'none'}
                viewBox="0 0 24 24"
                stroke={isLiked ? '#ef4444' : 'white'}
                strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.div>
            <span className="text-white text-[11px]">{formatLikes(reel.likes + (isLiked ? 1 : 0))}</span>
          </button>

          <button className="flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-white text-[11px]">Reply</span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none"
          >
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="text-white text-[11px]">Share</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center cursor-pointer bg-black/30 backdrop-blur-sm"
          >
            {isMuted ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full"
          >
            Link copied
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
