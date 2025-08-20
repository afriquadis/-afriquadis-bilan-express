'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAccessPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Vérification du mot de passe administrateur
      // TODO: Remplacer par une authentification sécurisée
      if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
        sessionStorage.setItem('isAdmin', 'true');
        router.push('/admin');
      } else {
        setError('Mot de passe administrateur incorrect.');
      }
    } catch (error) {
      setError('Erreur lors de la connexion administrateur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-darkBlue-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-darkBlue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2 border-red-200">
          {/* Icône d'avertissement */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-darkBlue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-red-800">Accès Administrateur</h1>
            <p className="text-red-600 mt-2">Zone sécurisée - Accès restreint</p>
          </div>

          {/* Avertissement de sécurité */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700 text-center">
              <strong>⚠️ ATTENTION :</strong> Cette page est réservée aux administrateurs autorisés uniquement.
            </p>
          </div>

          {/* Formulaire de connexion administrateur */}
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-semibold text-red-700 mb-2">
                Mot de passe administrateur *
              </label>
              <input 
                id="adminPassword" 
                name="adminPassword" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe administrateur"
                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 via-orange-600 to-darkBlue-600 hover:from-red-700 hover:via-orange-700 hover:to-darkBlue-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg'
              } text-white`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion en cours...
                </span>
              ) : (
                'Accéder à l\'administration'
              )}
            </button>
          </form>

          {/* Retour à l'accueil */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              ← Retour à l'accueil
            </button>
          </div>

          {/* Note de sécurité */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Cette page n'est pas accessible depuis l'interface utilisateur pour des raisons de sécurité.
              <br />
              L'accès administrateur se fait uniquement via lien direct.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
