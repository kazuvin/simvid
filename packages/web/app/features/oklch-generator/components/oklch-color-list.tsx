import * as React from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ColorEditDialog } from './color-edit-dialog';
import { Copy, LayoutGrid, List } from 'lucide-react';
import { toast } from 'sonner';
import { getColorFormats, convertHexToOklch } from '~/utils';
import { useI18n } from '~/lib/i18n';
import type { OklchColor } from '../types';
import { formatOklchValue } from '../utils';

type OklchColorListProps = {
  colors: OklchColor[];
  onUpdate: (id: string, updates: Partial<Omit<OklchColor, 'id'>>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAdd: () => void;
  className?: string;
};

type ColorGridItemProps = {
  color: OklchColor;
  onClick: () => void;
};

type ColorItemProps = {
  color: OklchColor;
  onUpdate: (updates: Partial<Omit<OklchColor, 'id'>>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
};

function ColorItem({ color, onUpdate, onRemove, onDuplicate }: ColorItemProps) {
  const { t } = useI18n();
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [editName, setEditName] = React.useState(color.name);
  const colorInputRef = React.useRef<HTMLInputElement>(null);

  const handleNameEdit = () => {
    if (isEditingName) {
      onUpdate({ name: editName.trim() });
    }
    setIsEditingName(!isEditingName);
  };

  const handleInputBlur = () => {
    // Use setTimeout to allow button click to execute first
    setTimeout(() => {
      if (isEditingName) {
        onUpdate({ name: editName.trim() });
        setIsEditingName(false);
      }
    }, 0);
  };

  const handleValueChange = (field: keyof OklchColor, value: number) => {
    onUpdate({ [field]: value });
  };

  const colorValue = formatOklchValue(color);

  const handleCopyColor = async (format: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Copied ${format}: ${value}`);
    } catch (err) {
      console.error('Failed to copy color value:', err);
      toast.error('Failed to copy color value');
    }
  };

  const colorFormats = getColorFormats(color);

  const handleColorClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = event.target.value;
    const oklchColor = convertHexToOklch(hexColor);

    if (oklchColor) {
      onUpdate({
        lightness: oklchColor.lightness,
        chroma: oklchColor.chroma,
        hue: oklchColor.hue,
        alpha: oklchColor.alpha,
      });
    }
  };

  return (
    <div className="border-border flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="border-border h-16 w-16 flex-shrink-0 cursor-pointer rounded-md border transition-opacity hover:opacity-80"
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

        <div className="min-w-0 flex-1">
          {isEditingName ? (
            <Input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameEdit();
                if (e.key === 'Escape') {
                  setEditName(color.name);
                  setIsEditingName(false);
                }
              }}
              className="h-8 px-2 py-1 text-xs font-medium"
              autoFocus
            />
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-sm font-medium">{color.name}</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                      title="Copy color value"
                    >
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
          )}
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNameEdit}
            onMouseDown={(e) => e.preventDefault()}
            className="h-8 w-8 p-0"
          >
            {isEditingName ? '✓' : '✎'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
            className="h-8 w-8 p-0"
            title={t('colorList.actions.duplicate', { ns: 'oklch-generator' })}
          >
            {}
            {'⧉'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="space-y-1">
          <label className="text-muted-foreground text-xs font-medium">
            {t('colorEditor.fields.lightness', { ns: 'oklch-generator' })}
          </label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={color.lightness}
            onChange={(e) => handleValueChange('lightness', parseFloat(e.target.value) || 0)}
            className="h-8 px-2 py-1 text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-muted-foreground text-xs font-medium">
            {t('colorEditor.fields.chroma', { ns: 'oklch-generator' })}
          </label>
          <Input
            type="number"
            min="0"
            max="0.5"
            step="0.001"
            value={color.chroma}
            onChange={(e) => handleValueChange('chroma', parseFloat(e.target.value) || 0)}
            className="h-8 px-2 py-1 text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-muted-foreground text-xs font-medium">
            {t('colorEditor.fields.hue', { ns: 'oklch-generator' })}
          </label>
          <Input
            type="number"
            min="0"
            max="360"
            step="1"
            value={color.hue}
            onChange={(e) => handleValueChange('hue', parseFloat(e.target.value) || 0)}
            className="h-8 px-2 py-1 text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-muted-foreground text-xs font-medium">
            {t('colorEditor.fields.alpha', { ns: 'oklch-generator' })}
          </label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={color.alpha || 1}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 1;
              onUpdate({ alpha: value === 1 ? undefined : value });
            }}
            className="h-8 px-2 py-1 text-xs"
          />
        </div>
      </div>
    </div>
  );
}

function AddColorButton({ onAdd }: { onAdd: () => void }) {
  const { t } = useI18n();
  return (
    <button
      onClick={onAdd}
      className="border-border hover:border-ring hover:bg-accent/50 flex w-full cursor-pointer flex-col gap-3 rounded-lg border-2 border-dashed p-4 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="border-border bg-muted/50 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md border-2 border-dashed">
          <span className="text-muted-foreground text-2xl">+</span>
        </div>
        <div className="flex-1 text-left">
          <h4 className="text-muted-foreground text-sm font-medium">
            {t('colorList.addNew.title', { ns: 'oklch-generator' })}
          </h4>
          <p className="text-muted-foreground text-xs">
            {t('colorList.addNew.description', { ns: 'oklch-generator' })}
          </p>
        </div>
      </div>
    </button>
  );
}

function ColorGridItem({ color, onClick }: ColorGridItemProps) {
  const colorValue = formatOklchValue(color);

  return (
    <div
      className="border-border aspect-square cursor-pointer rounded-lg border transition-all hover:scale-105 hover:shadow-md"
      style={{ backgroundColor: colorValue }}
      onClick={onClick}
      title={`${color.name} - Click to edit`}
    />
  );
}

function AddColorGridButton({ onAdd }: { onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="border-border hover:border-ring hover:bg-accent/50 flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors"
    >
      <span className="text-muted-foreground text-2xl">+</span>
    </button>
  );
}

export function OklchColorList({ colors, onUpdate, onRemove, onDuplicate, onAdd, className }: OklchColorListProps) {
  const { t } = useI18n();
  const [selectedColor, setSelectedColor] = React.useState<OklchColor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleColorClick = (color: OklchColor) => {
    setSelectedColor(color);
    setIsDialogOpen(true);
  };

  const handleColorUpdate = (updates: Partial<Omit<OklchColor, 'id'>>) => {
    if (selectedColor) {
      onUpdate(selectedColor.id, updates);
    }
  };

  const handleColorRemove = () => {
    if (selectedColor) {
      onRemove(selectedColor.id);
    }
  };

  const handleColorDuplicate = () => {
    if (selectedColor) {
      onDuplicate(selectedColor.id);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t('colorList.title', { ns: 'oklch-generator', replace: { count: colors.length } })}</CardTitle>
        <Button variant="outline" size="sm" onClick={onAdd}>
          {t('colorList.addColor', { ns: 'oklch-generator' })}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              {t('colorList.viewModes.list', { ns: 'oklch-generator' })}
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              {t('colorList.viewModes.grid', { ns: 'oklch-generator' })}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4 space-y-3">
            {colors.map((color) => (
              <ColorItem
                key={color.id}
                color={color}
                onUpdate={(updates) => onUpdate(color.id, updates)}
                onRemove={() => onRemove(color.id)}
                onDuplicate={() => onDuplicate(color.id)}
              />
            ))}
            <AddColorButton onAdd={onAdd} />
          </TabsContent>
          <TabsContent value="grid" className="mt-4">
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
              {colors.map((color) => (
                <ColorGridItem key={color.id} color={color} onClick={() => handleColorClick(color)} />
              ))}
              <AddColorGridButton onAdd={onAdd} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <ColorEditDialog
        color={selectedColor}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUpdate={handleColorUpdate}
        onRemove={handleColorRemove}
        onDuplicate={handleColorDuplicate}
      />
    </Card>
  );
}
