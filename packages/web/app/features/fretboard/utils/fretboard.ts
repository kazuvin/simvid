import type { 
  FretboardConfig, 
  FretboardNote, 
  NoteInfo, 
  FretPosition,
  Key,
  ScaleType,
  ChordType 
} from '../types';
import { getNoteAtFret, getIntervalBetweenNotes, semitoneToInterval } from './notes';
import { getScale } from './scales';
import { getChord } from './chords';
import { getStandardTuning } from './tunings';

/**
 * フレットボード上のすべての音を計算
 */
export function calculateFretboardNotes(config: FretboardConfig): FretboardNote[] {
  const notes: FretboardNote[] = [];
  
  for (let stringNumber = 1; stringNumber <= config.stringCount; stringNumber++) {
    const stringTuning = config.tuning.find(t => t.stringNumber === stringNumber);
    if (!stringTuning) continue;
    
    for (let fret = 0; fret <= config.fretCount; fret++) {
      const noteName = getNoteAtFret(stringTuning.noteName, fret);
      const noteInfo = calculateNoteInfo(noteName, config.key, config.scaleType, config.chordType, config.chordKey);
      
      notes.push({
        string: stringNumber,
        fret,
        noteInfo,
      });
    }
  }
  
  return notes;
}

/**
 * 音の情報を計算（スケール、コードとの関係）
 */
function calculateNoteInfo(
  noteName: string, 
  key: Key, 
  scaleType?: ScaleType, 
  chordType?: ChordType,
  chordKey?: Key
): NoteInfo {
  const intervalSemitones = getIntervalBetweenNotes(key, noteName as Key);
  let interval = semitoneToInterval(intervalSemitones);
  
  // ルート判定：スケールキーまたはコードキーと一致する場合
  const isScaleRoot = noteName === key;
  const isChordRoot = chordKey && noteName === chordKey;
  const isRoot = isScaleRoot || isChordRoot;
  
  let isScaleTone = false;
  if (scaleType) {
    const scale = getScale(scaleType);
    isScaleTone = scale.semitones.includes(intervalSemitones);
  }
  
  let isChordTone = false;
  let chordInterval: any = undefined;
  
  if (chordType && chordKey) {
    const chord = getChord(chordType);
    const chordIntervalSemitones = getIntervalBetweenNotes(chordKey, noteName as Key);
    
    // コードの構成音かどうかチェック
    // 12音階内での完全一致を優先
    const exactMatch = chord.semitones.findIndex(semitone => semitone === chordIntervalSemitones);
    if (exactMatch !== -1) {
      isChordTone = true;
      chordInterval = chord.intervals[exactMatch];
    } else {
      // 一致しない場合、12で割った余りで判定（9th、11th、13thなど）
      const moduloMatch = chord.semitones.findIndex(semitone => semitone % 12 === chordIntervalSemitones);
      if (moduloMatch !== -1) {
        isChordTone = true;
        chordInterval = chord.intervals[moduloMatch];
      }
    }
    
    // コードトーンの場合はコード固有の度数を使用
    if (isChordTone && chordInterval) {
      interval = chordInterval;
    }
  }
  
  return {
    noteName: noteName as Key,
    interval,
    isRoot,
    isChordTone,
    isScaleTone,
  };
}

/**
 * デフォルト設定でフレットボード設定を作成
 */
export function createDefaultFretboardConfig(
  stringCount: 4 | 6 | 7 = 6,
  key: Key = 'C',
  scaleType?: ScaleType,
  chordType?: ChordType,
  chordKey?: Key
): FretboardConfig {
  return {
    stringCount,
    fretCount: 24,
    key,
    scaleType,
    chordType,
    chordKey: chordKey || key, // デフォルトはスケールキーと同じ
    tuning: getStandardTuning(stringCount),
  };
}

/**
 * 指定された位置の音情報を取得
 */
export function getNoteAtPosition(
  position: FretPosition, 
  config: FretboardConfig
): FretboardNote | undefined {
  const notes = calculateFretboardNotes(config);
  return notes.find(note => 
    note.string === position.string && note.fret === position.fret
  );
}