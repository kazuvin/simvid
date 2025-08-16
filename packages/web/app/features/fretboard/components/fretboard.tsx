import { cn } from '~/utils';
import { FretboardNote as FretboardNoteComponent } from './fretboard-note';
import type { FretboardConfig, FretboardNote as FretboardNoteType } from '../types';

export interface FretboardProps {
  config: FretboardConfig;
  notes: FretboardNoteType[];
  showInterval?: boolean;
  className?: string;
}

export function Fretboard({ config, notes, showInterval = true, className }: FretboardProps) {
  const { fretCount } = config;

  const getNoteAtPosition = (stringNumber: number, fret: number) => {
    return notes.find((note) => note.string === stringNumber && note.fret === fret);
  };

  const fretWidth = 80;
  const openStringWidth = 60;
  const nutWidth = 4;
  const stringSpacing = 32;
  const topMargin = 24;

  const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

  return (
    <div className={cn('overflow-x-auto p-6 scrollbar-hide', className)}>
      <div className="inline-block">
        {/* フレット番号表示 */}
        <div className="mb-4 flex">
          <div style={{ width: `${12 + openStringWidth + nutWidth}px` }}></div>
          {Array.from({ length: fretCount }, (_, index) => {
            const fret = index + 1;
            return (
              <div key={fret} className="flex items-center justify-center" style={{ width: `${fretWidth}px` }}>
                {markerFrets.includes(fret) && (
                  <span className={cn('text-xs font-medium text-slate-700', fret === 12 && 'font-bold text-slate-900')}>
                    {fret}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* フレットボード */}
        <div className="relative">
          {/* ナット（0フレット） */}
          <div
            className="absolute w-1 bg-slate-800"
            style={{
              left: `${12 + openStringWidth}px`,
              top: `${topMargin}px`,
              height: `${5 * stringSpacing}px`,
            }}
          />

          {/* フレットライン（垂直） */}
          {Array.from({ length: fretCount }, (_, index) => {
            const fret = index + 1;
            const leftPosition = 12 + openStringWidth + nutWidth + fret * fretWidth;

            return (
              <div
                key={fret}
                className="absolute w-0.5 bg-slate-400"
                style={{
                  left: `${leftPosition}px`,
                  top: `${topMargin}px`,
                  height: `${5 * stringSpacing}px`,
                }}
              />
            );
          })}

          {/* 弦（6本、水平） */}
          {Array.from({ length: 6 }, (_, index) => {
            const stringNumber = index + 1;
            const stringY = topMargin + index * stringSpacing;

            return (
              <div key={stringNumber}>
                {/* 弦ライン（ナットから右側のみ） */}
                <div
                  className="absolute h-0.5 bg-slate-600"
                  style={{
                    top: `${stringY}px`,
                    left: `${12 + openStringWidth}px`,
                    width: `${nutWidth + fretCount * fretWidth}px`,
                  }}
                />

                {/* ノート配置 */}
                {Array.from({ length: fretCount + 1 }, (_, fret) => {
                  const noteAtFret = getNoteAtPosition(stringNumber, fret);
                  const noteX =
                    fret === 0 ? 12 + openStringWidth / 2 : 12 + openStringWidth + nutWidth + (fret - 0.5) * fretWidth;

                  return noteAtFret ? (
                    <div
                      key={`${stringNumber}-${fret}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transform"
                      style={{
                        left: `${noteX}px`,
                        top: `${stringY}px`,
                      }}
                    >
                      <FretboardNoteComponent note={noteAtFret} showInterval={showInterval} />
                    </div>
                  ) : null;
                })}
              </div>
            );
          })}

          {/* ポジションマーク */}
          {markerFrets
            .filter((fret) => fret <= fretCount)
            .map((fret) => {
              const markerX = 12 + openStringWidth + nutWidth + (fret - 0.5) * fretWidth;
              const centerY = topMargin + (5 * stringSpacing) / 2;

              return fret === 12 ? (
                <div key={fret}>
                  {/* 12フレットは2つのドット */}
                  <div
                    className="absolute h-2 w-2 rounded-full bg-slate-400"
                    style={{
                      left: `${markerX - 4}px`,
                      top: `${centerY - 32}px`,
                    }}
                  />
                  <div
                    className="absolute h-2 w-2 rounded-full bg-slate-400"
                    style={{
                      left: `${markerX - 4}px`,
                      top: `${centerY + 32}px`,
                    }}
                  />
                </div>
              ) : (
                <div
                  key={fret}
                  className="absolute h-1.5 w-1.5 rounded-full bg-slate-400"
                  style={{
                    left: `${markerX - 3}px`,
                    top: `${centerY - 3}px`,
                  }}
                />
              );
            })}

          {/* フレットボードのサイズ設定 */}
          <div
            style={{
              width: `${24 + openStringWidth + nutWidth + fretCount * fretWidth}px`,
              height: `${topMargin * 2 + 5 * stringSpacing}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
