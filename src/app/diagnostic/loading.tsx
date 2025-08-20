/**
 * Page de chargement pour la route /diagnostic
 * Évite un écran blanc pendant le chargement des chunks
 */
export default function LoadingDiagnostic() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="text-gray-600">Chargement du bilan médical...</p>
      </div>
    </main>
  );
}
