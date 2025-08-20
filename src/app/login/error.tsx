"use client";

/**
 * Error Boundary local pour la route /login
 * Gère les erreurs spécifiques à la page de connexion
 */
export default function LoginError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void; 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          
          <h1 className="text-xl font-bold text-red-800 mb-4">
            Erreur lors de la connexion
          </h1>
          
          <p className="text-red-600 mb-6">
            {error.message || "Une erreur s'est produite lors de la connexion."}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Réessayer
            </button>
            
            <button
              onClick={() => window.location.href = '/diagnostic'}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Mode Invité - Continuer
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Conseil :</strong> Vous pouvez continuer en mode invité sans créer de compte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
