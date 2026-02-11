const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const BLACK_NOTES = new Set(['C#', 'D#', 'F#', 'G#', 'A#']);

export const WHITE_KEY_WIDTH = 40;
export const BLACK_KEY_WIDTH = 24;
export const WHITE_KEY_HEIGHT = 180;
export const BLACK_KEY_HEIGHT = 120;

export interface PianoKeyData {
  index: number;
  note: string;
  octave: number;
  fullName: string;
  frequency: number;
  isBlack: boolean;
  whiteIndex: number;
  leftPosition: number;
}

function buildPianoKeys(): PianoKeyData[] {
  const keys: PianoKeyData[] = [];
  // Piano starts at A0 (MIDI 21). Index 0 = A0, index 48 = A4 (440Hz).
  // The 88 keys go from A0 to C8.
  const startNoteIndex = 9; // A is index 9 in NOTE_NAMES (C=0..B=11)
  const startOctave = 0;

  let whiteCount = 0;

  for (let i = 0; i < 88; i++) {
    const semitone = (startNoteIndex + i) % 12;
    const note = NOTE_NAMES[semitone];
    const octave = startOctave + Math.floor((startNoteIndex + i) / 12);
    const isBlack = BLACK_NOTES.has(note);
    const frequency = 440 * Math.pow(2, (i - 48) / 12);

    // whiteIndex: for white keys, it's the running count; for black keys, it's the next white key's index
    const whiteIndex = whiteCount;
    let leftPosition: number;

    if (isBlack) {
      // Black key sits centered on the border before the next white key
      leftPosition = whiteCount * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2;
    } else {
      leftPosition = whiteCount * WHITE_KEY_WIDTH;
      whiteCount++;
    }

    keys.push({
      index: i,
      note,
      octave,
      fullName: `${note}${octave}`,
      frequency,
      isBlack,
      whiteIndex,
      leftPosition,
    });
  }

  return keys;
}

export const PIANO_KEYS = buildPianoKeys();
export const TOTAL_WHITE_KEYS = PIANO_KEYS.filter(k => !k.isBlack).length;
export const PIANO_WIDTH = TOTAL_WHITE_KEYS * WHITE_KEY_WIDTH;

// Middle C (C4) index in our array
// A0 is index 0, so C4 = 39 semitones above A0
export const MIDDLE_C_INDEX = 39;
