import * as React from 'react';
import { CreateVideoContext } from './create-video-context';
import type { CreateVideoStep } from '../types';
import type { CreateVideoContextValue } from './create-video-context';
import type { CreateVideoData } from '../schemas';

interface CreateVideoProviderProps {
  children: React.ReactNode;
  steps: CreateVideoStep[];
}

export function CreateVideoProvider({ children, steps }: CreateVideoProviderProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set());
  const [validatedSteps, setValidatedSteps] = React.useState<Set<number>>(new Set());
  const [formData, setFormData] = React.useState<Partial<CreateVideoData>>({});

  const updateStepData = React.useCallback((step: keyof CreateVideoData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data,
    }));
  }, []);

  const getCurrentStepData = React.useCallback(() => {
    const stepKeys: (keyof CreateVideoData)[] = ['script', 'image', 'audio', 'video'];
    const currentStepKey = stepKeys[currentStep - 1];
    return formData[currentStepKey];
  }, [currentStep, formData]);

  const goToNextStep = React.useCallback(() => {
    setValidatedSteps(prev => new Set(prev).add(currentStep));
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const handlePrevious = React.useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);

  const handleStepClick = React.useCallback((stepNumber: number) => {
    if (validatedSteps.has(stepNumber) || stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  }, [validatedSteps, currentStep]);

  const isStepDisabled = React.useCallback((stepNumber: number) => {
    return stepNumber > currentStep && !validatedSteps.has(stepNumber);
  }, [currentStep, validatedSteps]);

  const canGoNext = React.useMemo(() => {
    return currentStep <= steps.length;
  }, [currentStep, steps.length]);

  const canGoPrevious = React.useMemo(() => {
    return currentStep > 1;
  }, [currentStep]);

  const contextValue: CreateVideoContextValue = {
    currentStep,
    completedSteps,
    validatedSteps,
    steps,
    formData,
    updateStepData,
    goToNextStep,
    handlePrevious,
    handleStepClick,
    isStepDisabled,
    canGoNext,
    canGoPrevious,
    getCurrentStepData,
  };

  return (
    <CreateVideoContext.Provider value={contextValue}>
      {children}
    </CreateVideoContext.Provider>
  );
}