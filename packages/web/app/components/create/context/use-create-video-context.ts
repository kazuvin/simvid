import * as React from 'react';
import { CreateVideoContext } from './create-video-context';

export function useCreateVideoContext() {
  const context = React.useContext(CreateVideoContext);
  if (!context) {
    throw new Error('useCreateVideoContext must be used within a CreateVideoProvider');
  }
  return context;
}