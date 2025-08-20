"use client";

import { useState, useEffect } from 'react';
import AdminGuard from '@/components/AdminGuard';
import AddPathologyModal from '@/components/AddPathologyModal';
import EditPathologyModal from '@/components/EditPathologyModal';
import type { Symptom, Pathology } from '@/types';

export default function AdminPathologiesPage() {
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPathology, setSelectedPathology] = useState<Pathology | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pathologiesRes, symptomsRes] = await Promise.all([
        fetch('/api/pathologies'),
        fetch('/api/symptoms')
      ]);
      if(!pathologiesRes.ok || !symptomsRes.ok) throw new Error("Failed to fetch");
      setPathologies(await pathologiesRes.json());
      setSymptoms(await symptomsRes.json());
    } catch (error) { console.error("Erreur de chargement:", error); } 
    finally { setIsLoading(false); }
  };

  const handleAdd = async (data: Omit<Pathology, 'id'>) => {
    await fetch('/api/pathologies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    fetchData();
  };
  
  const handleUpdate = async (data: Pathology) => {
    await fetch(`/api/pathologies/${data.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette pathologie ?")) {
      await fetch(`/api/pathologies/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };
  
  const getSymptomNameById = (id: string): string => symptoms.find(s => s.id === id)?.name || 'Inconnu';

  if (isLoading) return <AdminGuard><div>Chargement des données...</div></AdminGuard>;

  return (
    <AdminGuard>
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-800">Gestion des Pathologies</h1>
            <button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">+ Ajouter</button>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Symptômes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pathologies.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                        {p.symptoms.map(sId => (
                            <span key={sId} className="bg-yellow-200 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full">
                                {getSymptomNameById(sId)}
                            </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => { setSelectedPathology(p); setIsEditModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900">Modifier</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900 ml-4">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddPathologyModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAdd} symptoms={symptoms} />
      <EditPathologyModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onUpdate={handleUpdate} pathology={selectedPathology} symptoms={symptoms} />
    </AdminGuard>
  );
}
