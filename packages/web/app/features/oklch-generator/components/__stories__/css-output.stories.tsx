import type { Meta, StoryObj } from '@storybook/react';
import { CssOutput } from '../css-output';
import type { OklchColor } from '../../types';

const sampleColors: OklchColor[] = [
  { id: '1', name: 'primary', lightness: 55, chroma: 0.224, hue: 264 },
  { id: '2', name: 'secondary', lightness: 96.1, chroma: 0.014, hue: 264 },
  { id: '3', name: 'destructive', lightness: 55, chroma: 0.206, hue: 27 },
  { id: '4', name: 'accent', lightness: 73.9, chroma: 0.155, hue: 53 },
];

const meta: Meta<typeof CssOutput> = {
  title: 'Features/OKLCH Generator/CSS Output',
  component: CssOutput,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof CssOutput>;

export const Default: Story = {
  args: {
    colors: sampleColors,
  },
};

export const Empty: Story = {
  args: {
    colors: [],
  },
};

export const SingleColor: Story = {
  args: {
    colors: [{ id: '1', name: 'primary', lightness: 55, chroma: 0.224, hue: 264 }],
  },
};
