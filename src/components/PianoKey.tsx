import React, { useCallback } from 'react';
import { PianoKeyData, WHITE_KEY_WIDTH, BLACK_KEY_WIDTH, WHITE_KEY_HEIGHT, BLACK_KEY_HEIGHT } from '../data/pianoKeys';
import './PianoKey.css';

interface PianoKeyProps {
  keyData: PianoKeyData;
  isActive: boolean;
  onNoteOn: (index: number) => void;
  onNoteOff: (index: number) => void;
}

export const PianoKey = React.memo(function PianoKey({ keyData, isActive, onNoteOn, onNoteOff }: PianoKeyProps) {
  const { index, isBlack, leftPosition, fullName } = keyData;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onNoteOn(index);
  }, [index, onNoteOn]);

  const handleMouseUp = useCallback(() => {
    onNoteOff(index);
  }, [index, onNoteOff]);

  const handleMouseLeave = useCallback(() => {
    if (isActive) onNoteOff(index);
  }, [index, isActive, onNoteOff]);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (e.buttons === 1) onNoteOn(index);
  }, [index, onNoteOn]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    onNoteOn(index);
  }, [index, onNoteOn]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    onNoteOff(index);
  }, [index, onNoteOff]);

  const width = isBlack ? BLACK_KEY_WIDTH : WHITE_KEY_WIDTH;
  const height = isBlack ? BLACK_KEY_HEIGHT : WHITE_KEY_HEIGHT;

  const className = [
    'piano-key',
    isBlack ? 'piano-key--black' : 'piano-key--white',
    isActive ? 'piano-key--active' : '',
  ].join(' ');

  return (
    <div
      className={className}
      style={{
        left: leftPosition,
        width,
        height,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-note={fullName}
    />
  );
});
