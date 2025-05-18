// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './src/lib/supabaseClient';
import { createCard } from './src/lib/spacedRepetition';
import { generateId } from './src/lib/utils';

import MainLayout from './src/layouts/MainLayout';
import Navbar from './src/components/Navbar';
import Home from './src/pages/Home';
import Login from './src/pages/Login';
import Review from './src/pages/Review';
import Stats from './src/pages/Stats';
import CreateCard from './src/pages/CreateCard';
import FlashcardReview from './src/components/FlashcardReview';

// Types
type Card = {
  id: string;
  front: string;
  back: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: Date;
  tags?: string[];
};

const App: React.FC = () => {
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
    // Flashcards data
  const [flashcards, setFlashcards] = useState<Card[]>([
    // Basic knowledge
    createCard('1', 'What is the capital of France?', 'Paris', ['Geography']),
    createCard('2', 'What is 2+2?', '4', ['Math']),
    createCard('3', 'What is the most abundant gas in Earth\'s atmosphere?', 'Nitrogen', ['Science']),
    createCard('4', 'What is the chemical symbol for gold?', 'Au', ['Science']),
    createCard('5', 'Who wrote "Romeo and Juliet"?', 'William Shakespeare', ['Literature']),
    
    // Programming flashcards
    createCard('6', 'What does CSS stand for?', 'Cascading Style Sheets', ['Programming']),
    createCard('7', 'What is React?', 'A JavaScript library for building user interfaces', ['Programming']),
    createCard('8', 'What is JSX?', 'JavaScript XML - A syntax extension for JavaScript that looks similar to HTML', ['Programming']),
    createCard('9', 'What is useState in React?', 'A Hook that lets you add React state to function components', ['Programming']),
    createCard('16', 'What is a closure in JavaScript?', 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment)', ['Programming']),
    createCard('17', 'Explain the concept of "hoisting" in JavaScript', 'Hoisting is JavaScript\'s default behavior of moving all declarations to the top of the current scope', ['Programming']),
    createCard('18', 'What is the difference between var, let, and const in JavaScript?', 'var is function-scoped and can be redeclared, let is block-scoped and can be reassigned, const is block-scoped and cannot be reassigned', ['Programming']),
    
    // Language learning
    createCard('10', '¿Cómo estás?', 'How are you?', ['Language']),
    createCard('11', 'Bonjour', 'Hello/Good day (French)', ['Language']),
    createCard('12', '你好 (Nǐ hǎo)', 'Hello (Chinese)', ['Language']),
    createCard('19', 'Gracias', 'Thank you (Spanish)', ['Language']),
    createCard('20', 'Arigato', 'Thank you (Japanese)', ['Language']),
    createCard('21', 'Guten Tag', 'Good day (German)', ['Language']),
    
    // History
    createCard('13', 'In what year did World War II end?', '1945', ['History']),
    createCard('14', 'Who was the first president of the United States?', 'George Washington', ['History']),
    createCard('15', 'What ancient civilization built the pyramids at Giza?', 'Ancient Egyptians', ['History']),
    createCard('22', 'When did the Berlin Wall fall?', 'November 9, 1989', ['History']),
    createCard('23', 'Who was the first woman to win a Nobel Prize?', 'Marie Curie', ['History', 'Science']),
    
    // Math
    createCard('24', 'What is the Pythagorean theorem?', 'In a right triangle, the square of the length of the hypotenuse equals the sum of squares of the other two sides (a² + b² = c²)', ['Math']),
    createCard('25', 'What is the formula for the area of a circle?', 'A = πr² (where r is the radius)', ['Math']),
    createCard('26', 'What is the derivative of sin(x)?', 'cos(x)', ['Math']),
    
    // Science
    createCard('27', 'What are the three states of matter?', 'Solid, liquid, and gas (plasma is often considered the fourth)', ['Science']),
    createCard('28', 'What is photosynthesis?', 'The process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water', ['Science']),
    createCard('29', 'What is Newton\'s First Law of Motion?', 'An object at rest stays at rest and an object in motion stays in motion with the same speed and direction unless acted upon by an external force', ['Science']),
    
    // Geography
    createCard('30', 'What is the largest ocean on Earth?', 'Pacific Ocean', ['Geography']),
    createCard('31', 'What is the longest river in the world?', 'The Nile River (though some sources argue it\'s the Amazon River)', ['Geography']),
    createCard('32', 'What are the seven continents?', 'Africa, Antarctica, Asia, Australia/Oceania, Europe, North America, and South America', ['Geography']),
  ]);
  
  // Calculate stats
  const totalCards = flashcards.length;
  const dueCards = flashcards.filter(card => {
    return new Date(card.nextReview) <= new Date();
  }).length;
  const masteredCards = flashcards.filter(card => card.interval > 30).length;
  
  // Sample user reviews - in a real app, these would come from a database
  const reviewsData = {
    reviews: [
      {
        id: '1',
        name: 'Sarah Johnson',
        rating: 5,
        comment: 'This app has transformed how I study! The spaced repetition algorithm really helped me retain information for my medical exams.',
        date: '2025-04-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'David Chen',
        rating: 4,
        comment: 'Simple and effective. I love how I can track my progress and see what cards I need to review.',
        date: '2025-05-01T15:20:00Z'
      },      {
        id: '3',
        name: 'Emma Wilson',
        rating: 5,
        comment: 'Perfect for language learning! I\'ve been using it to master Spanish vocabulary.',
        date: '2025-05-10T09:15:00Z'
      }
    ]
  };
  
  // Stats data
  const statsData = {
    stats: [
      { id: '1', label: 'Total Cards', value: totalCards },
      { id: '2', label: 'Mastery Rate', value: totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0, suffix: '%' },
      { id: '3', label: 'Due Today', value: dueCards },
      { id: '4', label: 'Cards Reviewed', value: flashcards.reduce((sum, card) => sum + card.repetitions, 0) },
      { id: '5', label: 'Average Ease', value: Math.round(flashcards.reduce((sum, card) => sum + card.easeFactor, 0) / (totalCards || 1) * 10) / 10 }
    ]
  };
  
  // Check auth status when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data?.session?.user);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // Login handler
  const handleLogin = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  // Update cards after review
  const handleReviewComplete = (updatedCards: Card[]) => {
    // Update cards in state
    const newFlashcards = [...flashcards];
    
    updatedCards.forEach(updatedCard => {
      const index = newFlashcards.findIndex(card => card.id === updatedCard.id);
      if (index !== -1) {
        newFlashcards[index] = updatedCard;
      }
    });
    
    setFlashcards(newFlashcards);
    // In a real app, you would save to the database here
  };
  
  // Create a new card
  const handleCreateCard = (front: string, back: string, tags: string[] = []) => {
    const newCard = createCard(generateId(), front, back);
    setFlashcards([...flashcards, { ...newCard, tags }]);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <MainLayout
        navbar={<Navbar />}
        footer={<div className="text-sm text-gray-500">SpacedFlash © {new Date().getFullYear()}</div>}
      >        <Routes>
          <Route path="/" element={
            <Home 
              totalCards={totalCards} 
              dueCards={dueCards} 
              masteredCards={masteredCards} 
              flashcards={flashcards}
            />
          } />
          <Route path="/login" element={
            user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/review" element={
            <FlashcardReview 
              cards={flashcards.filter(card => new Date(card.nextReview) <= new Date())}
              onComplete={handleReviewComplete}
              onCancel={() => null} // Navigate back in a real app
            />
          } />
          <Route path="/reviews" element={<Review />} />
          <Route path="/stats" element={<Stats {...statsData} />} />          <Route path="/create" element={
            <CreateCard 
              onSave={handleCreateCard}
              availableTags={['Science', 'Math', 'History', 'Language', 'Programming', 'Art', 'Geography', 'Literature', 'Physics', 'Chemistry', 'Biology']}
            />
          } />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
