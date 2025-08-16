import { useState, useCallback, useMemo } from 'react';
import type { OklchColor, CssVariable } from '../types';
import { colorToCssVariable, generateCssOutput, generateId } from '../utils';

const initialColors: OklchColor[] = [
  {
    id: 'initial-1',
    name: 'primary',
    lightness: 55,
    chroma: 0.224,
    hue: 264,
  },
  {
    id: 'initial-2',
    name: 'secondary',
    lightness: 96.1,
    chroma: 0.014,
    hue: 264,
  },
];

export const useOklchGenerator = () => {
  const [colors, setColors] = useState<OklchColor[]>(initialColors);

  const addColor = useCallback((colorData: Omit<OklchColor, 'id'>) => {
    const newColor: OklchColor = {
      ...colorData,
      id: generateId(),
    };
    setColors((prev) => [...prev, newColor]);
  }, []);

  const updateColor = useCallback((id: string, updates: Partial<Omit<OklchColor, 'id'>>) => {
    setColors((prev) => prev.map((color) => (color.id === id ? { ...color, ...updates } : color)));
  }, []);

  const removeColor = useCallback((id: string) => {
    setColors((prev) => prev.filter((color) => color.id !== id));
  }, []);

  const clearColors = useCallback(() => {
    setColors([]);
  }, []);

  const duplicateColor = useCallback(
    (id: string) => {
      const colorToDuplicate = colors.find((color) => color.id === id);
      if (colorToDuplicate) {
        const duplicatedColor: OklchColor = {
          ...colorToDuplicate,
          id: generateId(),
          name: `${colorToDuplicate.name} Copy`,
        };
        setColors((prev) => [...prev, duplicatedColor]);
      }
    },
    [colors],
  );

  const importColors = useCallback((importedColors: Omit<OklchColor, 'id'>[]) => {
    const newColors: OklchColor[] = importedColors.map((colorData) => ({
      ...colorData,
      id: generateId(),
    }));
    setColors(newColors);
  }, []);

  const cssVariables = useMemo((): CssVariable[] => {
    return colors.map(colorToCssVariable);
  }, [colors]);

  const cssOutput = useMemo(() => {
    return generateCssOutput(colors);
  }, [colors]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, [cssOutput]);

  return {
    colors,
    cssVariables,
    cssOutput,
    addColor,
    updateColor,
    removeColor,
    clearColors,
    duplicateColor,
    importColors,
    copyToClipboard,
  };
};
