import { cn } from '~/utils';
import { FretboardNote as FretboardNoteComponent } from './fretboard-note';
import type { FretboardNote as FretboardNoteType } from '../types';

export interface FretboardStringProps {
  stringNumber: number;
  fretCount: number;
  notes: FretboardNoteType[];
  showInterval?: boolean;
  showFretNumbers?: boolean;
  className?: string;
}

export function FretboardString({
  stringNumber,
  fretCount,
  notes,
  showInterval = true,
  showFretNumbers = false,
  className,
}: FretboardStringProps) {
  const stringNotes = notes.filter((note) => note.string === stringNumber);

  // 弦の太さを弦番号に応じて調整
  const stringThickness = stringNumber <= 2 ? 'h-0.5' : stringNumber <= 4 ? 'h-1' : 'h-1.5';

  return (
    <div className={cn('relative flex', className)}>
      {/* 弦のライン */}
      <div
        className={cn(
          'absolute top-1/2 right-4 left-4 -translate-y-1/2 transform rounded-full',
          'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400',
          'shadow-sm',
          stringThickness,
        )}
      />

      {/* フレット */}
      {Array.from({ length: fretCount + 1 }, (_, fret) => {
        const noteAtFret = stringNotes.find((note) => note.fret === fret);

        return (
          <div
            key={fret}
            className="relative flex h-12 flex-1 items-center justify-center"
            style={{ minWidth: '50px' }}
          >
            {/* フレットライン（全体で表示するため削除） */}

            {/* フレット番号表示（最下弦のみ） */}
            {showFretNumbers && (
              <div className="absolute top-14 left-1/2 z-30 -translate-x-1/2 transform">
                {fret === 0 ? (
                  <span className="inline-block h-6 w-6 rounded-full text-center text-xs leading-6 font-medium text-slate-500">
                    0
                  </span>
                ) : (
                  <span
                    className={cn(
                      'inline-block h-6 w-6 rounded-full text-center text-xs leading-6',
                      [3, 5, 7, 9, 15, 17, 19, 21].includes(fret) && 'bg-slate-300 text-slate-700',
                      fret === 12 && 'bg-slate-400 font-bold text-white',
                      ![3, 5, 7, 9, 12, 15, 17, 19, 21].includes(fret) && 'text-slate-500',
                    )}
                  >
                    {fret}
                  </span>
                )}
              </div>
            )}

            {/* 音符表示 */}
            {noteAtFret && (
              <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
                <FretboardNoteComponent note={noteAtFret} showInterval={showInterval} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
