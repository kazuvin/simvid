import { type ReactNode, useReducer, useMemo, useEffect, useRef } from 'react';
import { VideoEditorContext } from './context';
import { videoEditorReducer, initialVideoEditorState, createVideoEditorActions } from './reducer';

interface VideoEditorProviderProps {
  children: ReactNode;
}

export function VideoEditorProvider({ children }: VideoEditorProviderProps) {
  const [state, dispatch] = useReducer(videoEditorReducer, initialVideoEditorState);

  // Actions を安定化するために useMemo を使用
  const actions = useMemo(() => createVideoEditorActions(state, dispatch), [state, dispatch]);

  // video 要素が変更された時のクリーンアップ
  useEffect(() => {
    return () => {
      if (state.videoElement && (state.videoElement as any).__videoEditorCleanup) {
        (state.videoElement as any).__videoEditorCleanup();
      }
    };
  }, [state.videoElement]);

  const contextValue = useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions],
  );

  return <VideoEditorContext.Provider value={contextValue}>{children}</VideoEditorContext.Provider>;
}
