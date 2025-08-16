import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from '../heading';

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'muted', 'destructive', 'primary'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Heading Text',
    level: 'h2',
    variant: 'default',
  },
};

export const H1: Story = {
  args: {
    children: 'Large Heading',
    level: 'h1',
  },
};

export const H3: Story = {
  args: {
    children: 'Medium Heading',
    level: 'h3',
  },
};

export const H6: Story = {
  args: {
    children: 'Small Heading',
    level: 'h6',
  },
};

export const Muted: Story = {
  args: {
    children: 'Muted Heading',
    level: 'h2',
    variant: 'muted',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary Heading',
    level: 'h2',
    variant: 'primary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive Heading',
    level: 'h2',
    variant: 'destructive',
  },
};

export const AllLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading level="h1">Heading 1</Heading>
      <Heading level="h2">Heading 2</Heading>
      <Heading level="h3">Heading 3</Heading>
      <Heading level="h4">Heading 4</Heading>
      <Heading level="h5">Heading 5</Heading>
      <Heading level="h6">Heading 6</Heading>
    </div>
  ),
};
