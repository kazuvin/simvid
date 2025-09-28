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

