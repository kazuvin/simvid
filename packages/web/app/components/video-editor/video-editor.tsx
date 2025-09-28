import { useEffect } from 'react';
import { cn } from '~/utils/cn';
import { VideoEditorProvider, useVideoEditor } from './contexts';
import { VideoEditorCanvas } from './video-editor-canvas';
import { VideoEditorControl } from './video-editor-control';
import { ImageTrackUploader } from './image-track-uploader';
import type { VideoProject, InitialTrack } from './schemas';
import { convertInitialTrackToVideoTrack, resolveEffectiveValues } from './utils';

// Main component props interface
interface VideoEditorProps {
  className?: string;
  showControls?: boolean;
  showDebugInfo?: boolean;
  showImageUploader?: boolean;
  project: VideoProject;
  onProjectChange?: (project: VideoProject) => void;

  // Deprecated props for backward compatibility
  /** @deprecated Use project.output.width instead */
  width?: number;
  /** @deprecated Use project.output.height instead */
  height?: number;
  /** @deprecated Use project.duration instead */
  duration?: number;
  /** @deprecated Use project.tracks instead */
  initialTracks?: InitialTrack[];
}

// Main content component (wrapped by provider)
function VideoEditorContent({
  className,
  showControls = true,
  showDebugInfo = false,
  showImageUploader = false,
  project,
  onProjectChange,
  // Backward compatibility props
  width,
  height,
  duration,
  initialTracks
}: VideoEditorProps) {
  const { actions } = useVideoEditor();

  // Resolve effective values from project or fallback props
  const { effectiveWidth, effectiveHeight, effectiveDuration, effectiveTracks } = resolveEffectiveValues(
    project,
    width,
    height,
    duration,
    initialTracks
  );

  // Initialize editor with project data
  useEffect(() => {
    actions.setDuration(effectiveDuration);

    effectiveTracks.forEach((initialTrack, index) => {
      const videoTrack = convertInitialTrackToVideoTrack(
        initialTrack,
        index,
        effectiveWidth,
        effectiveHeight
      );
      actions.addTrack(videoTrack);
    });
  }, [actions, effectiveDuration, effectiveTracks, effectiveWidth, effectiveHeight]);

  return (
    <div
      className={cn(
        "video-editor flex flex-col bg-background border border-border rounded-lg overflow-hidden",
        className
      )}
      style={project?.settings?.backgroundColor ? { backgroundColor: project.settings.backgroundColor } : undefined}
    >
      {showImageUploader && (
        <div className="p-3 border-b border-border">
          <ImageTrackUploader />
        </div>
      )}
      <VideoEditorCanvas
        width={effectiveWidth}
        height={effectiveHeight}
        showDebugInfo={showDebugInfo}
      />
      {showControls && <VideoEditorControl />}
    </div>
  );
}

// Main exported component
export function VideoEditor(props: VideoEditorProps) {
  return (
    <VideoEditorProvider>
      <VideoEditorContent {...props} />
    </VideoEditorProvider>
  );
}