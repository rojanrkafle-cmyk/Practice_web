import React, { Component, ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { logError } from '@/lib/logger';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, {
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-black/95"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-gold mb-6"
          >
            <AlertCircle size={48} />
          </motion.div>
          
          <h1 className="font-cormorant text-3xl text-gold mb-4">
            Something went wrong
          </h1>
          
          <p className="font-noto-jp text-white/80 mb-8 text-center">
            申し訳ありません。エラーが発生しました。
          </p>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gold text-black font-medium rounded-lg
                hover:bg-gold/90 transition-colors"
            >
              再試行 (Retry)
            </motion.button>

            <Link href="/">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 border border-gold text-gold rounded-lg
                  hover:bg-gold/10 transition-colors inline-block"
              >
                ホームに戻る (Return Home)
              </motion.a>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-8 p-4 bg-black/50 rounded-lg text-red-400 text-sm overflow-auto max-w-full">
              {this.state.error.message}
            </pre>
          )}
        </motion.div>
      );
    }

    return this.props.children;
  }
}