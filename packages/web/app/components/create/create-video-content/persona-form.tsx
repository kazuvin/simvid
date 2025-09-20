import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { Input, Textarea, Button, Divider } from '~/components/ui';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { DialogFooter } from '~/components/ui/dialog';
import { RequiredChip } from '~/components/shared';
import { PersonaFormSchema, type PersonaFormData, type ScriptFormData } from '../schemas';
import { PERSONA_PRESETS } from './constants';

interface PersonaFormProps {
  editingPersona: NonNullable<ScriptFormData['targetPersonas']>[0] | null;
  onSave: (data: PersonaFormData) => void;
  onCancel: () => void;
}

export function PersonaForm({ editingPersona, onSave, onCancel }: PersonaFormProps) {
  const form = useForm<PersonaFormData>({
    resolver: zodResolver(PersonaFormSchema),
    defaultValues: {
      name: editingPersona?.name || '',
      ageRange: editingPersona?.ageRange || '',
      gender: editingPersona?.gender || '',
      occupation: editingPersona?.occupation || '',
      characteristics: editingPersona?.characteristics || '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    form.handleSubmit((data: PersonaFormData) => {
      onSave(data);
    })(e);
  };

  const handlePresetSelect = (preset: (typeof PERSONA_PRESETS)[0]) => {
    form.reset({
      name: preset.name,
      ageRange: preset.ageRange,
      gender: preset.gender,
      occupation: preset.occupation,
      characteristics: preset.characteristics,
    });
  };

  return (
    <>
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

      <Form {...form}>
        <form id="persona-form" onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
            control={form.control}
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
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button
          type="button"
          onClick={() => {
            const formElement = document.getElementById('persona-form') as HTMLFormElement;
            if (formElement) {
              formElement.requestSubmit();
            }
          }}
        >
          {editingPersona ? '更新' : '追加'}
        </Button>
      </DialogFooter>
    </>
  );
}