import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from 'framer-motion';

type FlashcardProps = {
  front: string;
  back: string;
  loading?: boolean;
  onFlip?: (isFlipped: boolean) => void;
  isFlipped?: boolean;
  controlledFlip?: boolean;
};

export const Flashcard: React.FC<FlashcardProps> = ({ 
  front, 
  back, 
  loading, 
  onFlip,
  isFlipped: controlledIsFlipped,
  controlledFlip = false
}) => {
  const [flipped, setFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(true);

  // Support for externally controlled flipping
  useEffect(() => {
    if (controlledFlip && controlledIsFlipped !== undefined) {
      setFlipped(controlledIsFlipped);
    }
  }, [controlledFlip, controlledIsFlipped]);

  const handleFlip = () => {
    if (!loading && animationComplete) {
      const newFlipped = !flipped;
      setFlipped(newFlipped);
      if (onFlip) onFlip(newFlipped);
      setAnimationComplete(false);
    }
  };
  
  return (
    <motion.div
      onClick={handleFlip}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
      }}
      whileHover={{ 
        scale: 1.03,
        y: -6,
        boxShadow: "0 24px 40px rgba(0,0,0,0.13)",
        transition: { type: "spring", stiffness: 260, damping: 18 }
      }}
      className={cn(
        'relative w-full max-w-[clamp(320px,40vw,420px)] h-[clamp(220px,28vw,270px)] cursor-pointer',
        'transition-all duration-500',
        loading ? '' : '',
        'select-none',
        'transform-gpu'
      )}
      style={{ transformStyle: "preserve-3d", perspective: "2000px" }}
    >
      <motion.div
        animate={{ 
          rotateY: flipped ? 180 : 0,
          z: isHovered ? 30 : 0 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 80, 
          damping: 12,
          mass: 0.8
        }}
        onAnimationComplete={() => setAnimationComplete(true)}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <motion.div 
          className={cn(
            'absolute w-full h-full flex items-center justify-center p-6 text-center rounded-2xl',
            isHovered && !flipped ? 'ring-2 ring-blue-400' : '',
            isHovered ? 'shadow-lg' : ''
          )}
          style={{
            boxShadow: "0 10px 30px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.07)",
            background: "linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)",
            transform: "translateZ(2px)",
            backfaceVisibility: "hidden"
          }}
        >
          <Card
            className={cn(
              'w-full h-full flex items-center justify-center p-6 text-center bg-white/90 dark:bg-gray-900/90',
              'backdrop-blur-sm border border-gray-200 dark:border-gray-700',
              'shadow-lg rounded-xl'
            )}
          >
            <CardContent className="text-base sm:text-xl font-semibold text-gray-800 dark:text-white relative overflow-hidden w-full h-full flex items-center justify-center">
              {loading ? <Skeleton height={120} width="90%" /> : (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isHovered ? 0.15 : 0 
                    }}
                    className="absolute -right-5 -top-5 w-20 h-20 bg-blue-400 dark:bg-blue-600 rounded-full blur-xl z-0"
                  />
                  <motion.div className="relative z-10 w-full">
                    <ReactMarkdown>{front}</ReactMarkdown>
                  </motion.div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Back of card */}
        <motion.div 
          className={cn(
            'absolute w-full h-full flex items-center justify-center p-6 text-center rounded-2xl',
            isHovered && flipped ? 'ring-2 ring-purple-400' : '',
            isHovered ? 'shadow-lg' : ''
          )}
          style={{
            boxShadow: "0 10px 30px rgba(0,0,0,0.15), 0 5px 15px rgba(0,0,0,0.1)",
            background: "linear-gradient(145deg, #f3f4f6 0%, #e5e7eb 100%)",
            transform: "translateZ(2px) rotateY(180deg)",
            backfaceVisibility: "hidden"
          }}
        >
          <Card
            className={cn(
              'w-full h-full flex items-center justify-center p-6 text-center bg-gray-100/95 dark:bg-gray-800/95',
              'backdrop-blur-sm border border-gray-300 dark:border-gray-600',
              'shadow-lg rounded-xl'
            )}
          >
            <CardContent className="text-base sm:text-xl font-medium text-gray-700 dark:text-gray-200 relative overflow-hidden w-full h-full flex items-center justify-center">
              {loading ? <Skeleton height={120} width="90%" /> : (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isHovered ? 0.1 : 0 
                    }}
                    className="absolute -left-5 -bottom-5 w-20 h-20 bg-purple-400 dark:bg-purple-600 rounded-full blur-xl z-0"
                  />
                  <motion.div className="relative z-10 w-full">
                    <ReactMarkdown>{back}</ReactMarkdown>
                  </motion.div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Flip indicator */}
      {!loading && (
        <motion.div 
          className="absolute bottom-3 right-3 text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={flipped ? 'back' : 'front'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {flipped ? 'tap to see front' : 'tap to see answer'}
            </motion.span>
          </AnimatePresence>
          <motion.span className="ml-1 text-gray-400">(space)</motion.span>
        </motion.div>
      )}
      
      {/* Keyboard shortcut hint */}
      <AnimatePresence>
        {isHovered && !loading && (
          <motion.div
            className="absolute top-3 right-3 px-2 py-1 bg-gray-800/80 dark:bg-gray-700/80 text-white text-xs rounded"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Press Space to flip
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Default export
export default Flashcard;
