import { ReactNode, useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import { motion, useSpring, useTransform } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
  growth?: string; // e.g., "+15%"
  variant?: 'default' | 'success' | 'danger';
  animate?: boolean;
  threshold?: number; // For upcoming reviews threshold
  max?: number; // For progress bars and visualizations
}

const variantStyles = {
  default: 'text-gray-200',
  success: 'text-green-400',
  danger: 'text-red-400',
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  className,
  growth,
  variant = 'default',
  animate = true,
  threshold = 10,
  max = 100
}) => {
  // For animated counting effect
  const [animatedValue, setAnimatedValue] = useState(0);
  const spring = useSpring(0, { stiffness: 80, damping: 15 });
  const displayValue = useTransform(spring, Math.round);
  
  // For progress bar
  const progressWidth = useTransform(spring, [0, max], ["0%", "100%"]);
  const progressOpacity = useTransform(spring, [0, threshold / 2, threshold], [0.4, 0.7, 1]);
  const progressColor = useTransform(
    spring, 
    [0, threshold / 2, threshold], 
    [
      "rgb(59, 130, 246)", // Blue
      "rgb(99, 102, 241)", // Indigo
      "rgb(139, 92, 246)"  // Purple
    ]
  );

  // Animate the value counting up
  useEffect(() => {
    if (typeof value === 'number' && animate) {
      const numericValue = Number(value);
      spring.set(numericValue);
      
      const animationTimer = setTimeout(() => {
        setAnimatedValue(numericValue);
      }, 300);
      
      return () => clearTimeout(animationTimer);
    }
  }, [value, animate, spring]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ 
        scale: 1.03, 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="transform-gpu"
    >
      <Card className={cn(
        'w-full shadow-md rounded-2xl overflow-hidden', 
        'bg-gray-900 border-gray-800/50',
        'backdrop-blur-lg relative',
        'transform-style-preserve-3d perspective-1000',
        className
      )}>
        {/* Enhanced animated gradient background effect */}
        <motion.div 
          className={cn(
            "absolute inset-0 opacity-40",
            variant === 'success' ? "bg-gradient-to-br from-green-900/60 via-green-800/30 to-transparent" : 
            variant === 'danger' ? "bg-gradient-to-br from-red-900/60 via-red-800/30 to-transparent" : 
            "bg-gradient-to-br from-blue-900/60 via-blue-800/30 to-transparent"
          )}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: "linear"
          }}
        />
        
        {/* Animated particle stars */}
        {variant !== 'danger' && [...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-300"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 3) * 30}%`,
              zIndex: 2,
              opacity: 0.7,
              filter: "blur(0.5px)"
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + i,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      
        <CardContent className="p-6 flex flex-col gap-3 relative z-10">
          <div className="flex items-center justify-between">
            <motion.h3 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-medium text-gray-400 mb-1 tracking-wide"
            >
              {title}
            </motion.h3>
            
            {icon && (
              <motion.div 
                className={cn(
                  "p-2.5 rounded-full flex items-center justify-center",
                  variant === 'success' ? "bg-green-900/30 text-green-400" : 
                  variant === 'danger' ? "bg-red-900/30 text-red-400" : 
                  "bg-blue-900/30 text-blue-400"
                )}
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(100, 220, 255, 0)", 
                    "0 0 10px rgba(100, 220, 255, 0.5)", 
                    "0 0 0px rgba(100, 220, 255, 0)"
                  ]
                }}
                transition={{
                  boxShadow: {
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  }
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {icon}
                </motion.div>
              </motion.div>
            )}
          </div>
          
          <motion.div className="mt-1">
            <motion.h4 
              className={cn(
                "text-3xl font-bold", 
                variantStyles[variant]
              )}
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              {animate && typeof value === 'number' ? 
                <motion.span>{displayValue}</motion.span> : 
                value
              }
            </motion.h4>
            
            {growth && (
              <motion.p 
                className={cn(
                  "text-sm font-semibold mt-2 flex items-center",
                  growth.startsWith('+') ? "text-green-400" : "text-red-400"
                )}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {growth.startsWith('+') ? (
                  <motion.svg 
                    className="w-4 h-4 mr-1.5"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </motion.svg>
                ) : (
                  <motion.svg 
                    className="w-4 h-4 mr-1.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    animate={{ y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </motion.svg>
                )}
                {growth}
              </motion.p>
            )}
          </motion.div>
          
          {/* Advanced animated progress bar for upcoming reviews with threshold indicator */}
          {typeof value === 'number' && (
            <motion.div 
              className="mt-4 h-3 rounded-full overflow-hidden bg-gray-800/70"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div 
                className="h-full rounded-full relative"
                style={{ 
                  width: progressWidth,
                  opacity: progressOpacity,
                  backgroundColor: progressColor
                }}
              >
                {/* Pulsing glow effect inside progress bar */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2
                  }}
                  style={{
                    backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  }}
                />

                {/* Moving dots along the progress bar */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-0 bottom-0 w-1 bg-white/50 rounded-full"
                    animate={{
                      left: ["-5%", "105%"],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + i,
                      delay: i * 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
              
              {/* Threshold indicator */}
              {threshold > 0 && (
                <motion.div
                  className="absolute h-5 w-0.5 bg-yellow-400"
                  style={{ 
                    left: `${(threshold / max) * 100}%`,
                    top: -1,
                  }}
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    height: ["80%", "120%", "80%"],
                    boxShadow: [
                      "0 0 3px rgba(250, 230, 50, 0.5)", 
                      "0 0 8px rgba(250, 230, 50, 0.8)", 
                      "0 0 3px rgba(250, 230, 50, 0.5)"
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                />
              )}
            </motion.div>
          )}
        </CardContent>
        
        {/* Subtle neon border glow at the bottom */}
        <motion.div 
          className={cn(
            "h-0.5 w-full absolute bottom-0 left-0 right-0",
            variant === 'success' ? "bg-green-400" : 
            variant === 'danger' ? "bg-red-400" : 
            "bg-blue-400"
          )}
          animate={{
            boxShadow: [
              "0 0 5px rgba(100, 220, 255, 0.3)", 
              "0 0 15px rgba(100, 220, 255, 0.7)", 
              "0 0 5px rgba(100, 220, 255, 0.3)"
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        />
      </Card>
    </motion.div>
  );
};

export default StatsCard;
