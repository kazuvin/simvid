import { Card, Input, Textarea } from '~/components/ui';

export function ScriptStep() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">台本作成</h3>
        <p className="text-muted-foreground">動画の台本やシナリオを作成しましょう</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">動画のテーマ</label>
            <Input type="text" placeholder="例: プログラミング入門" />
          </div>

          <div>
            <label className="text-sm font-medium">動画の長さ</label>
            <select className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="short">短編 (1-3分)</option>
              <option value="medium">中編 (3-10分)</option>
              <option value="long">長編 (10分以上)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">ターゲット層</label>
            <Input type="text" placeholder="例: プログラミング初心者" />
          </div>

          <div>
            <label className="text-sm font-medium">詳細な内容</label>
            <Textarea placeholder="動画で伝えたい内容を詳しく記載してください" rows={6} />
          </div>
        </div>
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
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">画像スタイル</label>
            <select className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="realistic">リアリスティック</option>
              <option value="anime">アニメ風</option>
              <option value="illustration">イラスト</option>
              <option value="abstract">抽象的</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">画像の枚数</label>
            <input
              type="number"
              min="1"
              max="20"
              defaultValue="5"
              className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">解像度</label>
            <select className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="720p">HD (1280x720)</option>
              <option value="1080p">Full HD (1920x1080)</option>
              <option value="4k">4K (3840x2160)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">追加の指示</label>
            <textarea
              placeholder="画像生成に関する特別な要望があれば記載してください"
              rows={4}
              className="border-input bg-background mt-1 w-full resize-none rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>
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
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">ナレーション声質</label>
            <select className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="male">男性の声</option>
              <option value="female">女性の声</option>
              <option value="child">子供の声</option>
              <option value="senior">シニアの声</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">話すスピード</label>
            <select className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="slow">ゆっくり</option>
              <option value="normal">普通</option>
              <option value="fast">早め</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">音声の調子</label>
            <select className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="calm">落ち着いた</option>
              <option value="energetic">エネルギッシュ</option>
              <option value="friendly">フレンドリー</option>
              <option value="professional">プロフェッショナル</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="bgm" className="rounded" />
            <label htmlFor="bgm" className="text-sm font-medium">
              BGMを追加する
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="effects" className="rounded" />
            <label htmlFor="effects" className="text-sm font-medium">
              効果音を追加する
            </label>
          </div>
        </div>
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
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">出力形式</label>
            <select className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="mp4">MP4</option>
              <option value="mov">MOV</option>
              <option value="avi">AVI</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">画質設定</label>
            <select className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="standard">標準画質</option>
              <option value="high">高画質</option>
              <option value="ultra">最高画質</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">フレームレート</label>
            <select className="border-input bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="24">24 FPS</option>
              <option value="30">30 FPS</option>
              <option value="60">60 FPS</option>
            </select>
          </div>

          <div className="border-border border-t pt-4">
            <h4 className="mb-3 text-sm font-medium">生成設定の確認</h4>
            <div className="text-muted-foreground space-y-2 text-sm">
              <p>• 台本: 作成済み</p>
              <p>• 画像: 生成済み</p>
              <p>• 音声: 生成済み</p>
            </div>
          </div>

          <div className="pt-4">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 text-sm font-medium">
              動画を生成する
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
