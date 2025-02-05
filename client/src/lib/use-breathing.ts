import { useState, useEffect, useCallback, useRef } from "react";
import { useSound } from "./use-sound";

export type BreathingPhase = "inhale" | "hold1" | "exhale" | "hold2";

const PHASE_DURATION = 5000; // Exactly 5 seconds per phase

export function useBreathing() {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const { playInhale, playExhale, stopSound } = useSound();

  // Refs to track animation state
  const startTimeRef = useRef<number>(0);
  const pausedProgressRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const phaseStartTimeRef = useRef<number>(0);

  const nextPhase = useCallback(() => {
    const phases: BreathingPhase[] = ["inhale", "hold1", "exhale", "hold2"];
    const currentIndex = phases.indexOf(currentPhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    setCurrentPhase(phases[nextIndex]);
    setPhaseProgress(0);
    phaseStartTimeRef.current = Date.now();
  }, [currentPhase]);

  // Phase progression
  useEffect(() => {
    if (!isActive) return;

    if (!phaseStartTimeRef.current) {
      phaseStartTimeRef.current = Date.now();
    }

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - phaseStartTimeRef.current;
      const progress = Math.min(elapsed / PHASE_DURATION, 1);

      setPhaseProgress(progress);

      if (progress >= 1) {
        nextPhase();
      } else {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, nextPhase]);

  // Sound effects
  useEffect(() => {
    if (!isActive || !isSoundEnabled) {
      stopSound();
      return;
    }

    if (currentPhase === "inhale") {
      playInhale();
    } else if (currentPhase === "exhale") {
      playExhale();
    }

    return () => {
      stopSound();
    };
  }, [currentPhase, isActive, isSoundEnabled, playExhale, playInhale, stopSound]);

  const toggleActive = () => {
    if (isActive) {
      // Pause - store current progress and stop animation
      pausedProgressRef.current = phaseProgress;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopSound();
    } else {
      // Resume from stored progress
      phaseStartTimeRef.current = Date.now() - (pausedProgressRef.current * PHASE_DURATION);
    }
    setIsActive(!isActive);
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  return {
    isActive,
    currentPhase,
    phaseProgress,
    isSoundEnabled,
    toggleActive,
    toggleSound,
  };
}