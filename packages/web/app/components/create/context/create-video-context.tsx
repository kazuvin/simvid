import * as React from 'react';
import type { CreateVideoStep } from '../types';

export interface CreateVideoContextValue {
  currentStep: number;
  completedSteps: Set<number>;
  steps: CreateVideoStep[];
  handleNext: () => void;
  handlePrevious: () => void;
  handleStepClick: (stepNumber: number) => void;
  isStepDisabled: (stepNumber: number) => boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const CreateVideoContext = React.createContext<CreateVideoContextValue | null>(null);