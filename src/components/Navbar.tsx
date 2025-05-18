import { useState, useEffect, useRef } from 'react';
import { Sparkles, Lightbulb, GraduationCap, Star, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

type NavItem = {
  name: string;
  href: string;
};

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Create', href: '/create' },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  
  // Enhanced parallax effects with more dramatic values
  const { scrollY } = useScroll();
  const logoScale = useTransform(scrollY, [0, 200], [1, 0.88]);
  const logoRotateY = useTransform(scrollY, [0, 100], [0, -8]);
  const logoRotateX = useTransform(scrollY, [0, 100], [0, 6]);
  const navOpacity = useTransform(scrollY, [0, 100], [1, 0.97]);
  const navY = useTransform(scrollY, [0, 150], [0, -10]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 15]);
  const navBgOpacity = useTransform(scrollY, [0, 100], [0.85, 0.98]);
  const scrollProgress = useTransform(scrollY, [0, 1000], [0, 100]);

  // Check if page is scrolled for glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse parallax effect for stars
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <motion.header 
      ref={navRef}
      style={{ 
        y: navY, 
        opacity: navOpacity,
        perspective: "2500px",
        transformStyle: "preserve-3d"
      }} 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 px-3 sm:px-5", 
        scrolled ? "backdrop-blur-2xl" : "",
        "bg-gray-900/85 shadow-xl shadow-blue-900/40",
        "overflow-hidden"
      )}
    >
      {/* Enhanced scroll progress indicator */}
      <motion.div 
        style={{ width: scrollProgress, transformStyle: "preserve-3d" }}
        className="absolute h-0.5 top-0 left-0 bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 z-50"
      />

      {/* Ultra enhanced 3D background with larger, more realistic stars */}
      <div className="absolute inset-0 overflow-hidden">      {/* Animated nebula background layer - optimized for performance */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(25, 30, 60, 0.5), rgba(5, 10, 30, 0))",
            transform: "translateZ(-50px)",
          }}
          initial={{ scale: 1, opacity: 0.15 }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.15, 0.2, 0.15]
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut"
          }}
        />

        {/* Optimized stars background with hardware acceleration */}
        {[...Array(20)].map((_, i) => (          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${3 + (i % 5) * 1.2}px`,
              height: `${3 + (i % 5) * 1.2}px`,
              left: `${(i * 4.7) % 100}%`,
              top: `${(i * 5.3) % 100}%`,
              background: `rgba(${170 + (i % 8) * 10}, ${190 + (i % 10) * 6}, 255, ${0.6 + (i % 5) * 0.07})`,
              boxShadow: `0 0 ${5 + (i % 6) * 2}px rgba(120, 160, 255, ${0.5 + (i % 5) * 0.1})`,
              transformStyle: "preserve-3d",
              transform: `translateZ(${(i % 10) * 6}px) translateX(${mousePosition.x * 0.01 * (1 + (i % 3))}px) translateY(${mousePosition.y * 0.01 * (1 + (i % 2))}px)`,
              willChange: "transform, opacity"
            }}
            animate={{
              opacity: [0.5, 0.9, 0.5],
              scale: [1, 1.3 + (i % 4) * 0.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + (i % 6),
              ease: "easeInOut",
              delay: (i % 8) * 0.3,
            }}
          />
        ))}          {/* Performance-optimized Star Clusters with enhanced SVG */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`star-cluster-${i}`}
            className="absolute"
            style={{
              left: `${(i * 12) % 100}%`,
              top: `${(i * 11 + 5) % 100}%`,
              transformStyle: "preserve-3d",
              transform: `translateZ(${(i % 6) * 10}px) translateX(${mousePosition.x * 0.01 * ((i % 3) + 1)}px) translateY(${mousePosition.y * 0.01 * ((i % 4) + 1)}px)`,
              willChange: "transform, opacity"
            }}
            animate={{
              scale: [0.8, 1.3, 0.8],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + i,
              ease: "easeInOut"
            }}
          >            <svg width={18 + i * 2} height={18 + i * 2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id={`star-cluster-gradient-${i}`} cx="50%" cy="50%" r="100%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="50%" stopColor={`rgba(${200 + i * 10}, ${220 + i * 5}, 255, 1)`} />
                  <stop offset="100%" stopColor={`rgba(${150 + i * 15}, ${180 + i * 10}, 255, 0.8)`} />
                </radialGradient>
              </defs>
              <path d="M12 2L14.2 9.2H22L15.9 13.8L18.1 21L12 16.4L5.9 21L8.1 13.8L2 9.2H9.8L12 2Z" 
                fill={`url(#star-cluster-gradient-${i})`} />
              <circle cx="12" cy="12" r={3 + i * 0.25} 
                fill={`rgba(${230 + i * 8}, ${240 + i * 5}, 255, ${0.6 + i * 0.08})`} />
            </svg>
          </motion.div>
        ))}
      </div>
      
      {/* Professional 3D effect layer behind navbar with enhanced gradient */}
      <motion.div 
        style={{
          opacity: navBgOpacity,
          backdropFilter: `blur(${navBlur.get()}px)`,
        }}
        className={cn(
          "absolute inset-0 -z-10",
          "bg-gradient-to-b from-gray-900/95 to-gray-800/85"
        )}
      />

      <nav className={cn(
        "max-w-7xl mx-auto py-5 px-5 sm:px-8 flex items-center justify-between gap-5",
        "glossy-dark",
        "rounded-xl transition-all duration-500 transform-gpu",
        "border border-gray-800/30 bg-gradient-to-b from-gray-900/95 to-gray-800/90",
        "shadow-lg shadow-blue-900/30",
        "transform-style-preserve-3d"
      )}>
        {/* Logo with dramatically enhanced 3D effect */}
        <motion.div 
          style={{ 
            scale: logoScale, 
            rotateX: logoRotateX,
            rotateY: logoRotateY,
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
          whileHover={{ 
            scale: 1.20, 
            rotateY: -18,
            rotateX: 12,
            z: 50,
            transition: { type: "spring", stiffness: 300, damping: 12 }
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className={cn(
            "text-3xl font-extrabold tracking-wide perspective-2500 relative",
            "text-white",
            "py-2 px-3 rounded-lg",
            "transform-gpu select-none"
          )}
        >
          {/* Animated 3D stars around the logo - Bigger, more realistic */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 20) - 15}%`,
                top: `${(i % 2 === 0 ? -18 : 110) + (i * 6)}%`,
                transformStyle: "preserve-3d",
                transform: `translateZ(${30 + i * 7}px)`,
                zIndex: 50
              }}
              animate={{
                rotate: [0, 360],
                y: [-(i * 4), (i * 4), -(i * 4)],
                scale: [0.7, 1.4, 0.7],
                opacity: [0.4, 0.9, 0.4],
                filter: [
                  "drop-shadow(0 0 2px rgba(150, 200, 255, 0.5))",
                  "drop-shadow(0 0 8px rgba(150, 200, 255, 0.8))",
                  "drop-shadow(0 0 2px rgba(150, 200, 255, 0.5))",
                ]
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + i * 0.6,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            >
              <svg width={10 + i * 2} height={10 + i * 2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.2 9.2H22L15.9 13.8L18.1 21L12 16.4L5.9 21L8.1 13.8L2 9.2H9.8L12 2Z" 
                  fill={`rgb(${170 + i * 15}, ${190 + i * 10}, 255)`} />
            </svg>
            </motion.div>
          ))}
          
          {/* Icon with enhanced 3D effect */}          <motion.div
            className="absolute -left-10 block"
            style={{ transform: "translateZ(35px)" }}
            animate={{ 
              rotateY: [0, 360], 
              scale: [1, 1.3, 1],
              filter: [
                "drop-shadow(0 0 5px rgba(59, 130, 246, 0.6))",
                "drop-shadow(0 0 20px rgba(59, 130, 246, 0.9))",
                "drop-shadow(0 0 5px rgba(59, 130, 246, 0.6))",
              ]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              },
              filter: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <GraduationCap className="w-9 h-9 text-blue-300" />
          </motion.div>
          
          <span 
            className="inline-block transform px-1 text-white drop-shadow-lg"
            style={{ transform: "translateZ(30px)" }}
          >
            Flash
          </span>
          
          <motion.span 
            initial={{ opacity: 0.9, y: 50, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{ transform: "translateZ(40px)" }}
            transition={{ duration: 1, type: "spring", stiffness: 200 }}
            className={cn(
              "text-blue-300 inline-block",
              "neon-border-blue rounded px-3 py-0 ml-1",
              "shadow-lg",
              "bg-gradient-to-r from-blue-600/40 to-purple-600/40"
            )}
          >
            Learn
          </motion.span>
          
          {/* Multiple animated sparkles for enhanced effect */}
          {[...Array(4)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0.5, 1.8, 0.5],
                y: [0, -12 - (i * 6), 0],
                x: [i * 6, i * 12, i * 6],
                rotate: [0, 180 + (i * 90), 0]
              }}
              transition={{ 
                repeat: Infinity, 
                repeatDelay: 1 + i * 0.5,
                duration: 2.5 - (i * 0.3),
                delay: i * 0.8
              }}
              className="absolute -top-2 -right-4 text-yellow-300 filter drop-shadow-lg"
              style={{ transform: `translateZ(${30 + i * 12}px)` }}
            >
              <Sparkles className={`w-${5 + i} h-${5 + i}`} />
            </motion.span>
          ))}
          
          {/* Enhanced 3D glow effect with pulsating animation */}
          <motion.div 
            className="absolute inset-0 rounded-lg -z-10 blur-xl bg-blue-500/30"
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scale: [0.95, 1.08, 0.95],
              filter: [
                "blur(10px) brightness(1)",
                "blur(18px) brightness(1.8)",
                "blur(10px) brightness(1)"
              ]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut"
            }}
          />
          
          {/* 3D depth shadow with enhanced effect */}
          <div 
            className="absolute inset-0 rounded-lg -z-20 blur-2xl opacity-40 bg-blue-400/30" 
            style={{ transform: "translateZ(-25px) translateY(10px) scale(0.85)" }} 
          />
        </motion.div>
          {/* Desktop Nav with enhanced 3D hover effects and significantly increased spacing */}
        <div className="hidden md:flex items-center space-x-8 lg:space-x-10 ml-8 mr-4">
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.15 * index,
                type: "spring",
                stiffness: 200
              }}
              style={{ 
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
              }}              whileHover={{ 
                scale: 1.18,
                y: -8, 
                rotateX: 18,
                rotateY: 12,
                z: 50,
                transition: { type: "spring", stiffness: 350, damping: 7 }
              }}
              className={cn(
                "text-gray-100 transition-all duration-300",
                "text-base font-semibold tracking-wide",
                "px-4 py-2.5 rounded-lg hover:text-blue-300",
                "perspective-2000 backdrop-blur-sm transform-style-preserve-3d",
                "border border-gray-700/40",
                "hover:border-blue-500/50 hover:border-opacity-90",
                "shadow-md shadow-gray-900/20",
                "hover:shadow-lg hover:shadow-blue-600/30",
                "bg-gray-800/60 hover:bg-gray-800/80"
              )}
            >
              {/* Enhanced 3D effect for text with larger star */}
              <span style={{ transform: "translateZ(20px)" }} className="relative flex items-center">                {/* Larger animated star with enhanced 3D glow effect and realism */}
                <motion.div 
                  className={cn(
                    "absolute -left-[18px] -top-[16px]",
                    "text-blue-400 filter"
                  )}
                  animate={{ 
                    scale: [0.7, 1.5, 0.7],
                    rotate: [0, 25, 0, -25, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatDelay: 1 + index * 0.8,
                    duration: 3
                  }}
                  style={{ 
                    transform: "translateZ(35px)",
                    filter: "drop-shadow(0 0 12px rgba(96, 165, 250, 0.8))"
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id={`star-gradient-${index}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="white" />
                        <stop offset="60%" stopColor="#93c5fd" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </radialGradient>
                      <filter id={`star-glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 25 -7" result="glow" />
                        <feBlend in="SourceGraphic" in2="glow" mode="normal" />
                      </filter>
                    </defs>
                    <path d="M12 2L14.2 9.2H22L15.9 13.8L18.1 21L12 16.4L5.9 21L8.1 13.8L2 9.2H9.8L12 2Z" 
                      fill={`url(#star-gradient-${index})`} 
                      filter={`url(#star-glow-${index})`} />
                    <path d="M12 2L14.2 9.2H22L15.9 13.8L18.1 21L12 16.4L5.9 21L8.1 13.8L2 9.2H9.8L12 2Z" 
                      fill="rgba(255,255,255,0.5)" 
                      transform="scale(0.85)" />
                  </svg>
                </motion.div>
                {item.name}
              </span>
            </motion.a>
          ))}
            {/* Ultra-enhanced action button with dramatic 3D effects and cosmic feel */}
          <motion.div
            whileHover={{ scale: 1.18, z: 60, rotateX: 12, rotateY: -15 }}
            whileTap={{ scale: 0.9, rotateX: -8 }}
            style={{ 
              transformStyle: "preserve-3d",
              perspective: "1500px",
              marginLeft: "20px"
            }}
            className="block"
          >
            <Button
              variant="primary"
              size="default"
              className={cn(
                "rounded-lg font-bold transition-all duration-300",
                "text-lg tracking-wider",
                "transform-style-preserve-3d",
                "border-2",
                "bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600",
                "border-blue-400/60",
                "shadow-xl shadow-blue-700/50",
                "px-7 py-3.5"
              )}
              style={{ transformStyle: "preserve-3d" }}
            >
              <span style={{ transform: "translateZ(35px)" }} className="flex items-center gap-3.5">
                <Lightbulb className="w-5 h-5 filter drop-shadow-md" />
                <span>Get Started</span>
                
                {/* Animated particles around the button */}
                <motion.span
                  className="absolute -right-2 -top-2"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [0.8, 1.4, 0.8],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  }}
                  style={{ transform: "translateZ(30px)" }}
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                </motion.span>
                
                {/* Enhanced interactive orbiting star system */}
                <motion.div
                  className="absolute"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ 
                    transformOrigin: "center center",
                    transform: "translateZ(25px)"
                  }}
                >
                  {[...Array(3)].map((_, idx) => (
                    <motion.div
                      key={`orbit-star-${idx}`}
                      className="absolute"
                      style={{
                        left: `${10 + (idx * 15)}px`,
                        top: `${(idx % 2 === 0 ? -15 : -5)}px`,
                      }}
                      animate={{
                        scale: [0.6, 1, 0.6],
                        opacity: [0.6, 1, 0.6],
                        filter: [
                          "drop-shadow(0 0 2px rgba(255, 255, 200, 0.4))",
                          "drop-shadow(0 0 6px rgba(255, 255, 200, 0.8))",
                          "drop-shadow(0 0 2px rgba(255, 255, 200, 0.4))",
                        ]
                      }}
                      transition={{
                        duration: 2 + idx * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.3
                      }}
                    >
                      <svg width={8 + idx * 2} height={8 + idx * 2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L14.2 9.2H22L15.9 13.8L18.1 21L12 16.4L5.9 21L8.1 13.8L2 9.2H9.8L12 2Z" fill="currentColor" className="text-yellow-200" />
                      </svg>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Interactive tooltip on hover */}
                <motion.div
                  className="absolute -bottom-10 bg-gray-800/90 text-blue-200 text-xs font-medium px-3 py-1.5 rounded-md shadow-lg backdrop-blur-md border border-blue-500/30"
                  initial={{ opacity: 0, y: -5, scale: 0.9 }}
                  whileHover={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ transform: "translateZ(40px)" }}
                >
                  Begin your learning journey
                </motion.div>
              </span>
              
              {/* Inner glow effect */}
              <motion.div
                className="absolute inset-0 rounded-lg -z-10 opacity-60 bg-blue-400/40 blur-md"
                animate={{ 
                  scale: [0.85, 1.08, 0.85],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
            </Button>
          </motion.div>
        </div>
        
        {/* Dramatically enhanced Mobile Menu Icon with 3D animation */}
        <div className="md:hidden flex items-center">
          <motion.div
            whileTap={{ scale: 0.8, rotate: 12, z: 15 }}
            whileHover={{ scale: 1.2, rotateY: 25, z: 40 }}
            style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
            className="relative"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
              className={cn(
                "rounded-full p-2.5",
                "bg-gray-800/95 border-2 border-blue-500/60",
                "shadow-lg shadow-blue-500/30",
                menuOpen ? "neon-border-purple" : "neon-border-blue"
              )}
              style={{ transformStyle: "preserve-3d" }}
            >
              {menuOpen ? (
                <motion.div
                  initial={{ rotate: 0, scale: 0.8 }}
                  animate={{ 
                    rotate: 180,
                    scale: [1, 1.3, 1],
                  }}
                  transition={{ 
                    duration: 0.6,
                    scale: {
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    }
                  }}
                  style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
                  className="text-purple-300 drop-shadow-lg"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    scale: {
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    }
                  }}
                  style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
                  className="text-blue-300 drop-shadow-lg"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              )}
            </Button>
            
            {/* Enhanced glow effect */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full -z-10 blur-xl",
                menuOpen ? "bg-purple-500/40" : "bg-blue-500/40"
              )}
              animate={{ 
                scale: [0.8, 1.4, 0.8], 
                opacity: [0.4, 0.9, 0.4],
                filter: [
                  "blur(8px) brightness(1)",
                  "blur(15px) brightness(1.4)",
                  "blur(8px) brightness(1)"
                ]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut" 
              }}
            />
            
            {/* Orbiting star effect */}
            <motion.div
              className="absolute w-3 h-3 text-blue-300"
              animate={{
                rotate: [0, 360],
                x: [0, 18, 0, -18, 0],
                y: [0, -18, 0, 18, 0],
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 3, ease: "linear" },
                x: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              }}
              style={{ transform: "translateZ(35px)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.2 9.2H22L15.9 13.8L18.1 21L12 16.4L5.9 21L8.1 13.8L2 9.2H9.8L12 2Z" fill="currentColor" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </nav>
      
      {/* Dramatically enhanced Mobile Nav Dropdown with 3D animations */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0, rotateX: -25, y: -20 }}
            animate={{ height: "auto", opacity: 1, rotateX: 0, y: 0 }}
            exit={{ height: 0, opacity: 0, rotateX: -15, y: -10 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.23, 1, 0.32, 1],
              opacity: { duration: 0.5 },
              rotateX: { duration: 0.8, type: "spring", stiffness: 80, damping: 15 }
            }}
            style={{ 
              transformOrigin: "top center",
              perspective: "2000px",
              transformStyle: "preserve-3d"
            }}
            className={cn(
              "md:hidden px-6 py-5 pb-7 space-y-4 overflow-hidden", 
              "bg-gradient-to-b from-gray-900/95 via-gray-800/95 to-gray-900/95", 
              "glossy-dark border-2 border-blue-500/30",
              "shadow-2xl rounded-2xl mx-2 mt-2",
              "backdrop-blur-xl"
            )}
          >
            {/* Enhanced decorative mobile menu elements */}
            <div className="relative h-2 flex justify-center items-center">
              <motion.div
                initial={{ width: "10%", opacity: 0 }}
                animate={{ width: "40%", opacity: 1 }}
                className="h-1 bg-blue-500/60 rounded-full"
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              
              {/* Animated dots on the line */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-blue-400"
                  style={{ left: `${25 + (i * 18)}%` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 1],
                    opacity: [0, 1, 0.8]
                  }}
                  transition={{ 
                    delay: 0.3 + (i * 0.15),
                    duration: 0.5 
                  }}
                />
              ))}
            </div>
            
            {/* Enhanced star field in mobile menu background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.random() * 3 + 1.5}px`,
                    height: `${Math.random() * 3 + 1.5}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: `rgba(${180 + Math.random() * 75}, ${200 + Math.random() * 55}, 255, ${Math.random() * 0.6 + 0.4})`,
                    boxShadow: `0 0 ${Math.random() * 6 + 2}px rgba(100, 150, 255, ${Math.random() * 0.5 + 0.3})`,
                    transformStyle: "preserve-3d",
                    transform: `translateZ(${Math.random() * 30}px)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.9, 0.3],
                    scale: [1, Math.random() * 2.5 + 1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: Math.random() * 4 + 3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ x: -50, opacity: 0, rotateY: -30, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ 
                  delay: 0.1 * index, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }}
                whileHover={{ 
                  x: 10, 
                  scale: 1.1,
                  rotateX: 8,
                  rotateY: 8,
                  z: 30,
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
                style={{
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d"
                }}
                className={cn(
                  "block hover:text-blue-300", 
                  "transition-all duration-300 font-semibold py-5 px-5 rounded-xl tracking-wide",
                  "border border-blue-500/30",
                  "text-blue-100",
                  "bg-gradient-to-r from-gray-800/90 to-gray-900/90",
                  "hover:bg-gradient-to-r hover:from-blue-900/40 hover:to-purple-900/40",
                  "shadow-md shadow-black/40",
                  "hover:shadow-xl hover:shadow-blue-900/30",
                  "flex items-center relative",
                  "mb-2"
                )}
              >
                {/* Animated 3D star indicator with enhanced effects */}
                <motion.div 
                  className="mr-4 text-blue-400"
                  animate={{ 
                    scale: [1, 1.6, 1],
                    rotate: [0, 180, 360],
                    opacity: [0.7, 1, 0.7],
                    filter: [
                      "drop-shadow(0 0 3px rgba(96, 165, 250, 0.3))",
                      "drop-shadow(0 0 10px rgba(96, 165, 250, 0.8))",
                      "drop-shadow(0 0 3px rgba(96, 165, 250, 0.3))",
                    ]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatDelay: 1 + index * 0.7, 
                    duration: 3
                  }}
                  style={{ transform: `translateZ(${15 + index * 3}px)` }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L14.2 9.2H22L15.9 13.8L18.1 21L12 16.4L5.9 21L8.1 13.8L2 9.2H9.8L12 2Z" fill="currentColor" />
                  </svg>
                </motion.div>
                
                {/* Text with enhanced 3D effect */}
                <span 
                  style={{ transform: "translateZ(20px)" }}
                  className="text-lg"
                >
                  {item.name}
                </span>
                
                {/* 3D glow effect around text */}
                <motion.div
                  className="absolute inset-0 rounded-lg -z-10 opacity-0 bg-blue-500/30 blur-md"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Animated particles */}
                <motion.div
                  animate={{
                    x: [0, 8, 0, -8, 0],
                    opacity: [0, 0.9, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: index * 0.3
                  }}
                  className="absolute right-4 text-blue-400/70"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </motion.a>
            ))}
            
            <motion.div
              initial={{ x: -50, opacity: 0, rotateY: -30, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ 
                delay: 0.1 * navItems.length, 
                duration: 0.6,
                type: "spring",
                stiffness: 80,
                damping: 10
              }}
              style={{
                transformOrigin: "center center",
                perspective: "2000px",
                transformStyle: "preserve-3d"
              }}
              className="mt-7 relative"
            >
              {/* Main CTA button with enhanced 3D animations */}
              <motion.div
                whileHover={{ 
                  scale: 1.08, 
                  z: 40,
                  rotateX: 8,
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
                whileTap={{ scale: 0.95, rotateX: -5 }}
                className="relative perspective-2500"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Button
                  className={cn(
                    "w-full py-7 px-4 justify-center",
                    "transition-all duration-500 transform",
                    "rounded-xl border-2",
                    "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700",
                    "border-blue-400/60",
                    "shadow-xl shadow-blue-900/50",
                    "text-white font-bold text-xl tracking-wider",
                    "overflow-hidden"
                  )}
                >
                  <span 
                    className="flex items-center gap-3 relative z-10"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <Lightbulb className="w-6 h-6 filter drop-shadow-md" />
                    <span className="drop-shadow-md">Get Started Now</span>
                  </span>
                  
                  {/* Animated background effect */}
                  <motion.div 
                    className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-600/30 to-blue-400/40"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%'],
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      backgroundPosition: {
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 3,
                      },
                      scale: {
                        repeat: Infinity,
                        duration: 2,
                      }
                    }}
                  />
                </Button>
                
                {/* Animated 3D stars around the button */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 80 + 10}%`,
                      zIndex: 20,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [0.6, 1.5, 0.6],
                      opacity: [0.3, 0.95, 0.3],
                      x: [-(i * 6), (i * 6), -(i * 6)],
                      y: [-(i * 4), (i * 4), -(i * 4)],
                      filter: [
                        "drop-shadow(0 0 2px rgba(255, 255, 255, 0.4))",
                        "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))",
                        "drop-shadow(0 0 2px rgba(255, 255, 255, 0.4))",
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2 + i * 0.6,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                  >
                    <svg 
                      width={8 + i*1.5} height={8 + i*1.5} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.7))" }}
                    >
                      <path d="M12 2L14.2 9.2H22L15.9 13.8L18.1 21L12 16.4L5.9 21L8.1 13.8L2 9.2H9.8L12 2Z" 
                        fill="white" />
                    </svg>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Inner glow effect for the button */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-xl blur-xl bg-blue-500/40"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.9, 1.12, 0.9],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
              
              {/* Additional sparkle elements */}
              <motion.div
                className="absolute -top-3 -right-3 text-blue-200"
                animate={{
                  rotate: [0, 360],
                  scale: [0.8, 1.6, 0.8],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                style={{ transform: "translateZ(50px)" }}
              >
                <Sparkles className="w-7 h-7" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced 3D shadow effect with dramatic parallax */}
      <motion.div
        className="absolute left-3 right-3 h-1/2 -bottom-4 -z-10 blur-2xl rounded-full bg-blue-600/30"
        style={{ 
          scaleX: 0.92,
          transformOrigin: "center bottom",
          y: useTransform(scrollY, [0, 100], [0, 10]),
          opacity: useTransform(scrollY, [0, 100], [0.5, 0.95]),
          filter: `blur(${useTransform(scrollY, [0, 100], [15, 30]).get()}px)`
        }}
      />
      
      {/* Second shadow layer for depth */}
      <motion.div
        className="absolute left-10 right-10 h-1/3 -bottom-6 -z-20 blur-3xl rounded-full bg-purple-700/20"
        style={{ 
          scaleX: 0.95,
          transformOrigin: "center bottom",
          y: useTransform(scrollY, [0, 100], [0, 15]),
          opacity: useTransform(scrollY, [0, 100], [0.3, 0.7]),
        }}
      />
        {/* Ultra-enhanced cosmic nebula effect in the background */}
      <div className="absolute inset-0 -z-30 overflow-hidden opacity-50">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/12 to-purple-900/20"
          animate={{
            opacity: [0.5, 0.7, 0.5],
            filter: [
              'blur(20px) brightness(1)',
              'blur(25px) brightness(1.2)',
              'blur(20px) brightness(1)'
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut"
          }}
        />
        
        {/* Animated nebula particles with enhanced color and glow */}
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 5 + 1.5}px`,
              height: `${Math.random() * 5 + 1.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${Math.random() * 100 + 120}, ${Math.random() * 100 + 120}, 255, ${Math.random() * 0.6 + 0.3})`,
              boxShadow: `0 0 ${Math.random() * 12 + 6}px rgba(100, 150, 255, ${Math.random() * 0.4 + 0.2})`,
              filter: `blur(${Math.random() * 3 + 1}px)`,
            }}
            animate={{
              opacity: [0.2, Math.random() * 0.6 + 0.4, 0.2],
              scale: [1, Math.random() * 1.8 + 1.2, 1],
              x: [0, Math.random() * 12 - 6, 0],
              y: [0, Math.random() * 12 - 6, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 6 + 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Scroll progress indicator */}
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
        style={{ 
          width: useTransform(
            scrollY, 
            [0, document.body?.scrollHeight - window.innerHeight || 1000], 
            ["0%", "100%"]
          ),
          opacity: useTransform(scrollY, [0, 100], [0, 1]),
          filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
        }}
      />
    </motion.header>
  );
};

export default Navbar;
