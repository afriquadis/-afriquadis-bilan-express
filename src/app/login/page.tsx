'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulation de connexion utilisateur
      // TODO: Implémenter la vraie logique d'authentification avec NextAuth
      if (email && password) {
        // Vérification admin pour le développement
        if (email === 'admin@afriquadis.com' && password === 'admin123') {
          sessionStorage.setItem('isAdmin', 'true');
          router.push('/admin');
        } else {
          // Redirection vers la page de diagnostic après connexion
          router.push('/diagnostic');
        }
    } else {
        setError('Veuillez remplir tous les champs.');
      }
    } catch (error) {
      setError('Erreur lors de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-afriquadis-50 via-orange-50 to-darkBlue-50 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-darkBlue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-afriquadis-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
            {/* Logo et titre */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-afriquadis-500 via-orange-500 to-darkBlue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-3xl text-white font-bold">A</span>
              </div>
              <h1 className="text-2xl font-bold text-darkBlue-800">Connexion</h1>
              <p className="text-gray-600 mt-2">Accédez à votre espace personnel</p>
            </div>

            {/* Formulaire de connexion */}
        <form onSubmit={handleLogin} className="space-y-6">        
          <div>
                <label htmlFor="email" className="block text-sm font-semibold text-darkBlue-700 mb-2">
                  Email *
                </label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afriquadis-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-darkBlue-700 mb-2">
                  Mot de passe *
                </label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}        
                  placeholder="Votre mot de passe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afriquadis-500 focus:border-transparent transition-colors"
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
                    : 'bg-gradient-to-r from-afriquadis-600 to-darkBlue-600 hover:from-afriquadis-700 hover:to-darkBlue-700 focus:ring-2 focus:ring-afriquadis-500 focus:ring-offset-2 shadow-lg'
                } text-white`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connexion en cours...
                  </span>
                ) : (
                  'Se connecter'
                )}
            </button>
            </form>

            {/* Liens utiles */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-afriquadis-600 hover:text-afriquadis-700 font-semibold">
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* Accès admin en mode dev */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 text-center">
                  <strong>Mode Développement:</strong><br/>
                  Admin: admin@afriquadis.com / admin123
                </p>
              </div>
            )}

            {/* Mode invité */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm text-center mb-3">
                Ou continuez sans compte
              </p>
              <Link 
                href="/diagnostic"
                className="block w-full py-3 px-6 bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-700 font-semibold rounded-lg transition-all duration-300 text-center border border-orange-200 shadow-sm"
              >
                Mode Invité - Commencer le diagnostic
              </Link>
            </div>
          </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
