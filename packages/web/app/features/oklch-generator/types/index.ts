export type OklchColor = {
  id: string;
  name: string;
  lightness: number;
  chroma: number;
  hue: number;
  alpha?: number;
};

export type CssVariable = {
  name: string;
  value: string;
};

export type OklchGeneratorState = {
  colors: OklchColor[];
  cssVariables: CssVariable[];
};
