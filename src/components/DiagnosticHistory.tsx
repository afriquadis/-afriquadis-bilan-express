'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Button from './Button';

interface HistoryItem {
  id: string;
  date: string;
  symptoms: string[];
  pathologies: string[];
  recommendations: string[];
  confidence: number;
}

export default function DiagnosticHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('aq_diagnostic_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.log('Erreur chargement historique:', error);
    }
    setLoading(false);
  };

  const clearHistory = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer tout l\'historique ?')) {
      localStorage.removeItem('aq_diagnostic_history');
      setHistory([]);
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'afriquadis_diagnostic_history.json';
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-afriquadis-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-darkBlue-800">
          📋 Historique des Diagnostics
        </h2>
        <div className="flex gap-3">
          {history.length > 0 && (
            <>
              <Button variant="secondary" size="sm" onClick={exportHistory}>
                📥 Exporter
              </Button>
              <Button variant="danger" size="sm" onClick={clearHistory}>
                🗑️ Vider
              </Button>
            </>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-8">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-darkBlue-800 mb-2">
              Aucun diagnostic dans l'historique
            </h3>
            <p className="text-gray-600 mb-4">
              Vos diagnostics AFRIQUADIS apparaîtront ici automatiquement
            </p>
            <Button href="/diagnostic" variant="primary">
              Faire un Diagnostic
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card padding="lg" hover>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-darkBlue-800">
                          Diagnostic du {new Date(item.date).toLocaleDateString('fr-FR')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(item.date).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Confiance</div>
                        <div className={`font-bold text-lg ${
                          item.confidence >= 80 ? 'text-green-600' :
                          item.confidence >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {item.confidence}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-darkBlue-700 mb-2">Symptômes</h4>
                        <div className="space-y-1">
                          {item.symptoms.slice(0, 3).map((symptom, i) => (
                            <div key={i} className="text-sm text-gray-600 flex items-center">
                              <span className="w-2 h-2 bg-afriquadis-500 rounded-full mr-2"></span>
                              {symptom}
                            </div>
                          ))}
                          {item.symptoms.length > 3 && (
                            <div className="text-sm text-gray-500">
                              +{item.symptoms.length - 3} autres
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-darkBlue-700 mb-2">Pathologies</h4>
                        <div className="space-y-1">
                          {item.pathologies.slice(0, 2).map((pathology, i) => (
                            <div key={i} className="text-sm text-orange-700 font-medium">
                              {pathology}
                            </div>
                          ))}
                          {item.pathologies.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{item.pathologies.length - 2} autres
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-darkBlue-700 mb-2">Recommandations</h4>
                        <div className="space-y-1">
                          {item.recommendations.slice(0, 2).map((rec, i) => (
                            <div key={i} className="text-sm text-green-700">
                              ✓ {rec}
                            </div>
                          ))}
                          {item.recommendations.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{item.recommendations.length - 2} autres
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
