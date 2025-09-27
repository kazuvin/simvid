import { createContext, useContext } from 'react';
import type { VideoEditorState } from './types';
import type { VideoEditorActions } from './actions';

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