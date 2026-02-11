import { useEffect, useRef } from 'react';
import { PIANO_KEYS, PIANO_WIDTH, WHITE_KEY_HEIGHT, MIDDLE_C_INDEX, WHITE_KEY_WIDTH } from '../data/pianoKeys';
import { PianoKey } from './PianoKey';
import './Piano.css';

interface PianoProps {
  activeKeys: Set<number>;
  onNoteOn: (index: number) => void;
  onNoteOff: (index: number) => void;
}

export function Piano({ activeKeys, onNoteOn, onNoteOff }: PianoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to center middle C on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const middleCKey = PIANO_KEYS[MIDDLE_C_INDEX];
    const scrollTarget = middleCKey.leftPosition - container.clientWidth / 2 + WHITE_KEY_WIDTH / 2;
    container.scrollLeft = Math.max(0, scrollTarget);
  }, []);

  return (
    <div className="piano-scroll-container" ref={containerRef}>
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
  );
}
