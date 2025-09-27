import type { VideoEditorState, VideoTrack } from './types';
import type { VideoEditorAction } from './actions';

export const initialVideoEditorState: VideoEditorState = {
  canvas: null,
  videoElement: null,
  isPlaying: false,
  currentTime: 0,
  duration: 10,
  volume: 1,
  playbackRate: 1,
  timeline: {
    start: 0,
    end: 10,
    zoom: 1,
  },
  selectedTracks: [],
  tracks: [],
  timerId: null,
};

export function videoEditorReducer(state: VideoEditorState, action: VideoEditorAction): VideoEditorState {
  switch (action.type) {
    case 'SET_CANVAS':
      return { ...state, canvas: action.payload };

    case 'SET_VIDEO_ELEMENT':
      return { ...state, videoElement: action.payload };

    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };

    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };

    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload,
        timeline: {
          ...state.timeline,
          end: action.payload,
        },
      };

    case 'SET_VOLUME':
      return {
        ...state,
        volume: Math.max(0, Math.min(1, action.payload)),
      };

    case 'SET_PLAYBACK_RATE':
      return {
        ...state,
        playbackRate: Math.max(0.25, Math.min(4, action.payload)),
      };

    case 'SET_TIMELINE_RANGE':
      return {
        ...state,
        timeline: {
          ...state.timeline,
          start: Math.max(0, action.payload.start),
          end: Math.min(state.duration, Math.max(action.payload.start, action.payload.end)),
        },
      };

    case 'SET_TIMELINE_ZOOM':
      return {
        ...state,
        timeline: {
          ...state.timeline,
          zoom: Math.max(0.1, Math.min(10, action.payload)),
        },
      };

    case 'ADD_TRACK':
      if (state.tracks.some((track) => track.id === action.payload.id)) {
        return state;
      }

      const newTrack = {
        ...action.payload,
        startTime: Math.max(0, action.payload.startTime),
        endTime: Math.min(state.duration, Math.max(action.payload.startTime, action.payload.endTime)),
      };

      if (newTrack.type === 'video' && newTrack.source) {
        const videoElement = document.createElement('video');

        const isExternalUrl = newTrack.source.startsWith('http') &&
                             !newTrack.source.includes(window.location.hostname);

        if (isExternalUrl) {
          videoElement.crossOrigin = 'anonymous';
        }

        videoElement.muted = newTrack.metadata?.muted ?? true;
        videoElement.volume = newTrack.metadata?.volume ?? 1;
        videoElement.playbackRate = newTrack.metadata?.playbackRate ?? 1;
        videoElement.preload = 'auto';
        videoElement.playsInline = true;

        videoElement.style.position = 'absolute';
        videoElement.style.left = '-9999px';
        videoElement.style.top = '-9999px';
        videoElement.style.width = '1px';
        videoElement.style.height = '1px';
        videoElement.style.opacity = '0';
        videoElement.style.pointerEvents = 'none';

        document.body.appendChild(videoElement);

        videoElement.src = newTrack.source;
        videoElement.load();

        (newTrack as any).videoElement = videoElement;
      }

      return {
        ...state,
        tracks: [...state.tracks, newTrack],
      };

    case 'REMOVE_TRACK':
      const trackToRemove = state.tracks.find((track) => track.id === action.payload);
      if (trackToRemove && trackToRemove.type === 'video' && (trackToRemove as any).videoElement) {
        const videoElement = (trackToRemove as any).videoElement;
        videoElement.pause();
        videoElement.src = '';
        videoElement.load();

        if (videoElement.parentNode) {
          videoElement.parentNode.removeChild(videoElement);
        }
      }

      return {
        ...state,
        tracks: state.tracks.filter((track) => track.id !== action.payload),
        selectedTracks: state.selectedTracks.filter((id) => id !== action.payload),
      };

    case 'UPDATE_TRACK':
      return {
        ...state,
        tracks: state.tracks.map((track) =>
          track.id === action.payload.id
            ? {
                ...track,
                ...action.payload.updates,
                startTime:
                  action.payload.updates.startTime !== undefined
                    ? Math.max(0, action.payload.updates.startTime)
                    : track.startTime,
                endTime:
                  action.payload.updates.endTime !== undefined
                    ? Math.min(state.duration, Math.max(track.startTime, action.payload.updates.endTime))
                    : track.endTime,
              }
            : track,
        ),
      };

    case 'SELECT_TRACK':
      if (state.selectedTracks.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        selectedTracks: [...state.selectedTracks, action.payload],
      };

    case 'DESELECT_TRACK':
      return {
        ...state,
        selectedTracks: state.selectedTracks.filter((id) => id !== action.payload),
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedTracks: [],
      };

    case 'SET_TIMER_ID':
      return {
        ...state,
        timerId: action.payload,
      };

    default:
      return state;
  }
}