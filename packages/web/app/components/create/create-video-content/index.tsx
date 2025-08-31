import { ScriptStep, ImageStep, AudioStep, VideoStep } from './step-contents';
import { CreateVideoNavigation } from '../create-video-navigation';
import { useCreateVideoContext } from '../context';

export function CreateVideoContent() {
  const { currentStep } = useCreateVideoContext();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ScriptStep />;
      case 2:
        return <ImageStep />;
      case 3:
        return <AudioStep />;
      case 4:
        return <VideoStep />;
      default:
        return <ScriptStep />;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto p-8">
        {renderStepContent()}
      </div>
      <CreateVideoNavigation />
    </div>
  );
}

