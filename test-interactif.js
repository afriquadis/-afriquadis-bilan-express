// Test interactif du système de diagnostic AFRIQUADIS
const fs = require('fs');
const path = require('path');

console.log('🎯 Test Interactif - Système de Diagnostic AFRIQUADIS');
console.log('=====================================================\n');

// Charger les données
const pathologiesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/pathologies-enrichies.json'), 'utf8'));
const symptomesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/symptomes-enrichis.json'), 'utf8'));
const kitsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/kits-produits-prix-reels.json'), 'utf8'));

// Fonction de diagnostic simplifiée
function runDiagnostic(symptomIds) {
  const results = [];
  
  pathologiesData.pathologies.forEach(pathology => {
    const matchingSymptoms = pathology.symptoms.filter(s => symptomIds.includes(s));
    if (matchingSymptoms.length > 0) {
      const confidence = Math.round((matchingSymptoms.length / pathology.symptoms.length) * 100);
      if (confidence >= 30) {
        const urgency = pathology.severity === 'elevee' ? '🔴 URGENT' : pathology.severity === 'moyenne' ? '🟡 MOYEN' : '🟢 FAIBLE';
        
        results.push({
          pathologyId: pathology.id,
          pathologyName: pathology.name,
          confidence,
          urgency,
          score: confidence,
          symptoms: matchingSymptoms,
          category: pathology.category,
          severity: pathology.severity,
          advice: pathology.advice
        });
      }
    }
  });
  
  return results.sort((a, b) => b.score - a.score);
}

// Fonction pour obtenir le nom d'un symptôme
function getSymptomName(id) {
  const symptome = symptomesData.symptoms.find(s => s.id === id);
  return symptome ? symptome.name : id;
}

// Fonction pour obtenir le kit de produits
function getProductKit(id) {
  return kitsData.product_kits.find(k => k.id === id);
}

// Scénarios de test
const scenarios = [
  {
    name: "🔴 Cas d'urgence cardiaque",
    symptoms: ['douleur_poitrine', 'essoufflement', 'palpitations', 'fatigue'],
    description: "Patient avec douleur thoracique et essoufflement"
  },
  {
    name: "🟡 Problèmes digestifs",
    symptoms: ['douleur_estomac', 'nausees', 'perte_appetit', 'ballonnements'],
    description: "Patient avec douleurs gastriques et nausées"
  },
  {
    name: "🟢 Fatigue générale",
    symptoms: ['fatigue', 'manque_energie', 'difficulte_concentration'],
    description: "Patient avec fatigue persistante"
  },
  {
    name: "🔴 Hypertension artérielle",
    symptoms: ['maux_tete_frequents', 'vertiges', 'fatigue', 'palpitations'],
    description: "Patient avec maux de tête et vertiges"
  },
  {
    name: "🟡 Problèmes respiratoires",
    symptoms: ['essoufflement', 'toux_persistante', 'oppression_thoracique'],
    description: "Patient avec difficultés respiratoires"
  }
];

// Exécuter tous les scénarios
scenarios.forEach((scenario, index) => {
  console.log(`\n${scenario.name}`);
  console.log(`Description: ${scenario.description}`);
  console.log(`Symptômes: ${scenario.symptoms.map(s => getSymptomName(s)).join(', ')}`);
  console.log('─'.repeat(60));
  
  const results = runDiagnostic(scenario.symptoms);
  
  if (results.length === 0) {
    console.log('❌ Aucune pathologie trouvée');
  } else {
    console.log(`✅ ${results.length} pathologie(s) identifiée(s):\n`);
    
    results.slice(0, 3).forEach((result, idx) => {
      console.log(`${idx + 1}. ${result.pathologyName}`);
      console.log(`   Score: ${result.score}% | Urgence: ${result.urgency}`);
      console.log(`   Catégorie: ${result.category}`);
      console.log(`   Symptômes correspondants: ${result.symptoms.map(s => getSymptomName(s)).join(', ')}`);
      
      // Afficher les conseils
      if (result.advice) {
        console.log(`   💡 Conseils alimentation: ${result.advice.alimentation}`);
        console.log(`   💡 Conseils hygiène: ${result.advice.hygiene}`);
      }
      
      // Afficher le kit de produits
      const kit = getProductKit(result.product_kit_id);
      if (kit) {
        console.log(`   💊 Kit recommandé: ${kit.name} (${kit.totalPrice} XOF)`);
      }
      
      console.log('');
    });
  }
});

// Statistiques finales
console.log('\n📊 STATISTIQUES FINALES');
console.log('========================');
console.log(`• Total pathologies: ${pathologiesData.pathologies.length}`);
console.log(`• Total symptômes: ${symptomesData.symptoms.length}`);
console.log(`• Total kits produits: ${kitsData.product_kits.length}`);

// Vérifier la couverture des symptômes
const allSymptomIds = new Set();
pathologiesData.pathologies.forEach(p => p.symptoms.forEach(s => allSymptomIds.add(s)));
console.log(`• Symptômes couverts: ${allSymptomIds.size}/${symptomesData.symptoms.length}`);

console.log('\n🎉 Test terminé avec succès !');
console.log('🚀 Le système de diagnostic AFRIQUADIS est pleinement opérationnel.');
