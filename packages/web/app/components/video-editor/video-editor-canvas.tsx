import { useEffect, useRef, useCallback } from 'react';
import { cn } from '~/utils/cn';
import { useVideoEditor } from './contexts';

interface VideoEditorCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export function VideoEditorCanvas({
  width = 800,
  height = 450,
  className
}: VideoEditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number>();
  const { state, actions } = useVideoEditor();

  // Canvas と Video 要素の初期化（一度だけ実行）
  const initRef = useRef(false);
  useEffect(() => {
    if (!initRef.current) {
      if (canvasRef.current) {
        actions.setCanvas(canvasRef.current);
      }
      if (videoRef.current) {
        actions.setVideoElement(videoRef.current);
      }
      initRef.current = true;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [actions]);

  // テキストの描画
  const renderText = useCallback((
    ctx: CanvasRenderingContext2D,
    track: any,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.save();

    // テキストの設定（トラックのメタデータから取得、なければデフォルト）
    const fontSize = track.metadata?.fontSize || 32;
    const fontFamily = track.metadata?.fontFamily || 'Arial';
    const color = track.metadata?.color || '#ffffff';
    const x = track.metadata?.x || canvasWidth / 2;
    const y = track.metadata?.y || canvasHeight / 2;
    const textAlign = track.metadata?.textAlign || 'center';
    const baseline = track.metadata?.baseline || 'middle';

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign as CanvasTextAlign;
    ctx.textBaseline = baseline as CanvasTextBaseline;

    // テキストに影を追加
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // テキストを描画
    const text = track.metadata?.text || track.name;
    ctx.fillText(text, x, y);

    ctx.restore();
  }, []);

  // アニメーションフレームの管理と描画
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Canvas をクリア
      ctx.clearRect(0, 0, width, height);

      // 動画が再生可能な状態の場合、描画
      if (video.readyState >= 2) {
        // 動画を描画
        ctx.drawImage(video, 0, 0, width, height);

        // 現在時刻に基づいてトラックを描画
        const currentTime = state.currentTime;

        state.tracks.forEach(track => {
          if (!track.enabled || currentTime < track.startTime || currentTime > track.endTime) {
            return;
          }

          switch (track.type) {
            case 'text':
              renderText(ctx, track, width, height);
              break;
            case 'video':
              // 追加の動画レイヤー（将来の実装用）
              break;
            case 'audio':
              // オーディオは Canvas に描画しない
              break;
          }
        });
      }
    };

    const animate = () => {
      render();
      if (state.isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (state.isPlaying) {
      animate();
    } else {
      // 停止時も一度描画して最新の状態を反映
      render();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlaying, state.currentTime, state.tracks, width, height, renderText]);

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-black"
      />

      {/* 非表示の video 要素（描画ソースとして使用） */}
      <video
        ref={videoRef}
        className="hidden"
        crossOrigin="anonymous"
        playsInline
        muted={false}
      />

      {/* デバッグ情報 */}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
        <div>Time: {state.currentTime.toFixed(2)}s</div>
        <div>Duration: {state.duration.toFixed(2)}s</div>
        <div>Playing: {state.isPlaying ? 'Yes' : 'No'}</div>
        <div>Tracks: {state.tracks.length}</div>
      </div>
    </div>
  );
}