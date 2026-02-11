import { SoundPreset, PRESETS, DEFAULT_PRESET_INDEX } from '../data/presets';

interface ActiveNote {
  oscillators: OscillatorNode[];
  gain: GainNode;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private activeNotes = new Map<number, ActiveNote>();
  private masterGain: GainNode | null = null;
  preset: SoundPreset = PRESETS[DEFAULT_PRESET_INDEX];

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  noteOn(keyIndex: number, frequency: number): void {
    if (this.activeNotes.has(keyIndex)) return;

    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    const { envelope, oscillators: oscConfigs } = this.preset;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + envelope.attack);
    gain.gain.linearRampToValueAtTime(envelope.sustain, now + envelope.attack + envelope.decay);
    gain.connect(this.masterGain!);

    const oscillators: OscillatorNode[] = [];

    for (const config of oscConfigs) {
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(config.gain, now);
      oscGain.connect(gain);

      const osc = ctx.createOscillator();
      osc.type = config.type;
      osc.frequency.setValueAtTime(frequency * config.frequencyRatio, now);
      osc.detune.setValueAtTime(config.detuneAmount, now);
      osc.connect(oscGain);
      osc.start(now);
      oscillators.push(osc);
    }

    this.activeNotes.set(keyIndex, { oscillators, gain });
  }

  noteOff(keyIndex: number): void {
    const note = this.activeNotes.get(keyIndex);
    if (!note || !this.ctx) return;

    const now = this.ctx.currentTime;
    const { oscillators, gain } = note;
    const release = this.preset.envelope.release;

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + release);

    for (const osc of oscillators) {
      osc.stop(now + release);
    }

    this.activeNotes.delete(keyIndex);
  }

  dispose(): void {
    for (const [keyIndex] of this.activeNotes) {
      this.noteOff(keyIndex);
    }
    this.ctx?.close();
  }
}
