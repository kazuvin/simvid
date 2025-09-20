import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { Card, Input, Textarea, Button, Divider } from '~/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '~/components/ui/dialog';
import { RequiredChip } from '~/components/shared';
import {
  ScriptFormSchema,
  type ScriptFormData,
  PersonaFormSchema,
  type PersonaFormData,
  VIDEO_TYPES,
} from '../schemas';
import { useCreateVideoContext } from '../context';

// ペルソナプリセット
const PERSONA_PRESETS = [
  {
    name: 'プログラミング初心者',
    ageRange: '20-30代',
    gender: '問わない',
    occupation: '学生・新社会人',
    characteristics: 'プログラミング経験が浅い、基礎から学びたい、実践的なスキルを身につけたい',
  },
  {
    name: 'ビジネスパーソン',
    ageRange: '30-40代',
    gender: '問わない',
    occupation: '会社員・管理職',
    characteristics: '効率性を重視、実用的な知識を求める、時間が限られている',
  },
  {
    name: '学生',
    ageRange: '18-25歳',
    gender: '問わない',
    occupation: '大学生・大学院生',
    characteristics: '学習意欲が高い、新しい技術に興味津々、キャリア形成を考えている',
  },
  {
    name: 'シニア層',
    ageRange: '50代以上',
    gender: '問わない',
    occupation: 'さまざま',
    characteristics: 'デジタルに不慣れ、丁寧な説明を求める、実生活に役立つ内容を好む',
  },
] as const;

// ペルソナ管理コンポーネント
function PersonaManager({
  personas,
  onPersonasChange,
}: {
  personas: NonNullable<ScriptFormData['targetPersonas']>;
  onPersonasChange: (personas: NonNullable<ScriptFormData['targetPersonas']>) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingPersona, setEditingPersona] = React.useState<NonNullable<ScriptFormData['targetPersonas']>[0] | null>(
    null,
  );

  const personaForm = useForm<PersonaFormData>({
    resolver: zodResolver(PersonaFormSchema),
    defaultValues: {
      name: '',
      ageRange: '',
      gender: '',
      occupation: '',
      characteristics: '',
    },
  });

  const openAddPersona = () => {
    setEditingPersona(null);
    personaForm.reset({
      name: '',
      ageRange: '',
      gender: '',
      occupation: '',
      characteristics: '',
    });
    setIsDialogOpen(true);
  };

  const openEditPersona = (persona: NonNullable<ScriptFormData['targetPersonas']>[0]) => {
    setEditingPersona(persona);
    personaForm.reset({
      name: persona.name,
      ageRange: persona.ageRange || '',
      gender: persona.gender || '',
      occupation: persona.occupation || '',
      characteristics: persona.characteristics || '',
    });
    setIsDialogOpen(true);
  };

  const handleSavePersona = personaForm.handleSubmit((data: PersonaFormData) => {
    const newPersona = {
      id: editingPersona?.id || `persona-${Date.now()}`,
      name: data.name.trim(),
      ageRange: data.ageRange || undefined,
      gender: data.gender || undefined,
      occupation: data.occupation || undefined,
      characteristics: data.characteristics || undefined,
    };

    if (editingPersona) {
      // 編集
      onPersonasChange(personas.map((p) => (p.id === editingPersona.id ? newPersona : p)));
    } else {
      // 新規追加
      onPersonasChange([...personas, newPersona]);
    }

    setIsDialogOpen(false);
  });

  const handleDeletePersona = (id: string) => {
    onPersonasChange(personas.filter((p) => p.id !== id));
  };

  const handlePresetSelect = (preset: (typeof PERSONA_PRESETS)[0]) => {
    personaForm.reset({
      name: preset.name,
      ageRange: preset.ageRange,
      gender: preset.gender,
      occupation: preset.occupation,
      characteristics: preset.characteristics,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>ペルソナ</FormLabel>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" onClick={openAddPersona}>
              + ペルソナを追加
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPersona ? 'ペルソナを編集' : 'ペルソナを追加'}</DialogTitle>
            </DialogHeader>

            {!editingPersona && (
              <div className="space-y-2">
                <FormLabel className="block">プリセットから選択</FormLabel>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PERSONA_PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetSelect(preset)}
                      className="h-auto justify-start p-3 text-left"
                    >
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-muted-foreground mt-1 text-xs">
                          {preset.ageRange} • {preset.occupation}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
                <Divider>手動で入力</Divider>
              </div>
            )}

            <Form {...personaForm}>
              <form id="persona-form" onSubmit={handleSavePersona} className="space-y-4">
                <FormField
                  control={personaForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>ペルソナ名</FormLabel>
                        <RequiredChip />
                      </div>
                      <FormControl>
                        <Input placeholder="例: プログラミング初心者の田中さん" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={personaForm.control}
                    name="ageRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>年齢層</FormLabel>
                        <FormControl>
                          <Input placeholder="例: 20-30代" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personaForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>性別</FormLabel>
                        <FormControl>
                          <Input placeholder="例: 男性、女性、問わない" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personaForm.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>職業</FormLabel>
                        <FormControl>
                          <Input placeholder="例: エンジニア、学生" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={personaForm.control}
                  name="characteristics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>特徴・属性</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="例: プログラミング経験が浅い、新しい技術に興味がある"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit" form="persona-form">
                {editingPersona ? '更新' : '追加'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {personas.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {personas.map((persona) => (
            <div key={persona.id} className="border-border bg-muted/50 rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold">{persona.name}</h4>
                <div className="flex items-center space-x-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEditPersona(persona)}>
                    編集
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleDeletePersona(persona.id)}>
                    削除
                  </Button>
                </div>
              </div>
              <div className="text-muted-foreground space-y-1 text-sm">
                {persona.ageRange && (
                  <div>
                    <span className="font-medium">年齢:</span> {persona.ageRange}
                  </div>
                )}
                {persona.gender && (
                  <div>
                    <span className="font-medium">性別:</span> {persona.gender}
                  </div>
                )}
                {persona.occupation && (
                  <div>
                    <span className="font-medium">職業:</span> {persona.occupation}
                  </div>
                )}
                {persona.characteristics && (
                  <div>
                    <span className="font-medium">特徴:</span> {persona.characteristics}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ScriptStep() {
  const { formData, updateStepData, goToNextStep, handlePrevious, currentStep, steps, canGoPrevious } =
    useCreateVideoContext();

  const form = useForm<ScriptFormData>({
    resolver: zodResolver(ScriptFormSchema),
    defaultValues: formData.script || {
      title: '',
      duration: 60,
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
        <h3 className="text-xl font-semibold">台本作成</h3>
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

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>動画の長さ（秒）</FormLabel>
                      <RequiredChip />
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="60"
                        min="10"
                        max="1800"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoType"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>動画の種類</FormLabel>
                      <RequiredChip />
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="動画の種類を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tutorial">チュートリアル</SelectItem>
                        <SelectItem value="explanation">解説</SelectItem>
                        <SelectItem value="introduction">紹介</SelectItem>
                        <SelectItem value="review">レビュー</SelectItem>
                        <SelectItem value="presentation">プレゼンテーション</SelectItem>
                        <SelectItem value="story">ストーリー</SelectItem>
                        <SelectItem value="custom">カスタム</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('videoType') === 'custom' && (
                <FormField
                  control={form.control}
                  name="customVideoType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>カスタム動画種類</FormLabel>
                      <FormControl>
                        <Input placeholder="動画の種類を入力してください" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
