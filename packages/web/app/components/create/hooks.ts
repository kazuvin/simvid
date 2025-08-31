import * as React from 'react';
import type { CreateVideoStep } from '../types';

export function useCreateVideoFlow(steps: CreateVideoStep[]) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set());

  const handleNext = React.useCallback(() => {
    if (currentStep <= steps.length) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
      }
    }
  }, [currentStep, steps.length]);

  const handlePrevious = React.useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);

  const handleStepClick = React.useCallback((stepNumber: number) => {
    // Only allow navigation to completed steps or current step
    if (completedSteps.has(stepNumber) || stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  }, [completedSteps, currentStep]);

  const isStepDisabled = React.useCallback((stepNumber: number) => {
    return stepNumber > currentStep && !completedSteps.has(stepNumber);
  }, [currentStep, completedSteps]);

  const canGoNext = React.useMemo(() => {
    return currentStep <= steps.length;
  }, [currentStep, steps.length]);

  const canGoPrevious = React.useMemo(() => {
    return currentStep > 1;
  }, [currentStep]);

  const isAllCompleted = React.useMemo(() => {
    return completedSteps.size === steps.length;
  }, [completedSteps.size, steps.length]);

  return {
    currentStep,
    completedSteps,
    handleNext,
    handlePrevious,
    handleStepClick,
    isStepDisabled,
    canGoNext,
    canGoPrevious,
    isAllCompleted,
  };
}