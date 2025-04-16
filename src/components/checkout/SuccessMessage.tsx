'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface SuccessMessageProps {
  onClose?: () => void;
  title?: string;
  message?: string;
  continueUrl?: string;
}

export const SuccessMessage = ({ 
  onClose, 
  title = "Payment Successful!", 
  message = "Thank you for your order. We've sent a confirmation email with your receipt.",
  continueUrl = "/products"
}: SuccessMessageProps) => {
  // Handle escape key press
  useEffect(() => {
    if (!onClose) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="relative text-center p-4 sm:p-6 md:p-8 bg-background rounded-lg"
        role="alert"
        aria-live="polite"
      >
        {/* Close Button (mobile only) */}
        {onClose && (
          <button 
            onClick={onClose}
            className="sm:hidden absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
        
        {/* Success Icon with pulse animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-3 sm:mb-4"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: 1, duration: 0.5, delay: 0.5 }}
          >
            <CheckCircle className="h-5 w-5 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
          </motion.div>
        </motion.div>
        
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 dark:text-white">{title}</h1>
        <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <Link href={continueUrl} className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto hover:bg-primary/10 dark:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          {onClose && (
            <Button 
              onClick={onClose} 
              className="w-full sm:w-auto hidden sm:block hover:bg-primary/90"
            >
              Close
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};