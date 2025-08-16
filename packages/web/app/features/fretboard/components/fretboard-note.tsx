import { cn } from '~/utils';
import type { FretboardNote } from '../types';

export interface FretboardNoteProps {
  note: FretboardNote;
  showInterval?: boolean;
  className?: string;
}

export function FretboardNote({ note, showInterval = true, className }: FretboardNoteProps) {
  const { noteInfo } = note;
  const { isRoot, isChordTone, isScaleTone, interval } = noteInfo;
  
  if (!isScaleTone && !isChordTone) {
    return null;
  }
  
  const displayText = showInterval && interval ? interval : noteInfo.noteName;
  
  return (
    <div className={cn('relative', className)}>
      {/* スケールトーン: 弦と同じ色の点 */}
      {isScaleTone && (
        <div
          className={cn(
            'w-8 h-8 rounded-full',
            'bg-slate-600/30 border border-slate-400/40',
          )}
        />
      )}
      
      {/* コードトーン: 度数表示付きの点を中心に重ねる */}
      {isChordTone && (
        <div
          className={cn(
            'absolute top-1/2 left-1/2 w-6 h-6 rounded-full',
            'flex items-center justify-center text-xs font-medium',
            'transform -translate-x-1/2 -translate-y-1/2',
            'transition-all duration-200',
            isRoot
              ? 'bg-destructive text-destructive-foreground border border-background'
              : 'bg-primary text-primary-foreground border border-background',
          )}
        >
          {displayText}
        </div>
      )}
    </div>
  );
}