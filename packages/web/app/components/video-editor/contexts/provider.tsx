import { type ReactNode, useReducer, useMemo, useEffect, useRef } from 'react';
import { VideoEditorContext } from './context';
import { videoEditorReducer, initialVideoEditorState, createVideoEditorActions } from './reducer';

interface VideoEditorProviderProps {
  children: ReactNode;
}

export function VideoEditorProvider({ children }: VideoEditorProviderProps) {
  const [state, dispatch] = useReducer(videoEditorReducer, initialVideoEditorState);
  const stateRef = useRef(state);

  // 最新の state を ref に保持
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Actions を安定化するために dispatch のみに依存
  const actions = useMemo(() => createVideoEditorActions(() => stateRef.current, dispatch), [dispatch]);

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
