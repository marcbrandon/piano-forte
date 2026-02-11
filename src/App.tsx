import { useState, useCallback } from 'react';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { PIANO_KEYS } from './data/pianoKeys';
import { PRESETS, DEFAULT_PRESET_INDEX } from './data/presets';
import { Piano } from './components/Piano';
import './App.css';

export default function App() {
  const engine = useAudioEngine();
  const [activeKeys, setActiveKeys] = useState<Set<number>>(() => new Set());
  const [presetIndex, setPresetIndex] = useState(DEFAULT_PRESET_INDEX);

  useKeyboardInput({ engine, activeKeys, setActiveKeys });

  const handlePresetChange = useCallback((index: number) => {
    setPresetIndex(index);
    if (engine) {
      engine.preset = PRESETS[index];
    }
  }, [engine]);

  const handleNoteOn = useCallback((index: number) => {
    if (!engine) return;
    const key = PIANO_KEYS[index];
    engine.noteOn(index, key.frequency);
    setActiveKeys(prev => new Set(prev).add(index));
  }, [engine]);

  const handleNoteOff = useCallback((index: number) => {
    if (!engine) return;
    engine.noteOff(index);
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }, [engine]);

  return (
    <div className="app">
      <h1 className="app-title">Piano</h1>
      <div className="preset-selector">
        {PRESETS.map((preset, i) => (
          <button
            key={preset.name}
            className={`preset-btn${i === presetIndex ? ' preset-btn--active' : ''}`}
            onClick={() => handlePresetChange(i)}
          >
            {preset.name}
          </button>
        ))}
      </div>
      <Piano activeKeys={activeKeys} onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
      <p className="app-hint">
        Use keyboard: Z-M (lower octave), Q-U (upper octave). Arrow keys to shift octave.
      </p>
    </div>
  );
}
