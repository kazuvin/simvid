# 国際化（i18n）ガイド

このプロジェクトではi18nextを使用して多言語対応を実装しています。

## 概要

- **ライブラリ**: i18next（react-i18nextは使用せず、カスタムフックで実装）
- **対応言語**: 英語（en）、日本語（ja）
- **フォールバック言語**: 英語（en）
- **言語検出**: ブラウザのlocaleに基づいて自動切り替え

## ディレクトリ構造

```
app/locales/
├── index.ts           # 言語リソースのエクスポート
├── en/               # 英語翻訳ファイル
│   ├── index.ts      # 英語リソースのエクスポート
│   └── common.json   # 共通翻訳（ボタン、メッセージなど）
└── ja/               # 日本語翻訳ファイル
    ├── index.ts      # 日本語リソースのエクスポート
    └── common.json   # 共通翻訳（ボタン、メッセージなど）
```

## 翻訳ファイルの管理ルール

### 1. ファイル構造

- **名前空間別にファイルを分割**: 機能や用途別にJSONファイルを作成
  - `common.json`: ボタン、メッセージ、ナビゲーションなど共通要素
  - `auth.json`: 認証関連
  - `dashboard.json`: ダッシュボード関連
  - etc.

### 2. キーの命名規則

- **階層構造を使用**: ドット記法でネストした構造
- **わかりやすい名前**: 機能や用途が分かる名前を使用
- **一貫性**: 同じパターンの翻訳は同じ構造で命名

```json
{
  "buttons": {
    "save": "保存",
    "cancel": "キャンセル",
    "confirm": "確認"
  },
  "messages": {
    "success": "操作が正常に完了しました",
    "error": "エラーが発生しました"
  },
  "forms": {
    "validation": {
      "required": "この項目は必須です",
      "email": "有効なメールアドレスを入力してください"
    }
  }
}
```

### 3. 補間（変数埋め込み）

i18nextの補間機能を使用して動的な値を埋め込み可能：

```json
{
  "welcome": "ようこそ、{{name}}さん！",
  "itemCount": "{{count}}件のアイテムがあります"
}
```

### 4. 複数形対応

countパラメータを使用して複数形対応：

```json
{
  "item": "{{count}}個のアイテム",
  "item_plural": "{{count}}個のアイテム"
}
```

### 5. 必須ルール

1. **すべての言語で同じキー構造を維持**
2. **空の値は禁止**
3. **未使用のキーは削除**
4. **新しいキーを追加する際は全言語に追加**

## 使用方法

### useI18nカスタムフック

```tsx
import { useI18n } from '~/lib/i18n';

function MyComponent() {
  const { t, language, changeLanguage, ready } = useI18n();

  // 基本的な翻訳
  const saveButton = t('buttons.save');

  // 変数埋め込み
  const welcome = t('welcome', { replace: { name: 'John' } });

  // 複数形
  const itemCount = t('itemCount', { count: 5, replace: { count: 5 } });

  // 名前空間を指定（デフォルトは'common'）
  const authTitle = t('title', { ns: 'auth' });

  // 言語切り替え
  const handleLanguageChange = () => {
    changeLanguage(language === 'en' ? 'ja' : 'en');
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{authTitle}</h1>
      <p>{welcome}</p>
      <p>{itemCount}</p>
      <button onClick={handleLanguageChange}>
        {language === 'en' ? '日本語' : 'English'}
      </button>
      <button>{saveButton}</button>
    </div>
  );
}
```

## 品質管理

### ESLintルール

以下のESLintルールが設定されており、翻訳漏れを防ぎます：

- `i18next/no-literal-string`: JSX内の直接的な文字列を検出
- `i18next/no-raw-text`: 翻訳されていないテキストを検出

### 翻訳整合性チェック

`pnpm check-translations`コマンドで以下をチェック：

- 全言語間でキーの一貫性
- 空の翻訳値の検出
- 未使用キーの検出
- 名前空間の整合性

### 無視設定

以下の属性は翻訳チェックから除外されます：

- `className`
- `style`
- `data-testid`
- `id`
- `type`
- `role`
- `aria-label`

## 新しい翻訳の追加手順

1. **キーの設計**: わかりやすく一貫性のある名前を考える
2. **英語版に追加**: `app/locales/en/` の適切なファイルに追加
3. **日本語版に追加**: `app/locales/ja/` の対応するファイルに追加
4. **整合性チェック**: `pnpm check-translations` を実行
5. **ESLintチェック**: `pnpm lint` を実行

## 新しい名前空間の追加

1. **翻訳ファイル作成**: 各言語ディレクトリに同名のJSONファイルを作成
2. **index.tsの更新**: 各言語の`index.ts`にインポートを追加
3. **型定義の確認**: TypeScriptの型定義が自動更新されることを確認

例：
```typescript
// app/locales/en/index.ts
import common from './common.json';
import dashboard from './dashboard.json'; // 新しい名前空間

export default {
  common,
  dashboard, // 追加
} as const;
```

## トラブルシューティング

### よくある問題

1. **翻訳が表示されない**
   - `ready`状態を確認
   - キーの綴りを確認
   - 名前空間の指定を確認

2. **ESLintエラー**
   - 直接的な文字列を`t()`関数に置き換え
   - 無視すべき属性の場合は設定を確認

3. **翻訳整合性エラー**
   - 全言語で同じキー構造になっているか確認
   - 空の値がないか確認

### デバッグ

開発環境では詳細なログが出力されます：

```typescript
// app/lib/i18n.ts
debug: process.env.NODE_ENV === 'development',
```

## ベストプラクティス

1. **早期の計画**: 新機能開発時から翻訳を考慮
2. **一貫性**: 同じ意味の翻訳は同じキーを使用
3. **文脈の考慮**: 同じ英語でも文脈により日本語訳が変わる場合は別キー
4. **レビュー**: 翻訳内容は必ずネイティブスピーカーにレビューしてもらう
5. **テスト**: 各言語での表示確認を忘れずに
