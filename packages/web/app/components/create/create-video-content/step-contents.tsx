import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { Card, Input, Textarea, Button } from '~/components/ui';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { RequiredChip } from '~/components/shared';
import { ScriptFormSchema, type ScriptFormData } from '../schemas';
import { useCreateVideoContext } from '../context';
import { PersonaManager } from './persona-manager';
import { DurationSelect } from './duration-select';
import { VideoTypeSelect } from './video-type-select';


export function ScriptStep() {
  const { formData, updateStepData, goToNextStep, handlePrevious, currentStep, steps, canGoPrevious } =
    useCreateVideoContext();

  const form = useForm<ScriptFormData>({
    resolver: zodResolver(ScriptFormSchema),
    defaultValues: formData.script || {
      title: '',
      duration: 'product_intro',
      videoType: 'tutorial',
      targetPersonas: [],
      freeInput: '',
    },
  });

  const onSubmit = async (data: ScriptFormData) => {
    updateStepData('script', data);
    goToNextStep();
  };

  // Watch for form changes and update context
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        updateStepData('script', value);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateStepData]);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">動画の企画</h3>
        <p className="text-muted-foreground">動画の台本やシナリオを作成しましょう</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>動画のタイトル</FormLabel>
                      <RequiredChip />
                    </div>
                    <FormControl>
                      <Input placeholder="例: プログラミング入門" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DurationSelect control={form.control} watchDuration={form.watch('duration')} />

              <VideoTypeSelect control={form.control} watchVideoType={form.watch('videoType')} />

              <FormField
                control={form.control}
                name="targetPersonas"
                render={({ field }) => (
                  <FormItem>
                    <PersonaManager personas={field.value || []} onPersonasChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="freeInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>自由入力欄</FormLabel>
                    <FormControl>
                      <Textarea placeholder="動画で伝えたい詳細な内容があれば記載してください" rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Navigation */}
            <div className="border-border border-t pt-6">
              <div className="flex items-center justify-between">
                {!isFirstStep ? (
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    disabled={!canGoPrevious}
                    variant="outline"
                    size="default"
                  >
                    前のステップ
                  </Button>
                ) : null}

                <Button type="submit" size="default">
                  {isLastStep ? '作成する' : '次のステップ'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export function ImageStep() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">内容の編集</h3>
        <p className="text-muted-foreground">台本に基づいて動画に使用する画像を生成します</p>
      </div>
      <Card className="p-6">
        <p className="text-muted-foreground">このステップは後で実装予定です。</p>
      </Card>
    </div>
  );
}

export function AudioStep() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">動画生成</h3>
        <p className="text-muted-foreground">ナレーションや効果音を生成します</p>
      </div>
      <Card className="p-6">
        <p className="text-muted-foreground">このステップは後で実装予定です。</p>
      </Card>
    </div>
  );
}

export function VideoStep() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">動画生成</h3>
        <p className="text-muted-foreground">最終的な動画を生成・出力します</p>
      </div>
      <Card className="p-6">
        <p className="text-muted-foreground">このステップは後で実装予定です。</p>
      </Card>
    </div>
  );
}
