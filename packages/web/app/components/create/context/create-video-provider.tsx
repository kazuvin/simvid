import * as React from 'react';
import { useCreateVideoFlow } from '../hooks';
import { CreateVideoContext } from './create-video-context';
import type { CreateVideoStep } from '../types';
import type { CreateVideoContextValue } from './create-video-context';

interface CreateVideoProviderProps {
  children: React.ReactNode;
  steps: CreateVideoStep[];
}

export function CreateVideoProvider({ children, steps }: CreateVideoProviderProps) {
  const flowState = useCreateVideoFlow(steps);

  const contextValue: CreateVideoContextValue = {
    ...flowState,
    steps,
  };

  return (
    <CreateVideoContext.Provider value={contextValue}>
      {children}
    </CreateVideoContext.Provider>
  );
}