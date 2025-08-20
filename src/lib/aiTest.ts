// Test avancé du moteur IA AFRIQUADIS
import { quickSymptomAnalysis, runDiagnostic } from './diagnosticEngine';

export function testAIEngineComprehensive() {
  console.log('🧪 Test Complet du Moteur IA AFRIQUADIS...');
  console.log('=' .repeat(60));
  
  const testResults = {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    diagnosticsFound: 0,
    averageScore: 0,
    totalScore: 0
  };

  // Test 1: Symptômes grippaux
  console.log('\n📋 Test 1: Symptômes grippaux');
  const fluSymptoms = ['fievre', 'frissons', 'fatigue_extreme', 'courbatures'];
  testResults.totalTests++;
  
  try {
    const analysis = quickSymptomAnalysis(fluSymptoms);
    const diagnostic = runDiagnostic(fluSymptoms);
    
    if (Array.isArray(analysis) && analysis.length > 0) {
      console.log('✅ Analyse des symptômes: SUCCÈS');
      testResults.passedTests++;
    } else {
      console.log('❌ Analyse des symptômes: ÉCHEC');
      testResults.failedTests++;
    }
    
    if (Array.isArray(diagnostic) && diagnostic.length > 0) {
      console.log('✅ Diagnostic trouvé:', diagnostic.length, 'pathologies');
      testResults.diagnosticsFound += diagnostic.length;
      testResults.passedTests++;
      
      diagnostic.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.pathology.name} (Score: ${result.score}%)`);
        testResults.totalScore += result.score;
      });
    } else {
      console.log('❌ Aucun diagnostic trouvé pour les symptômes grippaux');
      testResults.failedTests++;
    }
  } catch (error) {
    console.error('💥 Erreur lors du test grippal:', error);
    testResults.failedTests++;
  }

  // Test 2: Symptômes digestifs
  console.log('\n📋 Test 2: Symptômes digestifs');
  const digestiveSymptoms = ['nausees', 'douleurs_abdominales', 'perte_appetit'];
  testResults.totalTests++;
  
  try {
    console.log('Analysis:', quickSymptomAnalysis(digestiveSymptoms));
    const diagnostic = runDiagnostic(digestiveSymptoms);
    
    if (Array.isArray(diagnostic) && diagnostic.length > 0) {
      console.log('✅ Diagnostic digestif trouvé:', diagnostic.length, 'pathologies');
      testResults.diagnosticsFound += diagnostic.length;
      testResults.passedTests++;
      
      diagnostic.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.pathology.name} (Score: ${result.score}%)`);
        testResults.totalScore += result.score;
      });
    } else {
      console.log('❌ Aucun diagnostic trouvé pour les symptômes digestifs');
      testResults.failedTests++;
    }
  } catch (error) {
    console.error('💥 Erreur lors du test digestif:', error);
    testResults.failedTests++;
  }

  // Test 3: Symptômes respiratoires
  console.log('\n📋 Test 3: Symptômes respiratoires');
  const respiratorySymptoms = ['toux_persistante', 'mal_gorge', 'congestion_nasale'];
  testResults.totalTests++;
  
  try {
    const diagnostic = runDiagnostic(respiratorySymptoms);
    
    if (Array.isArray(diagnostic) && diagnostic.length > 0) {
      console.log('✅ Diagnostic respiratoire trouvé:', diagnostic.length, 'pathologies');
      testResults.diagnosticsFound += diagnostic.length;
      testResults.passedTests++;
      
      diagnostic.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.pathology.name} (Score: ${result.score}%)`);
        testResults.totalScore += result.score;
      });
    } else {
      console.log('❌ Aucun diagnostic trouvé pour les symptômes respiratoires');
      testResults.failedTests++;
    }
  } catch (error) {
    console.error('💥 Erreur lors du test respiratoire:', error);
    testResults.failedTests++;
  }

  // Test 4: Symptômes mixtes
  console.log('\n📋 Test 4: Symptômes mixtes');
  const mixedSymptoms = ['fievre', 'nausees', 'fatigue_extreme'];
  testResults.totalTests++;
  
  try {
    const diagnostic = runDiagnostic(mixedSymptoms);
    
    if (Array.isArray(diagnostic) && diagnostic.length > 0) {
      console.log('✅ Diagnostic mixte trouvé:', diagnostic.length, 'pathologies');
      testResults.diagnosticsFound += diagnostic.length;
      testResults.passedTests++;
      
      diagnostic.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.pathology.name} (Score: ${result.score}%)`);
        testResults.totalScore += result.score;
      });
    } else {
      console.log('❌ Aucun diagnostic trouvé pour les symptômes mixtes');
      testResults.failedTests++;
    }
  } catch (error) {
    console.error('💥 Erreur lors du test mixte:', error);
    testResults.failedTests++;
  }

  // Test 5: Symptômes uniques
  console.log('\n📋 Test 5: Symptômes uniques');
  const uniqueSymptoms = ['maux_tete'];
  testResults.totalTests++;
  
  try {
    const diagnostic = runDiagnostic(uniqueSymptoms);
    
    if (Array.isArray(diagnostic) && diagnostic.length > 0) {
      console.log('✅ Diagnostic unique trouvé:', diagnostic.length, 'pathologies');
      testResults.diagnosticsFound += diagnostic.length;
      testResults.passedTests++;
      
      diagnostic.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.pathology.name} (Score: ${result.score}%)`);
        testResults.totalScore += result.score;
      });
    } else {
      console.log('❌ Aucun diagnostic trouvé pour les symptômes uniques');
      testResults.failedTests++;
    }
  } catch (error) {
    console.error('💥 Erreur lors du test unique:', error);
    testResults.failedTests++;
  }

  // Résultats finaux
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RÉSULTATS FINAUX DES TESTS IA');
  console.log('=' .repeat(60));
  
  testResults.averageScore = testResults.totalScore / Math.max(testResults.diagnosticsFound, 1);
  
  console.log(`Total des tests: ${testResults.totalTests}`);
  console.log(`Tests réussis: ${testResults.passedTests}`);
  console.log(`Tests échoués: ${testResults.failedTests}`);
  console.log(`Diagnostics trouvés: ${testResults.diagnosticsFound}`);
  console.log(`Score moyen: ${testResults.averageScore.toFixed(1)}%`);
  
  const successRate = (testResults.passedTests / testResults.totalTests) * 100;
  console.log(`Taux de succès: ${successRate.toFixed(1)}%`);
  
  if (testResults.diagnosticsFound > 0) {
    console.log('🎉 SUCCÈS: Le système IA trouve des diagnostics !');
  } else {
    console.log('❌ ÉCHEC: Aucun diagnostic trouvé par le système IA');
  }
  
  console.log('=' .repeat(60));
  
  return {
    success: testResults.diagnosticsFound > 0,
    diagnosticsFound: testResults.diagnosticsFound,
    successRate: successRate,
    averageScore: testResults.averageScore
  };
}

// Test rapide pour validation
export async function quickAITest() {
  console.log('🚀 Test Rapide IA...');
  
  const symptoms = ['fievre', 'fatigue_extreme'];
    const result = await runDiagnostic(symptoms);

  if (result.length > 0) {
    console.log('✅ Diagnostic trouvé:', result[0].pathologyId);
    return true;
  } else {
    console.log('❌ Aucun diagnostic trouvé');
    return false;
  }
}
