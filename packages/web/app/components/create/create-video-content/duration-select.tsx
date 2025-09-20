import { Input } from '~/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { RequiredChip } from '~/components/shared';
import { getDurationLabel } from './constants';
import type { Control, FieldPath } from 'react-hook-form';
import type { ScriptFormData } from '../schemas';

interface DurationSelectProps {
  control: Control<ScriptFormData>;
  watchDuration: string;
}

export function DurationSelect({ control, watchDuration }: DurationSelectProps) {
  return (
    <>
      <FormField
        control={control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>動画の長さ</FormLabel>
              <RequiredChip />
            </div>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="動画の長さを選択">
                    {field.value ? getDurationLabel(field.value) : '動画の長さを選択'}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="sns_short">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">SNS投稿用 (15-60秒)</span>
                    <span className="text-muted-foreground text-xs">
                      TikTok、Instagram Reels、YouTube Shorts
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="product_intro">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">商品・サービス紹介 (1-3分)</span>
                    <span className="text-muted-foreground text-xs">商品説明、会社概要、サービス紹介</span>
                  </div>
                </SelectItem>
                <SelectItem value="tutorial">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">チュートリアル・ハウツー (3-8分)</span>
                    <span className="text-muted-foreground text-xs">操作方法、手順説明、レシピ</span>
                  </div>
                </SelectItem>
                <SelectItem value="detailed_explanation">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">詳細解説・講義 (8-15分)</span>
                    <span className="text-muted-foreground text-xs">教育コンテンツ、深い解説</span>
                  </div>
                </SelectItem>
                <SelectItem value="long_content">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">長編コンテンツ (15分以上)</span>
                    <span className="text-muted-foreground text-xs">
                      ウェビナー、インタビュー、ドキュメンタリー
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="custom">カスタム</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {watchDuration === 'custom' && (
        <FormField
          control={control}
          name="customDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カスタム長さ（秒）</FormLabel>
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
      )}
    </>
  );
}