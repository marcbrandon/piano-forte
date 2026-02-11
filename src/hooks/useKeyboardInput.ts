import { useEffect, useRef, useCallback, useState } from 'react';
import { AudioEngine } from '../audio/AudioEngine';
import { PIANO_KEYS } from '../data/pianoKeys';
import {
  getKeyOffset,
  DEFAULT_BASE_INDEX,
  OCTAVE_SHIFT,
  MIN_BASE_INDEX,
  MAX_BASE_INDEX,
} from '../data/keyboardMap';

interface UseKeyboardInputProps {
  engine: AudioEngine | null;
  activeKeys: Set<number>;
  setActiveKeys: React.Dispatch<React.SetStateAction<Set<number>>>;
}

export function useKeyboardInput({ engine, activeKeys, setActiveKeys }: UseKeyboardInputProps) {
  const [baseIndex, setBaseIndex] = useState(DEFAULT_BASE_INDEX);
  // Stores the resolved key index at note-on time so octave shifts mid-hold don't break note-off
  const heldKeys = useRef(new Map<string, number>());
  // Keep activeKeys ref in sync for cleanup
  const activeKeysRef = useRef(activeKeys);
  activeKeysRef.current = activeKeys;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.repeat) return;

    if (e.key === 'ArrowLeft') {
      setBaseIndex(prev => Math.max(MIN_BASE_INDEX, prev - OCTAVE_SHIFT));
      return;
    }
    if (e.key === 'ArrowRight') {
      setBaseIndex(prev => Math.min(MAX_BASE_INDEX, prev + OCTAVE_SHIFT));
      return;
    }

    const offset = getKeyOffset(e.key);
    if (offset === undefined || !engine) return;

    const keyIndex = baseIndex + offset;
    if (keyIndex < 0 || keyIndex > 87) return;

    const key = PIANO_KEYS[keyIndex];
    heldKeys.current.set(e.key.toLowerCase(), keyIndex);
    engine.noteOn(keyIndex, key.frequency);
    setActiveKeys(prev => new Set(prev).add(keyIndex));
  }, [engine, baseIndex, setActiveKeys]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const lowerKey = e.key.toLowerCase();
    const keyIndex = heldKeys.current.get(lowerKey);
    if (keyIndex === undefined || !engine) return;

    heldKeys.current.delete(lowerKey);
    engine.noteOff(keyIndex);
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(keyIndex);
      return next;
    });
  }, [engine, setActiveKeys]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { baseIndex };
}
