import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { Code } from '~/components/ui/code';
import { toast } from 'sonner';
import { useI18n } from '~/lib/i18n';
import type { OklchColor } from '../types';

type OutputFormat = 'css-variables' | 'tailwind-v3' | 'tailwind-v4';

type CssOutputProps = {
  colors: OklchColor[];
  className?: string;
};

export function CssOutput({ colors, className }: CssOutputProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState<OutputFormat>('css-variables');

  const generateCssVariables = (colors: OklchColor[]) => {
    if (colors.length === 0) return '';

    const cssVars = colors
      .map(
        (color) => `  --${color.name.replace(/\s+/g, '-')}: oklch(${color.lightness}% ${color.chroma} ${color.hue});`,
      )
      .join('\n');

    return `:root {\n${cssVars}\n}`;
  };

  const generateTailwindV3 = (colors: OklchColor[]) => {
    if (colors.length === 0) return '';

    const colorEntries = colors
      .map(
        (color) =>
          `        '${color.name.replace(/\s+/g, '-')}': 'oklch(${color.lightness}% ${color.chroma} ${color.hue})'`,
      )
      .join(',\n');

    return `module.exports = {
  theme: {
    extend: {
      colors: {
${colorEntries}
      }
    }
  }
}`;
  };

  const generateTailwindV4 = (colors: OklchColor[]) => {
    if (colors.length === 0) return '';

    const cssVars = colors
      .map(
        (color) =>
          `  --color-${color.name.replace(/\s+/g, '-')}: oklch(${color.lightness}% ${color.chroma} ${color.hue});`,
      )
      .join('\n');

    return `@theme {\n${cssVars}\n}`;
  };

  const getOutputByFormat = (format: OutputFormat) => {
    switch (format) {
      case 'css-variables':
        return generateCssVariables(colors);
      case 'tailwind-v3':
        return generateTailwindV3(colors);
      case 'tailwind-v4':
        return generateTailwindV4(colors);
      default:
        return '';
    }
  };

  const handleCopy = React.useCallback(() => {
    toast('CSS copied to clipboard!');
  }, [toast]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('cssOutput.title', { ns: 'oklch-generator' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OutputFormat)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="css-variables">
              {t('cssOutput.tabs.cssVariables', { ns: 'oklch-generator' })}
            </TabsTrigger>
            <TabsTrigger value="tailwind-v3">{t('cssOutput.tabs.tailwindV3', { ns: 'oklch-generator' })}</TabsTrigger>
            <TabsTrigger value="tailwind-v4">{t('cssOutput.tabs.tailwindV4', { ns: 'oklch-generator' })}</TabsTrigger>
          </TabsList>

          <TabsContent value="css-variables" className="mt-4">
            <Code showCopy onCopy={handleCopy}>
              {getOutputByFormat('css-variables')}
            </Code>
          </TabsContent>

          <TabsContent value="tailwind-v3" className="mt-4">
            <Code language="javascript" showCopy onCopy={handleCopy}>
              {getOutputByFormat('tailwind-v3')}
            </Code>
          </TabsContent>

          <TabsContent value="tailwind-v4" className="mt-4">
            <Code showCopy onCopy={handleCopy}>
              {getOutputByFormat('tailwind-v4')}
            </Code>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
