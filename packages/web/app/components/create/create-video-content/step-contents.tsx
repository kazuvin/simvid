import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Textarea, Checkbox } from '~/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { scriptStepSchema, imageStepSchema, audioStepSchema, videoStepSchema, type ScriptStepData, type ImageStepData, type AudioStepData, type VideoStepData } from '../schemas';

export function ScriptStep() {
  const form = useForm<ScriptStepData>({
    resolver: zodResolver(scriptStepSchema),
    defaultValues: {
      theme: '',
      duration: 'short',
      targetAudience: '',
      content: '',
    },
  });

  const onSubmit = (data: ScriptStepData) => {
    console.log('Script step data:', data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">台本作成</h3>
        <p className="text-muted-foreground">動画の台本やシナリオを作成しましょう</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          </form>
        </Form>
      </Card>
    </div>
  );
}

export function ImageStep() {
  const form = useForm<ImageStepData>({
    resolver: zodResolver(imageStepSchema),
    defaultValues: {
      style: 'realistic',
      count: 5,
      resolution: '1080p',
      additionalInstructions: '',
    },
  });

  const onSubmit = (data: ImageStepData) => {
    console.log('Image step data:', data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">画像生成</h3>
        <p className="text-muted-foreground">台本に基づいて動画に使用する画像を生成します</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>画像スタイル</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="画像スタイルを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="realistic">リアリスティック</SelectItem>
                      <SelectItem value="anime">アニメ風</SelectItem>
                      <SelectItem value="illustration">イラスト</SelectItem>
                      <SelectItem value="abstract">抽象的</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>画像の枚数</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>解像度</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="解像度を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="720p">HD (1280x720)</SelectItem>
                      <SelectItem value="1080p">Full HD (1920x1080)</SelectItem>
                      <SelectItem value="4k">4K (3840x2160)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>追加の指示</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="画像生成に関する特別な要望があれば記載してください"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Card>
    </div>
  );
}

export function AudioStep() {
  const form = useForm<AudioStepData>({
    resolver: zodResolver(audioStepSchema),
    defaultValues: {
      voiceType: 'female',
      speed: 'normal',
      tone: 'friendly',
      includeBgm: false,
      includeEffects: false,
    },
  });

  const onSubmit = (data: AudioStepData) => {
    console.log('Audio step data:', data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">音声生成</h3>
        <p className="text-muted-foreground">ナレーションや効果音を生成します</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="voiceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ナレーション声質</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="声質を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">男性の声</SelectItem>
                      <SelectItem value="female">女性の声</SelectItem>
                      <SelectItem value="child">子供の声</SelectItem>
                      <SelectItem value="senior">シニアの声</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="speed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>話すスピード</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="スピードを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="slow">ゆっくり</SelectItem>
                      <SelectItem value="normal">普通</SelectItem>
                      <SelectItem value="fast">早め</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>音声の調子</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="調子を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="calm">落ち着いた</SelectItem>
                      <SelectItem value="energetic">エネルギッシュ</SelectItem>
                      <SelectItem value="friendly">フレンドリー</SelectItem>
                      <SelectItem value="professional">プロフェッショナル</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeBgm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>BGMを追加する</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeEffects"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>効果音を追加する</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Card>
    </div>
  );
}

export function VideoStep() {
  const form = useForm<VideoStepData>({
    resolver: zodResolver(videoStepSchema),
    defaultValues: {
      format: 'mp4',
      quality: 'high',
      frameRate: '30',
    },
  });

  const onSubmit = (data: VideoStepData) => {
    console.log('Video step data:', data);
    console.log('動画を生成中...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">動画生成</h3>
        <p className="text-muted-foreground">最終的な動画を生成・出力します</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>出力形式</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="出力形式を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mp4">MP4</SelectItem>
                      <SelectItem value="mov">MOV</SelectItem>
                      <SelectItem value="avi">AVI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>画質設定</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="画質を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">標準画質</SelectItem>
                      <SelectItem value="high">高画質</SelectItem>
                      <SelectItem value="ultra">最高画質</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frameRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>フレームレート</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="フレームレートを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="24">24 FPS</SelectItem>
                      <SelectItem value="30">30 FPS</SelectItem>
                      <SelectItem value="60">60 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-border border-t pt-4">
              <h4 className="mb-3 text-sm font-medium">生成設定の確認</h4>
              <div className="text-muted-foreground space-y-2 text-sm">
                <p>• 台本: 作成済み</p>
                <p>• 画像: 生成済み</p>
                <p>• 音声: 生成済み</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 text-sm font-medium"
              >
                動画を生成する
              </button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
