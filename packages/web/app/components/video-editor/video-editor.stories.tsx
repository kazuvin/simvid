import type { Meta, StoryObj } from '@storybook/react';
import { VideoEditor } from './video-editor';
import type { VideoProject } from './schemas';

const meta: Meta<typeof VideoEditor> = {
  title: 'Components/VideoEditor/VideoEditor',
  component: VideoEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Complete video editor component with canvas, timeline controls, and professional UI. Features independent timer-based playback that works without video files.',
      },
    },
  },
  argTypes: {
    showControls: {
      control: 'boolean',
      description: 'Show/hide timeline controls',
    },
    showDebugInfo: {
      control: 'boolean',
      description: 'Show/hide debug information overlay',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    project: {
      control: 'object',
      description: 'Video project configuration containing all video-related settings',
    },
  },
};

export default meta;
type Story = StoryObj<typeof VideoEditor>;

// Sample project configurations
const defaultProject: VideoProject = {
  name: 'Default Demo Project',
  duration: 10,
  output: {
    width: 800,
    height: 450,
    frameRate: 30,
    format: 'mp4',
  },
  tracks: [
    {
      type: 'text',
      name: 'Main Title',
      text: 'Professional Video Editor',
      startTime: 1,
      endTime: 5,
      fontSize: 48,
      color: '#ffffff',
      y: 180,
    },
    {
      type: 'text',
      name: 'Subtitle',
      text: 'Independent timer-based playback system',
      startTime: 3,
      endTime: 8,
      fontSize: 24,
      color: '#ffdd44',
      y: 270,
    },
    {
      type: 'text',
      name: 'Ending Message',
      text: 'Works without video files!',
      startTime: 7,
      endTime: 10,
      fontSize: 32,
      color: '#44ff44',
    },
  ],
  settings: {
    backgroundColor: '#1a1a2e',
  },
};

const presentationProject: VideoProject = {
  name: 'Presentation Demo',
  duration: 12,
  output: {
    width: 800,
    height: 450,
    frameRate: 30,
  },
  tracks: [
    {
      type: 'text',
      name: 'Welcome',
      text: 'Welcome to SimVid',
      startTime: 0,
      endTime: 3,
      fontSize: 54,
      color: '#ffffff',
      y: 150,
    },
    {
      type: 'text',
      name: 'Product Name',
      text: 'Advanced Video Editor',
      startTime: 2.5,
      endTime: 6,
      fontSize: 36,
      color: '#3b82f6',
      y: 220,
    },
    {
      type: 'text',
      name: 'Technology',
      text: 'Built with React & TypeScript',
      startTime: 5,
      endTime: 9,
      fontSize: 28,
      color: '#10b981',
      y: 280,
    },
    {
      type: 'text',
      name: 'Status',
      text: 'Ready for Production',
      startTime: 8,
      endTime: 12,
      fontSize: 42,
      color: '#f59e0b',
      y: 200,
    },
  ],
  settings: {
    backgroundColor: '#0f1419',
  },
};

const mixedMediaProject: VideoProject = {
  name: 'Mixed Media Demo',
  duration: 10,
  output: {
    width: 800,
    height: 450,
    frameRate: 30,
  },
  tracks: [
    {
      type: 'video',
      name: 'Background Video',
      source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      startTime: 2,
      endTime: 8,
      layout: 'custom',
      transform: {
        x: 50,
        y: 50,
        width: 400,
        height: 225,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 1,
      },
      volume: 0.3,
      objectFit: 'cover',
    },
    {
      type: 'image',
      name: 'Overlay Image',
      source: 'https://picsum.photos/200/150?random=1',
      startTime: 3,
      endTime: 7,
      layout: 'custom',
      transform: {
        x: 450,
        y: 50,
        width: 200,
        height: 150,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 0.8,
      },
      objectFit: 'contain',
    },
    {
      type: 'text',
      name: 'Text Overlay',
      startTime: 4,
      endTime: 6,
      text: 'Text + Image + Video',
      fontSize: 36,
      color: '#ffffff',
      y: 300,
    },
  ],
  settings: {
    backgroundColor: '#1e293b',
  },
};

const videoOnlyProject: VideoProject = {
  name: 'Video-Only Demo',
  duration: 20,
  output: {
    width: 1280,
    height: 720,
    frameRate: 30,
  },
  tracks: [
    {
      type: 'video',
      name: 'Main Video',
      source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      startTime: 0,
      endTime: 15,
      layout: 'fullscreen',
      volume: 1,
      objectFit: 'cover',
    },
    {
      type: 'video',
      name: 'Rotated Overlay',
      source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      startTime: 5,
      endTime: 12,
      layout: 'custom',
      transform: {
        x: 200,
        y: 100,
        width: 400,
        height: 300,
        scaleX: 0.8,
        scaleY: 0.8,
        rotation: 15,
        opacity: 0.7,
      },
      volume: 0.2,
      objectFit: 'contain',
    },
  ],
  settings: {
    backgroundColor: '#000000',
  },
};

// Demo wrapper with feature descriptions
function VideoEditorDemo(props: any) {
  return (
    <div className="space-y-4">
      <VideoEditor {...props} />
      <div className="text-muted-foreground max-w-2xl text-sm">
        <p className="mb-2 font-medium">Features demonstrated:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Professional timeline with drag-to-seek functionality</li>
          <li>Play/pause controls with frame-by-frame navigation</li>
          <li>Multiple playback speeds (0.25x to 4x)</li>
          <li>Volume control with mute/unmute</li>
          <li>Dynamic duration setting</li>
          <li>Text tracks with timing visualization</li>
          <li>Independent timer system (no video file required)</li>
        </ul>
      </div>
    </div>
  );
}

// Story definitions
export const Default: Story = {
  args: {
    project: defaultProject,
    showControls: true,
    showDebugInfo: false,
  },
  render: (args) => <VideoEditorDemo {...args} />,
};

export const MixedMedia: Story = {
  args: {
    project: mixedMediaProject,
    showControls: true,
    showDebugInfo: false,
  },
  render: (args) => <VideoEditorDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Video editor with background video, picture-in-picture overlay, and text tracks. Demonstrates canvas-based video rendering with transforms.',
      },
    },
  },
};
