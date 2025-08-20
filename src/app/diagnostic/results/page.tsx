'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { runDiagnostic } from '@/lib/diagnosticEngineEnrichi';
import WhatsAppButton from '@/components/WhatsAppButton';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function AnalysisPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [symptomAnalysis, setSymptomAnalysis] = useState<any[]>([]);
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const analysisSteps = [
    { id: 'symptoms', name: 'Analyse symptômes', icon: '🔍', color: 'bg-green-500' },
    { id: 'pathological', name: 'IA pathologique', icon: '🧠', color: 'bg-blue-500' },
    { id: 'confidence', name: 'Score confiance', icon: '📊', color: 'bg-yellow-500' },
    { id: 'recommendations', name: 'Recommandations', icon: '💊', color: 'bg-purple-500' }
  ];

  useEffect(() => {
    // Récupérer les symptômes sélectionnés
    const loadSelectedSymptoms = async () => {
      try {
        setError(null);
        setIsLoading(true);
        
        const symptoms = localStorage.getItem('aq_selectedSymptoms');
        if (!symptoms) {
          setError('Aucun symptôme sélectionné. Veuillez recommencer le diagnostic.');
          setIsLoading(false);
          return;
        }

          const selectedSymptomsData = JSON.parse(symptoms);
          
          // Extraire les IDs des symptômes (peuvent être des objets {id, name} ou des IDs simples)
          let selectedSymptomIds: string[] = [];
          
          try {
            if (Array.isArray(selectedSymptomsData)) {
              if (selectedSymptomsData.length > 0) {
                if (typeof selectedSymptomsData[0] === 'object' && selectedSymptomsData[0] !== null) {
                  // Cas où les symptômes sont des objets {id, name}
                  selectedSymptomIds = selectedSymptomsData
                    .filter((s: any) => s && typeof s === 'object' && s.id)
                    .map((s: any) => s.id);
                } else if (typeof selectedSymptomsData[0] === 'string') {
                  // Cas où les symptômes sont déjà des IDs
                  selectedSymptomIds = selectedSymptomsData.filter((s: any) => typeof s === 'string');
                }
              }
            }
          } catch (parseError) {
            console.error('Erreur lors du parsing des symptômes:', parseError);
          setError('Erreur lors de la lecture des symptômes sélectionnés.');
          setIsLoading(false);
          return;
          }
          
          // Vérifier que nous avons des IDs valides
        if (selectedSymptomIds.length === 0) {
          setError('Aucun symptôme valide trouvé. Veuillez recommencer le diagnostic.');
          setIsLoading(false);
          return;
        }

            console.log('🔍 Symptômes sélectionnés:', selectedSymptomIds);
            
            // Analyser les symptômes
            try {
              // Créer une analyse simple des symptômes
          const analysis = selectedSymptomIds.map((symptomId) => ({
                id: symptomId,
                name: getSymptomName(symptomId),
                severity: 'medium',
                context: 'Symptôme sélectionné par le patient'
              }));
              
              setSymptomAnalysis(analysis);
            } catch (analysisError) {
              console.error('Erreur lors de l\'analyse des symptômes:', analysisError);
              setSymptomAnalysis([]);
            }
            
            // Lancer le diagnostic
            try {
              const results = await runDiagnostic(selectedSymptomIds);
              if (Array.isArray(results)) {
                setDiagnosticResults(results);
                console.log('🎯 Résultats du diagnostic:', results);
              } else {
                console.error('runDiagnostic n\'a pas retourné un tableau valide');
                setDiagnosticResults([]);
              }
            } catch (diagnosticError) {
              console.error('Erreur lors du diagnostic:', diagnosticError);
          setError('Erreur lors de l\'analyse IA. Veuillez réessayer.');
            setDiagnosticResults([]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur générale lors du chargement des symptômes:', error);
        setError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
        setSymptomAnalysis([]);
        setDiagnosticResults([]);
        setIsLoading(false);
      }
    };

    loadSelectedSymptoms();

    // Animation plus rapide (500ms au lieu de 2s)
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return Math.min(prev + 10, 100);
        }
        return prev;
      });
    }, 500);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, []);

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getStepIcon = (step: any, status: string) => {
    if (status === 'completed') return '✅';
    if (status === 'active') return step.icon;
    return '⏳';
  };

  const getStepColor = (step: any, status: string) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'active') return step.color;
    return 'bg-gray-300';
  };

  // Fonction utilitaire pour obtenir le nom d'un symptôme
  const getSymptomName = (symptomId: string): string => {
    // Import dynamique des symptômes
    try {
      const symptomesData = require('@/data/symptomes-enrichis.json');
      const symptome = symptomesData.symptoms.find((s: any) => s.id === symptomId);
      return symptome ? symptome.name : symptomId;
    } catch (error) {
      return symptomId;
    }
  };

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            
            <h1 className="text-xl font-bold text-red-800 mb-4">
              Erreur lors de l'analyse
            </h1>
            
            <p className="text-red-600 mb-6">
              {error}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.href = '/diagnostic'}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Recommencer le diagnostic
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              <h1 className="text-xl font-bold text-gray-800 mb-2">
                Chargement en cours...
              </h1>
              <p className="text-gray-600">
                Préparation de votre analyse IA
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            
            <h1 className="text-xl font-bold text-red-800 mb-4">
              Erreur lors de l'analyse
            </h1>
            
            <p className="text-red-600 mb-6">
              {error}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.href = '/diagnostic'}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Recommencer le diagnostic
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage du chargement
  if (isLoading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              <h1 className="text-xl font-bold text-gray-800 mb-2">
                Chargement en cours...
              </h1>
              <p className="text-gray-600">
                Préparation de votre analyse IA
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-afriquadis-50 via-white to-green-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute -top-10 right-10 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-16 left-10 w-48 h-48 bg-yellow-100 rounded-full blur-3xl opacity-60"></div>
        <div className="max-w-2xl mx-auto px-6 relative z-10">
        {/* Carte principale */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          {/* Icône centrale avec animation */}
            <div className="text-center mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
              {/* Cercle de progression */}
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#eef2f7" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                    className="transition-all duration-300 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#16a34a" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Icône centrale */}
              <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">🧬</span>
                </div>
              </div>

              <h1 className="text-2xl font-extrabold text-green-700 tracking-tight">Analyse IA en cours...</h1>
              <p className="text-gray-500 mt-1 text-sm">Intelligence Artificielle AFRIQUADIS Pro analyse vos symptômes</p>
          </div>
          
          {/* Barre de progression */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
              <div 
                  className="bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
                />
            </div>
              <p className="text-center text-sm text-gray-600 font-medium">
                {progress}% - Analyse des symptômes...
              </p>
            </div>
                    
          {/* Grille des étapes */}
          <div className="grid grid-cols-2 gap-4">
            {analysisSteps.map((step, index) => {
              const status = getStepStatus(index);
                const base = 'p-4 rounded-xl border transition-all duration-300 bg-gray-50';
                const active = 'border-green-300 bg-green-50 shadow-sm';
                const pending = 'border-gray-200';
              return (
                  <div key={step.id} className={`${base} ${status === 'completed' ? active : status === 'active' ? active : pending}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getStepColor(step, status)} text-white`}>{getStepIcon(step, status)}</div>
                      <div>
                        <h3 className={`text-sm font-semibold ${status === 'completed' ? 'text-green-700' : status === 'active' ? 'text-green-700' : 'text-gray-600'}`}>{step.name}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

            {/* Badge version */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full">
                <span className="text-blue-700 text-sm font-medium">IA AFRIQUADIS Pro • Version 3.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
