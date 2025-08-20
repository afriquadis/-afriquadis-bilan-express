"use client";
import { useState, useEffect } from 'react';
import type { AdminUser, Analytics } from '@/types';

interface AdminPanelProps {
  adminUser: AdminUser;
}

export default function AdminPanel({ adminUser }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'diagnostics' | 'pathologies' | 'analytics'>('dashboard');
  const [analytics, setAnalytics] = useState<Analytics>({
    totalDiagnostics: 0,
    totalUsers: 0,
    popularPathologies: [],
    conversionRate: 0,
    averageSessionDuration: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
    loadUsers();
    loadDiagnostics();
  }, []);

  const loadAnalytics = async () => {
    // Simulation de données analytics
    setAnalytics({
      totalDiagnostics: 1247,
      totalUsers: 892,
      popularPathologies: [
        { pathologyId: 'P001', count: 156, percentage: 12.5 },
        { pathologyId: 'P002', count: 134, percentage: 10.7 },
        { pathologyId: 'P003', count: 98, percentage: 7.9 }
      ],
      conversionRate: 78.5,
      averageSessionDuration: 4.2
    });
  };

  const loadUsers = async () => {
    // Simulation de données utilisateurs
    setUsers([
      { id: '1', name: 'Jean Dupont', email: 'jean@example.com', createdAt: '2024-01-15', lastLogin: '2024-01-20', status: 'active' },
      { id: '2', name: 'Marie Martin', email: 'marie@example.com', createdAt: '2024-01-10', lastLogin: '2024-01-19', status: 'active' }
    ]);
  };

  const loadDiagnostics = async () => {
    // Simulation de données diagnostics
    setDiagnostics([
      { id: '1', userId: '1', pathology: 'Paludisme', score: 85, date: '2024-01-20' },
      { id: '2', userId: '2', pathology: 'Anémie', score: 72, date: '2024-01-19' }
    ]);
  };

  const getPathologyName = (pathologyId: string) => {
    const pathologyNames: { [key: string]: string } = {
      'P001': 'Paludisme',
      'P002': 'Diabète',
      'P003': 'Anémie',
      'P004': 'Ulcère gastrique',
      'P005': 'Fatigue chronique'
    };
    return pathologyNames[pathologyId] || pathologyId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AFRIQUADIS Admin</h1>
                <p className="text-sm text-gray-600">Panel d'administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Connecté en tant que <span className="font-semibold">{adminUser.name}</span>
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                adminUser.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {adminUser.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation des onglets */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
              { id: 'users', label: 'Utilisateurs', icon: '👥' },
              { id: 'diagnostics', label: 'Diagnostics', icon: '🔍' },
              { id: 'pathologies', label: 'Pathologies', icon: '🏥' },
              { id: 'analytics', label: 'Analytics', icon: '📈' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Diagnostics</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalDiagnostics}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Durée moyenne</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.averageSessionDuration}min</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pathologies populaires */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pathologies les plus diagnostiquées</h3>
              <div className="space-y-4">
                {analytics.popularPathologies.map((pathology, index) => (
                  <div key={pathology.pathologyId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </span>
                      <span className="ml-3 font-medium text-gray-900">
                        {getPathologyName(pathology.pathologyId)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{pathology.count} diagnostics</span>
                      <span className="text-sm font-medium text-green-600">{pathology.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Gestion des utilisateurs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-green-600 hover:text-green-900 mr-3">Voir</button>
                        <button className="text-red-600 hover:text-red-900">Suspendre</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Historique des diagnostics</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pathologie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {diagnostics.map(diagnostic => (
                    <tr key={diagnostic.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{diagnostic.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">User #{diagnostic.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{diagnostic.pathology}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          diagnostic.score >= 80 ? 'bg-green-100 text-green-800' :
                          diagnostic.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {diagnostic.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{diagnostic.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">Détails</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pathologies' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Gestion des pathologies</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  + Ajouter une pathologie
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: 'P001', name: 'Paludisme', symptoms: 8, products: 3 },
                  { id: 'P002', name: 'Diabète', symptoms: 6, products: 2 },
                  { id: 'P003', name: 'Anémie', symptoms: 5, products: 2 },
                  { id: 'P004', name: 'Ulcère gastrique', symptoms: 7, products: 2 },
                  { id: 'P005', name: 'Fatigue chronique', symptoms: 4, products: 1 }
                ].map(pathology => (
                  <div key={pathology.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{pathology.name}</h4>
                      <span className="text-xs text-gray-500">ID: {pathology.id}</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>📋 {pathology.symptoms} symptômes</div>
                      <div>💊 {pathology.products} produits</div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">Modifier</button>
                      <button className="text-red-600 hover:text-red-900 text-sm">Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Graphique des diagnostics par jour */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagnostics par jour</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Graphique des diagnostics (simulation)</p>
                </div>
              </div>

              {/* Répartition par pathologie */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par pathologie</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Graphique en camembert (simulation)</p>
                </div>
              </div>
            </div>

            {/* Métriques détaillées */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques détaillées</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">78.5%</div>
                  <div className="text-sm text-gray-600">Taux de conversion</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4.2min</div>
                  <div className="text-sm text-gray-600">Durée moyenne de session</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">85%</div>
                  <div className="text-sm text-gray-600">Satisfaction utilisateur</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
