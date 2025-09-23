import { createContext, useContext } from 'react';
import type { VideoEditorActions } from './reducer';

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
}

export interface VideoEditorContextValue {
  state: VideoEditorState;
  actions: VideoEditorActions;
}

export const VideoEditorContext = createContext<VideoEditorContextValue | null>(null);

export function useVideoEditor() {
  const context = useContext(VideoEditorContext);
  if (!context) {
    throw new Error('useVideoEditor must be used within a VideoEditorProvider');
  }
  return context;
}

