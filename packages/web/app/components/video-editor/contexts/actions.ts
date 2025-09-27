import type { VideoEditorState, VideoTrack } from './types';

export type VideoEditorAction =
  | { type: 'SET_CANVAS'; payload: HTMLCanvasElement | null }
  | { type: 'SET_VIDEO_ELEMENT'; payload: HTMLVideoElement | null }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_PLAYBACK_RATE'; payload: number }
  | { type: 'SET_TIMELINE_RANGE'; payload: { start: number; end: number } }
  | { type: 'SET_TIMELINE_ZOOM'; payload: number }
  | { type: 'ADD_TRACK'; payload: VideoTrack }
  | { type: 'REMOVE_TRACK'; payload: string }
  | { type: 'UPDATE_TRACK'; payload: { id: string; updates: Partial<VideoTrack> } }
  | { type: 'SELECT_TRACK'; payload: string }
  | { type: 'DESELECT_TRACK'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_TIMER_ID'; payload: number | null };

export interface VideoEditorActions {
  setCanvas: (canvas: HTMLCanvasElement | null) => void;
  setVideoElement: (video: HTMLVideoElement | null) => void;
  play: () => Promise<void>;
  pause: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setDuration: (duration: number) => void;
  setTimelineRange: (start: number, end: number) => void;
  setTimelineZoom: (zoom: number) => void;
  addTrack: (track: VideoTrack) => void;
  removeTrack: (trackId: string) => void;
  updateTrack: (trackId: string, updates: Partial<VideoTrack>) => void;
  selectTrack: (trackId: string) => void;
  deselectTrack: (trackId: string) => void;
  clearSelection: () => void;
}

export function createVideoEditorActions(
  getState: () => VideoEditorState,
  dispatch: (action: VideoEditorAction) => void,
): VideoEditorActions {
  return {
    setCanvas: (canvas: HTMLCanvasElement | null) => {
      dispatch({ type: 'SET_CANVAS', payload: canvas });
    },

    setVideoElement: (video: HTMLVideoElement | null) => {
      dispatch({ type: 'SET_VIDEO_ELEMENT', payload: video });

      if (video) {
        const handleTimeUpdate = () => {
          const currentState = getState();
          if (!currentState.isPlaying && video.src && video.readyState >= 1) {
            dispatch({ type: 'SET_CURRENT_TIME', payload: video.currentTime });
          }
        };

        const handleDurationChange = () => {
          if (video.duration && !isNaN(video.duration)) {
            dispatch({ type: 'SET_DURATION', payload: video.duration });
          }
        };

        const handleVolumeChange = () => {
          dispatch({ type: 'SET_VOLUME', payload: video.volume });
        };

        const handleRateChange = () => {
          dispatch({ type: 'SET_PLAYBACK_RATE', payload: video.playbackRate });
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('durationchange', handleDurationChange);
        video.addEventListener('volumechange', handleVolumeChange);
        video.addEventListener('ratechange', handleRateChange);

        (video as any).__videoEditorCleanup = () => {
          video.removeEventListener('timeupdate', handleTimeUpdate);
          video.removeEventListener('durationchange', handleDurationChange);
          video.removeEventListener('volumechange', handleVolumeChange);
          video.removeEventListener('ratechange', handleRateChange);
        };
      }
    },

    play: async () => {
      const state = getState();

      if (!state.isPlaying) {
        if (state.timerId) {
          cancelAnimationFrame(state.timerId);
          dispatch({ type: 'SET_TIMER_ID', payload: null });
        }

        dispatch({ type: 'SET_PLAYING', payload: true });

        const startTime = Date.now();
        const initialCurrentTime = state.currentTime;
        let lastUpdateTime = startTime;

        const updateTime = () => {
          const currentState = getState();

          if (!currentState.isPlaying) {
            return;
          }

          const now = Date.now();
          if (now - lastUpdateTime < 33) {
            const timerId = requestAnimationFrame(updateTime);
            dispatch({ type: 'SET_TIMER_ID', payload: timerId });
            return;
          }

          lastUpdateTime = now;
          const elapsed = ((now - startTime) * currentState.playbackRate) / 1000;
          const newTime = initialCurrentTime + elapsed;

          if (newTime >= currentState.duration) {
            dispatch({ type: 'SET_CURRENT_TIME', payload: currentState.duration });
            dispatch({ type: 'SET_PLAYING', payload: false });
            dispatch({ type: 'SET_TIMER_ID', payload: null });
          } else {
            dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
            const timerId = requestAnimationFrame(updateTime);
            dispatch({ type: 'SET_TIMER_ID', payload: timerId });
          }
        };

        const timerId = requestAnimationFrame(updateTime);
        dispatch({ type: 'SET_TIMER_ID', payload: timerId });
      }

      if (state.videoElement) {
        try {
          await state.videoElement.play();
        } catch (error) {
          // Video play failed, but timer continues
        }
      }

      state.tracks.forEach(track => {
        if (track.type === 'video' && (track as any).videoElement) {
          const videoElement = (track as any).videoElement;
          try {
            const trackTime = state.currentTime - track.startTime;
            if (trackTime >= 0 && trackTime <= (track.endTime - track.startTime)) {
              videoElement.currentTime = trackTime;
              videoElement.play();
            }
          } catch (error) {
            // Ignore play errors
          }
        }
      });
    },

    pause: () => {
      const state = getState();

      if (state.timerId) {
        cancelAnimationFrame(state.timerId);
        dispatch({ type: 'SET_TIMER_ID', payload: null });
      }

      dispatch({ type: 'SET_PLAYING', payload: false });

      if (state.videoElement) {
        state.videoElement.pause();
      }

      state.tracks.forEach(track => {
        if (track.type === 'video' && (track as any).videoElement) {
          const videoElement = (track as any).videoElement;
          videoElement.pause();
        }
      });
    },

    seekTo: (time: number) => {
      const state = getState();
      const clampedTime = Math.max(0, Math.min(state.duration, time));
      dispatch({ type: 'SET_CURRENT_TIME', payload: clampedTime });

      if (state.videoElement) {
        state.videoElement.currentTime = clampedTime;
      }

      state.tracks.forEach(track => {
        if (track.type === 'video' && (track as any).videoElement) {
          const videoElement = (track as any).videoElement;
          const trackTime = clampedTime - track.startTime;
          if (trackTime >= 0 && trackTime <= (track.endTime - track.startTime)) {
            videoElement.currentTime = trackTime;
          }
        }
      });
    },

    setVolume: (volume: number) => {
      dispatch({ type: 'SET_VOLUME', payload: volume });
      const state = getState();
      if (state.videoElement) {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        state.videoElement.volume = clampedVolume;
      }
    },

    setPlaybackRate: (rate: number) => {
      dispatch({ type: 'SET_PLAYBACK_RATE', payload: rate });
      const state = getState();
      if (state.videoElement) {
        const clampedRate = Math.max(0.25, Math.min(4, rate));
        state.videoElement.playbackRate = clampedRate;
      }
    },

    setDuration: (duration: number) => {
      dispatch({ type: 'SET_DURATION', payload: Math.max(0.1, duration) });
    },

    setTimelineRange: (start: number, end: number) => {
      dispatch({ type: 'SET_TIMELINE_RANGE', payload: { start, end } });
    },

    setTimelineZoom: (zoom: number) => {
      dispatch({ type: 'SET_TIMELINE_ZOOM', payload: zoom });
    },

    addTrack: (track: VideoTrack) => {
      dispatch({ type: 'ADD_TRACK', payload: track });
    },

    removeTrack: (trackId: string) => {
      dispatch({ type: 'REMOVE_TRACK', payload: trackId });
    },

    updateTrack: (trackId: string, updates: Partial<VideoTrack>) => {
      dispatch({ type: 'UPDATE_TRACK', payload: { id: trackId, updates } });
    },

    selectTrack: (trackId: string) => {
      dispatch({ type: 'SELECT_TRACK', payload: trackId });
    },

    deselectTrack: (trackId: string) => {
      dispatch({ type: 'DESELECT_TRACK', payload: trackId });
    },

    clearSelection: () => {
      dispatch({ type: 'CLEAR_SELECTION' });
    },
  };
}