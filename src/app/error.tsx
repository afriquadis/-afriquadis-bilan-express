'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// ErrorBoundary global - Fallback quand un chunk échoue à se charger
// Affiche un message clair et un bouton "Réessayer" au lieu de planter l'application
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log l'erreur pour debugging
    console.error('Application Error:', error);
  }, [error]);

  // Détection spécifique des erreurs de ChunkLoadError
  const isChunkError = error.message.includes('ChunkLoadError') || 
                      error.message.includes('Loading chunk') ||
                      error.message.includes('failed');

  const handleReload = () => {
    // Vider le cache du navigateur et recharger complètement
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
      });
    }
    window.location.reload();
  };

  const handleRetry = () => {
    // D'abord essayer reset() de React, sinon reload complet
    try {
      reset();
    } catch {
      handleReload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isChunkError ? 'Erreur de chargement' : 'Erreur d\'application'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {isChunkError 
            ? 'Un problème de réseau ou de cache est survenu. Veuillez recharger la page.' 
            : 'Une erreur inattendue s\'est produite. Vous pouvez essayer de recharger la page.'}
        </p>

        {/* Détails de l'erreur en mode développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-red-800 mb-2">Détails de l'erreur (dev) :</h3>
            <pre className="text-xs text-red-700 overflow-auto max-h-32 whitespace-pre-wrap">
              {error.message}
            </pre>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={isChunkError ? handleReload : handleRetry}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isChunkError ? 'Recharger la page' : 'Réessayer'}
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Accueil
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Si le problème persiste, videz le cache de votre navigateur (Ctrl+Shift+R)
        </p>
      </div>
    </div>
  );
}