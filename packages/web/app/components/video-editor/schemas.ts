import { z } from 'zod';

export const AspectRatioSchema = z.enum(['16:9', '9:16']);

export const RenderConfigSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  aspectRatio: AspectRatioSchema,
  fps: z.number().positive().int(),
  quality: z.enum(['low', 'medium', 'high', 'ultra']),
  // Common rendering settings
  fontSmoothing: z.boolean(),
  imageInterpolation: z.enum(['nearest', 'linear', 'cubic']),
  outputFormat: z.enum(['mp4', 'webm', 'mov']),
});

export const PlaybackStateSchema = z.object({
  isPlaying: z.boolean(),
  currentTime: z.number().min(0), // in seconds
  duration: z.number().min(0), // in seconds
  volume: z.number().min(0).max(1), // 0-1
  speed: z.number().positive(), // playback speed multiplier
  loop: z.boolean(),
});

export const TransformSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  rotation: z.number(), // in degrees
  scaleX: z.number(),
  scaleY: z.number(),
});

export const BaseLayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['video', 'image', 'text', 'audio']),
  startTime: z.number().min(0), // in seconds
  duration: z.number().positive(), // in seconds
  visible: z.boolean(),
  locked: z.boolean(),
  opacity: z.number().min(0).max(1), // 0-1
  zIndex: z.number().int(),
});

export const VideoLayerSchema = BaseLayerSchema.extend({
  type: z.literal('video'),
  src: z.string(),
  volume: z.number().min(0).max(1), // 0-1
  playbackRate: z.number().positive(),
  transform: TransformSchema,
  // Video-specific effects
  brightness: z.number().min(-100).max(100),
  contrast: z.number().min(-100).max(100),
  saturation: z.number().min(-100).max(100),
  blur: z.number().min(0).max(100),
});

export const ImageLayerSchema = BaseLayerSchema.extend({
  type: z.literal('image'),
  src: z.string(),
  transform: TransformSchema,
  // Image-specific effects
  brightness: z.number().min(-100).max(100),
  contrast: z.number().min(-100).max(100),
  saturation: z.number().min(-100).max(100),
  blur: z.number().min(0).max(100),
});

export const TextShadowSchema = z.object({
  enabled: z.boolean(),
  color: z.string(),
  offsetX: z.number(),
  offsetY: z.number(),
  blur: z.number().min(0),
});

export const TextStrokeSchema = z.object({
  enabled: z.boolean(),
  color: z.string(),
  width: z.number().min(0),
});

export const TextLayerSchema = BaseLayerSchema.extend({
  type: z.literal('text'),
  content: z.string(),
  transform: TransformSchema,
  // Text styling
  fontFamily: z.string(),
  fontSize: z.number().positive(),
  fontWeight: z.enum(['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']),
  fontStyle: z.enum(['normal', 'italic']),
  color: z.string(),
  backgroundColor: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']),
  lineHeight: z.number().positive(),
  letterSpacing: z.number(),
  // Text effects
  shadow: TextShadowSchema,
  stroke: TextStrokeSchema,
});

export const AudioReverbSchema = z.object({
  enabled: z.boolean(),
  roomSize: z.number().min(0).max(1), // 0-1
  damping: z.number().min(0).max(1), // 0-1
});

export const AudioEchoSchema = z.object({
  enabled: z.boolean(),
  delay: z.number().min(0), // in seconds
  feedback: z.number().min(0).max(1), // 0-1
});

export const AudioEqualizerSchema = z.object({
  enabled: z.boolean(),
  bass: z.number().min(-20).max(20), // -20 to 20 dB
  mid: z.number().min(-20).max(20), // -20 to 20 dB
  treble: z.number().min(-20).max(20), // -20 to 20 dB
});

export const AudioEffectsSchema = z.object({
  reverb: AudioReverbSchema.optional(),
  echo: AudioEchoSchema.optional(),
  equalizer: AudioEqualizerSchema.optional(),
});

export const AudioLayerSchema = BaseLayerSchema.extend({
  type: z.literal('audio'),
  src: z.string(),
  volume: z.number().min(0).max(1), // 0-1
  fadeIn: z.number().min(0), // duration in seconds
  fadeOut: z.number().min(0), // duration in seconds
  // Audio effects
  effects: AudioEffectsSchema,
});

export const LayerSchema = z.discriminatedUnion('type', [
  VideoLayerSchema,
  ImageLayerSchema,
  TextLayerSchema,
  AudioLayerSchema,
]);

export const TimelineSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.number().positive(), // in seconds
  layers: z.array(LayerSchema),
  renderConfig: RenderConfigSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AspectRatio = z.infer<typeof AspectRatioSchema>;
export type RenderConfig = z.infer<typeof RenderConfigSchema>;
export type PlaybackState = z.infer<typeof PlaybackStateSchema>;
export type Transform = z.infer<typeof TransformSchema>;
export type BaseLayer = z.infer<typeof BaseLayerSchema>;
export type VideoLayer = z.infer<typeof VideoLayerSchema>;
export type ImageLayer = z.infer<typeof ImageLayerSchema>;
export type TextLayer = z.infer<typeof TextLayerSchema>;
export type AudioLayer = z.infer<typeof AudioLayerSchema>;
export type Layer = z.infer<typeof LayerSchema>;
export type Timeline = z.infer<typeof TimelineSchema>;
