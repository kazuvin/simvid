import { Button } from '~/components/ui';
import { useCreateVideoContext } from './context';

export function CreateVideoNavigation() {
  const { currentStep, steps, handleNext, handlePrevious, canGoNext, canGoPrevious } = useCreateVideoContext();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  return (
    <div className="border-border bg-background border-t p-6">
      <div className="flex items-center justify-between">
        {!isFirstStep ? (
          <Button onClick={handlePrevious} disabled={!canGoPrevious} variant="outline" size="default">
            前のステップ
          </Button>
        ) : (
          <div />
        )}

        <Button onClick={handleNext} disabled={!canGoNext} size="default">
          {isLastStep ? '作成する' : '次のステップ'}
        </Button>
      </div>
    </div>
  );
}

