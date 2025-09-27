import { type VideoEditorState, type VideoTrack } from './context';

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

export const initialVideoEditorState: VideoEditorState = {
  canvas: null,
  videoElement: null,
  isPlaying: false,
  currentTime: 0,
  duration: 10, // デフォルトで10秒
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
        // ビジネスロジック: video要素のイベントリスナー設定
        const handleTimeUpdate = () => {
          // タイマーベースの再生中は video の timeupdate を完全に無視
          const currentState = getState();
          // srcがあり、かつ再生していない時のみ同期
          if (!currentState.isPlaying && video.src && video.readyState >= 1) {
            dispatch({ type: 'SET_CURRENT_TIME', payload: video.currentTime });
          }
        };

        const handleDurationChange = () => {
          if (video.duration && !isNaN(video.duration)) {
            dispatch({ type: 'SET_DURATION', payload: video.duration });
          }
        };

        const handlePlay = () => {
          // video要素からの再生イベントは無視（タイマーベースを優先）
        };

        const handlePause = () => {
          // video要素からの一時停止イベントは無視（タイマーベースを優先）
        };

        const handleVolumeChange = () => {
          dispatch({ type: 'SET_VOLUME', payload: video.volume });
        };

        const handleRateChange = () => {
          dispatch({ type: 'SET_PLAYBACK_RATE', payload: video.playbackRate });
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('durationchange', handleDurationChange);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('volumechange', handleVolumeChange);
        video.addEventListener('ratechange', handleRateChange);

        // クリーンアップ関数を video 要素に保存
        (video as any).__videoEditorCleanup = () => {
          video.removeEventListener('timeupdate', handleTimeUpdate);
          video.removeEventListener('durationchange', handleDurationChange);
          video.removeEventListener('play', handlePlay);
          video.removeEventListener('pause', handlePause);
          video.removeEventListener('volumechange', handleVolumeChange);
          video.removeEventListener('ratechange', handleRateChange);
        };
      }
    },

    play: async () => {
      const state = getState();

      // タイマーベースの再生システム
      if (!state.isPlaying) {
        // 既存のタイマーがあれば停止
        if (state.timerId) {
          cancelAnimationFrame(state.timerId);
          dispatch({ type: 'SET_TIMER_ID', payload: null });
        }

        dispatch({ type: 'SET_PLAYING', payload: true });

        // 独立したタイマーで時間を更新
        const startTime = Date.now();
        const initialCurrentTime = state.currentTime;

        let lastUpdateTime = startTime;

        const updateTime = () => {
          const currentState = getState();

          // 再生が停止された場合はタイマーを停止
          if (!currentState.isPlaying) {
            return;
          }

          const now = Date.now();
          // UI更新を33ms間隔（約30FPS）に制限して滑らかにする
          if (now - lastUpdateTime < 33) {
            const timerId = requestAnimationFrame(updateTime);
            dispatch({ type: 'SET_TIMER_ID', payload: timerId });
            return;
          }

          lastUpdateTime = now;
          const elapsed = ((now - startTime) * currentState.playbackRate) / 1000;
          const newTime = initialCurrentTime + elapsed;

          if (newTime >= currentState.duration) {
            // 再生終了
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

      // video 要素がある場合は同期
      if (state.videoElement) {
        try {
          await state.videoElement.play();
        } catch (error) {
          console.error('Video play failed (but timer continues):', error);
        }
      }
    },

    pause: () => {
      const state = getState();

      // タイマーを停止
      if (state.timerId) {
        cancelAnimationFrame(state.timerId);
        dispatch({ type: 'SET_TIMER_ID', payload: null });
      }

      dispatch({ type: 'SET_PLAYING', payload: false });

      // video 要素がある場合は同期
      if (state.videoElement) {
        state.videoElement.pause();
      }
    },

    seekTo: (time: number) => {
      const state = getState();

      // 時間を制限してから設定
      const clampedTime = Math.max(0, Math.min(state.duration, time));
      dispatch({ type: 'SET_CURRENT_TIME', payload: clampedTime });

      // video 要素がある場合は同期
      if (state.videoElement) {
        state.videoElement.currentTime = clampedTime;
      }
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
        // ビジネスロジック: 動画の長さが変わったらタイムラインも更新
        timeline: {
          ...state.timeline,
          end: action.payload,
        },
      };

    case 'SET_VOLUME':
      return {
        ...state,
        volume: Math.max(0, Math.min(1, action.payload)), // ビジネスロジック: 音量は0-1の範囲
      };

    case 'SET_PLAYBACK_RATE':
      return {
        ...state,
        playbackRate: Math.max(0.25, Math.min(4, action.payload)), // ビジネスロジック: 再生速度は0.25-4の範囲
      };

    case 'SET_TIMELINE_RANGE':
      return {
        ...state,
        timeline: {
          ...state.timeline,
          start: Math.max(0, action.payload.start), // ビジネスロジック: 開始時間は0以上
          end: Math.min(state.duration, Math.max(action.payload.start, action.payload.end)), // ビジネスロジック: 終了時間の制約
        },
      };

    case 'SET_TIMELINE_ZOOM':
      return {
        ...state,
        timeline: {
          ...state.timeline,
          zoom: Math.max(0.1, Math.min(10, action.payload)), // ビジネスロジック: ズームは0.1-10の範囲
        },
      };

    case 'ADD_TRACK':
      // ビジネスロジック: 同じIDのトラックは追加しない
      if (state.tracks.some((track) => track.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        tracks: [
          ...state.tracks,
          {
            ...action.payload,
            // ビジネスロジック: 新しいトラックのデフォルト値設定
            startTime: Math.max(0, action.payload.startTime),
            endTime: Math.min(state.duration, Math.max(action.payload.startTime, action.payload.endTime)),
          },
        ],
      };

    case 'REMOVE_TRACK':
      return {
        ...state,
        tracks: state.tracks.filter((track) => track.id !== action.payload),
        // ビジネスロジック: トラックを削除したら選択状態からも除外
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
                // ビジネスロジック: 時間の制約を適用
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
      // ビジネスロジック: 既に選択されている場合は何もしない
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
