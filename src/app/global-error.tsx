'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Erreur critique
              </h1>
              
              <p className="text-gray-600 mb-6">
                Une erreur critique est survenue dans l'application. Cette erreur empêche le fonctionnement normal.
              </p>

              {process.env.NODE_ENV === 'development' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-red-800 mb-2">Erreur critique (dev) :</h3>
                  <pre className="text-xs text-red-700 overflow-auto max-h-32 whitespace-pre-wrap">
                    {error.message}
                  </pre>
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Recharger l'application
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Retour à l'accueil
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-6">
                Erreur globale - Contactez le support si cela persiste
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
