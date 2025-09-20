import * as React from 'react';
import type { CreateVideoStep } from '../types';
import type { CreateVideoData, ScriptStepData, ImageStepData, AudioStepData, VideoStepData } from '../schemas';

export interface CreateVideoContextValue {
  currentStep: number;
  completedSteps: Set<number>;
  validatedSteps: Set<number>;
  steps: CreateVideoStep[];
  formData: Partial<CreateVideoData>;
  updateStepData: (step: keyof CreateVideoData, data: any) => void;
  goToNextStep: () => void;
  handlePrevious: () => void;
  handleStepClick: (stepNumber: number) => void;
  isStepDisabled: (stepNumber: number) => boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  getCurrentStepData: () => any;
}

export const CreateVideoContext = React.createContext<CreateVideoContextValue | null>(null);