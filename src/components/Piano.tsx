import { useEffect, useRef, useCallback } from 'react';
import { PIANO_KEYS, PIANO_WIDTH, WHITE_KEY_HEIGHT, MIDDLE_C_INDEX, WHITE_KEY_WIDTH } from '../data/pianoKeys';
import { PianoKey } from './PianoKey';
import './Piano.css';

// Scroll by 7 white keys (one octave) per button press
const SCROLL_STEP = WHITE_KEY_WIDTH * 7;

function getNoteIndexFromElement(el: Element | null): number | null {
  while (el) {
    const note = (el as HTMLElement).dataset?.note;
    if (note) {
      const key = PIANO_KEYS.find(k => k.fullName === note);
      return key ? key.index : null;
    }
    el = el.parentElement;
  }
  return null;
}

interface PianoProps {
  activeKeys: Set<number>;
  onNoteOn: (index: number) => void;
  onNoteOff: (index: number) => void;
}

export function Piano({ activeKeys, onNoteOn, onNoteOff }: PianoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTouchNote = useRef<number | null>(null);

  // Auto-scroll to center middle C on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const middleCKey = PIANO_KEYS[MIDDLE_C_INDEX];
    const scrollTarget = middleCKey.leftPosition - container.clientWidth / 2 + WHITE_KEY_WIDTH / 2;
    container.scrollLeft = Math.max(0, scrollTarget);
  }, []);

  const scrollBy = useCallback((direction: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: direction * SCROLL_STEP, behavior: 'smooth' });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const noteIndex = getNoteIndexFromElement(el);

    const prev = currentTouchNote.current;
    if (noteIndex === prev) return;

    if (prev !== null) onNoteOff(prev);
    if (noteIndex !== null) onNoteOn(noteIndex);
    currentTouchNote.current = noteIndex;
  }, [onNoteOn, onNoteOff]);

  const handleTouchEnd = useCallback(() => {
    if (currentTouchNote.current !== null) {
      onNoteOff(currentTouchNote.current);
      currentTouchNote.current = null;
    }
  }, [onNoteOff]);

  return (
    <div className="piano-wrapper">
      <button className="piano-nav piano-nav--left" onClick={() => scrollBy(-1)} aria-label="Scroll left">
        &#x25C0;
      </button>
      <div
        className="piano-scroll-container"
        ref={containerRef}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div className="piano-keys" style={{ width: PIANO_WIDTH, height: WHITE_KEY_HEIGHT }}>
          {PIANO_KEYS.map(keyData => (
            <PianoKey
              key={keyData.index}
              keyData={keyData}
              isActive={activeKeys.has(keyData.index)}
              onNoteOn={onNoteOn}
              onNoteOff={onNoteOff}
            />
          ))}
        </div>
      </div>
      <button className="piano-nav piano-nav--right" onClick={() => scrollBy(1)} aria-label="Scroll right">
        &#x25B6;
      </button>
    </div>
  );
}
