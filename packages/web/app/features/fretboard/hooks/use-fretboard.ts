import { useState, useMemo } from 'react';
import type { 
  FretboardConfig, 
  FretboardNote, 
  StringCount, 
  Key, 
  ScaleType, 
  ChordType 
} from '../types';
import { calculateFretboardNotes, createDefaultFretboardConfig } from '../utils';

export interface UseFretboardProps {
  stringCount?: StringCount;
  key?: Key;
  scaleType?: ScaleType;
  chordType?: ChordType;
  chordKey?: Key;
  fretCount?: number;
}

export interface UseFretboardReturn {
  config: FretboardConfig;
  notes: FretboardNote[];
  setStringCount: (count: StringCount) => void;
  setKey: (key: Key) => void;
  setScaleType: (scaleType: ScaleType | undefined) => void;
  setChordType: (chordType: ChordType | undefined) => void;
  setChordKey: (chordKey: Key) => void;
  reset: () => void;
}

export function useFretboard(props: UseFretboardProps = {}): UseFretboardReturn {
  const [stringCount, setStringCount] = useState<StringCount>(props.stringCount ?? 6);
  const [key, setKey] = useState<Key>(props.key ?? 'C');
  const [scaleType, setScaleType] = useState<ScaleType | undefined>(props.scaleType);
  const [chordType, setChordType] = useState<ChordType | undefined>(props.chordType);
  const [chordKey, setChordKey] = useState<Key>(props.chordKey ?? props.key ?? 'C');
  
  const config = useMemo(() => 
    createDefaultFretboardConfig(stringCount, key, scaleType, chordType, chordKey),
    [stringCount, key, scaleType, chordType, chordKey]
  );
  
  const notes = useMemo(() => 
    calculateFretboardNotes(config),
    [config]
  );
  
  const reset = () => {
    setStringCount(6);
    setKey('C');
    setScaleType(undefined);
    setChordType(undefined);
    setChordKey('C');
  };
  
  return {
    config,
    notes,
    setStringCount,
    setKey,
    setScaleType,
    setChordType,
    setChordKey,
    reset,
  };
}