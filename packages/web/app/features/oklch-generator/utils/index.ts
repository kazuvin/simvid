import type { OklchColor, CssVariable } from '../types';
import { formatOklchValue } from '~/utils';

export { formatOklchValue };

export const generateCssVariableName = (name: string): string => {
  return `--color-${name.toLowerCase().replace(/\s+/g, '-')}`;
};

export const colorToCssVariable = (color: OklchColor): CssVariable => {
  return {
    name: generateCssVariableName(color.name),
    value: formatOklchValue(color),
  };
};

export const generateCssOutput = (colors: OklchColor[]): string => {
  const variables = colors.map(colorToCssVariable);
  const cssLines = variables.map((variable) => `  ${variable.name}: ${variable.value};`);

  return `@theme {\n${cssLines.join('\n')}\n}`;
};

export const generateId = (): string => {
  return crypto.randomUUID() as string;
};

export const generateRandomOklchColor = (): Omit<OklchColor, 'id'> => {
  // Generate a random but pleasing OKLCH color
  const lightness = Math.random() * 40 + 40; // 40-80% for good contrast
  const chroma = Math.random() * 0.2 + 0.05; // 0.05-0.25 for vibrant but not oversaturated colors
  const hue = Math.random() * 360; // Full hue range

  return {
    name: `color-${Math.floor(Math.random() * 1000)}`,
    lightness: Math.round(lightness * 10) / 10, // Round to 1 decimal
    chroma: Math.round(chroma * 1000) / 1000, // Round to 3 decimals
    hue: Math.round(hue),
  };
};

export const parseOklchFromCss = (cssText: string): Omit<OklchColor, 'id'>[] => {
  const colors: Omit<OklchColor, 'id'>[] = [];

  // Match CSS custom properties with OKLCH values
  // Pattern: --color-name: oklch(L% C H [/ A]);
  const oklchRegex = /--color-([^:]+):\s*oklch\(([^)]+)\)/g;

  let match;
  while ((match = oklchRegex.exec(cssText)) !== null) {
    const [, colorName, oklchValues] = match;

    // Clean up the color name (remove whitespace, handle kebab-case)
    const cleanName = colorName.trim().replace(/-/g, ' ');

    // Parse OKLCH values: "L% C H" or "L% C H / A"
    const values = oklchValues.trim().split(/\s+/);

    if (values.length >= 3) {
      const lightness = parseFloat(values[0].replace('%', ''));
      const chroma = parseFloat(values[1]);
      const hue = parseFloat(values[2]);

      // Check for alpha value (after / separator)
      let alpha: number | undefined;
      if (values.length >= 5 && values[3] === '/') {
        const alphaValue = parseFloat(values[4]);
        if (alphaValue !== 1) {
          alpha = alphaValue;
        }
      }

      // Validate parsed values
      if (!isNaN(lightness) && !isNaN(chroma) && !isNaN(hue)) {
        colors.push({
          name: cleanName,
          lightness: Math.round(lightness * 10) / 10,
          chroma: Math.round(chroma * 1000) / 1000,
          hue: Math.round(hue),
          alpha,
        });
      }
    }
  }

  return colors;
};
