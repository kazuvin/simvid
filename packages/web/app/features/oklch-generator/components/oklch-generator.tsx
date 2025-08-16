import { Button } from '~/components/ui/button';
import { cn } from '~/utils';
import { useI18n } from '~/lib/i18n';
import { useOklchGenerator } from '../hooks';
import { generateRandomOklchColor } from '../utils';
import { OklchColorList } from './oklch-color-list';
import { CssOutput } from './css-output';
import { OklchImportDialog } from './oklch-import-dialog';

type OklchGeneratorProps = {
  className?: string;
};

export function OklchGenerator({ className }: OklchGeneratorProps) {
  const { t } = useI18n();
  const { colors, addColor, updateColor, removeColor, clearColors, duplicateColor, importColors } = useOklchGenerator();

  const addDefaultColor = () => {
    addColor(generateRandomOklchColor());
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title', { ns: 'oklch-generator' })}</h1>
          <p className="text-muted-foreground">{t('description', { ns: 'oklch-generator' })}</p>
        </div>
        <div className="flex gap-2">
          <OklchImportDialog onImport={importColors}>
            <Button variant="outline">{t('actions.importCSS', { ns: 'oklch-generator' })}</Button>
          </OklchImportDialog>
          {colors.length > 2 && (
            <Button variant="outline" onClick={clearColors}>
              {t('actions.clearAll', { ns: 'oklch-generator' })}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <OklchColorList
            colors={colors}
            onUpdate={updateColor}
            onRemove={removeColor}
            onDuplicate={duplicateColor}
            onAdd={addDefaultColor}
          />
        </div>

        <div>
          <CssOutput colors={colors} />
        </div>
      </div>
    </div>
  );
}
