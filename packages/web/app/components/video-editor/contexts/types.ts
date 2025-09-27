export interface VideoEditorState {
  canvas: HTMLCanvasElement | null;
  videoElement: HTMLVideoElement | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  timeline: {
    start: number;
    end: number;
    zoom: number;
  };
  selectedTracks: string[];
  tracks: VideoTrack[];
  timerId: number | null;
}

export interface VideoTrack {
  id: string;
  type: 'video' | 'audio' | 'text';
  name: string;
  startTime: number;
  endTime: number;
  source?: string;
  enabled: boolean;
  locked: boolean;
  metadata?: Record<string, any>;
}