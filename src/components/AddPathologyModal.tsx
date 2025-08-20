"use client";
import { useState } from 'react';
import type { Pathology, Symptom } from '@/types';
interface AddPathologyModalProps { isOpen: boolean; onClose: () => void; onAdd: (data: Omit<Pathology, 'id'>) => void; symptoms: Symptom[]; }

export default function AddPathologyModal({ isOpen, onClose, onAdd, symptoms }: AddPathologyModalProps) {
  const [name, setName] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name, symptoms: selectedSymptoms, product_kit_id: "K_NEW",
      advice: { alimentation: "N/A", hygiene: "N/A", repos: "N/A", hydratation: "N/A", activite_physique: "N/A" }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Ajouter une pathologie</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input type="text" id="add-name" value={name} onChange={(e) => setName(e.target.value)} required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Symptômes</label>
            <div className="max-h-60 overflow-y-auto border p-2 grid grid-cols-2 gap-2">
              {symptoms.map(symptom => (
                <label key={symptom.id} className="flex items-center space-x-2 p-1">
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom.id)}
                    onChange={() =>
                      setSelectedSymptoms(prev =>
                        prev.includes(symptom.id)
                          ? prev.filter(id => id !== symptom.id)
                          : [...prev, symptom.id]
                      )
                    }
                  />
                  <span>{symptom.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}
