'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DiagnosticHistory from '@/components/DiagnosticHistory';
import SymptomTracker from '@/components/SymptomTracker';
import HealthTips from '@/components/HealthTips';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';

type TabType = 'overview' | 'history' | 'tracker' | 'tips';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, name: 'Vue d\'ensemble', icon: '📊' },
    { id: 'history' as TabType, name: 'Historique', icon: '📋' },
    { id: 'tracker' as TabType, name: 'Suivi', icon: '📈' },
    { id: 'tips' as TabType, name: 'Conseils', icon: '💡' }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="lg" className="bg-gradient-to-br from-afriquadis-50 to-afriquadis-100 border-2 border-afriquadis-200">
          <div className="text-center">
            <div className="text-3xl mb-2">🩺</div>
            <h3 className="font-semibold text-darkBlue-800 mb-1">Diagnostics</h3>
            <p className="text-2xl font-bold text-afriquadis-600">12</p>
            <p className="text-sm text-gray-600">Cette année</p>
          </div>
        </Card>

        <Card padding="lg" className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-darkBlue-800 mb-1">Symptômes</h3>
            <p className="text-2xl font-bold text-orange-600">5</p>
            <p className="text-sm text-gray-600">En suivi</p>
          </div>
        </Card>

        <Card padding="lg" className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
          <div className="text-center">
            <div className="text-3xl mb-2">💡</div>
            <h3 className="font-semibold text-darkBlue-800 mb-1">Conseils</h3>
            <p className="text-2xl font-bold text-green-600">85%</p>
            <p className="text-sm text-gray-600">Complétés</p>
          </div>
        </Card>

        <Card padding="lg" className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-darkBlue-800 mb-1">Objectifs</h3>
            <p className="text-2xl font-bold text-blue-600">3/5</p>
            <p className="text-sm text-gray-600">Atteints</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <h3 className="font-semibold text-darkBlue-800 mb-4 flex items-center gap-2">
            📈 Évolution Récente
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Maux de tête</p>
                <p className="text-sm text-green-600">Amélioration continue</p>
              </div>
              <div className="text-2xl">📈</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-800">Fatigue</p>
                <p className="text-sm text-yellow-600">Stable</p>
              </div>
              <div className="text-2xl">➡️</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-800">Sommeil</p>
                <p className="text-sm text-blue-600">En amélioration</p>
              </div>
              <div className="text-2xl">📈</div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="font-semibold text-darkBlue-800 mb-4 flex items-center gap-2">
            🎯 Actions Recommandées
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-afriquadis-50 rounded-lg">
              <span className="text-xl">💧</span>
              <div className="flex-1">
                <p className="font-medium text-darkBlue-800">Hydratation</p>
                <p className="text-sm text-gray-600">Boire 2L d\'eau aujourd\'hui</p>
              </div>
              <Button size="sm" variant="primary">Fait</Button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <span className="text-xl">🚶‍♂️</span>
              <div className="flex-1">
                <p className="font-medium text-darkBlue-800">Exercice</p>
                <p className="text-sm text-gray-600">Marche de 30 minutes</p>
              </div>
              <Button size="sm" variant="secondary">À faire</Button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <span className="text-xl">🌿</span>
              <div className="flex-1">
                <p className="font-medium text-darkBlue-800">Tisane AFRIQUADIS</p>
                <p className="text-sm text-gray-600">Tisane relaxante ce soir</p>
              </div>
              <Button size="sm" variant="secondary">Planifier</Button>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="lg" className="bg-gradient-to-r from-darkBlue-50 to-afriquadis-50 border-2 border-darkBlue-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-darkBlue-800 mb-2">
            🚀 Prêt pour un nouveau diagnostic ?
          </h3>
          <p className="text-gray-600 mb-4">
            Analysez vos symptômes actuels avec notre IA avancée
          </p>
          <Link href="/diagnostic">
            <Button variant="primary" size="lg">
              Commencer un Diagnostic
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-darkBlue-800 mb-2">
          🏥 Tableau de Bord Santé AFRIQUADIS
        </h1>
        <p className="text-gray-600">
          Suivez votre santé et gérez vos diagnostics en un seul endroit
        </p>
      </div>

      {/* Navigation par onglets */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-afriquadis-500 text-afriquadis-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'history' && <DiagnosticHistory />}
        {activeTab === 'tracker' && <SymptomTracker />}
        {activeTab === 'tips' && <HealthTips />}
      </motion.div>
    </div>
  );
}
