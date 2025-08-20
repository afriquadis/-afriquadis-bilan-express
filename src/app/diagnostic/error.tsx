"use client";

/**
 * Error Boundary local pour la route /diagnostic
 * Gère les erreurs spécifiques au module de diagnostic
 */
export default function DiagnosticError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void; 
}) {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2 text-red-800">
          Une erreur est survenue dans le bilan
        </h2>
        <p className="mb-4 text-red-700">{error.message}</p>
        <div className="space-x-4">
          <button 
            onClick={() => reset()} 
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
          <button 
            onClick={() => window.location.href = '/'} 
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </main>
  );
}
