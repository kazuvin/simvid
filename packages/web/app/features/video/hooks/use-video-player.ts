import { useState, useRef, useEffect, useCallback } from 'react';
import type { MediaItem, Subtitle, PlaybackState, VideoProject } from '../types';

export function useVideoPlayer(project: VideoProject) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const mediaElementsRef = useRef<Map<string, HTMLImageElement | HTMLVideoElement>>(new Map());
  
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentMediaIndex: 0,
    speed: 1,
  });

  // Update duration when mediaItems change
  useEffect(() => {
    const totalDuration = project.mediaItems.reduce((total, item) => total + item.duration, 0);
    setPlaybackState(prev => ({
      ...prev,
      duration: totalDuration,
    }));
  }, [project.mediaItems]);

  const getCurrentMediaItem = useCallback(() => {
    let accumulatedTime = 0;
    for (let i = 0; i < project.mediaItems.length; i++) {
      const item = project.mediaItems[i];
      if (playbackState.currentTime >= accumulatedTime && 
          playbackState.currentTime < accumulatedTime + item.duration) {
        return { item, index: i, localTime: playbackState.currentTime - accumulatedTime };
      }
      accumulatedTime += item.duration;
    }
    return null;
  }, [project.mediaItems, playbackState.currentTime]);

  const getCurrentSubtitles = useCallback(() => {
    return project.subtitles.filter(subtitle => 
      playbackState.currentTime >= subtitle.startTime && 
      playbackState.currentTime <= subtitle.endTime
    );
  }, [project.subtitles, playbackState.currentTime]);

  const loadMediaElement = useCallback((item: MediaItem): Promise<HTMLImageElement | HTMLVideoElement> => {
    return new Promise((resolve, reject) => {
      let element = mediaElementsRef.current.get(item.id);
      
      if (element) {
        resolve(element);
        return;
      }

      if (item.type === 'image') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          mediaElementsRef.current.set(item.id, img);
          resolve(img);
        };
        img.onerror = reject;
        img.src = item.src;
      } else if (item.type === 'video') {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.onloadeddata = () => {
          mediaElementsRef.current.set(item.id, video);
          resolve(video);
        };
        video.onerror = reject;
        video.src = item.src;
      }
    });
  }, []);

  const drawFrameWithState = useCallback(async (state: PlaybackState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = project.settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate current media item based on current time
    let currentMedia = null;
    let accumulatedTime = 0;
    for (let i = 0; i < project.mediaItems.length; i++) {
      const item = project.mediaItems[i];
      if (state.currentTime >= accumulatedTime && 
          state.currentTime < accumulatedTime + item.duration) {
        currentMedia = { item, index: i, localTime: state.currentTime - accumulatedTime };
        break;
      }
      accumulatedTime += item.duration;
    }

    if (currentMedia) {
      try {
        const mediaElement = await loadMediaElement(currentMedia.item);
        
        if (currentMedia.item.type === 'image') {
          const img = mediaElement as HTMLImageElement;
          
          // Calculate scaling to fit canvas while maintaining aspect ratio
          const scale = Math.min(
            canvas.width / img.naturalWidth,
            canvas.height / img.naturalHeight
          );
          const width = img.naturalWidth * scale;
          const height = img.naturalHeight * scale;
          const x = (canvas.width - width) / 2;
          const y = (canvas.height - height) / 2;
          
          ctx.drawImage(img, x, y, width, height);
        } else if (currentMedia.item.type === 'video') {
          const video = mediaElement as HTMLVideoElement;
          
          // Sync video time with current media time
          const videoTime = currentMedia.localTime / 1000;
          if (Math.abs(video.currentTime - videoTime) > 0.1) {
            video.currentTime = videoTime;
          }
          
          // Calculate scaling to fit canvas while maintaining aspect ratio
          const scale = Math.min(
            canvas.width / video.videoWidth,
            canvas.height / video.videoHeight
          );
          const width = video.videoWidth * scale;
          const height = video.videoHeight * scale;
          const x = (canvas.width - width) / 2;
          const y = (canvas.height - height) / 2;
          
          ctx.drawImage(video, x, y, width, height);
        }
      } catch (error) {
        // Fallback to placeholder
        ctx.fillStyle = '#666';
        ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 150);
        
        ctx.fillStyle = '#fff';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `Loading ${currentMedia.item.type}...`,
          canvas.width / 2,
          canvas.height / 2
        );
      }
    } else {
      // No media to display
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        'No media to display',
        canvas.width / 2,
        canvas.height / 2
      );
    }

    // Draw subtitles - calculate current subtitles based on current time
    const currentSubtitles = project.subtitles.filter(subtitle => 
      state.currentTime >= subtitle.startTime && 
      state.currentTime <= subtitle.endTime
    );
    
    currentSubtitles.forEach(subtitle => {
      ctx.font = `${subtitle.style?.fontSize || 24}px ${subtitle.style?.fontFamily || 'sans-serif'}`;
      
      const x = subtitle.position?.x || canvas.width / 2;
      const y = subtitle.position?.y || canvas.height - 50;
      
      // Draw background
      const textMetrics = ctx.measureText(subtitle.text);
      const padding = 10;
      ctx.fillStyle = subtitle.style?.backgroundColor || 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(
        x - textMetrics.width / 2 - padding,
        y - 30,
        textMetrics.width + padding * 2,
        40
      );
      
      // Draw text
      ctx.fillStyle = subtitle.style?.color || '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(subtitle.text, x, y);
    });
  }, [project.mediaItems, project.subtitles, project.settings.backgroundColor, loadMediaElement]);

  // 既存のdrawFrameはplaybackStateを使用
  const drawFrame = useCallback(async () => {
    await drawFrameWithState(playbackState);
  }, [drawFrameWithState, playbackState]);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      const frameId = requestAnimationFrame(animate);
      animationFrameRef.current = frameId;
      return;
    }

    const elapsed = timestamp - startTimeRef.current;
    
    let shouldContinue = true;
    let newPlaybackState: PlaybackState | null = null;
    
    setPlaybackState(prev => {
      if (!prev.isPlaying) {
        shouldContinue = false;
        return prev;
      }
      
      const newTime = Math.min(
        prev.currentTime + elapsed * prev.speed,
        prev.duration
      );

      // Calculate current media index
      let currentMediaIndex = 0;
      let accumulatedTime = 0;
      for (let i = 0; i < project.mediaItems.length; i++) {
        const item = project.mediaItems[i];
        if (newTime >= accumulatedTime && newTime < accumulatedTime + item.duration) {
          currentMediaIndex = i;
          break;
        }
        accumulatedTime += item.duration;
      }

      const updatedState = { ...prev, currentTime: newTime, currentMediaIndex };

      // Check if playback has reached the end
      if (newTime >= prev.duration && prev.duration > 0) {
        shouldContinue = false;
        updatedState.isPlaying = false;
        updatedState.currentTime = prev.duration; // Ensure we don't exceed duration
      }
      
      newPlaybackState = updatedState;
      return updatedState;
    });

    startTimeRef.current = timestamp;
    
    // Draw frame with the current state immediately
    if (newPlaybackState) {
      drawFrameWithState(newPlaybackState);
    }
    
    // Continue animation if still playing
    if (shouldContinue) {
      const frameId = requestAnimationFrame(animate);
      animationFrameRef.current = frameId;
    } else {
      animationFrameRef.current = undefined;
    }
  }, [project.mediaItems]);

  const play = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setPlaybackState(prev => {
      // If playback has ended (currentTime >= duration), restart from beginning
      const shouldRestart = prev.currentTime >= prev.duration;
      return { 
        ...prev, 
        isPlaying: true,
        currentTime: shouldRestart ? 0 : prev.currentTime,
        currentMediaIndex: shouldRestart ? 0 : prev.currentMediaIndex
      };
    });
    
    startTimeRef.current = undefined;
    const frameId = requestAnimationFrame(animate);
    animationFrameRef.current = frameId;
  }, [animate]);

  const pause = useCallback(() => {
    setPlaybackState(prev => ({ ...prev, isPlaying: false }));
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  const seek = useCallback((time: number) => {
    setPlaybackState(prev => {
      const newTime = Math.max(0, Math.min(time, prev.duration));
      
      // Calculate current media index for the new time
      let currentMediaIndex = 0;
      let accumulatedTime = 0;
      for (let i = 0; i < project.mediaItems.length; i++) {
        const item = project.mediaItems[i];
        if (newTime >= accumulatedTime && newTime < accumulatedTime + item.duration) {
          currentMediaIndex = i;
          break;
        }
        accumulatedTime += item.duration;
      }
      
      return {
        ...prev,
        currentTime: newTime,
        currentMediaIndex,
      };
    });
  }, [project.mediaItems]);

  const setSpeed = useCallback((speed: number) => {
    setPlaybackState(prev => ({ ...prev, speed }));
  }, []);

  useEffect(() => {
    const draw = async () => {
      await drawFrame();
    };
    draw();
  }, [drawFrame]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    canvasRef,
    playbackState,
    play,
    pause,
    seek,
    setSpeed,
    getCurrentMediaItem,
    getCurrentSubtitles,
  };
}