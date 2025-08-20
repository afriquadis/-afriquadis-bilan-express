'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Button from './Button';

interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: 'nutrition' | 'exercice' | 'sommeil' | 'stress' | 'prévention';
  priority: 'high' | 'medium' | 'low';
  icon: string;
  duration?: string;
}

const HEALTH_TIPS: HealthTip[] = [
  {
    id: '1',
    title: 'Hydratation quotidienne',
    content: 'Buvez au moins 8 verres d\'eau par jour pour maintenir une bonne hydratation. L\'eau aide à éliminer les toxines et améliore la digestion.',
    category: 'nutrition',
    priority: 'high',
    icon: '💧',
    duration: 'Toute la journée'
  },
  {
    id: '2',
    title: 'Marche matinale',
    content: 'Une marche de 20-30 minutes chaque matin stimule la circulation sanguine et améliore l\'humeur grâce à la libération d\'endorphines.',
    category: 'exercice',
    priority: 'high',
    icon: '🚶‍♂️',
    duration: '20-30 min'
  },
  {
    id: '3',
    title: 'Tisanes AFRIQUADIS',
    content: 'Consommez nos tisanes naturelles le soir pour favoriser la détente et améliorer la qualité du sommeil.',
    category: 'nutrition',
    priority: 'medium',
    icon: '🌿',
    duration: 'Avant le coucher'
  },
  {
    id: '4',
    title: 'Respiration profonde',
    content: 'Pratiquez 5 minutes de respiration profonde pour réduire le stress et l\'anxiété. Inspirez 4 sec, retenez 4 sec, expirez 6 sec.',
    category: 'stress',
    priority: 'high',
    icon: '🧘‍♀️',
    duration: '5 minutes'
  },
  {
    id: '5',
    title: 'Sommeil réparateur',
    content: 'Maintenez un horaire de sommeil régulier de 7-8 heures. Évitez les écrans 1h avant le coucher.',
    category: 'sommeil',
    priority: 'high',
    icon: '😴',
    duration: '7-8 heures'
  },
  {
    id: '6',
    title: 'Alimentation équilibrée',
    content: 'Privilégiez les fruits et légumes locaux, riches en vitamines et antioxydants naturels.',
    category: 'nutrition',
    priority: 'medium',
    icon: '🥗',
    duration: 'À chaque repas'
  },
  {
    id: '7',
    title: 'Étirements quotidiens',
    content: 'Effectuez 10 minutes d\'étirements pour maintenir la flexibilité et prévenir les tensions musculaires.',
    category: 'exercice',
    priority: 'medium',
    icon: '🤸‍♀️',
    duration: '10 minutes'
  },
  {
    id: '8',
    title: 'Lavage des mains',
    content: 'Lavez-vous les mains régulièrement avec du savon pendant 20 secondes pour prévenir les infections.',
    category: 'prévention',
    priority: 'high',
    icon: '🧼',
    duration: '20 secondes'
  }
];

export default function HealthTips() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedTips, setCompletedTips] = useState<Set<string>>(new Set());
  const [dailyTips, setDailyTips] = useState<HealthTip[]>([]);

  useEffect(() => {
    loadCompletedTips();
    generateDailyTips();
  }, []);

  const loadCompletedTips = () => {
    try {
      const saved = localStorage.getItem('aq_completed_health_tips');
      if (saved) {
        setCompletedTips(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.log('Erreur chargement conseils complétés:', error);
    }
  };

  const saveCompletedTips = (completed: Set<string>) => {
    try {
      localStorage.setItem('aq_completed_health_tips', JSON.stringify(Array.from(completed)));
      setCompletedTips(completed);
    } catch (error) {
      console.log('Erreur sauvegarde conseils complétés:', error);
    }
  };

  const generateDailyTips = () => {
    // Sélectionner 3 conseils de haute priorité pour la journée
    const highPriorityTips = HEALTH_TIPS.filter(tip => tip.priority === 'high');
    const randomTips = highPriorityTips.sort(() => 0.5 - Math.random()).slice(0, 3);
    setDailyTips(randomTips);
  };

  const toggleTipCompletion = (tipId: string) => {
    const newCompleted = new Set(completedTips);
    if (newCompleted.has(tipId)) {
      newCompleted.delete(tipId);
    } else {
      newCompleted.add(tipId);
    }
    saveCompletedTips(newCompleted);
  };

  const categories = [
    { id: 'all', name: 'Tous', icon: '🌟' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
    { id: 'exercice', name: 'Exercice', icon: '💪' },
    { id: 'sommeil', name: 'Sommeil', icon: '😴' },
    { id: 'stress', name: 'Stress', icon: '🧘' },
    { id: 'prévention', name: 'Prévention', icon: '🛡️' }
  ];

  const filteredTips = selectedCategory === 'all' 
    ? HEALTH_TIPS 
    : HEALTH_TIPS.filter(tip => tip.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-green-500 bg-green-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'bg-green-100 text-green-700';
      case 'exercice': return 'bg-blue-100 text-blue-700';
      case 'sommeil': return 'bg-purple-100 text-purple-700';
      case 'stress': return 'bg-orange-100 text-orange-700';
      case 'prévention': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const completionRate = Math.round((completedTips.size / HEALTH_TIPS.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-darkBlue-800">
          💡 Conseils Santé Personnalisés
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-500">Progression</div>
          <div className={`font-bold text-lg ${
            completionRate >= 80 ? 'text-green-600' :
            completionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {completionRate}%
          </div>
        </div>
      </div>

      {/* Conseils du jour */}
      <Card padding="lg" className="bg-gradient-to-r from-afriquadis-50 to-orange-50 border-2 border-afriquadis-200">
        <h3 className="font-semibold text-darkBlue-800 mb-4 flex items-center gap-2">
          ⭐ Conseils du jour
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg border border-white/50"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{tip.icon}</span>
                <h4 className="font-medium text-darkBlue-700">{tip.title}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">{tip.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{tip.duration}</span>
                <button
                  onClick={() => toggleTipCompletion(tip.id)}
                  className={`text-sm px-3 py-1 rounded-full transition-all ${
                    completedTips.has(tip.id)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {completedTips.has(tip.id) ? '✓ Fait' : 'Marquer'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
              selectedCategory === category.id
                ? 'bg-afriquadis-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-afriquadis-300'
            }`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Liste des conseils */}
      <div className="space-y-4">
        {filteredTips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              padding="lg" 
              hover 
              className={`border-l-4 ${getPriorityColor(tip.priority)} ${
                completedTips.has(tip.id) ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{tip.icon}</span>
                    <h3 className={`font-semibold text-darkBlue-800 ${
                      completedTips.has(tip.id) ? 'line-through' : ''
                    }`}>
                      {tip.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(tip.category)}`}>
                      {tip.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{tip.content}</p>
                  {tip.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>⏱️</span>
                      <span>{tip.duration}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toggleTipCompletion(tip.id)}
                  className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    completedTips.has(tip.id)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-afriquadis-100 text-afriquadis-700 hover:bg-afriquadis-200'
                  }`}
                >
                  {completedTips.has(tip.id) ? '✓ Complété' : 'Marquer comme fait'}
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
