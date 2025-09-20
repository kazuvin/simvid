import { z } from 'zod';

// Script Step Schema
export const scriptStepSchema = z.object({
  theme: z.string().min(1, '動画のテーマを入力してください'),
  duration: z.enum(['short', 'medium', 'long']),
  targetAudience: z.string().min(1, 'ターゲット層を入力してください'),
  content: z.string().min(10, '詳細な内容を10文字以上で入力してください'),
});

// Image Step Schema
export const imageStepSchema = z.object({
  style: z.enum(['realistic', 'anime', 'illustration', 'abstract']),
  count: z.number().min(1, '最低1枚は必要です').max(20, '最大20枚まで設定可能です'),
  resolution: z.enum(['720p', '1080p', '4k']),
  additionalInstructions: z.string().optional(),
});

// Audio Step Schema
export const audioStepSchema = z.object({
  voiceType: z.enum(['male', 'female', 'child', 'senior']),
  speed: z.enum(['slow', 'normal', 'fast']),
  tone: z.enum(['calm', 'energetic', 'friendly', 'professional']),
  includeBgm: z.boolean(),
  includeEffects: z.boolean(),
});

// Video Step Schema
export const videoStepSchema = z.object({
  format: z.enum(['mp4', 'mov', 'avi']),
  quality: z.enum(['standard', 'high', 'ultra']),
  frameRate: z.enum(['24', '30', '60']),
});

// Combined form schema for the entire create video flow
export const createVideoSchema = z.object({
  script: scriptStepSchema,
  image: imageStepSchema,
  audio: audioStepSchema,
  video: videoStepSchema,
});

export type ScriptStepData = z.infer<typeof scriptStepSchema>;
export type ImageStepData = z.infer<typeof imageStepSchema>;
export type AudioStepData = z.infer<typeof audioStepSchema>;
export type VideoStepData = z.infer<typeof videoStepSchema>;
export type CreateVideoData = z.infer<typeof createVideoSchema>;