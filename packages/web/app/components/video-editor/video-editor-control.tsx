import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/utils/cn';
import { useVideoEditor } from './contexts';

interface VideoEditorControlProps {
  className?: string;
}

export function VideoEditorControl({ className }: VideoEditorControlProps) {
  const { state, actions } = useVideoEditor();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Format time as MM:SS or HH:MM:SS
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle timeline click and drag
  const handleTimelineInteraction = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * state.duration;

    actions.seekTo(newTime);
  }, [state.duration, actions]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStartTime(state.currentTime);
    handleTimelineInteraction(e);
  }, [state.currentTime, handleTimelineInteraction]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * state.duration;

    actions.seekTo(newTime);
  }, [isDragging, state.duration, actions]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Playback rate options
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4];

  return (
    <div className={cn("video-editor-control bg-background border-t border-border", className)}>
      {/* Timeline */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-mono text-muted-foreground min-w-[60px]">
            {formatTime(Math.floor(state.currentTime * 10) / 10)}
          </span>
          <div
            ref={timelineRef}
            className="flex-1 h-6 bg-muted rounded cursor-pointer relative group"
            onMouseDown={handleMouseDown}
          >
            {/* Timeline background */}
            <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted rounded" />

            {/* Progress bar */}
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-l"
              style={{
                width: `${(state.currentTime / state.duration) * 100}%`,
                transition: isDragging ? 'none' : 'width 50ms ease-out'
              }}
            />

            {/* Playhead */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-background rounded-full shadow-lg -ml-2"
              style={{
                left: `${(state.currentTime / state.duration) * 100}%`,
                transition: isDragging ? 'none' : 'left 50ms ease-out'
              }}
            />

            {/* Track markers */}
            {state.tracks.map((track) => (
              <div key={track.id} className="absolute top-0 h-full">
                {/* Track start */}
                <div
                  className="absolute top-0 w-1 h-full bg-accent/60"
                  style={{ left: `${(track.startTime / state.duration) * 100}%` }}
                />
                {/* Track duration */}
                <div
                  className="absolute top-1 h-4 bg-accent/30 border border-accent/50 rounded-sm"
                  style={{
                    left: `${(track.startTime / state.duration) * 100}%`,
                    width: `${((track.endTime - track.startTime) / state.duration) * 100}%`
                  }}
                />
                {/* Track end */}
                <div
                  className="absolute top-0 w-1 h-full bg-accent/60"
                  style={{ left: `${(track.endTime / state.duration) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <span className="text-sm font-mono text-muted-foreground min-w-[60px]">
            {formatTime(state.duration)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left controls - Playback */}
        <div className="flex items-center gap-2">
          {/* Skip to start */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => actions.seekTo(0)}
            className="h-8 w-8 p-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </Button>

          {/* Previous frame */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => actions.seekTo(Math.max(0, state.currentTime - 1/30))}
            className="h-8 w-8 p-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.5 12L20 18V6l-8.5 6zm-.5 0L2.5 18V6L11 12z"/>
            </svg>
          </Button>

          {/* Play/Pause */}
          <Button
            variant="default"
            size="sm"
            onClick={state.isPlaying ? actions.pause : actions.play}
            className="h-10 w-10 rounded-full"
          >
            {state.isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </Button>

          {/* Next frame */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => actions.seekTo(Math.min(state.duration, state.currentTime + 1/30))}
            className="h-8 w-8 p-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.5 12L4 18V6l8.5 6zm.5 0L21.5 18V6L13 12z"/>
            </svg>
          </Button>

          {/* Skip to end */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => actions.seekTo(state.duration)}
            className="h-8 w-8 p-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 18h2V6h-2v12zM4 18l8.5-6L4 6v12z"/>
            </svg>
          </Button>
        </div>

        {/* Center controls - Playback rate */}
        <div className="flex items-center gap-1">
          {playbackRates.map((rate) => (
            <Button
              key={rate}
              variant={state.playbackRate === rate ? "default" : "ghost"}
              size="sm"
              onClick={() => actions.setPlaybackRate(rate)}
              className="h-7 px-2 text-xs"
            >
              {rate}x
            </Button>
          ))}
        </div>

        {/* Right controls - Volume and settings */}
        <div className="flex items-center gap-2">
          {/* Volume */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => actions.setVolume(state.volume > 0 ? 0 : 1)}
              className="h-8 w-8 p-0"
            >
              {state.volume === 0 ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              )}
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={state.volume}
              onChange={(e) => actions.setVolume(parseFloat(e.target.value))}
              className="w-20 h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Duration setter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Duration:</span>
            <input
              type="number"
              min="0.1"
              max="3600"
              step="0.1"
              value={state.duration}
              onChange={(e) => actions.setDuration(parseFloat(e.target.value) || 10)}
              className="w-16 h-7 px-2 text-xs bg-muted border border-border rounded"
            />
            <span className="text-xs text-muted-foreground">s</span>
          </div>
        </div>
      </div>

      {/* Track info */}
      {state.tracks.length > 0 && (
        <div className="px-4 py-2 border-t border-border bg-muted/30">
          <div className="text-xs text-muted-foreground">
            Tracks: {state.tracks.length} | Selected: {state.selectedTracks.length}
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}