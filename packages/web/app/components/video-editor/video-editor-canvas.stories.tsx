import type { Meta, StoryObj } from '@storybook/react';
import { VideoEditorCanvas } from './video-editor-canvas';
import { VideoEditorProvider } from './contexts';

const meta: Meta<typeof VideoEditorCanvas> = {
  title: 'Components/VideoEditor/VideoEditorCanvas',
  component: VideoEditorCanvas,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Canvas component for video editor that renders video content, text overlays, and provides visual feedback. Features independent timer-based rendering system.',
      },
    },
  },
  argTypes: {
    width: {
      control: { type: 'number', min: 200, max: 1920, step: 10 },
      description: 'Canvas width in pixels',
    },
    height: {
      control: { type: 'number', min: 200, max: 1080, step: 10 },
      description: 'Canvas height in pixels',
    },
    showDebugInfo: {
      control: 'boolean',
      description: 'Show debug information overlay',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <VideoEditorProvider>
        <Story />
      </VideoEditorProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VideoEditorCanvas>;

export const Default: Story = {
  args: {
    width: 800,
    height: 450,
    showDebugInfo: false,
  },
};

export const WithDebugInfo: Story = {
  args: {
    width: 800,
    height: 450,
    showDebugInfo: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Canvas with debug information overlay showing current state.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    width: 640,
    height: 360,
    showDebugInfo: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact size canvas suitable for smaller containers.',
      },
    },
  },
};

export const FullHD: Story = {
  args: {
    width: 1280,
    height: 720,
    showDebugInfo: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Full HD resolution canvas for high-quality content.',
      },
    },
  },
};

export const Square: Story = {
  args: {
    width: 600,
    height: 600,
    showDebugInfo: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Square aspect ratio canvas for social media content.',
      },
    },
  },
};