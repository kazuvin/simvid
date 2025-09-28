import { useCallback } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/utils/cn';
import { useVideoEditor } from './contexts';
import type { VideoTrack } from './contexts/types';

interface ImageTrackControlsProps {
  className?: string;
  trackId?: string;
}

export function ImageTrackControls({ className, trackId }: ImageTrackControlsProps) {
  const { state, actions } = useVideoEditor();

  const imageTrack = state.tracks.find((track) => track.id === trackId && track.type === 'image') as VideoTrack | undefined;

  const updateTrackMetadata = useCallback((updates: any) => {
    if (!imageTrack) return;

    const updatedMetadata = {
      ...imageTrack.metadata,
      ...updates,
    };

    actions.updateTrack(imageTrack.id, { metadata: updatedMetadata });
  }, [imageTrack, actions]);

  const setLayout = useCallback((layout: 'fullscreen' | 'custom') => {
    if (layout === 'custom' && imageTrack && !imageTrack.metadata?.transform) {
      updateTrackMetadata({
        layout,
        transform: {
          x: 0,
          y: 0,
          width: 400,
          height: 300,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          opacity: 1,
        },
      });
    } else {
      updateTrackMetadata({ layout });
    }
  }, [updateTrackMetadata, imageTrack]);

  const updateTransform = useCallback((transformUpdate: any) => {
    if (!imageTrack?.metadata?.transform) return;

    updateTrackMetadata({
      transform: {
        ...imageTrack.metadata.transform,
        ...transformUpdate,
      },
    });
  }, [updateTrackMetadata, imageTrack]);

  const setObjectFit = useCallback((objectFit: 'cover' | 'contain' | 'fill') => {
    updateTrackMetadata({ objectFit });
  }, [updateTrackMetadata]);

  if (!imageTrack) {
    return (
      <div className={cn('p-4 text-center text-muted-foreground', className)}>
        Select an image track to edit its properties
      </div>
    );
  }

  const layout = imageTrack.metadata?.layout || 'fullscreen';
  const objectFit = imageTrack.metadata?.objectFit || 'cover';
  const transform = imageTrack.metadata?.transform;

  return (
    <div className={cn('space-y-4 p-4', className)}>
      <div>
        <h3 className="text-sm font-medium mb-2">Layout</h3>
        <div className="flex gap-2">
          <Button
            variant={layout === 'fullscreen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayout('fullscreen')}
          >
            Fullscreen
          </Button>
          <Button
            variant={layout === 'custom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayout('custom')}
          >
            Custom
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Object Fit</h3>
        <div className="flex gap-2">
          <Button
            variant={objectFit === 'cover' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setObjectFit('cover')}
          >
            Cover
          </Button>
          <Button
            variant={objectFit === 'contain' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setObjectFit('contain')}
          >
            Contain
          </Button>
          <Button
            variant={objectFit === 'fill' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setObjectFit('fill')}
          >
            Fill
          </Button>
        </div>
      </div>

      {layout === 'custom' && transform && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Transform</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">X Position</label>
              <input
                type="number"
                value={Math.round(transform.x || 0)}
                onChange={(e) => updateTransform({ x: Number(e.target.value) })}
                className="w-full mt-1 px-2 py-1 text-xs border border-border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Y Position</label>
              <input
                type="number"
                value={Math.round(transform.y || 0)}
                onChange={(e) => updateTransform({ y: Number(e.target.value) })}
                className="w-full mt-1 px-2 py-1 text-xs border border-border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Width</label>
              <input
                type="number"
                value={Math.round(transform.width || 0)}
                onChange={(e) => updateTransform({ width: Number(e.target.value) })}
                className="w-full mt-1 px-2 py-1 text-xs border border-border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Height</label>
              <input
                type="number"
                value={Math.round(transform.height || 0)}
                onChange={(e) => updateTransform({ height: Number(e.target.value) })}
                className="w-full mt-1 px-2 py-1 text-xs border border-border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Scale X</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={transform.scaleX || 1}
                onChange={(e) => updateTransform({ scaleX: Number(e.target.value) })}
                className="w-full mt-1 px-2 py-1 text-xs border border-border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Scale Y</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={transform.scaleY || 1}
                onChange={(e) => updateTransform({ scaleY: Number(e.target.value) })}
                className="w-full mt-1 px-2 py-1 text-xs border border-border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Rotation (deg)</label>
              <input
                type="number"
                value={Math.round(transform.rotation || 0)}
                onChange={(e) => updateTransform({ rotation: Number(e.target.value) })}
                className="w-full mt-1 px-2 py-1 text-xs border border-border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Opacity</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={transform.opacity ?? 1}
                onChange={(e) => updateTransform({ opacity: Number(e.target.value) })}
                className="w-full mt-1 px-2 py-1 text-xs border border-border rounded"
              />
            </div>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-border">
        <h3 className="text-sm font-medium mb-2">Track Duration</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Start Time (s)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={imageTrack.startTime}
              onChange={(e) => {
                actions.updateTrack(imageTrack.id, { startTime: Number(e.target.value) });
              }}
              className="w-full mt-1 px-2 py-1 text-xs border border-border rounded"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">End Time (s)</label>
            <input
              type="number"
              step="0.1"
              min={imageTrack.startTime}
              value={imageTrack.endTime}
              onChange={(e) => {
                actions.updateTrack(imageTrack.id, { endTime: Number(e.target.value) });
              }}
              className="w-full mt-1 px-2 py-1 text-xs border border-border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}