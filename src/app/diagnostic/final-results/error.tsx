"use client";

/**
 * Error Boundary local pour la route /diagnostic/final-results
 * Gère les erreurs spécifiques à la page des résultats finales
 */
export default function FinalResultsError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void; 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          
          <h1 className="text-xl font-bold text-red-800 mb-4">
            Erreur lors de l'affichage des résultats
          </h1>
          
          <p className="text-red-600 mb-6">
            {error.message || "Une erreur inattendue s'est produite lors de l'affichage de vos résultats de diagnostic."}
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
              Recommencer le diagnostic
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
              💡 <strong>Conseil :</strong> Si le problème persiste, contactez notre support technique via WhatsApp ou téléphone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
