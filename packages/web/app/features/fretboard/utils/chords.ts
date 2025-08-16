import type { Chord, ChordType } from '../types';

// コード定義のマップ
export const CHORDS: Record<ChordType, Chord> = {
  major: {
    name: 'Major',
    intervals: ['R', 'M3', 'P5'],
    semitones: [0, 4, 7],
  },
  minor: {
    name: 'Minor',
    intervals: ['R', 'm3', 'P5'],
    semitones: [0, 3, 7],
  },
  maj7: {
    name: 'Major 7th',
    intervals: ['R', 'M3', 'P5', 'M7'],
    semitones: [0, 4, 7, 11],
  },
  maj9: {
    name: 'Major 9th',
    intervals: ['R', 'M3', 'P5', 'M7', 'M9'],
    semitones: [0, 4, 7, 11, 14],
  },
  maj11: {
    name: 'Major 11th',
    intervals: ['R', 'M3', 'P5', 'M7', 'P11'],
    semitones: [0, 4, 7, 11, 17],
  },
  maj13: {
    name: 'Major 13th',
    intervals: ['R', 'M3', 'P5', 'M7', 'M13'],
    semitones: [0, 4, 7, 11, 21],
  },
  min7: {
    name: 'Minor 7th',
    intervals: ['R', 'm3', 'P5', 'm7'],
    semitones: [0, 3, 7, 10],
  },
  min9: {
    name: 'Minor 9th',
    intervals: ['R', 'm3', 'P5', 'm7', 'M9'],
    semitones: [0, 3, 7, 10, 14],
  },
  min11: {
    name: 'Minor 11th',
    intervals: ['R', 'm3', 'P5', 'm7', 'P11'],
    semitones: [0, 3, 7, 10, 17],
  },
  min13: {
    name: 'Minor 13th',
    intervals: ['R', 'm3', 'P5', 'm7', 'M13'],
    semitones: [0, 3, 7, 10, 21],
  },
  dom7: {
    name: 'Dominant 7th',
    intervals: ['R', 'M3', 'P5', 'm7'],
    semitones: [0, 4, 7, 10],
  },
  dom9: {
    name: 'Dominant 9th',
    intervals: ['R', 'M3', 'P5', 'm7', 'M9'],
    semitones: [0, 4, 7, 10, 14],
  },
  dom11: {
    name: 'Dominant 11th',
    intervals: ['R', 'M3', 'P5', 'm7', 'P11'],
    semitones: [0, 4, 7, 10, 17],
  },
  dom13: {
    name: 'Dominant 13th',
    intervals: ['R', 'M3', 'P5', 'm7', 'M13'],
    semitones: [0, 4, 7, 10, 21],
  },
  sus2: {
    name: 'Suspended 2nd',
    intervals: ['R', 'M2', 'P5'],
    semitones: [0, 2, 7],
  },
  sus4: {
    name: 'Suspended 4th',
    intervals: ['R', 'P4', 'P5'],
    semitones: [0, 5, 7],
  },
  dim: {
    name: 'Diminished',
    intervals: ['R', 'm3', 'TT'],
    semitones: [0, 3, 6],
  },
  dim7: {
    name: 'Diminished 7th',
    intervals: ['R', 'm3', 'TT', 'M6'],
    semitones: [0, 3, 6, 9],
  },
  aug: {
    name: 'Augmented',
    intervals: ['R', 'M3', 'm6'],
    semitones: [0, 4, 8],
  },
  'half-dim7': {
    name: 'Half Diminished 7th',
    intervals: ['R', 'm3', 'TT', 'm7'],
    semitones: [0, 3, 6, 10],
  },
};

export function getChord(chordType: ChordType): Chord {
  return CHORDS[chordType];
}
