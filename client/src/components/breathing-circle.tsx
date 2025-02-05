import { motion, AnimatePresence } from "framer-motion";
import type { BreathingPhase } from "@/lib/use-breathing";

interface BreathingCircleProps {
  isActive: boolean;
  currentPhase: BreathingPhase;
  phaseProgress: number;
}

const phaseText = {
  inhale: "Breathe In",
  hold1: "Hold",
  exhale: "Breathe Out", 
  hold2: "Hold"
};

export function BreathingCircle({ isActive, currentPhase, phaseProgress }: BreathingCircleProps) {
  const getScale = () => {
    switch (currentPhase) {
      case "inhale":
        return 1 + (0.3 * phaseProgress); // Gradually increase from 1 to 1.3
      case "hold1":
        return 1.3; // Stay expanded
      case "exhale":
        return 1.3 - (0.3 * phaseProgress); // Gradually decrease from 1.3 to 1
      case "hold2":
        return 1; // Stay contracted
      default:
        return 1;
    }
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ 
              scale: getScale(),
              opacity: 0.5,
            }}
            transition={{
              duration: 0.1, // Smooth updates for progress-based scaling
              ease: "linear"
            }}
          />
        )}
      </AnimatePresence>

      <motion.div 
        className="relative flex items-center justify-center w-48 h-48 rounded-full bg-primary/20 border-2 border-primary"
        animate={{ 
          scale: isActive ? getScale() : 1
        }}
        transition={{
          duration: 0.1,
          ease: "linear"
        }}
      >
        <div className="text-center">
          <div className="text-xl font-medium text-primary">
            {isActive ? phaseText[currentPhase] : "Ready"}
          </div>
          {isActive && (
            <div className="text-sm text-muted-foreground mt-1">
              {Math.ceil((1 - phaseProgress) * 5)}s
            </div>
          )}
        </div>
      </motion.div>

      {/* Progress Ring */}
      <svg 
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 100 100"
      >
        {isActive && (
          <circle
            className="stroke-primary fill-none"
            cx="50"
            cy="50"
            r="48"
            strokeWidth="4"
            strokeDasharray={`${phaseProgress * 301.59} 301.59`}
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}