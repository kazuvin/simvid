import { z } from 'zod';

// Const assertions (recommended by zod)
export const TextAlign = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const;

export const TextBaseline = {
  TOP: 'top',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',
} as const;

export const VideoLayout = {
  FULLSCREEN: 'fullscreen',
  CUSTOM: 'custom',
} as const;

export const ObjectFit = {
  FILL: 'fill',
  CONTAIN: 'contain',
  COVER: 'cover',
  NONE: 'none',
  SCALE_DOWN: 'scale-down',
} as const;

export const VideoFormat = {
  MP4: 'mp4',
  WEBM: 'webm',
  GIF: 'gif',
} as const;

export const Quality = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Transform settings schema
export const transformSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  scaleX: z.number().optional(),
  scaleY: z.number().optional(),
  rotation: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
});

// Text track schema
export const initialTextTrackSchema = z.object({
  type: z.literal('text'),
  name: z.string().optional(),
  startTime: z.number().min(0),
  endTime: z.number().min(0),
  enabled: z.boolean().optional(),
  locked: z.boolean().optional(),
  text: z.string(),
  fontSize: z.number().positive().optional(),
  color: z.string().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  fontFamily: z.string().optional(),
  textAlign: z.enum(TextAlign).optional(),
  baseline: z.enum(TextBaseline).optional(),
});

// Video track schema
export const initialVideoTrackSchema = z.object({
  type: z.literal('video'),
  name: z.string().optional(),
  startTime: z.number().min(0),
  endTime: z.number().min(0),
  enabled: z.boolean().optional(),
  locked: z.boolean().optional(),
  source: z.url(),
  layout: z.enum(VideoLayout).optional(),
  transform: transformSchema.optional(),
  volume: z.number().min(0).max(1).optional(),
  muted: z.boolean().optional(),
  playbackRate: z.number().positive().optional(),
  objectFit: z.enum(ObjectFit).optional(),
});

// Audio track schema
export const initialAudioTrackSchema = z.object({
  type: z.literal('audio'),
  name: z.string().optional(),
  startTime: z.number().min(0),
  endTime: z.number().min(0),
  enabled: z.boolean().optional(),
  locked: z.boolean().optional(),
  source: z.url(),
  volume: z.number().min(0).max(1).optional(),
  muted: z.boolean().optional(),
});

// Union of all track types
export const initialTrackSchema = z.discriminatedUnion('type', [
  initialTextTrackSchema,
  initialVideoTrackSchema,
  initialAudioTrackSchema,
]);

// Output settings schema
export const outputSettingsSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  frameRate: z.number().positive().optional(),
  format: z.enum(VideoFormat).optional(),
});

// Project settings schema
export const projectSettingsSchema = z
  .object({
    backgroundColor: z.string().optional(),
    audioSampleRate: z.number().positive().optional(),
    quality: z.enum(Quality).optional(),
  })
  .optional();

// Video project schema
export const videoProjectSchema = z.object({
  name: z.string().optional(),
  duration: z.number().positive(),
  output: outputSettingsSchema,
  tracks: z.array(initialTrackSchema),
  settings: projectSettingsSchema,
});

// Type exports
export type Transform = z.infer<typeof transformSchema>;
export type InitialTextTrack = z.infer<typeof initialTextTrackSchema>;
export type InitialVideoTrack = z.infer<typeof initialVideoTrackSchema>;
export type InitialAudioTrack = z.infer<typeof initialAudioTrackSchema>;
export type InitialTrack = z.infer<typeof initialTrackSchema>;
export type OutputSettings = z.infer<typeof outputSettingsSchema>;
export type ProjectSettings = z.infer<typeof projectSettingsSchema>;
export type VideoProject = z.infer<typeof videoProjectSchema>;
