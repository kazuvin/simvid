import * as React from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Textarea } from '~/components/ui/textarea';
import { useI18n } from '~/lib/i18n';
import type { OklchColor } from '../types';
import { parseOklchFromCss } from '../utils';

type OklchImportDialogProps = {
  onImport: (colors: Omit<OklchColor, 'id'>[]) => void;
  children: React.ReactNode;
};

export function OklchImportDialog({ onImport, children }: OklchImportDialogProps) {
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [cssText, setCssText] = React.useState('');
  const [parsedColors, setParsedColors] = React.useState<Omit<OklchColor, 'id'>[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleCssTextChange = (value: string) => {
    setCssText(value);
    setError(null);

    if (value.trim()) {
      try {
        const colors = parseOklchFromCss(value);
        setParsedColors(colors);

        if (colors.length === 0) {
          setError(
            'No OKLCH colors found in the provided CSS. Make sure your CSS contains --color-* properties with oklch() values.',
          );
        }
      } catch {
        setError('Failed to parse CSS. Please check the format and try again.');
        setParsedColors([]);
      }
    } else {
      setParsedColors([]);
    }
  };

  const handleImport = () => {
    if (parsedColors.length > 0) {
      onImport(parsedColors);
      setOpen(false);
      setCssText('');
      setParsedColors([]);
      setError(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCssText('');
    setParsedColors([]);
    setError(null);
  };

  const exampleCss = `@theme {
  --color-primary: oklch(55% 0.224 264);
  --color-secondary: oklch(96.1% 0.014 264);
  --color-accent: oklch(73.9% 0.155 53);
  --color-destructive: oklch(55% 0.206 27 / 0.9);
}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('import.title', { ns: 'oklch-generator' })}</DialogTitle>
          <DialogDescription>{t('import.description', { ns: 'oklch-generator' })}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('import.fields.cssCode', { ns: 'oklch-generator' })}</label>
            <Textarea
              placeholder={exampleCss}
              value={cssText}
              onChange={(e) => handleCssTextChange(e.target.value)}
              className="min-h-[200px] font-mono text-xs"
            />
          </div>

          {error && (
            <div className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border p-3 text-sm">
              {error}
            </div>
          )}

          {parsedColors.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('import.fields.preview', { ns: 'oklch-generator', replace: { count: parsedColors.length } })}
              </label>
              <div className="border-border grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto rounded-md border p-3">
                {parsedColors.map((color, index) => (
                  <div key={index} className="bg-muted/50 flex items-center gap-3 rounded p-2">
                    <div
                      className="border-border h-8 w-8 flex-shrink-0 rounded border"
                      style={{
                        backgroundColor: `oklch(${color.lightness}% ${color.chroma} ${color.hue}${color.alpha ? ` / ${color.alpha}` : ''})`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{color.name}</p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {`L:${color.lightness}% C:${color.chroma} H:${color.hue}°${color.alpha ? ` A:${color.alpha}` : ''}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t('import.buttons.cancel', { ns: 'oklch-generator' })}
          </Button>
          <Button onClick={handleImport} disabled={parsedColors.length === 0}>
            {t('import.buttons.import', { ns: 'oklch-generator' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
