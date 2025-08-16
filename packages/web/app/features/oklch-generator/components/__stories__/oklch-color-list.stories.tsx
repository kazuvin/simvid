import type { Meta, StoryObj } from '@storybook/react';
import { OklchColorList } from '../oklch-color-list';
import type { OklchColor } from '../../types';

const sampleColors: OklchColor[] = [
  {
    id: '1',
    name: 'primary',
    lightness: 55,
    chroma: 0.224,
    hue: 264,
  },
  {
    id: '2',
    name: 'secondary',
    lightness: 96.1,
    chroma: 0.014,
    hue: 264,
  },
  {
    id: '3',
    name: 'destructive',
    lightness: 55,
    chroma: 0.206,
    hue: 27,
  },
  {
    id: '4',
    name: 'accent-with-alpha',
    lightness: 73.9,
    chroma: 0.155,
    hue: 53,
    alpha: 0.8,
  },
];

const meta: Meta<typeof OklchColorList> = {
  title: 'Features/OKLCH Generator/Color List',
  component: OklchColorList,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onUpdate: { action: 'updated' },
    onRemove: { action: 'removed' },
    onDuplicate: { action: 'duplicated' },
    onAdd: { action: 'added' },
  },
};

export default meta;

type Story = StoryObj<typeof OklchColorList>;

export const Default: Story = {
  args: {
    colors: sampleColors,
    onAdd: () => console.log('Add color'),
  },
};

export const Empty: Story = {
  args: {
    colors: [],
    onAdd: () => console.log('Add color'),
  },
};

export const SingleColor: Story = {
  args: {
    colors: [sampleColors[0]],
    onAdd: () => console.log('Add color'),
  },
};
