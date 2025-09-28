import type { Meta, StoryObj } from '@storybook/react';
import { VideoEditor } from './video-editor';
import { ImageTrackControls } from './image-track-controls';
import type { VideoProject } from './schemas';

const meta: Meta<typeof VideoEditor> = {
  title: 'VideoEditor/ImageTrack',
  component: VideoEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImageProject: VideoProject = {
  name: 'Image Track Demo',
  duration: 10,
  output: {
    width: 800,
    height: 450,
  },
  tracks: [
    {
      type: 'image',
      name: 'Sample Image',
      startTime: 0,
      endTime: 5,
      source: 'https://picsum.photos/800/600?random=1',
      layout: 'fullscreen',
      objectFit: 'cover',
    },
    {
      type: 'image',
      name: 'Custom Position Image',
      startTime: 3,
      endTime: 8,
      source: 'https://picsum.photos/400/300?random=2',
      layout: 'custom',
      transform: {
        x: 100,
        y: 50,
        width: 300,
        height: 200,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 0.8,
      },
      objectFit: 'contain',
    },
    {
      type: 'text',
      name: 'Overlay Text',
      startTime: 1,
      endTime: 9,
      text: 'Image Track Demo',
      fontSize: 32,
      color: '#ffffff',
      x: 400,
      y: 400,
      textAlign: 'center',
      baseline: 'middle',
    },
  ],
};

export const ImageTrackDemo: Story = {
  args: {
    project: sampleImageProject,
    showControls: true,
    showDebugInfo: true,
    showImageUploader: false,
  },
};

export const ImageTrackWithControls: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="flex-1">
        <VideoEditor
          project={sampleImageProject}
          showControls={true}
          showDebugInfo={true}
          showImageUploader={false}
        />
      </div>
      <div className="w-80 border border-border rounded-lg">
        <ImageTrackControls trackId="initial-image-0" />
      </div>
    </div>
  ),
};

export const MultipleImageTracks: Story = {
  args: {
    project: {
      ...sampleImageProject,
      tracks: [
        {
          type: 'image',
          name: 'Background Image',
          startTime: 0,
          endTime: 10,
          source: 'https://picsum.photos/800/600?random=3',
          layout: 'fullscreen',
          objectFit: 'cover',
        },
        {
          type: 'image',
          name: 'Overlay 1',
          startTime: 2,
          endTime: 6,
          source: 'https://picsum.photos/200/200?random=4',
          layout: 'custom',
          transform: {
            x: 50,
            y: 50,
            width: 150,
            height: 150,
            scaleX: 1,
            scaleY: 1,
            rotation: 15,
            opacity: 0.9,
          },
          objectFit: 'cover',
        },
        {
          type: 'image',
          name: 'Overlay 2',
          startTime: 4,
          endTime: 8,
          source: 'https://picsum.photos/200/200?random=5',
          layout: 'custom',
          transform: {
            x: 600,
            y: 250,
            width: 150,
            height: 150,
            scaleX: 1.2,
            scaleY: 1.2,
            rotation: -10,
            opacity: 0.8,
          },
          objectFit: 'contain',
        },
      ],
    },
    showControls: true,
    showDebugInfo: true,
    showImageUploader: false,
  },
};