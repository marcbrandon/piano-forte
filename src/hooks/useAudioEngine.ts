import { useEffect, useRef } from 'react';
import { AudioEngine } from '../audio/AudioEngine';

export function useAudioEngine(): AudioEngine | null {
  const engineRef = useRef<AudioEngine | null>(null);

  if (!engineRef.current) {
    engineRef.current = new AudioEngine();
  }

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
    };
  }, []);

  return engineRef.current;
}
