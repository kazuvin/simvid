import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '~/components/ui';
import type { Key, ScaleType, ChordType } from '../types';
import { NOTE_NAMES } from '../utils';
import { useI18n } from '~/lib/i18n';

export interface FretboardControlsProps {
  selectedKey: Key;
  scaleType?: ScaleType;
  chordType?: ChordType;
  chordKey?: Key;
  onKeyChange: (key: Key) => void;
  onScaleTypeChange: (scaleType: ScaleType | undefined) => void;
  onChordTypeChange: (chordType: ChordType | undefined) => void;
  onChordKeyChange: (chordKey: Key) => void;
  className?: string;
}


const SCALE_TYPE_OPTIONS = [
  { value: 'none' },
  { value: 'major' },
  { value: 'minor' },
  { value: 'pentatonic-major' },
  { value: 'pentatonic-minor' },
] as const;

const CHORD_TYPE_OPTIONS = [
  { value: 'none' },
  { value: 'major' },
  { value: 'minor' },
  { value: 'maj7' },
  { value: 'maj9' },
  { value: 'maj11' },
  { value: 'maj13' },
  { value: 'min7' },
  { value: 'min9' },
  { value: 'min11' },
  { value: 'min13' },
  { value: 'dom7' },
  { value: 'dom9' },
  { value: 'dom11' },
  { value: 'dom13' },
  { value: 'sus2' },
  { value: 'sus4' },
  { value: 'dim' },
  { value: 'dim7' },
  { value: 'aug' },
  { value: 'half-dim7' },
] as const;

export function FretboardControls({
  selectedKey,
  scaleType,
  chordType,
  chordKey,
  onKeyChange,
  onScaleTypeChange,
  onChordTypeChange,
  onChordKeyChange,
  className,
}: FretboardControlsProps) {
  const { t } = useI18n();
  
  return (
    <div className={`space-y-6 ${className}`}>

      {/* スケール設定 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('scaleSettings', { ns: 'fretboard' })}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('rootKey', { ns: 'fretboard' })}</label>
            <Select
              value={selectedKey}
              onValueChange={(value) => onKeyChange(value as Key)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTE_NAMES.map(note => (
                  <SelectItem key={note} value={note}>
                    {note}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('scaleType', { ns: 'fretboard' })}</label>
            <Select
              value={scaleType || 'none'}
              onValueChange={(value) => onScaleTypeChange(value === 'none' ? undefined : value as ScaleType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCALE_TYPE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`scaleTypes.${option.value}`, { ns: 'fretboard' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* コード設定 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('chordSettings', { ns: 'fretboard' })}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('chordKey', { ns: 'fretboard' })}</label>
            <Select
              value={chordKey || selectedKey}
              onValueChange={(value) => onChordKeyChange(value as Key)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTE_NAMES.map(note => (
                  <SelectItem key={note} value={note}>
                    {note}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('chordType', { ns: 'fretboard' })}</label>
            <Select
              value={chordType || 'none'}
              onValueChange={(value) => onChordTypeChange(value === 'none' ? undefined : value as ChordType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHORD_TYPE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`chordTypes.${option.value}`, { ns: 'fretboard' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}