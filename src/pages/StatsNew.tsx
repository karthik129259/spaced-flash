// Stats.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import StatsCard from '../components/StatsCard';
import { 
  ActivitySquare, 
  Brain, 
  Calendar, 
  CheckSquare, 
  Clock,
  Award,
  LineChart as LineChartIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

// Custom CSS for enhanced effects
const styles = `
  .shadow-glow {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  .drop-shadow-glow {
    filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
  }

  @keyframes pulse-glow {
    0% { filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.3)); }
    50% { filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.6)); }
    100% { filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.3)); }
  }

  .animate-pulse-glow {
    animation: pulse-glow 2s infinite;
  }
  
  .bar-highlight-hover:hover {
    filter: brightness(1.1) saturate(1.2);
    transition: filter 0.2s ease-out;
  }
`;

interface Stat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
}

interface StatsProps {
  stats: Stat[];
}

// Sample data for charts
const sampleActivityData = [
  { day: 'Mon', cards: 25 },
  { day: 'Tue', cards: 40 },
  { day: 'Wed', cards: 30 },
  { day: 'Thu', cards: 22 },
  { day: 'Fri', cards: 38 },
  { day: 'Sat', cards: 50 },
  { day: 'Sun', cards: 42 },
];

const sampleRetentionData = [
  { month: 'Jan', retention: 65 },
  { month: 'Feb', retention: 72 },
  { month: 'Mar', retention: 75 },
  { month: 'Apr', retention: 80 },
  { month: 'May', retention: 85 },
];

// Mastery distribution data
const masteryDistribution = [
  { name: 'Mastered', value: 45, color: '#10B981' },
  { name: 'Learning', value: 30, color: '#3B82F6' },
  { name: 'Needs Review', value: 15, color: '#F59E0B' },
  { name: 'Difficult', value: 10, color: '#EF4444' }
];

const Stats: React.FC<StatsProps> = ({ 
  stats = [
    { id: '1', label: 'Total Cards', value: 120 },
    { id: '2', label: 'Mastery Rate', value: 68 },
    { id: '3', label: 'Due Today', value: 15 },
    { id: '4', label: 'Cards Reviewed', value: 64 },
    { id: '5', label: 'Avg. Ease', value: 2.6 }
  ] 
}) => {
  // Inject custom styles when component mounts
  React.useEffect(() => {
    // Add the styles to the document
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Chart animation state
  const [chartAnimation, setChartAnimation] = useState(false);

  // Trigger animations periodically
  useEffect(() => {
    // Initial animation on mount
    setChartAnimation(true);
    setTimeout(() => setChartAnimation(false), 2500);
    
    // Set up periodic animations
    const timer = setInterval(() => {
      setChartAnimation(true);
      setTimeout(() => setChartAnimation(false), 2500);
    }, 8000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      className="max-w-6xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        Performance Stats
      </motion.h1>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
        <StatsCard 
          title="Total Cards" 
          value={stats.find(s => s.id === '1')?.value || 0} 
          icon={<Brain />} 
          max={200}
          threshold={100}
          animate={true}
        />
        <StatsCard 
          title="Mastery Rate" 
          value={stats.find(s => s.id === '2')?.value || 0} 
          growth="+5%" 
          variant="success" 
          icon={<CheckSquare />}
          max={100}
          threshold={65}
          animate={true}
        />
        <StatsCard 
          title="Due Today" 
          value={stats.find(s => s.id === '3')?.value || 0} 
          icon={<Calendar />}
          max={30}
          threshold={10}
          animate={true}
        />
        <StatsCard 
          title="Cards Reviewed" 
          value={stats.find(s => s.id === '4')?.value || 0} 
          growth="+12%" 
          variant="success" 
          icon={<ActivitySquare />} 
          max={100}
          threshold={50}
          animate={true}
        />
        <StatsCard 
          title="Avg. Ease" 
          value={stats.find(s => s.id === '5')?.value || 0} 
          icon={<Clock />}
          max={3.0}
          threshold={2.5}
          animate={true}
        />
      </div>
      
      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="shadow-lg border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4">
              <div className="flex items-center space-x-3">
                <ActivitySquare className="text-white h-5 w-5" />
                <h2 className="text-white text-lg font-bold">Daily Activity</h2>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sampleActivityData}>
                    <defs>
                      <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="day" tick={{ fill: 'var(--color-text-secondary)' }} />
                    <YAxis tick={{ fill: 'var(--color-text-secondary)' }} width={30} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-card-background)',
                        borderColor: 'var(--color-border)',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cards" 
                      stroke="#3B82F6" 
                      fillOpacity={1}
                      fill="url(#colorCards)"
                      strokeWidth={2}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Mastery Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="shadow-lg border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
              <div className="flex items-center space-x-3">
                <Award className="text-white h-5 w-5" />
                <h2 className="text-white text-lg font-bold">Mastery Distribution</h2>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={masteryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={1}
                      dataKey="value"
                      animationDuration={1500}
                      animationEasing="ease-out"
                    >
                      {masteryDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value} cards`, 'Count']}
                      contentStyle={{ 
                        backgroundColor: 'var(--color-card-background)',
                        borderColor: 'var(--color-border)',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      formatter={(value, entry, index) => (
                        <span className="text-gray-700 dark:text-gray-300">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Retention Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-lg border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-4">
              <div className="flex items-center space-x-3">
                <LineChartIcon className="text-white h-5 w-5" />
                <h2 className="text-white text-lg font-bold">Retention Rate</h2>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sampleRetentionData}>
                    <defs>
                      <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)' }} />
                    <YAxis 
                      domain={[50, 100]} 
                      tick={{ fill: 'var(--color-text-secondary)' }}
                      width={30}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Retention']}
                      contentStyle={{ 
                        backgroundColor: 'var(--color-card-background)',
                        borderColor: 'var(--color-border)',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="retention" 
                      stroke="#10B981"
                      fill="url(#colorRetention)"
                      strokeWidth={3}
                      animationDuration={1500}
                      activeDot={{ r: 6, stroke: "#047857", strokeWidth: 2, fill: "#10B981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Learning Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <Card className="shadow-lg border-gray-200 dark:border-gray-800">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4">
            <h2 className="text-white text-lg font-bold">Tips to Improve Retention</h2>
          </div>
          <CardContent className="p-6">
            <ul className="space-y-4">
              {[
                "Review cards regularly, especially those marked as difficult",
                "Create concise, clear flashcards with one concept per card",
                "Use mnemonic techniques to help with memorization",
                "Organize cards with tags to group related concepts",
                "Trust the spaced repetition algorithm - it's scientifically proven!"
              ].map((tip, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="mt-1 flex-shrink-0">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                      {index + 1}
                    </span>
                  </div>
                  <p>{tip}</p>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Stats;
