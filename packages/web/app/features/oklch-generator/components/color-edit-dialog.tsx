import * as React from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { getColorFormats, convertHexToOklch } from '~/utils';
import { useI18n } from '~/lib/i18n';
import type { OklchColor } from '../types';
import { formatOklchValue } from '../utils';

type ColorEditDialogProps = {
  color: OklchColor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: Partial<Omit<OklchColor, 'id'>>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
};

export function ColorEditDialog({ color, open, onOpenChange, onUpdate, onRemove, onDuplicate }: ColorEditDialogProps) {
  const { t } = useI18n();
  const [editName, setEditName] = React.useState('');
  const [editLightness, setEditLightness] = React.useState(0);
  const [editChroma, setEditChroma] = React.useState(0);
  const [editHue, setEditHue] = React.useState(0);
  const [editAlpha, setEditAlpha] = React.useState(1);
  const colorInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (color) {
      setEditName(color.name);
      setEditLightness(color.lightness);
      setEditChroma(color.chroma);
      setEditHue(color.hue);
      setEditAlpha(color.alpha || 1);
    }
  }, [color]);

  if (!color) return null;

  const currentColor = {
    ...color,
    name: editName,
    lightness: editLightness,
    chroma: editChroma,
    hue: editHue,
    alpha: editAlpha === 1 ? undefined : editAlpha,
  };

  const colorValue = formatOklchValue(currentColor);
  const colorFormats = getColorFormats(currentColor);

  const handleSave = () => {
    onUpdate({
      name: editName.trim(),
      lightness: editLightness,
      chroma: editChroma,
      hue: editHue,
      alpha: editAlpha === 1 ? undefined : editAlpha,
    });
    onOpenChange(false);
  };

  const handleCopyColor = async (format: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Copied ${format}: ${value}`);
    } catch (err) {
      console.error('Failed to copy color value:', err);
      toast.error('Failed to copy color value');
    }
  };

  const handleColorClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = event.target.value;
    const oklchColor = convertHexToOklch(hexColor);

    if (oklchColor) {
      setEditLightness(oklchColor.lightness);
      setEditChroma(oklchColor.chroma);
      setEditHue(oklchColor.hue);
      setEditAlpha(oklchColor.alpha || 1);
    }
  };

  const handleRemove = () => {
    onRemove();
    onOpenChange(false);
  };

  const handleDuplicate = () => {
    onDuplicate();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('colorEditor.title', { ns: 'oklch-generator' })}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Color Preview */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="border-border h-20 w-20 cursor-pointer rounded-lg border transition-opacity hover:opacity-80"
                style={{ backgroundColor: colorValue }}
                onClick={handleColorClick}
                title="Click to change color"
              />
              <input
                ref={colorInputRef}
                type="color"
                value={colorFormats.find((f) => f.label === 'HEX')?.value || '#000000'}
                onChange={handleColorChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{editName}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Copy color value">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {colorFormats.map((format) => (
                      <DropdownMenuItem key={format.label} onSelect={() => handleCopyColor(format.label, format.value)}>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium">{format.label}</span>
                          <span className="text-muted-foreground font-mono text-xs">{format.value}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-muted-foreground font-mono text-xs">{colorValue}</p>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('colorEditor.fields.name', { ns: 'oklch-generator' })}</label>
            <Input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter color name"
            />
          </div>

          {/* OKLCH Values */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('colorEditor.fields.lightness', { ns: 'oklch-generator' })}
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={editLightness}
                onChange={(e) => setEditLightness(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('colorEditor.fields.chroma', { ns: 'oklch-generator' })}</label>
              <Input
                type="number"
                min="0"
                max="0.5"
                step="0.001"
                value={editChroma}
                onChange={(e) => setEditChroma(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('colorEditor.fields.hue', { ns: 'oklch-generator' })}</label>
              <Input
                type="number"
                min="0"
                max="360"
                step="1"
                value={editHue}
                onChange={(e) => setEditHue(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('colorEditor.fields.alpha', { ns: 'oklch-generator' })}</label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={editAlpha}
                onChange={(e) => setEditAlpha(parseFloat(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDuplicate}>
              {t('colorEditor.actions.duplicate', { ns: 'oklch-generator' })}
            </Button>
            <Button variant="outline" onClick={handleRemove} className="text-destructive hover:text-destructive">
              {t('colorEditor.actions.remove', { ns: 'oklch-generator' })}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('buttons.cancel')}
            </Button>
            <Button onClick={handleSave}>{t('buttons.save')}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
