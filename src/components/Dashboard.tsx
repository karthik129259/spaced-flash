import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import StatsCard from '../components/StatsCard';
import { BookOpen, Calendar, Award, ArrowRight, Plus, Clock, BarChart, Sparkles } from 'lucide-react';
import {
  BarChart as BarChartComponent,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

interface DueByDayCount {
  day: string;
  count: number;
}

interface DashboardProps {
  totalCards: number;
  dueCards: number;
  masteredCards: number;
  flashcards: {
    id: string;
    nextReview: Date;
    repetitions: number;
  }[];
}

const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Dashboard: React.FC<DashboardProps> = ({ totalCards, dueCards, masteredCards, flashcards }) => {
  const navigate = useNavigate();
  
  // Calculate cards due by day for next 7 days
  const cardsDueByDay: DueByDayCount[] = useMemo(() => {
    const now = new Date();
    const next7Days: DueByDayCount[] = [];
    
    // Initialize each day
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);
      next7Days.push({
        day: shortDays[date.getDay()],
        count: 0
      });
    }
    
    // Count cards due on each day
    flashcards.forEach(card => {
      const reviewDate = new Date(card.nextReview);
      const diffTime = Math.abs(reviewDate.getTime() - now.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7 && reviewDate >= now) {
        const dayIndex = (reviewDate.getDay() - now.getDay() + 7) % 7;
        next7Days[dayIndex].count += 1;
      }
    });
    
    return next7Days;
  }, [flashcards]);
  
  const completionRate = totalCards ? Math.round((masteredCards / totalCards) * 100) : 0;
    // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >      {/* Stats Cards with enhanced animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <StatsCard 
            title="Total Cards" 
            value={totalCards} 
            icon={<BookOpen className="text-blue-400" />} 
            threshold={50}
            max={100}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard 
            title="Due Today" 
            value={dueCards} 
            variant={dueCards > 0 ? "danger" : "success"} 
            icon={<Calendar className={dueCards > 0 ? "text-red-400" : "text-green-400"} />}
            threshold={5}
            max={20}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard 
            title="Mastery Rate" 
            value={completionRate} 
            growth={"+5%"}
            variant="success" 
            icon={<Award className="text-yellow-400" />}
            threshold={75}
            max={100}
          />
        </motion.div>
      </div>
        {/* Charts and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Reviews Chart */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="flex items-center justify-between mb-4"
              >
                <h3 className="text-xl font-bold">Upcoming Reviews</h3>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatDelay: 5,
                    duration: 1
                  }}
                >
                  <BarChart className="h-5 w-5 text-blue-500" />
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="h-64"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChartComponent data={cardsDueByDay}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                      formatter={(value) => [`${value} cards`, 'Due']}
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid rgba(229, 231, 235, 0.5)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#barGradient)" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChartComponent>
                </ResponsiveContainer>
              </motion.div>
            </CardContent>
            
            {/* Animated bottom border */}
            <motion.div 
              className="h-1 bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
          </Card>
        </motion.div>
          {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="flex items-center justify-between mb-4"
              >
                <h3 className="text-xl font-bold">Quick Actions</h3>
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Clock className="h-5 w-5 text-blue-500" />
                </motion.div>
              </motion.div>
              
              <div className="space-y-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button 
                    variant="primary"
                    className="w-full flex justify-between items-center"
                    onClick={() => navigate('/review')}
                    disabled={dueCards === 0}
                  >
                    <div className="flex items-center">
                      <motion.div
                        animate={{ 
                          rotate: dueCards > 0 ? [0, 15, 0, -15, 0] : 0 
                        }}
                        transition={{ 
                          repeat: dueCards > 0 ? Infinity : 0, 
                          repeatDelay: 4,
                          duration: 1.5
                        }}
                      >
                        <Clock className="mr-2 h-5 w-5" />
                      </motion.div>
                      Start Review Session
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button 
                    variant="outline"
                    className="w-full flex justify-between items-center"
                    onClick={() => navigate('/create')}
                  >
                    <div className="flex items-center">
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Plus className="mr-2 h-5 w-5" />
                      </motion.div>
                      Create New Card
                    </div>
                    <motion.div
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button 
                    variant="secondary"
                    className="w-full flex justify-between items-center"
                    onClick={() => navigate('/stats')}
                  >
                    <div className="flex items-center">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <BarChart className="mr-2 h-5 w-5" />
                      </motion.div>
                      View Detailed Stats
                    </div>
                    <motion.div
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
              
              {/* Study Tip with animated effects */}
              <motion.div 
                className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 relative overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Decorative sparkle */}
                <motion.div 
                  className="absolute -top-2 -right-2 text-blue-400"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatDelay: 3,
                    duration: 1.5
                  }}
                >
                  <Sparkles size={16} />
                </motion.div>
                
                <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm">Study Tip</h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                  Regular review of flashcards, even for just 10 minutes a day, significantly improves long-term retention.
                </p>
              </motion.div>
            </CardContent>
            
            {/* Animated bottom border */}
            <motion.div 
              className="h-1 bg-gradient-to-r from-purple-500 to-blue-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
