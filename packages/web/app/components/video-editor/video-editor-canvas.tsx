import { useEffect, useRef, useCallback } from 'react';
import { cn } from '~/utils/cn';
import { useVideoEditor } from './contexts';

interface VideoEditorCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  showDebugInfo?: boolean;
}

export function VideoEditorCanvas({
  width = 800,
  height = 450,
  className,
  showDebugInfo = false
}: VideoEditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const videoElementsRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const { state, actions } = useVideoEditor();

  const ensureVideoElement = useCallback((track: any) => {
    const existingElement = videoElementsRef.current.get(track.id);
    if (existingElement) {
      return existingElement;
    }

    if (track.type === 'video' && track.source) {
      const videoElement = document.createElement('video');

      const isExternalUrl = track.source.startsWith('http') &&
                           !track.source.includes(window.location.hostname);

      if (isExternalUrl) {
        videoElement.crossOrigin = 'anonymous';
      }

      videoElement.muted = track.metadata?.muted ?? true;
      videoElement.volume = track.metadata?.volume ?? 1;
      videoElement.playbackRate = track.metadata?.playbackRate ?? 1;
      videoElement.preload = 'auto';
      videoElement.playsInline = true;

      videoElement.style.position = 'absolute';
      videoElement.style.left = '-9999px';
      videoElement.style.top = '-9999px';
      videoElement.style.width = '1px';
      videoElement.style.height = '1px';
      videoElement.style.opacity = '0';
      videoElement.style.pointerEvents = 'none';

      document.body.appendChild(videoElement);

      videoElement.src = track.source;
      videoElement.load();

      videoElementsRef.current.set(track.id, videoElement);
      return videoElement;
    }

    return null;
  }, []);

  useEffect(() => {
    const currentElements = new Set(videoElementsRef.current.keys());
    const currentTrackIds = new Set(state.tracks.filter(t => t.type === 'video').map(t => t.id));

    for (const trackId of currentElements) {
      if (!currentTrackIds.has(trackId)) {
        const element = videoElementsRef.current.get(trackId);
        if (element) {
          element.pause();
          element.src = '';
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
          videoElementsRef.current.delete(trackId);
        }
      }
    }

    state.tracks.forEach(track => {
      if (track.type === 'video') {
        ensureVideoElement(track);
      }
    });
  }, [state.tracks, ensureVideoElement]);

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

  const renderText = useCallback((
    ctx: CanvasRenderingContext2D,
    track: any,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.save();

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

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const text = track.metadata?.text || track.name;
    ctx.fillText(text, x, y);

    ctx.restore();
  }, []);

  const renderVideo = useCallback((
    ctx: CanvasRenderingContext2D,
    track: any,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    let videoElement = videoElementsRef.current.get(track.id) || track.videoElement;

    if (!videoElement && track.type === 'video' && track.source) {
      videoElement = ensureVideoElement(track);
      if (!videoElement) {
        return;
      }
    }

    if (!videoElement) {
      return;
    }

    if (videoElement.readyState < 1) {
      return;
    }

    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      return;
    }

    ctx.save();

    const layout = track.metadata?.layout || 'fullscreen';
    const objectFit = track.metadata?.objectFit || 'cover';

    if (layout === 'fullscreen') {
      const opacity = track.metadata?.transform?.opacity ?? 1;
      ctx.globalAlpha = opacity;

      const videoAspect = videoElement.videoWidth / videoElement.videoHeight;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let drawX = 0;
      let drawY = 0;

      if (objectFit === 'cover') {
        if (videoAspect > canvasAspect) {
          drawWidth = canvasHeight * videoAspect;
          drawX = (canvasWidth - drawWidth) / 2;
        } else {
          drawHeight = canvasWidth / videoAspect;
          drawY = (canvasHeight - drawHeight) / 2;
        }
      } else if (objectFit === 'contain') {
        if (videoAspect > canvasAspect) {
          drawHeight = canvasWidth / videoAspect;
          drawY = (canvasHeight - drawHeight) / 2;
        } else {
          drawWidth = canvasHeight * videoAspect;
          drawX = (canvasWidth - drawWidth) / 2;
        }
      }

      ctx.drawImage(videoElement, drawX, drawY, drawWidth, drawHeight);
    } else if (layout === 'custom' && track.metadata?.transform) {
      const transform = track.metadata.transform;
      const x = transform.x || 0;
      const y = transform.y || 0;
      const width = transform.width || canvasWidth;
      const height = transform.height || canvasHeight;
      const scaleX = transform.scaleX || 1;
      const scaleY = transform.scaleY || 1;
      const rotation = (transform.rotation || 0) * Math.PI / 180;
      const opacity = transform.opacity ?? 1;

      ctx.globalAlpha = opacity;

      const centerX = x + width / 2;
      const centerY = y + height / 2;

      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.scale(scaleX, scaleY);

      ctx.drawImage(videoElement, -width / 2, -height / 2, width, height);
    }

    ctx.restore();
  }, [ensureVideoElement]);

  useEffect(() => {
    videoElementsRef.current.forEach((videoElement, trackId) => {
      const track = state.tracks.find(t => t.id === trackId);
      if (!track) return;

      const trackTime = state.currentTime - track.startTime;
      const isInRange = trackTime >= 0 && trackTime <= (track.endTime - track.startTime);

      if (state.isPlaying && isInRange) {
        videoElement.currentTime = trackTime;
        videoElement.play().catch(() => {
          // Ignore play errors
        });
      } else {
        videoElement.pause();
      }
    });
  }, [state.isPlaying, state.currentTime, state.tracks]);

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      const video = videoRef.current;
      if (video && video.readyState >= 2 && video.src) {
        ctx.drawImage(video, 0, 0, width, height);
      } else {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x <= width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y <= height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      const currentTime = state.currentTime;

      state.tracks.forEach(track => {
        if (!track.enabled || currentTime < track.startTime || currentTime > track.endTime) {
          return;
        }

        switch (track.type) {
          case 'video':
            renderVideo(ctx, track, width, height);
            break;
          case 'text':
            renderText(ctx, track, width, height);
            break;
          case 'audio':
            break;
        }
      });
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
      render();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlaying, state.currentTime, state.tracks, width, height, renderText, renderVideo]);

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-black"
      />

      <video
        ref={videoRef}
        className="hidden"
        crossOrigin="anonymous"
        playsInline
        muted={false}
      />

      {showDebugInfo && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
          <div>Time: {(Math.floor(state.currentTime * 10) / 10).toFixed(1)}s</div>
          <div>Duration: {state.duration.toFixed(1)}s</div>
          <div>Playing: {state.isPlaying ? 'Yes' : 'No'}</div>
          <div>Tracks: {state.tracks.length}</div>
        </div>
      )}
    </div>
  );
}