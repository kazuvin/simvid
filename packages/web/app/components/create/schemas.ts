import { z } from 'zod';

// 動画の種類の選択肢
const VIDEO_TYPES = [
  'tutorial', // チュートリアル
  'explanation', // 解説
  'introduction', // 紹介
  'review', // レビュー
  'presentation', // プレゼンテーション
  'story', // ストーリー
  'custom', // カスタム
] as const;

// 動画の長さの選択肢
const DURATIONS = [
  'sns_short', // SNS投稿用 (15-60秒)
  'product_intro', // 商品・サービス紹介 (1-3分)
  'tutorial', // チュートリアル・ハウツー (3-8分)
  'detailed_explanation', // 詳細解説・講義 (8-15分)
  'long_content', // 長編コンテンツ (15分以上)
  'custom', // カスタム
] as const;

// メインのスキーマ
export const ScriptFormSchema = z
  .object({
    // 動画のタイトル（必須）
    title: z
      .string()
      .min(1, 'タイトルを入力してください')
      .min(5, 'タイトルは5文字以上で入力してください')
      .max(200, 'タイトルは200文字以内で入力してください')
      .trim(),

    // 長さ（必須）
    duration: z.enum(DURATIONS),

    // カスタム長さ（durationがcustomの場合のみ）
    customDuration: z
      .number()
      .int('整数で入力してください')
      .min(10, '10秒以上で設定してください')
      .max(1800, '30分以内で設定してください')
      .optional(),

    // 動画の種類（必須）
    videoType: z.enum(VIDEO_TYPES),

    // カスタム動画種類（videoTypeがcustomの場合のみ）
    customVideoType: z
      .string()
      .min(1, 'カスタム動画種類を入力してください')
      .max(50, '50文字以内で入力してください')
      .trim()
      .optional(),

    // ターゲット像の詳細（複数設定可能）
    targetPersonas: z
      .array(
        z.object({
          // ID（フロントエンド用）
          id: z.string(),

          // ペルソナ名
          name: z
            .string()
            .min(1, 'ペルソナ名を入力してください')
            .max(100, 'ペルソナ名は100文字以内で入力してください')
            .trim(),

          // 年齢層
          ageRange: z.string().max(50, '年齢層は50文字以内で入力してください').optional(),

          // 性別
          gender: z.string().max(20, '性別は20文字以内で入力してください').optional(),

          // 職業
          occupation: z.string().max(100, '職業は100文字以内で入力してください').optional(),

          // 特徴・属性
          characteristics: z.string().max(300, '特徴は300文字以内で入力してください').optional(),
        }),
      )
      .optional(),

    // 自由入力欄（任意）
    freeInput: z
      .string()
      .max(500, '自由入力は500文字以内で入力してください')
      .optional()
      .transform((val) => val?.trim() || undefined),
  })
  .refine(
    // durationがcustomの場合はcustomDurationが必須
    (data) => {
      if (data.duration === 'custom') {
        return data.customDuration !== undefined;
      }
      return true;
    },
    {
      message: 'カスタム長さを指定してください',
      path: ['customDuration'],
    },
  )
  .refine(
    // videoTypeがcustomの場合はcustomVideoTypeが必須
    (data) => {
      if (data.videoType === 'custom') {
        return data.customVideoType !== undefined;
      }
      return true;
    },
    {
      message: 'カスタム動画種類を入力してください',
      path: ['customVideoType'],
    },
  );

// 型定義をエクスポート
export type ScriptFormData = z.infer<typeof ScriptFormSchema>;

// ペルソナフォーム用のスキーマ
export const PersonaFormSchema = z.object({
  // ペルソナ名
  name: z.string().min(1, 'ペルソナ名を入力してください').max(100, 'ペルソナ名は100文字以内で入力してください').trim(),

  // 年齢層
  ageRange: z.string().max(50, '年齢層は50文字以内で入力してください').optional(),

  // 性別
  gender: z.string().max(20, '性別は20文字以内で入力してください').optional(),

  // 職業
  occupation: z.string().max(100, '職業は100文字以内で入力してください').optional(),

  // 特徴・属性
  characteristics: z.string().max(300, '特徴は300文字以内で入力してください').optional(),
});

// ペルソナフォームの型定義
export type PersonaFormData = z.infer<typeof PersonaFormSchema>;

// 配列をエクスポート
export { VIDEO_TYPES, DURATIONS };
