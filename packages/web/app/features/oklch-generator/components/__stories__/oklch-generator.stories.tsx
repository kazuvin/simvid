import type { Meta, StoryObj } from '@storybook/react';
import { OklchGenerator } from '../oklch-generator';

const meta: Meta<typeof OklchGenerator> = {
  title: 'Features/OKLCH Generator',
  component: OklchGenerator,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof OklchGenerator>;

export const Default: Story = {
  args: {},
};
