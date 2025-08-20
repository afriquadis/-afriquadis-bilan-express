'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Button from './Button';

interface SymptomEntry {
  id: string;
  symptom: string;
  intensity: number;
  date: string;
  notes?: string;
}

interface TrackedSymptom {
  name: string;
  entries: SymptomEntry[];
  trend: 'amélioration' | 'stable' | 'aggravation';
}

export default function SymptomTracker() {
  const [trackedSymptoms, setTrackedSymptoms] = useState<TrackedSymptom[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSymptom, setNewSymptom] = useState('');
  const [newIntensity, setNewIntensity] = useState(1);
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    loadTrackedSymptoms();
  }, []);

  const loadTrackedSymptoms = () => {
    try {
      const saved = localStorage.getItem('aq_symptom_tracker');
      if (saved) {
        setTrackedSymptoms(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Erreur chargement suivi symptômes:', error);
    }
  };

  const saveTrackedSymptoms = (symptoms: TrackedSymptom[]) => {
    try {
      localStorage.setItem('aq_symptom_tracker', JSON.stringify(symptoms));
      setTrackedSymptoms(symptoms);
    } catch (error) {
      console.log('Erreur sauvegarde suivi symptômes:', error);
    }
  };

  const addSymptomEntry = () => {
    if (!newSymptom.trim()) return;

    const entry: SymptomEntry = {
      id: Date.now().toString(),
      symptom: newSymptom,
      intensity: newIntensity,
      date: new Date().toISOString(),
      notes: newNotes.trim() || undefined
    };

    const updatedSymptoms = [...trackedSymptoms];
    const existingIndex = updatedSymptoms.findIndex(s => s.name === newSymptom);

    if (existingIndex >= 0) {
      updatedSymptoms[existingIndex].entries.push(entry);
      updatedSymptoms[existingIndex].trend = calculateTrend(updatedSymptoms[existingIndex].entries);
    } else {
      updatedSymptoms.push({
        name: newSymptom,
        entries: [entry],
        trend: 'stable'
      });
    }

    saveTrackedSymptoms(updatedSymptoms);
    setNewSymptom('');
    setNewIntensity(1);
    setNewNotes('');
    setShowAddForm(false);
  };

  const calculateTrend = (entries: SymptomEntry[]): 'amélioration' | 'stable' | 'aggravation' => {
    if (entries.length < 2) return 'stable';
    
    const recent = entries.slice(-3);
    const first = recent[0].intensity;
    const last = recent[recent.length - 1].intensity;
    
    if (last < first) return 'amélioration';
    if (last > first) return 'aggravation';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'amélioration': return '📈';
      case 'aggravation': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'amélioration': return 'text-green-600';
      case 'aggravation': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity === 1) return 'bg-green-100 text-green-700';
    if (intensity === 2) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getIntensityLabel = (intensity: number) => {
    const labels = ['', 'Léger', 'Modéré', 'Sévère'];
    return labels[intensity] || 'Inconnu';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-darkBlue-800">
          📊 Suivi des Symptômes
        </h2>
        <Button 
          variant="primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Annuler' : '➕ Ajouter'}
        </Button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="lg">
            <h3 className="font-semibold text-darkBlue-800 mb-4">Ajouter une entrée</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptôme
                </label>
                <input
                  type="text"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="Ex: Mal de tête, Fatigue..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afriquadis-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intensité
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3].map(level => (
                    <button
                      key={level}
                      onClick={() => setNewIntensity(level)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        newIntensity === level
                          ? 'border-afriquadis-500 ' + getIntensityColor(level)
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {getIntensityLabel(level)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Observations particulières..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afriquadis-500"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="primary" onClick={addSymptomEntry}>
                  Ajouter
                </Button>
                <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {trackedSymptoms.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-8">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-darkBlue-800 mb-2">
              Aucun symptôme suivi
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez à suivre vos symptômes pour voir leur évolution
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trackedSymptoms.map((symptom, index) => (
            <motion.div
              key={symptom.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="lg" hover>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-darkBlue-800">
                      {symptom.name}
                    </h3>
                    <div className={`flex items-center gap-2 ${getTrendColor(symptom.trend)}`}>
                      <span>{getTrendIcon(symptom.trend)}</span>
                      <span className="text-sm font-medium capitalize">
                        {symptom.trend}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Dernières entrées ({symptom.entries.length} total)
                    </div>
                    {symptom.entries.slice(-3).reverse().map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium">
                            {new Date(entry.date).toLocaleDateString('fr-FR')}
                          </div>
                          {entry.notes && (
                            <div className="text-xs text-gray-600 mt-1">
                              {entry.notes}
                            </div>
                          )}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getIntensityColor(entry.intensity)}`}>
                          {getIntensityLabel(entry.intensity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
