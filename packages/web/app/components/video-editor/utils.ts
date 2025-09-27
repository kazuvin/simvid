import type { VideoTrack } from './contexts';
import type { InitialTrack } from './schemas';
import { TextAlign, TextBaseline, VideoLayout, ObjectFit } from './schemas';

/**
 * Helper function to convert InitialTrack to VideoTrack
 * Handles the conversion from the public API format to the internal format
 */
export function convertInitialTrackToVideoTrack(
  initialTrack: InitialTrack,
  index: number,
  effectiveWidth: number,
  effectiveHeight: number
): VideoTrack {
  const baseTrack = {
    id: `initial-${initialTrack.type}-${index}`,
    type: initialTrack.type,
    name: initialTrack.name ?? `${initialTrack.type.charAt(0).toUpperCase() + initialTrack.type.slice(1)} ${index + 1}`,
    startTime: initialTrack.startTime,
    endTime: initialTrack.endTime,
    enabled: initialTrack.enabled ?? true,
    locked: initialTrack.locked ?? false,
  };

  if (initialTrack.type === 'text') {
    return {
      ...baseTrack,
      type: 'text',
      metadata: {
        text: initialTrack.text,
        fontSize: initialTrack.fontSize ?? 32,
        fontFamily: initialTrack.fontFamily ?? 'Arial',
        color: initialTrack.color ?? '#ffffff',
        x: initialTrack.x ?? effectiveWidth / 2,
        y: initialTrack.y ?? effectiveHeight / 2,
        textAlign: initialTrack.textAlign ?? TextAlign.CENTER,
        baseline: initialTrack.baseline ?? TextBaseline.MIDDLE,
      },
    };
  }

  if (initialTrack.type === 'video') {
    return {
      ...baseTrack,
      type: 'video',
      source: initialTrack.source,
      metadata: {
        layout: initialTrack.layout ?? VideoLayout.FULLSCREEN,
        transform: initialTrack.transform ?? (initialTrack.layout === VideoLayout.CUSTOM ? {
          x: 0,
          y: 0,
          width: effectiveWidth,
          height: effectiveHeight,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          opacity: 1,
        } : undefined),
        volume: initialTrack.volume ?? 1,
        muted: initialTrack.muted ?? false,
        playbackRate: initialTrack.playbackRate ?? 1,
        objectFit: initialTrack.objectFit ?? ObjectFit.COVER,
      },
    };
  }

  if (initialTrack.type === 'audio') {
    return {
      ...baseTrack,
      type: 'audio',
      source: initialTrack.source,
      metadata: {
        volume: initialTrack.volume ?? 1,
        muted: initialTrack.muted ?? false,
      },
    };
  }

  throw new Error(`Unknown track type: ${(initialTrack as any).type}`);
}

/**
 * Helper function to resolve effective values from project or fallback props
 * Handles backward compatibility with deprecated props
 */
export function resolveEffectiveValues(
  project?: { output: { width: number; height: number }; duration: number; tracks: InitialTrack[] },
  width?: number,
  height?: number,
  duration?: number,
  initialTracks?: InitialTrack[]
) {
  return {
    effectiveWidth: project?.output.width ?? width ?? 800,
    effectiveHeight: project?.output.height ?? height ?? 450,
    effectiveDuration: project?.duration ?? duration ?? 10,
    effectiveTracks: project?.tracks ?? initialTracks ?? [],
  };
}