import { useCallback, useRef } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/utils/cn';
import { useVideoEditor } from './contexts';

interface ImageTrackUploaderProps {
  className?: string;
  onImageAdd?: (file: File, url: string) => void;
}

export function ImageTrackUploader({ className, onImageAdd }: ImageTrackUploaderProps) {
  const { actions } = useVideoEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const url = URL.createObjectURL(file);

    const track = {
      id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'image' as const,
      name: file.name,
      startTime: 0,
      endTime: 3,
      source: url,
      enabled: true,
      locked: false,
      metadata: {
        layout: 'fullscreen',
        objectFit: 'cover',
        transform: {
          opacity: 1,
        },
      },
    };

    actions.addTrack(track);
    onImageAdd?.(file, url);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [actions, onImageAdd]);

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={triggerFileSelect}
        className="h-8"
      >
        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        Add Image
      </Button>
    </div>
  );
}