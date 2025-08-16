import { formatHex, formatRgb, formatHsl, oklch, parseHex } from 'culori';
import type { OklchColor } from '~/features/oklch-generator/types';

export interface ColorFormat {
  label: string;
  value: string;
}

export const convertOklchToHex = (color: OklchColor): string => {
  const oklchColor = {
    mode: 'oklch' as const,
    l: color.lightness / 100,
    c: color.chroma,
    h: color.hue,
    alpha: color.alpha,
  };
  return formatHex(oklchColor) || '#000000';
};

export const convertOklchToRgb = (color: OklchColor): string => {
  const oklchColor = {
    mode: 'oklch' as const,
    l: color.lightness / 100,
    c: color.chroma,
    h: color.hue,
    alpha: color.alpha,
  };
  return formatRgb(oklchColor) || 'rgb(0, 0, 0)';
};

export const convertOklchToHsl = (color: OklchColor): string => {
  const oklchColor = {
    mode: 'oklch' as const,
    l: color.lightness / 100,
    c: color.chroma,
    h: color.hue,
    alpha: color.alpha,
  };
  return formatHsl(oklchColor) || 'hsl(0, 0%, 0%)';
};

export const formatOklchValue = (color: OklchColor): string => {
  const { lightness, chroma, hue, alpha } = color;
  const alphaValue = alpha !== undefined ? ` / ${alpha}` : '';
  return `oklch(${lightness}% ${chroma} ${hue}${alphaValue})`;
};

export const convertHexToOklch = (hexColor: string): OklchColor | null => {
  try {
    const parsed = parseHex(hexColor);
    if (!parsed) return null;
    
    const oklchColor = oklch(parsed);
    if (!oklchColor) return null;

    return {
      id: crypto.randomUUID(),
      name: `Color ${hexColor}`,
      lightness: (oklchColor.l || 0) * 100,
      chroma: oklchColor.c || 0,
      hue: oklchColor.h || 0,
      alpha: oklchColor.alpha !== undefined && oklchColor.alpha !== 1 ? oklchColor.alpha : undefined,
    };
  } catch (error) {
    console.error('Failed to convert hex to OKLCH:', error);
    return null;
  }
};

export const getColorFormats = (color: OklchColor): ColorFormat[] => [
  {
    label: 'OKLCH',
    value: formatOklchValue(color),
  },
  {
    label: 'HEX',
    value: convertOklchToHex(color),
  },
  {
    label: 'RGB',
    value: convertOklchToRgb(color),
  },
  {
    label: 'HSL',
    value: convertOklchToHsl(color),
  },
];
