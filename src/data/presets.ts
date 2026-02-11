export interface OscillatorConfig {
  type: OscillatorType;
  detuneAmount: number;    // cents
  frequencyRatio: number;  // multiplier on base frequency
  gain: number;            // volume of this oscillator
}

export interface Envelope {
  attack: number;   // seconds
  decay: number;    // seconds
  sustain: number;  // gain level 0-1
  release: number;  // seconds
}

export interface SoundPreset {
  name: string;
  oscillators: OscillatorConfig[];
  envelope: Envelope;
}

export const PRESETS: SoundPreset[] = [
  {
    name: 'Mellow',
    oscillators: [
      { type: 'triangle', detuneAmount: 0, frequencyRatio: 1, gain: 1 },
      { type: 'sine', detuneAmount: 0, frequencyRatio: 2, gain: 0.15 },
    ],
    envelope: { attack: 0.005, decay: 0.3, sustain: 0.7, release: 0.3 },
  },
  {
    name: 'Bright',
    oscillators: [
      { type: 'sawtooth', detuneAmount: 0, frequencyRatio: 1, gain: 0.6 },
      { type: 'sine', detuneAmount: 0, frequencyRatio: 2, gain: 0.2 },
    ],
    envelope: { attack: 0.005, decay: 0.2, sustain: 0.5, release: 0.2 },
  },
  {
    name: 'Organ',
    oscillators: [
      { type: 'sine', detuneAmount: 0, frequencyRatio: 1, gain: 1 },
      { type: 'sine', detuneAmount: 0, frequencyRatio: 2, gain: 0.5 },
      { type: 'sine', detuneAmount: 0, frequencyRatio: 3, gain: 0.25 },
    ],
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.1 },
  },
  {
    name: 'Synth',
    oscillators: [
      { type: 'square', detuneAmount: 0, frequencyRatio: 1, gain: 0.5 },
      { type: 'sawtooth', detuneAmount: 0, frequencyRatio: 0.5, gain: 0.3 },
    ],
    envelope: { attack: 0.01, decay: 0.4, sustain: 0.6, release: 0.4 },
  },
  {
    name: 'Honky Tonk',
    oscillators: [
      { type: 'triangle', detuneAmount: -8, frequencyRatio: 1, gain: 0.8 },
      { type: 'triangle', detuneAmount: 8, frequencyRatio: 1, gain: 0.8 },
    ],
    envelope: { attack: 0.005, decay: 0.3, sustain: 0.5, release: 0.3 },
  },
  {
    name: 'Plucky',
    oscillators: [
      { type: 'triangle', detuneAmount: 0, frequencyRatio: 1, gain: 1 },
      { type: 'square', detuneAmount: 0, frequencyRatio: 4, gain: 0.08 },
    ],
    envelope: { attack: 0.001, decay: 0.15, sustain: 0.1, release: 0.15 },
  },
];

export const DEFAULT_PRESET_INDEX = 0;
