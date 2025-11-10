'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error when it occurs
    logger.logError(error, {
      digest: error.digest,
      location: 'Global Error Page',
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-block text-gold mb-6"
          >
            <AlertCircle size={64} />
          </motion.div>
          
          <h1 className="font-cormorant text-4xl text-gold mb-4">
            申し訳ありません
          </h1>
          
          <p className="font-noto-jp text-white/80 mb-2">
            An unexpected error has occurred.
          </p>
          
          <p className="text-white/60 mb-8 text-sm">
            Our team has been notified and is working to resolve the issue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => reset()}
              className="px-6 py-3 bg-gold text-black font-medium rounded-lg
                hover:bg-gold/90 transition-colors w-full sm:w-auto"
            >
              もう一度試す (Try Again)
            </motion.button>

            <Link href="/" className="w-full sm:w-auto">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-gold text-gold rounded-lg
                  hover:bg-gold/10 transition-colors block text-center"
              >
                ホームに戻る (Return Home)
              </motion.a>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <motion.pre
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 p-4 bg-black/50 rounded-lg text-red-400 text-sm overflow-auto max-w-full"
            >
              <code>{error.message}</code>
            </motion.pre>
          )}
        </div>
      </motion.div>
    </div>
  );
}