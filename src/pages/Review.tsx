// filepath: c:\Projects\spaced-flash\src\pages\Review.tsx
// Review.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Flashcard from '../components/Flashcard';
import { ArrowLeft, CheckCircle, XCircle, MoreHorizontal, ArrowRight, ArrowLeft as ArrowLeftIcon, Bookmark, Clock } from 'lucide-react';
import TagSelector from '../components/TagSelector';
import { motion, AnimatePresence } from 'framer-motion';

// Type for a card with spaced repetition data
interface FlashcardData {
  id: string;
  front: string;
  back: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: Date;
  tags?: string[];
}

interface ReviewProps {
  cards?: FlashcardData[];
  onComplete?: (updatedCards: FlashcardData[]) => void;
}

const Review: React.FC<ReviewProps> = ({ 
  // Default props for demonstration
  cards = [
    {
      id: '1',
      front: 'What is the capital of France?',
      back: 'Paris',
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: new Date()
    },
    {
      id: '2',
      front: 'What is 2+2?',
      back: '4',
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: new Date()
    },
    {
      id: '3',
      front: 'What is the most abundant gas in Earth\'s atmosphere?',
      back: 'Nitrogen',
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: new Date()
    }
  ],
  onComplete = () => {}
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<FlashcardData[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredCards, setFilteredCards] = useState<FlashcardData[]>(cards);
  const [showKeyboardTips, setShowKeyboardTips] = useState(false);
  const [lastRating, setLastRating] = useState<number | null>(null);
  
  // Extract unique tags from all cards
  const allTags = Array.from(
    new Set(cards.flatMap(card => card.tags || []))
  );
  
  // Filter cards when tags are selected
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredCards(cards);
    } else {
      setFilteredCards(
        cards.filter(card => 
          selectedTags.every(tag => card.tags?.includes(tag))
        )
      );
    }
    // Reset to first card when filter changes
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCards([]);
  }, [selectedTags, cards]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        // Space to flip
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight' && isFlipped) {
        // Right arrow for "Easy" when flipped
        handleRating(5);
      } else if (e.key === 'ArrowDown' && isFlipped) {
        // Down arrow for "Medium" when flipped
        handleRating(3);
      } else if (e.key === 'ArrowLeft' && isFlipped) {
        // Left arrow for "Hard" when flipped
        handleRating(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, filteredCards]);
  
  const currentCard = filteredCards[currentIndex];
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleRating = (quality: number) => {
    if (!currentCard) return;
    
    setLastRating(quality);
    
    // In a real app, use the spaced repetition algorithm to update card
    const updatedCard = {
      ...currentCard,
      repetitions: currentCard.repetitions + 1,
      // This is simplified - in reality use the SM-2 algorithm
      interval: quality >= 3 ? currentCard.interval * 2 : 1,
      easeFactor: currentCard.easeFactor + (0.1 - (5 - quality) * 0.08),
      nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24 * (quality >= 3 ? currentCard.interval * 2 : 1))
    };
    
    setReviewedCards([...reviewedCards, updatedCard]);
    
    // Move to next card or complete
    if (currentIndex < filteredCards.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setLastRating(null);
      }, 500);
    } else {
      // All cards reviewed
      setTimeout(() => {
        handleComplete([...reviewedCards, updatedCard]);
        setLastRating(null);
      }, 500);
    }
  };
  
  const handleComplete = (allReviewed: FlashcardData[]) => {
    onComplete(allReviewed);
    // Show completion screen
    setCurrentIndex(filteredCards.length);
  };
  
  // Return to home
  const handleFinish = () => {
    navigate('/');
  };
  
  // If no cards to review
  if (filteredCards.length === 0) {
    return (
      <motion.div 
        className="max-w-md mx-auto mt-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 shadow-lg border-gray-800/20 dark:border-gray-700/20">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                No Cards to Review
              </motion.h2>
              <motion.p 
                className="text-gray-500 dark:text-gray-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                You're all caught up! There are no cards due for review right now.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button onClick={handleFinish} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Return Home
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Review completion screen
  if (currentIndex >= filteredCards.length) {
    return (
      <motion.div 
        className="max-w-md mx-auto mt-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 shadow-lg border-gray-800/20 dark:border-gray-700/20">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: [0, 20, -20, 0] }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,                  rotate: { 
                    duration: 1.5, 
                    ease: [0.42, 0, 0.58, 1] 
                  } 
                }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Review Complete!
              </motion.h2>
              <motion.p 
                className="text-gray-500 dark:text-gray-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                You've reviewed {filteredCards.length} cards. Keep up the good work!
              </motion.p>
              <motion.div
                className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
              >
                <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Button onClick={handleFinish} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Return Home
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  const progress = filteredCards.length ? Math.round((currentIndex / filteredCards.length) * 100) : 0;

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto px-2 sm:px-6 py-6 md:py-10 min-h-[80vh] flex flex-col justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4 group flex items-center">
          <motion.div
            whileHover={{ x: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:text-blue-500 transition-colors" />
          </motion.div> 
          Back to Home
        </Button>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Flashcard Review
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm px-3 py-1 bg-gray-800/10 dark:bg-gray-700/30 rounded-full">
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowKeyboardTips(!showKeyboardTips)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Bookmark size={16} />
            </Button>
          </div>
        </div>
        
        {/* Keyboard shortcuts tip */}
        <AnimatePresence>
          {showKeyboardTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 dark:bg-gray-800/40 border border-blue-100 dark:border-gray-700/50 rounded-lg mb-6 overflow-hidden"
            >
              <div className="p-4">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">Space</kbd>
                    <span className="text-gray-600 dark:text-gray-300">Flip card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">←</kbd>
                    <span className="text-gray-600 dark:text-gray-300">Hard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">↓</kbd>
                    <span className="text-gray-600 dark:text-gray-300">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">→</kbd>
                    <span className="text-gray-600 dark:text-gray-300">Easy</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
          <motion.div 
            className="h-full rounded-full relative overflow-hidden"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%']
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear"
              }}
              style={{
                backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 75%)",
                backgroundSize: "200% 100%"
              }}
            />
          </motion.div>
        </div>
        
        {/* Tag selector */}
        {allTags.length > 0 && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by tags:</p>
            <TagSelector 
              availableTags={allTags}
              selectedTags={selectedTags} 
              onChange={setSelectedTags}
              placeholder="Select tags to filter..."
            />
          </motion.div>
        )}
      </div>
      
      {currentCard && (
        <div className="flex flex-col items-center w-full">
          {/* Flashcard */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex + "-" + (isFlipped ? "flipped" : "front")}
              onClick={handleFlip}
              className="w-full mb-6 cursor-pointer transform-gpu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Flashcard 
                front={currentCard.front}
                back={currentCard.back}
                loading={false}
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Rating buttons - only show when card is flipped */}
          <AnimatePresence>
            {isFlipped && (
              <motion.div 
                className="w-full p-5 bg-gray-50 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700/50 mb-6 shadow-lg"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <h3 className="text-center font-medium mb-5 text-gray-800 dark:text-gray-200">How well did you recall this?</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant="danger" 
                    onClick={() => handleRating(1)}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-red-100 hover:bg-red-200 border-red-200 text-red-700 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:border-red-800 dark:text-red-400 transition-all duration-300 hover:scale-105"
                  >
                    <XCircle className="w-6 h-6" />
                    <span>Forgot</span>
                    <span className="text-xs opacity-70">(←)</span>
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleRating(3)}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700 dark:bg-gray-700/40 dark:hover:bg-gray-700/60 dark:border-gray-800 dark:text-gray-200 transition-all duration-300 hover:scale-105"
                  >
                    <MoreHorizontal className="w-6 h-6" />
                    <span>Medium</span>
                    <span className="text-xs opacity-70">(↓)</span>
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={() => handleRating(5)}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-green-100 hover:bg-green-200 border-green-200 text-green-700 dark:bg-green-900/40 dark:hover:bg-green-900/60 dark:border-green-800 dark:text-green-400 transition-all duration-300 hover:scale-105"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>Easy</span>
                    <span className="text-xs opacity-70">(→)</span>
                  </Button>
                </div>
                
                <div className="mt-5 border-t border-gray-200 dark:border-gray-700/50 pt-4 text-center">
                  <motion.div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                    <Clock size={14} />
                    Next review based on your choice
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Feedback animation overlay */}
          <AnimatePresence>
            {lastRating !== null && (
              <motion.div 
                className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className={`text-8xl ${lastRating === 5 ? 'text-green-500' : lastRating === 3 ? 'text-yellow-500' : 'text-red-500'}`}
                  initial={{ scale: 0.5, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {lastRating === 5 ? '😊' : lastRating === 3 ? '😐' : '😔'}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isFlipped && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="primary" 
                onClick={handleFlip}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              >
                Show Answer
              </Button>
            </motion.div>
          )}
          
          {/* Card navigation (for larger screens) */}
          <div className="hidden md:flex justify-between items-center w-full mt-8">
            <Button 
              variant="ghost" 
              onClick={() => { 
                if (currentIndex > 0) {
                  setCurrentIndex(currentIndex - 1);
                  setIsFlipped(false);
                }
              }}
              disabled={currentIndex === 0}
              className="text-gray-500 disabled:opacity-30"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Previous Card
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => { 
                if (currentIndex < filteredCards.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  setIsFlipped(false);
                }
              }}
              disabled={currentIndex >= filteredCards.length - 1 || !isFlipped}
              className="text-gray-500 disabled:opacity-30"
            >
              Next Card <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Review;
