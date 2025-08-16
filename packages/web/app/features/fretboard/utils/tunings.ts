import type { StringCount, StringTuning } from '../types';

// 標準チューニングの定義
export const STANDARD_TUNINGS: Record<StringCount, StringTuning[]> = {
  4: [
    { stringNumber: 1, noteName: 'G', octave: 3 }, // 1弦 (一番細い弦)
    { stringNumber: 2, noteName: 'D', octave: 3 },
    { stringNumber: 3, noteName: 'A', octave: 2 },
    { stringNumber: 4, noteName: 'E', octave: 2 }, // 4弦 (一番太い弦)
  ],
  6: [
    { stringNumber: 1, noteName: 'E', octave: 4 }, // 1弦 (一番細い弦)
    { stringNumber: 2, noteName: 'B', octave: 3 },
    { stringNumber: 3, noteName: 'G', octave: 3 },
    { stringNumber: 4, noteName: 'D', octave: 3 },
    { stringNumber: 5, noteName: 'A', octave: 2 },
    { stringNumber: 6, noteName: 'E', octave: 2 }, // 6弦 (一番太い弦)
  ],
  7: [
    { stringNumber: 1, noteName: 'E', octave: 4 }, // 1弦 (一番細い弦)
    { stringNumber: 2, noteName: 'B', octave: 3 },
    { stringNumber: 3, noteName: 'G', octave: 3 },
    { stringNumber: 4, noteName: 'D', octave: 3 },
    { stringNumber: 5, noteName: 'A', octave: 2 },
    { stringNumber: 6, noteName: 'E', octave: 2 },
    { stringNumber: 7, noteName: 'B', octave: 1 }, // 7弦 (一番太い弦)
  ],
};

export function getStandardTuning(stringCount: StringCount): StringTuning[] {
  return STANDARD_TUNINGS[stringCount];
}