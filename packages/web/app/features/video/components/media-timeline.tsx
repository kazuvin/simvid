import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card } from '~/components/ui/card';
import { Trash2, Edit3 } from 'lucide-react';
import type { MediaItem, Subtitle } from '../types';

interface MediaTimelineProps {
  mediaItems: MediaItem[];
  subtitles: Subtitle[];
  currentTime: number;
  currentMediaIndex?: number;
  onAddMediaItem: (item: Omit<MediaItem, 'id'>) => void;
  onRemoveMediaItem: (id: string) => void;
  onAddSubtitle: (subtitle: Omit<Subtitle, 'id'>) => void;
  onRemoveSubtitle: (id: string) => void;
}

export function MediaTimeline({
  mediaItems,
  subtitles,
  currentTime,
  currentMediaIndex = 0,
  onAddMediaItem,
  onRemoveMediaItem,
  onAddSubtitle,
  onRemoveSubtitle,
}: MediaTimelineProps) {
  const [newSubtitleText, setNewSubtitleText] = useState('');

  const handleAddMedia = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('image/') ? 'image' : 'video';
        
        let duration = 3000; // Default 3 seconds for images
        
        if (type === 'video') {
          // Get actual video duration
          try {
            duration = await getVideoDuration(url);
          } catch (error) {
            console.warn('Failed to get video duration, using default:', error);
            duration = 10000; // Default 10 seconds for videos
          }
        }
        
        onAddMediaItem({
          type,
          src: url,
          duration,
          alt: file.name,
        });
      }
    };
    input.click();
  };

  const getVideoDuration = (src: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        resolve(video.duration * 1000); // Convert to milliseconds
        video.src = '';
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video metadata'));
      };
      
      video.src = src;
    });
  };

  const handleAddSubtitle = () => {
    if (newSubtitleText.trim()) {
      onAddSubtitle({
        text: newSubtitleText.trim(),
        startTime: currentTime,
        endTime: currentTime + 3000, // Default 3 seconds
        position: { x: 400, y: 300 }, // Default center position
        style: {
          fontSize: 24,
          color: '#ffffff',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          fontFamily: 'sans-serif',
        },
      });
      setNewSubtitleText('');
    }
  };

  const getTotalDuration = () => {
    return mediaItems.reduce((total, item) => total + item.duration, 0);
  };

  const getTimelinePosition = (time: number) => {
    const totalDuration = getTotalDuration();
    return totalDuration > 0 ? (time / totalDuration) * 100 : 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleAddMedia} variant="outline">
          Add Media
        </Button>
      </div>

      {/* Media Items Timeline */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3">Media Items</h3>
        <div className="space-y-2">
          {mediaItems.map((item, index) => {
            let accumulatedTime = 0;
            for (let i = 0; i < index; i++) {
              accumulatedTime += mediaItems[i].duration;
            }
            
            const isCurrentMedia = index === currentMediaIndex;
            
            return (
              <div 
                key={item.id} 
                className={`flex items-center gap-2 p-2 rounded transition-colors ${
                  isCurrentMedia ? 'bg-primary/20 border-2 border-primary' : 'bg-muted'
                }`}
              >
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isCurrentMedia ? 'text-primary' : ''}`}>
                    {isCurrentMedia && '▶ '}{item.type}: {item.alt || item.src}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Duration: {item.duration / 1000}s
                    {isCurrentMedia && ` • Playing`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveMediaItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          {mediaItems.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              No media items added yet
            </div>
          )}
        </div>
      </Card>

      {/* Subtitles */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3">Subtitles</h3>
        
        {/* Add Subtitle */}
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Enter subtitle text..."
            value={newSubtitleText}
            onChange={(e) => setNewSubtitleText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtitle()}
          />
          <Button onClick={handleAddSubtitle} disabled={!newSubtitleText.trim()}>
            Add
          </Button>
        </div>

        {/* Subtitle List */}
        <div className="space-y-2">
          {subtitles.map((subtitle) => (
            <div key={subtitle.id} className="flex items-center gap-2 p-2 bg-muted rounded">
              <div className="flex-1">
                <div className="text-sm font-medium">{subtitle.text}</div>
                <div className="text-xs text-muted-foreground">
                  {subtitle.startTime / 1000}s - {subtitle.endTime / 1000}s
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveSubtitle(subtitle.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {subtitles.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              No subtitles added yet
            </div>
          )}
        </div>
      </Card>

      {/* Playhead indicator */}
      {getTotalDuration() > 0 && (
        <div className="relative h-2 bg-muted rounded">
          <div
            className="absolute top-0 w-1 h-full bg-primary rounded"
            style={{ left: `${getTimelinePosition(currentTime)}%` }}
          />
        </div>
      )}
    </div>
  );
}