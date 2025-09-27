import { useEffect } from 'react';
import { VideoEditorProvider } from './contexts/provider';
import { VideoEditorCanvas } from './video-editor-canvas';
import { VideoEditorControl } from './video-editor-control';
import { useVideoEditor, type VideoTrack } from './contexts';
import { cn } from '~/utils/cn';

export interface InitialTextTrack {
  type: 'text';
  name?: string;
  startTime: number;
  endTime: number;
  enabled?: boolean;
  locked?: boolean;
  text: string;
  fontSize?: number;
  color?: string;
  x?: number;
  y?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  baseline?: 'top' | 'middle' | 'bottom';
}

export interface InitialVideoTrack {
  type: 'video';
  name?: string;
  startTime: number;
  endTime: number;
  enabled?: boolean;
  locked?: boolean;
  source: string;

  // レイアウト設定（簡単な配置用）
  layout?: 'fullscreen' | 'custom';

  // 詳細座標設定（custom時に使用）
  transform?: {
    x: number;      // 左上のX座標
    y: number;      // 左上のY座標
    width: number;  // 幅
    height: number; // 高さ
    scaleX?: number; // X軸スケール (1.0 = 100%)
    scaleY?: number; // Y軸スケール (1.0 = 100%)
    rotation?: number; // 回転角度（度）
    opacity?: number; // 透明度 (0-1)
  };

  // ビデオ固有設定
  volume?: number;
  muted?: boolean;
  playbackRate?: number;

  // フィット設定
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
}

export interface InitialAudioTrack {
  type: 'audio';
  name?: string;
  startTime: number;
  endTime: number;
  enabled?: boolean;
  locked?: boolean;
  source: string;
  volume?: number;
  muted?: boolean;
}

export type InitialTrack = InitialTextTrack | InitialVideoTrack | InitialAudioTrack;

export interface VideoProject {
  // プロジェクト基本情報
  name?: string;
  duration: number;

  // 出力設定
  output: {
    width: number;
    height: number;
    frameRate?: number;
    format?: 'mp4' | 'webm' | 'gif';
  };

  // メディアトラック
  tracks: InitialTrack[];

  // プロジェクト設定（動画に影響するもののみ）
  settings?: {
    backgroundColor?: string;
    audioSampleRate?: number;
    quality?: 'low' | 'medium' | 'high';
  };
}

interface VideoEditorProps {
  // UI関連（動画に関係しない）
  className?: string;
  showControls?: boolean;
  showDebugInfo?: boolean;

  // プロジェクト情報（動画に関係する）
  project: VideoProject;

  // プロジェクト変更時のコールバック
  onProjectChange?: (project: VideoProject) => void;

  // 後方互換性のため（廃止予定）
  /** @deprecated Use project.output.width instead */
  width?: number;
  /** @deprecated Use project.output.height instead */
  height?: number;
  /** @deprecated Use project.duration instead */
  duration?: number;
  /** @deprecated Use project.tracks instead */
  initialTracks?: InitialTrack[];
}

function VideoEditorContent({
  className,
  showControls = true,
  showDebugInfo = false,
  project,
  onProjectChange,
  // 後方互換性
  width,
  height,
  duration,
  initialTracks
}: VideoEditorProps) {
  const { actions } = useVideoEditor();

  // プロジェクトまたは後方互換性のpropsから値を取得
  const effectiveWidth = project?.output.width ?? width ?? 800;
  const effectiveHeight = project?.output.height ?? height ?? 450;
  const effectiveDuration = project?.duration ?? duration ?? 10;
  const effectiveTracks = project?.tracks ?? initialTracks ?? [];

  useEffect(() => {
    // Set duration
    actions.setDuration(effectiveDuration);

    // Add tracks from project
    effectiveTracks.forEach((initialTrack, index) => {
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
        const textTrack: VideoTrack = {
          ...baseTrack,
          type: 'text',
          metadata: {
            text: initialTrack.text,
            fontSize: initialTrack.fontSize ?? 32,
            fontFamily: initialTrack.fontFamily ?? 'Arial',
            color: initialTrack.color ?? '#ffffff',
            x: initialTrack.x ?? effectiveWidth / 2,
            y: initialTrack.y ?? effectiveHeight / 2,
            textAlign: initialTrack.textAlign ?? 'center',
            baseline: initialTrack.baseline ?? 'middle',
          },
        };
        actions.addTrack(textTrack);
      } else if (initialTrack.type === 'video') {
        const videoTrack: VideoTrack = {
          ...baseTrack,
          type: 'video',
          source: initialTrack.source,
          metadata: {
            layout: initialTrack.layout ?? 'fullscreen',
            transform: initialTrack.transform ?? (initialTrack.layout === 'custom' ? {
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
            objectFit: initialTrack.objectFit ?? 'cover',
          },
        };
        actions.addTrack(videoTrack);
      } else if (initialTrack.type === 'audio') {
        const audioTrack: VideoTrack = {
          ...baseTrack,
          type: 'audio',
          source: initialTrack.source,
          metadata: {
            volume: initialTrack.volume ?? 1,
            muted: initialTrack.muted ?? false,
          },
        };
        actions.addTrack(audioTrack);
      }
    });
  }, [actions, effectiveDuration, effectiveTracks, effectiveWidth, effectiveHeight]);

  return (
    <div
      className={cn("video-editor flex flex-col bg-background border border-border rounded-lg overflow-hidden", className)}
      style={project?.settings?.backgroundColor ? { backgroundColor: project.settings.backgroundColor } : undefined}
    >
      <VideoEditorCanvas
        width={effectiveWidth}
        height={effectiveHeight}
        showDebugInfo={showDebugInfo}
      />
      {showControls && (
        <VideoEditorControl />
      )}
    </div>
  );
}

export function VideoEditor(props: VideoEditorProps) {
  return (
    <VideoEditorProvider>
      <VideoEditorContent {...props} />
    </VideoEditorProvider>
  );
}