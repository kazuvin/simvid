import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { Card, Input, Textarea, Button } from '~/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { scriptStepSchema, type ScriptStepData } from '../schemas';
import { useCreateVideoContext } from '../context';

export function ScriptStep() {
  const { formData, updateStepData, goToNextStep, handlePrevious, currentStep, steps, canGoPrevious } = useCreateVideoContext();
  
  const form = useForm<ScriptStepData>({
    resolver: zodResolver(scriptStepSchema),
    defaultValues: formData.script || {
      theme: '',
      duration: 'short',
      targetAudience: '',
      content: '',
    },
  });

  const onSubmit = async (data: ScriptStepData) => {
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
        <h3 className="text-xl font-semibold">台本作成</h3>
        <p className="text-muted-foreground">動画の台本やシナリオを作成しましょう</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>動画のテーマ</FormLabel>
                    <FormControl>
                      <Input placeholder="例: プログラミング入門" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>動画の長さ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="動画の長さを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="short">短編 (1-3分)</SelectItem>
                        <SelectItem value="medium">中編 (3-10分)</SelectItem>
                        <SelectItem value="long">長編 (10分以上)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ターゲット層</FormLabel>
                    <FormControl>
                      <Input placeholder="例: プログラミング初心者" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>詳細な内容</FormLabel>
                    <FormControl>
                      <Textarea placeholder="動画で伝えたい内容を詳しく記載してください" rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Navigation */}
            <div className="border-t border-border pt-6">
              <div className="flex justify-between items-center">
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
                ) : (
                  <div />
                )}
                
                <Button
                  type="submit"
                  size="default"
                >
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
        <h3 className="text-xl font-semibold">画像生成</h3>
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
        <h3 className="text-xl font-semibold">音声生成</h3>
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