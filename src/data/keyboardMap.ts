// Maps computer keyboard keys to semitone offsets from the current base octave.
// Two rows: lower row starts at C, upper row starts at C one octave higher.

// Lower row: Z S X D C V G B H N J M
// Maps to:   C C# D D# E F F# G G# A A# B
const LOWER_ROW: Record<string, number> = {
  z: 0, s: 1, x: 2, d: 3, c: 4, v: 5,
  g: 6, b: 7, h: 8, n: 9, j: 10, m: 11,
};

// Upper row: Q 2 W 3 E R 5 T 6 Y 7 U I
// Maps to:   C C# D D# E F F# G G# A A# B C(+1)
const UPPER_ROW: Record<string, number> = {
  q: 12, '2': 13, w: 14, '3': 15, e: 16, r: 17,
  '5': 18, t: 19, '6': 20, y: 21, '7': 22, u: 23, i: 24,
};

const KEY_MAP: Record<string, number> = { ...LOWER_ROW, ...UPPER_ROW };

// Default base: C4 = index 39 in 88-key array (A0 is index 0)
export const DEFAULT_BASE_INDEX = 39;
export const OCTAVE_SHIFT = 12;
export const MIN_BASE_INDEX = 0;
export const MAX_BASE_INDEX = 75; // So highest mapped key doesn't exceed 87

export function getKeyOffset(key: string): number | undefined {
  return KEY_MAP[key.toLowerCase()];
}
