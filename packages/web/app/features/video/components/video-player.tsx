import { useVideoPlayer } from '../hooks/use-video-player';
import type { VideoProject } from '../types';

interface VideoPlayerProps {
  project: VideoProject;
  className?: string;
}

export function VideoPlayer({ project, className }: VideoPlayerProps) {
  const { canvasRef, playbackState } = useVideoPlayer(project);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={project.settings.width}
        height={project.settings.height}
        className="border border-border rounded-lg bg-background"
      />
    </div>
  );
}