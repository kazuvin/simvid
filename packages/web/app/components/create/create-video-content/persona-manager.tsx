import * as React from 'react';
import { Button } from '~/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { FormLabel } from '~/components/ui/form';
import { type ScriptFormData, type PersonaFormData } from '../schemas';
import { PersonaForm } from './persona-form';
import { PersonaCard } from './persona-card';

interface PersonaManagerProps {
  personas: NonNullable<ScriptFormData['targetPersonas']>;
  onPersonasChange: (personas: NonNullable<ScriptFormData['targetPersonas']>) => void;
}

export function PersonaManager({ personas, onPersonasChange }: PersonaManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingPersona, setEditingPersona] = React.useState<NonNullable<ScriptFormData['targetPersonas']>[0] | null>(
    null,
  );

  const openAddPersona = () => {
    setEditingPersona(null);
    setIsDialogOpen(true);
  };

  const openEditPersona = (persona: NonNullable<ScriptFormData['targetPersonas']>[0]) => {
    setEditingPersona(persona);
    setIsDialogOpen(true);
  };

  const handleSavePersona = (data: PersonaFormData) => {
    const newPersona = {
      id: editingPersona?.id || `persona-${Date.now()}`,
      name: data.name.trim(),
      ageRange: data.ageRange || undefined,
      gender: data.gender || undefined,
      occupation: data.occupation || undefined,
      characteristics: data.characteristics || undefined,
    };

    if (editingPersona) {
      onPersonasChange(personas.map((p) => (p.id === editingPersona.id ? newPersona : p)));
    } else {
      onPersonasChange([...personas, newPersona]);
    }

    setIsDialogOpen(false);
  };

  const handleDeletePersona = (id: string) => {
    onPersonasChange(personas.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>ペルソナ</FormLabel>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" onClick={openAddPersona}>
              + ペルソナを追加
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPersona ? 'ペルソナを編集' : 'ペルソナを追加'}</DialogTitle>
            </DialogHeader>

            <PersonaForm
              editingPersona={editingPersona}
              onSave={handleSavePersona}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {personas.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onEdit={openEditPersona}
              onDelete={handleDeletePersona}
            />
          ))}
        </div>
      )}
    </div>
  );
}