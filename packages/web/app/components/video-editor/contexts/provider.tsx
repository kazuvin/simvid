import { type ReactNode, useReducer, useMemo, useEffect, useRef } from 'react';
import { VideoEditorContext } from './context';
import { videoEditorReducer, initialVideoEditorState } from './reducer';
import { createVideoEditorActions } from './actions';

interface VideoEditorProviderProps {
  children: ReactNode;
}

export function VideoEditorProvider({ children }: VideoEditorProviderProps) {
  const [state, dispatch] = useReducer(videoEditorReducer, initialVideoEditorState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const actions = useMemo(() => createVideoEditorActions(() => stateRef.current, dispatch), [dispatch]);

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