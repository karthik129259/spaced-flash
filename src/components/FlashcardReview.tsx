import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Flashcard from "../components/Flashcard";
import { updateCard } from "../lib/spacedRepetition";
import { cn, shuffleArray } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type ReviewCardType = {
  id: string;
  front: string;
  back: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: Date;
  tags?: string[];
};

interface FlashcardReviewProps {
  cards: ReviewCardType[];
  onComplete: (updatedCards: ReviewCardType[]) => void;
  onCancel: () => void;
}

const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  cards,
  onComplete,
  onCancel,
}) => {
  const [shuffledCards, setShuffledCards] = useState<ReviewCardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<ReviewCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Shuffle cards when component mounts
  useEffect(() => {
    setShuffledCards(shuffleArray(cards.filter(card => card)));
  }, [cards]);

  // Get current card
  const currentCard = shuffledCards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Handle rating (0-5) for SM-2 algorithm
  const handleRating = (quality: number) => {
    if (!currentCard) return;

    // Update card using spaced repetition algorithm
    const updatedCard = updateCard(currentCard, quality);

    setReviewedCards((prev) => [...prev, updatedCard]);

    // Move to next card
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // All cards reviewed
      handleComplete([...reviewedCards, updatedCard]);
    }
  };  // Submit all reviewed cards
  const handleComplete = useCallback((allReviewed: ReviewCardType[]) => {
    if (isCompleting) return;
    setIsCompleting(true);
    setLoading(true);
    
    // Small delay to ensure animations finish properly
    setTimeout(() => {
      try {
        onComplete(allReviewed);
      } finally {
        setLoading(false);
        setIsCompleting(false);
      }
    }, 100);
  }, [onComplete, isCompleting]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup any pending animations or state updates
      setIsCompleting(false);
      setLoading(false);
    };
  }, []);

  if (shuffledCards.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium text-gray-500">No cards available for review</p>
      </div>
    );
  }

  const progress = cards.length ? Math.round(((currentIndex) / cards.length) * 100) : 0;

  return (    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Flashcard Review
      </h1>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full relative"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-white/20 progress-bar-animated" />
        </motion.div>
      </div>
      
      <div className="flex flex-col items-center">
        {/* Card counter */}
        <p className="text-sm text-gray-500 mb-4">
          Card {currentIndex + 1} of {cards.length}
        </p>
        
        {currentCard && (
          <>
            {/* The flashcard */}
            <div onClick={handleFlip} className="cursor-pointer w-full mb-6">
              <Flashcard 
                front={currentCard.front} 
                back={currentCard.back}
              />
            </div>
            
            {/* Only show rating buttons when card is flipped */}
            {isFlipped && (                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-full mb-6"
                >
                  <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
                    <CardContent>
                      <h3 className="text-center font-medium mb-6 text-gray-800 dark:text-gray-200">
                        How well did you remember this?
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            variant="danger" 
                            onClick={() => handleRating(0)}
                            className="w-full h-auto py-4 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-red-500/30"
                          >
                            Forgot
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            variant="outline" 
                            onClick={() => handleRating(3)}
                            className="w-full h-auto py-4 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Medium
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            variant="success" 
                            onClick={() => handleRating(5)}
                            className="w-full h-auto py-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-green-500/30"
                          >
                            Easy
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                onClick={() => handleComplete(reviewedCards.length ? reviewedCards : shuffledCards)}
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 text-base rounded-lg transition-all duration-300"
              >
                End Review
              </Button>
              
              {!isFlipped && (
                <Button 
                  variant="primary" 
                  onClick={handleFlip}
                >
                  Show Answer
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlashcardReview;
