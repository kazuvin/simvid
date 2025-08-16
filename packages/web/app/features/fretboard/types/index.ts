// 弦数の定義
export type StringCount = 4 | 6 | 7;

// 音名の定義
export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

// キーの定義
export type Key = NoteName;

// スケールタイプの定義
export type ScaleType = 'major' | 'minor' | 'pentatonic-major' | 'pentatonic-minor';

// コードタイプの定義
export type ChordType = 
  | 'major' 
  | 'minor' 
  | 'maj7' 
  | 'maj9' 
  | 'maj11' 
  | 'maj13' 
  | 'min7' 
  | 'min9' 
  | 'min11' 
  | 'min13' 
  | 'dom7' 
  | 'dom9' 
  | 'dom11' 
  | 'dom13' 
  | 'sus2' 
  | 'sus4' 
  | 'dim' 
  | 'dim7' 
  | 'aug' 
  | 'half-dim7';

// 度数の定義
export type Interval = 'R' | 'm2' | 'M2' | 'm3' | 'M3' | 'P4' | 'TT' | 'P5' | 'm6' | 'M6' | 'm7' | 'M7' | 'M9' | 'P11' | 'M13';

// フレット位置の定義
export interface FretPosition {
  string: number; // 弦番号 (1-based)
  fret: number;   // フレット番号 (0-based, 0 = open)
}

// 音の情報
export interface NoteInfo {
  noteName: NoteName;
  interval?: Interval;
  isRoot?: boolean;
  isChordTone?: boolean;
  isScaleTone?: boolean;
}

// フレットボード上の音の情報
export interface FretboardNote extends FretPosition {
  noteInfo: NoteInfo;
}

// スケール定義
export interface Scale {
  name: string;
  intervals: Interval[];
  semitones: number[]; // ルートからの半音数
}

// コード定義
export interface Chord {
  name: string;
  intervals: Interval[];
  semitones: number[]; // ルートからの半音数
}

// 弦のチューニング定義
export interface StringTuning {
  stringNumber: number;
  noteName: NoteName;
  octave: number;
}

// フレットボードの設定
export interface FretboardConfig {
  stringCount: StringCount;
  fretCount: number;
  key: Key;
  scaleType?: ScaleType;
  chordType?: ChordType;
  chordKey?: Key; // コードのルート音を個別指定
  tuning: StringTuning[];
}