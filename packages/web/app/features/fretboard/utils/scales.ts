import type { Scale, ScaleType } from '../types';

// スケール定義のマップ
export const SCALES: Record<ScaleType, Scale> = {
  major: {
    name: 'Major',
    intervals: ['R', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
    semitones: [0, 2, 4, 5, 7, 9, 11],
  },
  minor: {
    name: 'Minor',
    intervals: ['R', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    semitones: [0, 2, 3, 5, 7, 8, 10],
  },
  'pentatonic-major': {
    name: 'Pentatonic Major',
    intervals: ['R', 'M2', 'M3', 'P5', 'M6'],
    semitones: [0, 2, 4, 7, 9],
  },
  'pentatonic-minor': {
    name: 'Pentatonic Minor',
    intervals: ['R', 'm3', 'P4', 'P5', 'm7'],
    semitones: [0, 3, 5, 7, 10],
  },
};

export function getScale(scaleType: ScaleType): Scale {
  return SCALES[scaleType];
}