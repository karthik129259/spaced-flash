// Home.tsx
import React, { useEffect, useState, useRef } from 'react';
import Dashboard from '../components/Dashboard';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { 
  BookOpen, 
  BarChart2, 
  PlusCircle, 
  ChevronRight, 
  Target, 
  ArrowDown, 
  Brain, 
  Lightbulb,
  Sparkles,
  Clock,
  Award
} from 'lucide-react';
import '../styles/3d-animations.css';
import '../styles/immersive-animations.css';

interface HomeProps {
  totalCards: number;
  dueCards: number;
  masteredCards: number;
  flashcards?: any[]; // Ideally should be properly typed
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  textColor: string;
  delay: number;
}

// Feature data array for the features section
const features: Feature[] = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Spaced Repetition",
    description: "Leverages cognitive science to present cards at optimal intervals for long-term memory retention",
    color: "bg-blue-50 dark:bg-blue-900/30",
    textColor: "text-blue-600 dark:text-blue-400",
    delay: 0
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: "Smart Algorithm",
    description: "Adapts to your performance, focusing more on difficult cards and less on mastered ones",
    color: "bg-purple-50 dark:bg-purple-900/30",
    textColor: "text-purple-600 dark:text-purple-400",
    delay: 0.2
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Progress Insights",
    description: "Rich visualizations of your learning progress to keep you motivated and on track",
    color: "bg-teal-50 dark:bg-teal-900/30",
    textColor: "text-teal-600 dark:text-teal-400",
    delay: 0.4
  }
];

const Home: React.FC<HomeProps> = ({ 
  totalCards, 
  dueCards, 
  masteredCards, 
  flashcards = [] 
}) => {
  // Mouse position for 3D effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  // Track mouse movement for interactive 3D effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const moveX = clientX - centerX;
    const moveY = clientY - centerY;
    
    // Normalize values to between -20 and 20 degrees for rotation
    mouseX.set(moveX / width * 40);
    mouseY.set(moveY / height * -40);
  };

  useEffect(() => {
    const unsubscribeX = mouseX.onChange((latest: number) => {
      rotateY.set(latest);
    });
    
    const unsubscribeY = mouseY.onChange((latest: number) => {
      rotateX.set(latest);
    });
    
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, rotateX, rotateY]);

  // Track scroll position for section animations
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const y3 = useTransform(scrollY, [0, 500], [0, -200]);
  const y4 = useTransform(scrollY, [500, 1000], [0, -100]);
  const opacity1 = useTransform(scrollY, [100, 300], [1, 0]);
  const opacity2 = useTransform(scrollY, [300, 500], [0, 1]);
  const opacity3 = useTransform(scrollY, [700, 900], [0, 1]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // References to sections for scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // For tracking active section in UI
  const [activeSection, setActiveSection] = useState(0);
  
  // For animated elements
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isMouseInside, setIsMouseInside] = useState(false);
  // Handle scroll to section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track section visibility for animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      if (heroRef.current && scrollPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight) {
        setActiveSection(0);
      } else if (featuresRef.current && scrollPosition < featuresRef.current.offsetTop + featuresRef.current.offsetHeight) {
        setActiveSection(1);
      } else if (cardsRef.current && scrollPosition < cardsRef.current.offsetTop + cardsRef.current.offsetHeight) {
        setActiveSection(2);
      } else if (dashboardRef.current) {
        setActiveSection(3);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Card variants for animations
  const cardVariants = {
    initial: { opacity: 0, y: 50, rotateX: 10, rotateY: -10 },
    animate: (index: number) => ({ 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: { 
        delay: 0.2 * index,
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: { 
      y: -15,
      boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
      backgroundColor: "var(--color-primary-50)"
    }
  };

  // Animated elements for the hero section
  const titleLetters = "SpacedFlash".split('');
  
  return (
    <div className="scroll-snap-container bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Fixed navigation dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col items-center space-y-4">
          {[heroRef, featuresRef, cardsRef, dashboardRef].map((ref, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(ref)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === index 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400'
              }`}
              aria-label={`Scroll to section ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="scroll-snap-section relative flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          style={{ opacity: opacity1 }}
        >
          <motion.div 
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
            style={{ y: y1 }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-40 -right-32 w-[40rem] h-[40rem] rounded-full bg-purple-500/10 blur-3xl"
            style={{ y: y2 }}
            animate={{
              scale: [1.1, 0.9, 1.1],
              rotate: [0, -10, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div 
            className="absolute bottom-0 left-1/3 w-[30rem] h-[30rem] rounded-full bg-teal-500/10 blur-3xl"
            style={{ y: y3 }}
            animate={{
              scale: [0.8, 1.1, 0.8],
              x: [0, 50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
        </motion.div>
        
        <div className="perspective-container relative z-10 max-w-6xl mx-auto px-4 py-12 text-center">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="wave-animation inline-flex mb-4">
              {titleLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  className="text-6xl md:text-7xl lg:text-8xl font-bold text-3d"
                  style={{
                    color: index < 6 ? 'rgb(29, 78, 216)' : 'rgb(124, 58, 237)',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            
            <motion.div
              className="text-reveal-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.p 
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                Enhance your learning journey with advanced spaced repetition
              </motion.p>
            </motion.div>
          </motion.div>

          {/* 3D Call to action button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-8"
          >
            <Link to="/review" className="inline-block">
              <motion.button
                className="button-3d bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Learning Now
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            onClick={() => scrollToSection(featuresRef)}
          >
            <ArrowDown className="w-6 h-6 text-blue-600 dark:text-blue-400 cursor-pointer" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="scroll-snap-section relative flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 -z-10"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute rounded-full bg-blue-200 dark:bg-blue-600"
              style={{
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.4 + Math.random() * 0.3
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10,
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Why SpacedFlash Works
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our scientifically-backed approach uses spaced repetition to optimize your memory retention
            </motion.p>
          </motion.div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="perspective-container"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: feature.delay }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsMouseInside(true)}
                onMouseLeave={() => setIsMouseInside(false)}
              >
                <motion.div 
                  className="rotate-3d-hover h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  style={{
                    rotateX: isMouseInside ? rotateX : 0,
                    rotateY: isMouseInside ? rotateY : 0,
                  }}
                >
                  <div className={`${feature.color} rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 ${feature.textColor}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 mt-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section 
        ref={cardsRef}
        className="scroll-snap-section relative flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-900 -z-10"></div>
        
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-transition bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-teal-500/5"></div>
          
          <motion.svg
            className="absolute inset-0 w-full h-full opacity-30 dark:opacity-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.3 }}
            viewport={{ once: true }}
          >
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-blue-500/30"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </motion.svg>
        </div>
        
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Quick Access
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Jump right into learning with these quick actions
            </motion.p>
          </motion.div>
          
          {/* 3D Card Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            variants={{
              animate: {
                transition: { staggerChildren: 0.2 }
              }
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Start Review Session Card */}
            <motion.div
              custom={0}
              variants={cardVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredCard('review')}
              onHoverEnd={() => setHoveredCard(null)}
              className="card-3d-wrapper"
            >
              <Link to="/review" className="block h-full">
                <Card className="depth-effect h-full border-2 border-transparent hover:border-blue-400 transition-all duration-300 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-8 flex flex-col h-full">
                    <motion.div
                      className="depth-layer-1 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6"
                      animate={{ 
                        rotateY: hoveredCard === 'review' ? 360 : 0,
                        backgroundColor: hoveredCard === 'review' ? 'var(--color-primary-200)' : 'var(--color-primary-100)'
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      <BookOpen className="text-blue-600 dark:text-blue-400 h-8 w-8" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-3 depth-layer-1">Start Review Session</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                      Review your due cards and strengthen your memory with optimal spacing
                    </p>
                    
                    <motion.div 
                      className="depth-layer-2 flex items-center text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950/50 rounded-lg px-4 py-2"
                      animate={{ x: hoveredCard === 'review' ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Clock className="mr-2 h-5 w-5" /> 
                      <span>{dueCards} cards due</span>
                      <ChevronRight className="ml-auto h-5 w-5" />
                    </motion.div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            
            {/* Create Card */}
            <motion.div
              custom={1}
              variants={cardVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredCard('create')}
              onHoverEnd={() => setHoveredCard(null)}
              className="card-3d-wrapper"
            >
              <Link to="/create" className="block h-full">
                <Card className="depth-effect h-full border-2 border-transparent hover:border-purple-400 transition-all duration-300 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-8 flex flex-col h-full">
                    <motion.div
                      className="depth-layer-1 w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6"
                      animate={{ 
                        rotate: hoveredCard === 'create' ? 90 : 0,
                        backgroundColor: hoveredCard === 'create' ? 'var(--color-purple-200)' : 'var(--color-purple-100)'
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      <PlusCircle className="text-purple-600 dark:text-purple-400 h-8 w-8" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-3 depth-layer-1">Create Card</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                      Add new flashcards to your collection and expand your knowledge base
                    </p>
                    
                    <motion.div 
                      className="depth-layer-2 flex items-center text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-950/50 rounded-lg px-4 py-2"
                      animate={{ x: hoveredCard === 'create' ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Target className="mr-2 h-5 w-5" />
                      <span>Create flashcard</span>
                      <ChevronRight className="ml-auto h-5 w-5" />
                    </motion.div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            
            {/* View Stats */}
            <motion.div
              custom={2}
              variants={cardVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredCard('stats')}
              onHoverEnd={() => setHoveredCard(null)}
              className="card-3d-wrapper"
            >
              <Link to="/stats" className="block h-full">
                <Card className="depth-effect h-full border-2 border-transparent hover:border-teal-400 transition-all duration-300 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-8 flex flex-col h-full">
                    <motion.div
                      className="depth-layer-1 w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-6"
                      animate={{ 
                        scale: hoveredCard === 'stats' ? [1, 1.2, 1] : 1,
                        backgroundColor: hoveredCard === 'stats' ? 'var(--color-teal-200)' : 'var(--color-teal-100)'
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      <BarChart2 className="text-teal-600 dark:text-teal-400 h-8 w-8" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-3 depth-layer-1">View Detailed Stats</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                      Track your progress and analyze your learning performance over time
                    </p>
                    
                    <motion.div 
                      className="depth-layer-2 flex items-center text-teal-600 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-950/50 rounded-lg px-4 py-2"
                      animate={{ x: hoveredCard === 'stats' ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Award className="mr-2 h-5 w-5" />
                      <span>{masteredCards} cards mastered</span>
                      <ChevronRight className="ml-auto h-5 w-5" />
                    </motion.div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Dashboard Section */}
      <section 
        ref={dashboardRef}
        className="scroll-snap-section relative min-h-screen flex flex-col items-center justify-start"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 to-slate-50 dark:from-gray-900 dark:to-gray-950 -z-10"></div>
        <div className="absolute inset-0 opacity-5">
          <svg className="h-full w-full">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor"></circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        
        {/* Content */}
        <motion.div
          className="w-full max-w-6xl mx-auto px-4 py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Learning Dashboard</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Track your progress and manage your flashcard collection
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glow-effect bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8"
          >
            <Dashboard 
              totalCards={totalCards}
              dueCards={dueCards}
              masteredCards={masteredCards}
              flashcards={flashcards}
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
