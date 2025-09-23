import type { AspectRatio, PlaybackState, RenderConfig } from './schemas';

export const ASPECT_RATIO_PRESETS: Record<AspectRatio, { width: number; height: number }> = {
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
};

export const DEFAULT_RENDER_CONFIG: RenderConfig = {
  width: 1920,
  height: 1080,
  aspectRatio: '16:9',
  fps: 30,
  quality: 'high',
  fontSmoothing: true,
  imageInterpolation: 'linear',
  outputFormat: 'mp4',
};

export const DEFAULT_PLAYBACK_STATE: PlaybackState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  speed: 1,
  loop: false,
};
