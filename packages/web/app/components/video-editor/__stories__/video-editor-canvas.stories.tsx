import type { Meta, StoryObj } from '@storybook/react';
import { VideoEditorCanvas } from '../video-editor-canvas';
import { VideoEditorProvider } from '../contexts';

const meta: Meta<typeof VideoEditorCanvas> = {
  title: 'Components/VideoEditor/VideoEditorCanvas',
  component: VideoEditorCanvas,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Canvas-based video editor component that renders video, images, and text tracks with timeline synchronization.',
      },
    },
  },
  argTypes: {
    width: {
      control: { type: 'number', min: 400, max: 1920, step: 50 },
      description: 'Canvas width in pixels',
    },
    height: {
      control: { type: 'number', min: 200, max: 1080, step: 50 },
      description: 'Canvas height in pixels',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof VideoEditorCanvas>;

// デモ用のコンポーネント（動画を読み込んでテキストトラックを追加）
function VideoEditorDemo({ width, height, className }: any) {
  return (
    <VideoEditorProvider>
      <VideoEditorCanvas width={width} height={height} className={className} />
      <DemoControls />
    </VideoEditorProvider>
  );
}

function DemoControls() {
  const { state, actions } = useVideoEditor();

  const loadSampleVideo = () => {
    // Sample video URL (Big Buck Bunny - Creative Commons)
    const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    if (state.videoElement) {
      state.videoElement.src = videoUrl;
      state.videoElement.load();

      // 動画の読み込み完了を待つ
      state.videoElement.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully');
        console.log('Video duration:', state.videoElement?.duration);
        console.log('Video readyState:', state.videoElement?.readyState);
      }, { once: true });

      state.videoElement.addEventListener('error', (e) => {
        console.error('Video load error:', e);
      }, { once: true });
    }
  };

  const addTextTrack = () => {
    const textTrack = {
      id: `text-${Date.now()}`,
      type: 'text' as const,
      name: 'Sample Text',
      startTime: 2,
      endTime: 8,
      enabled: true,
      locked: false,
      metadata: {
        text: 'Hello, Video Editor!',
        fontSize: 48,
        fontFamily: 'Arial',
        color: '#ffffff',
        x: 400, // center of 800px canvas
        y: 225, // center of 450px canvas
        textAlign: 'center',
        baseline: 'middle',
      },
    };

    actions.addTrack(textTrack);
  };

  const addSecondTextTrack = () => {
    const textTrack = {
      id: `text-${Date.now()}`,
      type: 'text' as const,
      name: 'Subtitle Text',
      startTime: 5,
      endTime: 12,
      enabled: true,
      locked: false,
      metadata: {
        text: 'This text appears from 5s to 12s',
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#ffff00',
        x: 400,
        y: 350, // bottom area
        textAlign: 'center',
        baseline: 'middle',
      },
    };

    actions.addTrack(textTrack);
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex gap-2">
        <button
          onClick={loadSampleVideo}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          disabled={!state.videoElement}
        >
          Load Sample Video
        </button>
        <button onClick={addTextTrack} className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
          Add Main Text (2s-8s)
        </button>
        <button onClick={addSecondTextTrack} className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
          Add Subtitle (5s-12s)
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={async () => {
            console.log('Play button clicked');
            console.log('Video element:', state.videoElement);
            console.log('Video readyState:', state.videoElement?.readyState);
            console.log('Video src:', state.videoElement?.src);
            try {
              await actions.play();
              console.log('Play action completed');
            } catch (error) {
              console.error('Play action failed:', error);
            }
          }}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          disabled={!state.videoElement || state.isPlaying}
        >
          Play
        </button>
        <button
          onClick={actions.pause}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          disabled={!state.videoElement || !state.isPlaying}
        >
          Pause
        </button>
        <button
          onClick={() => actions.seekTo(0)}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          disabled={!state.videoElement}
        >
          Reset
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={state.volume}
          onChange={(e) => actions.setVolume(parseFloat(e.target.value))}
          className="w-24"
        />
        <span className="text-sm">{Math.round(state.volume * 100)}%</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Seek:</label>
        <input
          type="range"
          min="0"
          max={state.duration || 100}
          step="0.1"
          value={state.currentTime}
          onChange={(e) => actions.seekTo(parseFloat(e.target.value))}
          className="w-48"
          disabled={!state.videoElement}
        />
        <span className="text-sm">{state.currentTime.toFixed(1)}s</span>
      </div>

      <div className="text-sm text-gray-600">
        <p>Instructions:</p>
        <ol className="list-inside list-decimal space-y-1">
          <li>Click "Load Sample Video" to load a test video</li>
          <li>Add text tracks with different timing</li>
          <li>Use Play/Pause controls to see text appearing at specified times</li>
          <li>Use the seek bar to jump to different times</li>
        </ol>
      </div>
    </div>
  );
}

// Import useVideoEditor in the component
import { useVideoEditor } from '~/components/video-editor/contexts';

export const Default: Story = {
  args: {
    width: 800,
    height: 450,
  },
  render: (args) => <VideoEditorDemo {...args} />,
};

export const Compact: Story = {
  args: {
    width: 640,
    height: 360,
  },
  render: (args) => <VideoEditorDemo {...args} />,
};

export const LargeCanvas: Story = {
  args: {
    width: 1280,
    height: 720,
  },
  render: (args) => <VideoEditorDemo {...args} />,
};

export const WithCustomStyling: Story = {
  args: {
    width: 800,
    height: 450,
    className: 'shadow-lg border-2 border-blue-300',
  },
  render: (args) => <VideoEditorDemo {...args} />,
};

export const WithSampleContent: Story = {
  args: {
    width: 800,
    height: 450,
  },
  render: (args) => <VideoEditorDemo {...args} />,
};
