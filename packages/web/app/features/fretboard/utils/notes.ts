import type { NoteName, Key, Interval } from '../types';

// 音名の順序（半音階）
export const NOTE_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 度数と半音数のマッピング
export const INTERVAL_SEMITONES: Record<Interval, number> = {
  R: 0,   // Root
  'm2': 1, // minor 2nd
  'M2': 2, // Major 2nd
  'm3': 3, // minor 3rd
  'M3': 4, // Major 3rd
  'P4': 5, // Perfect 4th
  'TT': 6, // Tritone
  'P5': 7, // Perfect 5th
  'm6': 8, // minor 6th
  'M6': 9, // Major 6th
  'm7': 10, // minor 7th
  'M7': 11, // Major 7th
  'M9': 14, // Major 9th (2nd octave)
  'P11': 17, // Perfect 11th (4th octave)
  'M13': 21, // Major 13th (6th octave)
};

/**
 * 音名を半音数に変換
 */
export function noteToSemitone(noteName: NoteName): number {
  return NOTE_NAMES.indexOf(noteName);
}

/**
 * 半音数を音名に変換
 */
export function semitoneToNote(semitone: number): NoteName {
  const normalizedSemitone = ((semitone % 12) + 12) % 12;
  return NOTE_NAMES[normalizedSemitone];
}

/**
 * キーとフレット番号から音名を計算
 */
export function getNoteAtFret(openNote: NoteName, fret: number): NoteName {
  const openSemitone = noteToSemitone(openNote);
  const fretSemitone = openSemitone + fret;
  return semitoneToNote(fretSemitone);
}

/**
 * キーから指定された度数の音名を取得
 */
export function getNoteForInterval(key: Key, interval: Interval): NoteName {
  const keySemitone = noteToSemitone(key);
  const intervalSemitone = INTERVAL_SEMITONES[interval];
  const targetSemitone = keySemitone + intervalSemitone;
  return semitoneToNote(targetSemitone);
}

/**
 * 2つの音名間の度数を計算
 */
export function getIntervalBetweenNotes(fromNote: NoteName, toNote: NoteName): number {
  const fromSemitone = noteToSemitone(fromNote);
  const toSemitone = noteToSemitone(toNote);
  return ((toSemitone - fromSemitone) + 12) % 12;
}

/**
 * 半音数から度数を取得
 */
export function semitoneToInterval(semitone: number): Interval | undefined {
  const entries = Object.entries(INTERVAL_SEMITONES) as [Interval, number][];
  
  // 12音階内での完全一致を優先
  let match = entries.find(([, value]) => value === semitone);
  if (match) return match[0];
  
  // 12音階を超える度数（9th、11th、13th）については12で割った余りで判定
  const normalizedSemitone = semitone % 12;
  match = entries.find(([, value]) => value % 12 === normalizedSemitone);
  
  return match?.[0];
}