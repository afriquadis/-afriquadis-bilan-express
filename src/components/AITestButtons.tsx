'use client';

import { useState } from 'react';

export default function AITestButtons() {
  const [isTesting, setIsTesting] = useState(false);

  const handleSimpleTest = async () => {
    try {
      setIsTesting(true);
      console.log('🧪 Test du moteur IA AFRIQUADIS...');
      
      // Test avec des symptômes simples
      const testSymptoms = ['fievre', 'frissons', 'fatigue_extreme'];
      console.log('Symptômes de test:', testSymptoms);
      
      // Import dynamique pour éviter les erreurs de build
      const { quickSymptomAnalysis, runDiagnostic } = await import('@/lib/diagnosticEngine');
      
      console.log('📊 Test de l\'analyse des symptômes...');
      const analysis = quickSymptomAnalysis(testSymptoms);
      console.log('Résultat de l\'analyse:', analysis);
      
      console.log('🔍 Test du diagnostic complet...');
      const diagnostic = await runDiagnostic(testSymptoms);
      console.log('Résultats du diagnostic:', diagnostic);
      
      if (diagnostic.length > 0) {
        console.log('🎯 Top diagnostic:', {
          pathologieId: diagnostic[0].pathologyId,
          score: diagnostic[0].score,
          confiance: diagnostic[0].confidence,
          urgence: diagnostic[0].urgency
        });
      } else {
        console.log('⚠️ Aucun diagnostic trouvé - test avec symptômes différents...');
        
        // Test avec d'autres symptômes
        const alternativeSymptoms = ['nausees', 'douleurs_abdominales'];
        console.log('Test avec symptômes alternatifs:', alternativeSymptoms);
        const altDiagnostic = runDiagnostic(alternativeSymptoms);
        console.log('Résultats alternatifs:', altDiagnostic);
      }
      
      console.log('✅ Test IA terminé avec succès !');
      alert('Test IA terminé ! Vérifiez la console pour les résultats.');
    } catch (error) {
      console.error('❌ Erreur lors du test IA:', error);
      alert('Erreur lors du test IA. Vérifiez la console.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleCompleteTest = async () => {
    try {
      setIsTesting(true);
      console.log('🚀 Lancement du test complet IA...');
      
      const { testAIEngineComprehensive } = await import('@/lib/aiTest');
      const results = testAIEngineComprehensive();
      
      if (results.success) {
        alert(`🎉 Test complet réussi !\n\nDiagnostics trouvés: ${results.diagnosticsFound}\nTaux de succès: ${results.successRate.toFixed(1)}%\nScore moyen: ${results.averageScore.toFixed(1)}%\n\nVérifiez la console pour les détails.`);
      } else {
        alert(`❌ Test complet échoué !\n\nAucun diagnostic trouvé.\nVérifiez la console pour les détails.`);
      }
    } catch (error) {
      console.error('❌ Erreur lors du test complet IA:', error);
      alert('Erreur lors du test complet IA. Vérifiez la console.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="text-center mb-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={handleSimpleTest}
          disabled={isTesting}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTesting ? '⏳ Test en cours...' : '🧪 Test Simple IA'}
        </button>
        
        <button
          onClick={handleCompleteTest}
          disabled={isTesting}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTesting ? '⏳ Test en cours...' : '🚀 Test Complet IA'}
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Testez le système d'intelligence artificielle (vérifiez la console pour les résultats)
      </p>
    </div>
  );
}
