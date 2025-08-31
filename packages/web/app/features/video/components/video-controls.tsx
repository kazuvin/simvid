import { Button } from '~/components/ui/button';
import { Slider } from '~/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import type { PlaybackState } from '../types';

interface VideoControlsProps {
  playbackState: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onSpeedChange: (speed: number) => void;
}

export function VideoControls({
  playbackState,
  onPlay,
  onPause,
  onSeek,
  onSpeedChange,
}: VideoControlsProps) {
  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 p-4 bg-muted rounded-lg">
      {/* Timeline */}
      <div className="space-y-2">
        <Slider
          value={[playbackState.currentTime]}
          max={playbackState.duration}
          step={100}
          onValueChange={([value]) => onSeek(value)}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(playbackState.currentTime)}</span>
          <span>{formatTime(playbackState.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSeek(Math.max(0, playbackState.currentTime - 5000))}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={playbackState.isPlaying ? onPause : onPlay}
        >
          {playbackState.isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : playbackState.currentTime >= playbackState.duration && playbackState.duration > 0 ? (
            <RotateCcw className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSeek(Math.min(playbackState.duration, playbackState.currentTime + 5000))}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">Speed:</span>
        {[0.5, 1, 1.25, 1.5, 2].map(speed => (
          <Button
            key={speed}
            variant={playbackState.speed === speed ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSpeedChange(speed)}
          >
            {speed}x
          </Button>
        ))}
      </div>
    </div>
  );
}