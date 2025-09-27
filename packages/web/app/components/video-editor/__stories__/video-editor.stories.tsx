import type { Meta, StoryObj } from '@storybook/react';
import { VideoEditor, type VideoProject, type InitialTrack } from '../video-editor';
import { useVideoEditor } from '../contexts';
import { useEffect } from 'react';

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

// Sample project data
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

const multiLayerProject: VideoProject = {
  name: 'Multi-Layer Demo',
  duration: 15,
  output: {
    width: 1280,
    height: 720,
    frameRate: 30,
  },
  tracks: [
    {
      type: 'text',
      name: 'Background',
      text: 'Background Title',
      startTime: 0,
      endTime: 15,
      fontSize: 72,
      color: '#1f2937',
      y: 360,
    },
    {
      type: 'text',
      name: 'Layer 1',
      text: 'Foreground Text 1',
      startTime: 2,
      endTime: 6,
      fontSize: 32,
      color: '#ef4444',
      y: 200,
    },
    {
      type: 'text',
      name: 'Layer 2',
      text: 'Foreground Text 2',
      startTime: 5,
      endTime: 9,
      fontSize: 28,
      color: '#3b82f6',
      y: 500,
    },
    {
      type: 'text',
      name: 'Overlay',
      text: 'Overlay Message',
      startTime: 8,
      endTime: 12,
      fontSize: 36,
      color: '#ffffff',
      y: 300,
    },
    {
      type: 'text',
      name: 'Credits',
      text: 'Final Credits',
      startTime: 12,
      endTime: 15,
      fontSize: 24,
      color: '#6b7280',
      y: 600,
    },
  ],
  settings: {
    backgroundColor: '#111827',
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
      type: 'text',
      name: 'Opening Title',
      text: 'Mixed Media Demo',
      startTime: 0,
      endTime: 3,
      fontSize: 48,
      color: '#ffffff',
      y: 100,
    },
    {
      type: 'text',
      name: 'Subtitle',
      text: 'Supports multiple track types',
      startTime: 4,
      endTime: 8,
      fontSize: 24,
      color: '#ffdd44',
      y: 350,
    },
  ],
  settings: {
    backgroundColor: '#1e293b',
  },
};

const emptyProject: VideoProject = {
  name: 'Empty Project',
  duration: 10,
  output: {
    width: 800,
    height: 450,
    frameRate: 30,
  },
  tracks: [],
};

// Demo component wrapper with feature description
function VideoEditorDemo(props: any) {
  return (
    <div className="space-y-4">
      <VideoEditor {...props} />
      <div className="text-sm text-muted-foreground max-w-2xl">
        <p className="font-medium mb-2">Features demonstrated:</p>
        <ul className="list-disc list-inside space-y-1">
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

export const Default: Story = {
  args: {
    project: defaultProject,
    showControls: true,
    showDebugInfo: false,
  },
  render: (args) => <VideoEditorDemo {...args} />,
};

export const WithoutControls: Story = {
  args: {
    project: defaultProject,
    showControls: false,
    showDebugInfo: false,
  },
  render: (args) => <VideoEditor {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Video editor with controls hidden, showing only the canvas component.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    project: {
      ...defaultProject,
      output: {
        ...defaultProject.output,
        width: 640,
        height: 360,
      },
    },
    showControls: true,
    showDebugInfo: false,
  },
  render: (args) => <VideoEditorDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Compact size video editor suitable for smaller containers.',
      },
    },
  },
};

export const FullHD: Story = {
  args: {
    project: multiLayerProject,
    showControls: true,
    showDebugInfo: false,
  },
  render: (args) => <VideoEditorDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Full HD resolution video editor with multiple text layers for high-quality content.',
      },
    },
  },
};

export const Presentation: Story = {
  args: {
    project: presentationProject,
    showControls: true,
    showDebugInfo: false,
  },
  render: (args) => <VideoEditorDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Video editor configured for presentation-style content with sequential text appearance.',
      },
    },
  },
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
        story: 'Video editor demonstrating mixed media support (text, video, audio tracks).',
      },
    },
  },
};

export const WithDebugInfo: Story = {
  args: {
    project: defaultProject,
    showControls: true,
    showDebugInfo: true,
  },
  render: (args) => <VideoEditorDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Video editor with debug information overlay visible.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    project: defaultProject,
    showControls: true,
    showDebugInfo: false,
    className: 'shadow-2xl border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30',
  },
  render: (args) => <VideoEditorDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Video editor with custom styling applied via className prop.',
      },
    },
  },
};

// Interactive playground story
function InteractiveDemo(props: any) {
  function InteractiveController() {
    const { state, actions } = useVideoEditor();

    const addRandomTextTrack = () => {
      const colors = ['#ffffff', '#ffdd44', '#44ff44', '#4488ff', '#ff4444', '#ff44ff'];
      const texts = ['Amazing!', 'Awesome', 'Cool Text', 'Hello World', 'Video Editor', 'React Magic'];

      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      const startTime = Math.random() * (state.duration - 3);
      const endTime = startTime + 2 + Math.random() * 3;
      const randomY = 100 + Math.random() * (props.height - 200);

      const textTrack = {
        id: `random-${Date.now()}`,
        type: 'text' as const,
        name: `Text ${state.tracks.length + 1}`,
        startTime,
        endTime: Math.min(endTime, state.duration),
        enabled: true,
        locked: false,
        metadata: {
          text: `${randomText} ${state.tracks.length + 1}`,
          fontSize: 20 + Math.random() * 40,
          fontFamily: 'Arial',
          color: randomColor,
          x: props.width / 2,
          y: randomY,
          textAlign: 'center',
          baseline: 'middle',
        },
      };

      actions.addTrack(textTrack);
    };

    const clearAllTracks = () => {
      state.tracks.forEach(track => actions.removeTrack(track.id));
    };

    return (
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-medium mb-3">Interactive Controls</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={addRandomTextTrack}
            className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90"
          >
            Add Random Text
          </button>
          <button
            onClick={clearAllTracks}
            className="bg-destructive text-destructive-foreground px-3 py-1 rounded text-sm hover:bg-destructive/90"
          >
            Clear All Tracks
          </button>
          <button
            onClick={() => actions.setDuration(30)}
            className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm hover:bg-secondary/90"
          >
            30s Duration
          </button>
          <button
            onClick={() => actions.setDuration(60)}
            className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm hover:bg-secondary/90"
          >
            60s Duration
          </button>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Current tracks: {state.tracks.length} | Duration: {state.duration}s | Time: {state.currentTime.toFixed(1)}s
        </div>
      </div>
    );
  }

  return (
    <div>
      <VideoEditor {...props} />
      <InteractiveController />
    </div>
  );
}

export const InteractivePlayground: Story = {
  args: {
    project: {
      ...emptyProject,
      duration: 15,
    },
    showControls: true,
    showDebugInfo: false,
  },
  render: (args) => <InteractiveDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground where you can add random text tracks and experiment with the editor.',
      },
    },
  },
};

export const EmptyEditor: Story = {
  args: {
    project: emptyProject,
    showControls: true,
    showDebugInfo: false,
  },
  render: (args) => <VideoEditor {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Empty video editor ready for content creation.',
      },
    },
  },
};