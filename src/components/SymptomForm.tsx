'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectedSymptom {
  id: string;
  name: string;
  intensity: number;
}

// Liste enrichie et catégorisée
const COMMON_SYMPTOMS = [
  // Général
  { id: 'fievre', name: 'Fièvre', category: 'général' },
  { id: 'fatigue', name: 'Fatigue', category: 'général' },
  { id: 'perte_appetit', name: 'Perte d\'appétit', category: 'général' },
  { id: 'sueurs_nocturnes', name: 'Sueurs nocturnes', category: 'général' },
  { id: 'frissons', name: 'Frissons', category: 'général' },
  { id: 'amaigrissement', name: 'Amaigrissement', category: 'général' },
  { id: 'douleurs_diffuses', name: 'Douleurs diffuses', category: 'général' },
  { id: 'courbatures', name: 'Courbatures', category: 'général' },
  { id: 'troubles_sommeil', name: 'Troubles du sommeil', category: 'général' },

  // Respiratoire / ORL
  { id: 'toux', name: 'Toux', category: 'respiratoire' },
  { id: 'toux_grasse', name: 'Toux grasse', category: 'respiratoire' },
  { id: 'toux_seche', name: 'Toux sèche', category: 'respiratoire' },
  { id: 'essoufflement', name: 'Essoufflement', category: 'respiratoire' },
  { id: 'rhume', name: 'Rhume / Nez bouché', category: 'orl' },
  { id: 'mal_gorge', name: 'Mal de gorge', category: 'orl' },
  { id: 'etouffement', name: 'Sensation d\'étouffement', category: 'respiratoire' },
  { id: 'douleur_thoracique_respi', name: 'Douleur thoracique à la respiration', category: 'respiratoire' },

  // Digestif
  { id: 'nausees', name: 'Nausées', category: 'digestif' },
  { id: 'vomissements', name: 'Vomissements', category: 'digestif' },
  { id: 'diarrhee', name: 'Diarrhée', category: 'digestif' },
  { id: 'constipation', name: 'Constipation', category: 'digestif' },
  { id: 'douleur_abdominale', name: 'Douleur abdominale', category: 'digestif' },
  { id: 'brulures_estomac', name: 'Brûlures d\'estomac', category: 'digestif' },
  { id: 'ballonnements', name: 'Ballonnements', category: 'digestif' },
  { id: 'selles_sanglantes', name: 'Selles sanglantes', category: 'digestif' },

  // Neurologique
  { id: 'maux_tete', name: 'Maux de tête', category: 'neurologique' },
  { id: 'vertiges', name: 'Vertiges', category: 'neurologique' },
  { id: 'fourmillements', name: 'Fourmillements', category: 'neurologique' },
  { id: 'troubles_concentration', name: 'Troubles de la concentration', category: 'neurologique' },
  { id: 'vision_trouble', name: 'Vision trouble', category: 'neurologique' },
  { id: 'perte_connaissance', name: 'Perte de connaissance', category: 'neurologique' },

  // Cardiovasculaire
  { id: 'palpitations', name: 'Palpitations', category: 'cardiovasculaire' },
  { id: 'douleur_poitrine', name: 'Douleur thoracique', category: 'cardiovasculaire' },
  { id: 'oedemes_jambes', name: 'Œdèmes des jambes', category: 'cardiovasculaire' },
  { id: 'tension_elevee', name: 'Tension élevée (HTA)', category: 'cardiovasculaire' },
  { id: 'malaise_effort', name: 'Malaise à l\'effort', category: 'cardiovasculaire' },

  // Dermatologique
  { id: 'eruption_cutanee', name: 'Éruption cutanée', category: 'dermatologique' },
  { id: 'demangeaisons', name: 'Démangeaisons', category: 'dermatologique' },
  { id: 'peau_seche', name: 'Peau sèche', category: 'dermatologique' },
  { id: 'boutons', name: 'Boutons / Acné', category: 'dermatologique' },
  { id: 'plaie_malveillante', name: 'Plaie cicatrisant mal', category: 'dermatologique' },

  // Rhumatologique / Musculo-squelettique
  { id: 'douleur_dos', name: 'Douleur du dos', category: 'rhumatologique' },
  { id: 'douleurs_articulaires', name: 'Douleurs articulaires', category: 'rhumatologique' },
  { id: 'raideurs_matinales', name: 'Raideurs matinales', category: 'rhumatologique' },
  { id: 'gonflement_articulaire', name: 'Gonflement articulaire', category: 'rhumatologique' },

  // Urinaire
  { id: 'brulures_miction', name: 'Brûlures à la miction', category: 'urinaire' },
  { id: 'urines_frequentes', name: 'Envies fréquentes d\'uriner', category: 'urinaire' },
  { id: 'sang_dans_urines', name: 'Sang dans les urines', category: 'urinaire' },

  // Gynécologique (si concerné)
  { id: 'retard_regles', name: 'Retard de règles', category: 'gynécologique' },
  { id: 'douleurs_regles', name: 'Règles douloureuses', category: 'gynécologique' },
  { id: 'pertes_vaginales', name: 'Pertes vaginales anormales', category: 'gynécologique' },
];

const INTENSITY_LEVELS = [
  { value: 1, label: 'Léger', emoji: '😐', color: 'bg-green-100 text-green-700' },
  { value: 2, label: 'Modéré', emoji: '😕', color: 'bg-yellow-100 text-yellow-700' },
  { value: 3, label: 'Sévère', emoji: '😫', color: 'bg-red-100 text-red-700' }
];

// Catégories disponibles (dérivées des symptômes)
const ALL_CATEGORIES = ['tous', ...Array.from(new Set(COMMON_SYMPTOMS.map(s => s.category)))];

// Variants d'animation UI (stables, sans impact logique)
const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut', staggerChildren: 0.04 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

export default function SymptomForm() {
  const [step, setStep] = useState(1); // 1: sélection, 2: intensité, 3: analyse
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [symptomIntensities, setSymptomIntensities] = useState<Record<string, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('tous');
  const [query, setQuery] = useState<string>('');
  const router = useRouter();

  // ÉTAPE 1: Sélection des symptômes
  const handleSymptomToggle = (symptomId: string) => {
    const newSelected = new Set(selectedSymptoms);
    if (newSelected.has(symptomId)) {
      newSelected.delete(symptomId);
      // Supprimer aussi l'intensité
      const newIntensities = { ...symptomIntensities };
      delete newIntensities[symptomId];
      setSymptomIntensities(newIntensities);
    } else {
      newSelected.add(symptomId);
    }
    setSelectedSymptoms(newSelected);
  };

  // ÉTAPE 2: Définir l'intensité
  const handleIntensityChange = (symptomId: string, intensity: number) => {
    setSymptomIntensities(prev => ({
      ...prev,
      [symptomId]: intensity
    }));
  };

  // Navigation
  const handleNext = () => {
    if (step === 1 && selectedSymptoms.size > 0) {
      setStep(2);
    } else if (step === 2) {
      // Vérifier que tous les symptômes ont une intensité
      const hasAllIntensities = Array.from(selectedSymptoms).every(id => 
        ((symptomIntensities[id] ?? 0) > 0)
      );
      if (hasAllIntensities) {
        handleAnalyze();
      }
    }
  };

  const handlePrevious = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.push('/diagnostic');
    }
  };

  // ÉTAPE 3: Analyser
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Préparer les données pour l'analyse
    const symptomsData: SelectedSymptom[] = Array.from(selectedSymptoms).map(id => {
      const symptom = COMMON_SYMPTOMS.find(s => s.id === id);
      return {
        id,
        name: symptom?.name || '',
        intensity: symptomIntensities[id] || 1
      };
    });

    // Sauvegarder en localStorage
    try {
      localStorage.setItem('aq_selectedSymptoms', JSON.stringify(symptomsData));
      localStorage.setItem('aq_diagnosticDate', new Date().toISOString());
    } catch (error) {
      console.log('Erreur sauvegarde:', error);
    }

    // Simuler l'analyse (2 secondes)
    setTimeout(() => {
      router.push('/diagnostic/results');
    }, 2000);
  };

  const selectedSymptomsArray = Array.from(selectedSymptoms);
  const canProceedStep1 = selectedSymptoms.size > 0;
  const canProceedStep2 = selectedSymptomsArray.every(id => ((symptomIntensities[id] ?? 0) > 0));

  const filteredSymptoms = COMMON_SYMPTOMS.filter(s => {
    const byCategory = activeCategory === 'tous' ? true : s.category === activeCategory;
    const byQuery = query.trim().length === 0 ? true : s.name.toLowerCase().includes(query.toLowerCase());
    return byCategory && byQuery;
  });

  if (isAnalyzing) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-afriquadis-50 via-orange-50 to-darkBlue-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-darkBlue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float anim-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-afriquadis-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float anim-delay-4000"></div>
        <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md mx-auto border border-white/20 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-afriquadis-500 via-orange-500 to-darkBlue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <div className="w-8 h-8 border-4 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                </div>
          <h2 className="text-2xl font-bold text-darkBlue-800 mb-2">Analyse en cours</h2>
          <p className="text-gray-600 mb-4">Notre IA analyse vos symptômes...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-afriquadis-500 via-orange-500 to-darkBlue-600 h-2 rounded-full animate-pulse"></div>
          </div>
                          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-afriquadis-50 via-orange-50 to-darkBlue-50 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
      <div className="absolute top-1/2 right-10 w-24 h-24 bg-darkBlue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float anim-delay-2000"></div>
      <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-afriquadis-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float anim-delay-4000"></div>
      <div className="max-w-2xl mx-auto p-6 relative z-10">
        {/* Progress */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-darkBlue-800">
              {step === 1 ? 'Sélectionnez vos symptômes' : 'Évaluez l\'intensité'}
            </h1>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-afriquadis-100 to-orange-100 text-darkBlue-700 border border-white/40 shadow-sm">Étape {step}/2</span>
                      </div>
          <div className="w-full bg-white/60 backdrop-blur-sm rounded-full h-2 border border-white/40">
            <div 
              className="bg-gradient-to-r from-afriquadis-500 via-orange-500 to-darkBlue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
                </div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
          {step === 1 && (
            <>
              <p className="text-gray-600 mb-6">
                Choisissez tous les symptômes que vous ressentez actuellement
              </p>
              {/* Barre de recherche + filtres catégories */}
              <motion.div variants={itemVariants} className="flex flex-col gap-3 mb-6">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un symptôme..."
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-afriquadis-500 focus:border-afriquadis-400"
                />
                <div className="flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map(cat => (
                    <motion.button
                      variants={itemVariants}
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      whileTap={{ scale: 0.97 }}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        activeCategory === cat
                          ? 'bg-gradient-to-r from-afriquadis-500 to-darkBlue-600 text-white border-transparent'
                          : 'bg-white text-darkBlue-700 border-neutral-200 hover:border-afriquadis-300'
                      }`}
                    >
                      {cat === 'tous' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </motion.button>
                  ))}
              </div>
              </motion.div>

              <motion.div variants={containerVariants} className="grid gap-3">
              {filteredSymptoms.map((symptom) => (
                  <motion.div
                    variants={itemVariants}
                  key={symptom.id}
                  onClick={() => handleSymptomToggle(symptom.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      selectedSymptoms.has(symptom.id) 
                        ? 'border-afriquadis-500 bg-afriquadis-50 shadow-sm' 
                        : 'border-gray-200 hover:border-afriquadis-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="font-medium text-darkBlue-800">{symptom.name}</span>
                      <span className="ml-2 text-xs text-neutral-500">({symptom.category})</span>
                    </div>
                    {selectedSymptoms.has(symptom.id) && (
                      <svg className="w-5 h-5 text-afriquadis-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </motion.div>
                ))}
              </motion.div>

              <AnimatePresence>
                {selectedSymptoms.size > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-6 p-4 bg-gradient-to-r from-afriquadis-50 to-orange-50 rounded-xl border border-afriquadis-100">
                    <p className="text-afriquadis-800 font-medium">
                      {selectedSymptoms.size} symptôme(s) sélectionné(s)
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-gray-600 mb-6">
                Pour chaque symptôme, indiquez son intensité
              </p>

              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                {selectedSymptomsArray.map((symptomId) => {
                  const symptom = COMMON_SYMPTOMS.find(s => s.id === symptomId);
                  const currentIntensity = symptomIntensities[symptomId];

                  return (
                    <motion.div variants={itemVariants} key={symptomId} className="border border-gray-200 rounded-xl p-4 bg-white">
                      <h3 className="font-semibold text-darkBlue-800 mb-3">{symptom?.name}</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {INTENSITY_LEVELS.map((level) => (
                          <motion.button
                            key={level.value}
                            onClick={() => handleIntensityChange(symptomId, level.value)}
                            whileTap={{ scale: 0.97 }}
                            className={`p-3 rounded-xl border-2 transition-all duration-200 w-full ${
                              currentIntensity === level.value
                                ? 'border-afriquadis-500 bg-gradient-to-br from-afriquadis-50 via-orange-50 to-darkBlue-50 ' + level.color
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-1">{level.emoji}</div>
                              <div className="font-medium text-sm text-darkBlue-700">{level.label}</div>
                  </div>
                          </motion.button>
        ))}
      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <motion.button 
              onClick={handlePrevious}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-6 py-3 text-darkBlue-700 hover:text-darkBlue-900 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Précédent</span>
            </motion.button>

            <motion.button 
              onClick={handleNext}
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                (step === 1 ? canProceedStep1 : canProceedStep2)
                  ? 'bg-gradient-to-r from-afriquadis-600 via-orange-500 to-darkBlue-600 hover:from-afriquadis-700 hover:via-orange-600 hover:to-darkBlue-700 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{step === 2 ? 'Analyser' : 'Suivant'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}