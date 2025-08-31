import { Card } from '~/components/ui';
import { Stepper, StepperItem, StepperTrigger, StepperTitle, StepperDescription } from '~/components/ui/stepper';
import { useCreateVideoContext } from './context';

export function CreateVideoStepper() {
  const { steps, currentStep, completedSteps, handleStepClick, isStepDisabled } = useCreateVideoContext();
  return (
    <div className="h-full w-80 shrink-0 p-6">
      <Card className="h-full">
        <div className="flex h-full flex-col space-y-6 p-6">
          <Stepper
            currentStep={currentStep}
            orientation="vertical"
            className="flex w-full flex-col justify-start gap-6"
          >
            {steps.map((step) => (
              <StepperItem
                key={step.step}
                step={step.step}
                disabled={isStepDisabled(step.step)}
                className="flex w-full items-start gap-4 pb-6 last:pb-0"
              >
                <StepperTrigger className="z-10 shrink-0" onClick={() => handleStepClick(step.step)}>
                  {completedSteps.has(step.step) ? '✓' : step.step}
                </StepperTrigger>

                <div className="flex flex-col gap-1">
                  <StepperTitle>{step.title}</StepperTitle>
                  <StepperDescription>{step.description}</StepperDescription>
                </div>
              </StepperItem>
            ))}
          </Stepper>
        </div>
      </Card>
    </div>
  );
}
