import { Input } from '~/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { RequiredChip } from '~/components/shared';
import type { Control } from 'react-hook-form';
import type { ScriptFormData } from '../schemas';

interface VideoTypeSelectProps {
  control: Control<ScriptFormData>;
  watchVideoType: string;
}

export function VideoTypeSelect({ control, watchVideoType }: VideoTypeSelectProps) {
  return (
    <>
      <FormField
        control={control}
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

      {watchVideoType === 'custom' && (
        <FormField
          control={control}
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
    </>
  );
}