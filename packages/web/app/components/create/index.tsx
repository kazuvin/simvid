import { CreateVideoProvider } from './context';
import { CreateVideoStepper } from './create-video-stepper';
import { CreateVideoContent } from './create-video-content';
import type { CreateVideoStep } from './types';

const steps: CreateVideoStep[] = [
  {
    step: 1,
    title: '動画の企画',
    description: '動画の台本やシナリオを作成します',
  },
  {
    step: 2,
    title: '内容の編集',
    description: '台本に基づいて画像を生成します',
  },
  {
    step: 3,
    title: '動画生成',
    description: '最終的な動画を生成・出力します',
  },
];

export function CreateVideoFlow() {
  return (
    <CreateVideoProvider steps={steps}>
      <div className="bg-background flex">
        <CreateVideoStepper />
        <CreateVideoContent />
      </div>
    </CreateVideoProvider>
  );
}

