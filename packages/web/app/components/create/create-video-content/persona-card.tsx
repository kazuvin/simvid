import { Button } from '~/components/ui';
import type { ScriptFormData } from '../schemas';

interface PersonaCardProps {
  persona: NonNullable<ScriptFormData['targetPersonas']>[0];
  onEdit: (persona: NonNullable<ScriptFormData['targetPersonas']>[0]) => void;
  onDelete: (id: string) => void;
}

export function PersonaCard({ persona, onEdit, onDelete }: PersonaCardProps) {
  return (
    <div className="border-border bg-muted/50 rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{persona.name}</h4>
        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(persona)}>
            編集
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => onDelete(persona.id)}>
            削除
          </Button>
        </div>
      </div>
      <div className="text-muted-foreground space-y-1 text-sm">
        {persona.ageRange && (
          <div>
            <span className="font-medium">年齢:</span> {persona.ageRange}
          </div>
        )}
        {persona.gender && (
          <div>
            <span className="font-medium">性別:</span> {persona.gender}
          </div>
        )}
        {persona.occupation && (
          <div>
            <span className="font-medium">職業:</span> {persona.occupation}
          </div>
        )}
        {persona.characteristics && (
          <div>
            <span className="font-medium">特徴:</span> {persona.characteristics}
          </div>
        )}
      </div>
    </div>
  );
}