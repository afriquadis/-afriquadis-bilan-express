"use client";

import { useState, useEffect } from 'react';
import type { Pathology, Symptom } from '@/types';
interface EditPathologyModalProps { isOpen: boolean; onClose: () => void; onUpdate: (data: Pathology) => void; pathology: Pathology | null; symptoms: Symptom[]; }

export default function EditPathologyModal({ isOpen, onClose, onUpdate, pathology, symptoms }: EditPathologyModalProps) {
  const [name, setName] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  useEffect(() => {
    if (pathology) {
      setName(pathology.name);
      setSelectedSymptoms(pathology.symptoms);
    }
  }, [pathology]);

  if (!isOpen || !pathology) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...pathology, name, symptoms: selectedSymptoms });
    onClose();
  };
  
  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(p => p.includes(symptomId) ? p.filter(id => id !== symptomId) : [...p, symptomId]);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Modifier la pathologie</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md" required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Symptômes</label>
            <div className="max-h-60 overflow-y-auto border p-2 grid grid-cols-2 gap-2">
              {symptoms.map(symptom => (
                <label key={symptom.id} className="flex items-center space-x-2 p-1 rounded">
                  <input type="checkbox" checked={selectedSymptoms.includes(symptom.id)} onChange={() => handleSymptomToggle(symptom.id)} />
                  <span>{symptom.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Mettre à jour</button>
          </div>
        </form>
      </div>
    </div>
  );
}
