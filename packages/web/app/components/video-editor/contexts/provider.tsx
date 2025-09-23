import { type ReactNode, useReducer, useMemo, useEffect, useRef } from 'react';
import { VideoEditorContext } from './context';
import { videoEditorReducer, initialVideoEditorState, createVideoEditorActions } from './reducer';

interface VideoEditorProviderProps {
  children: ReactNode;
}

export function VideoEditorProvider({ children }: VideoEditorProviderProps) {
  const [state, dispatch] = useReducer(videoEditorReducer, initialVideoEditorState);
  const actionsRef = useRef(createVideoEditorActions(state, dispatch));

  // アクションを最新の state で更新
  useEffect(() => {
    actionsRef.current = createVideoEditorActions(state, dispatch);
  }, [state]);

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
      actions: actionsRef.current,
    }),
    [state],
  );

  return <VideoEditorContext.Provider value={contextValue}>{children}</VideoEditorContext.Provider>;
}
