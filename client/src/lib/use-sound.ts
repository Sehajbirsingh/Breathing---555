import { useCallback, useRef } from "react";

export function useSound() {
  const audioContextRef = useRef<AudioContext>();
  const currentOscillatorRef = useRef<OscillatorNode | null>(null);
  const currentGainRef = useRef<GainNode | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  };

  const stopSound = useCallback(() => {
    const ctx = getAudioContext();
    if (currentGainRef.current) {
      // Gradual fade out over 100ms to prevent clicking
      currentGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      setTimeout(() => {
        if (currentOscillatorRef.current) {
          currentOscillatorRef.current.stop();
          currentOscillatorRef.current.disconnect();
          currentOscillatorRef.current = null;
        }
        currentGainRef.current?.disconnect();
        currentGainRef.current = null;
      }, 100);
    }
  }, []);

  const createTone = useCallback((frequency: number, duration: number) => {
    const ctx = getAudioContext();

    // Stop any existing sound with a fade out
    stopSound();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    currentOscillatorRef.current = oscillator;
    currentGainRef.current = gainNode;

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0;

    // Very gradual fade in over 200ms
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.2);
    // Hold the tone
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + duration - 0.2);
    // Very gradual fade out over 200ms
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }, [stopSound]);

  const playInhale = useCallback(() => {
    createTone(396, 5); // G4 - calming frequency, exactly 5 seconds
  }, [createTone]);

  const playExhale = useCallback(() => {
    createTone(264, 5); // C4 - grounding frequency, exactly 5 seconds
  }, [createTone]);

  return {
    playInhale,
    playExhale,
    stopSound,
  };
}