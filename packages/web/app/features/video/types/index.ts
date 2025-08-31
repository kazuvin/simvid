export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  duration: number; // in milliseconds
  alt?: string;
}

export interface Subtitle {
  id: string;
  text: string;
  startTime: number; // in milliseconds
  endTime: number; // in milliseconds
  position?: {
    x: number;
    y: number;
  };
  style?: {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    fontFamily?: string;
  };
}

export interface VideoProject {
  id: string;
  title: string;
  mediaItems: MediaItem[];
  subtitles: Subtitle[];
  settings: {
    width: number;
    height: number;
    fps: number;
    backgroundColor: string;
  };
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentMediaIndex: number;
  speed: number;
}