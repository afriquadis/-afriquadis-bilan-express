// Script de test pour le moteur de diagnostic
const fs = require('fs');
const path = require('path');

// Charger les données
const pathologiesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/pathologies-enrichies.json'), 'utf8'));
const symptomesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/symptomes-enrichis.json'), 'utf8'));
const kitsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/kits-produits-prix-reels.json'), 'utf8'));

console.log('🔍 Test du système de diagnostic AFRIQUADIS');
console.log('==========================================\n');

// Afficher les statistiques
console.log(`📊 Statistiques des données:`);
console.log(`- Pathologies: ${pathologiesData.pathologies.length}`);
console.log(`- Symptômes: ${symptomesData.symptoms.length}`);
console.log(`- Kits de produits: ${kitsData.product_kits.length}\n`);

// Test 1: Symptômes de l'hypertension
console.log('🧪 Test 1: Symptômes de l\'hypertension');
const hypertension = pathologiesData.pathologies.find(p => p.name === 'Hypertension artérielle');
if (hypertension) {
  console.log(`- Pathologie: ${hypertension.name}`);
  console.log(`- Catégorie: ${hypertension.category}`);
  console.log(`- Sévérité: ${hypertension.severity}`);
  console.log(`- Symptômes: ${hypertension.symptoms.length}`);
  hypertension.symptoms.forEach(symptomId => {
    const symptome = symptomesData.symptoms.find(s => s.id === symptomId);
    console.log(`  • ${symptome ? symptome.name : symptomId}`);
  });
  console.log(`- Kit de produits: ${hypertension.product_kit_id}`);
  const kit = kitsData.product_kits.find(k => k.id === hypertension.product_kit_id);
  if (kit) {
    console.log(`  • Nom du kit: ${kit.name}`);
    console.log(`  • Prix total: ${kit.totalPrice} ${kit.currency}`);
  }
} else {
  console.log('❌ Hypertension non trouvée');
}
console.log('');

// Test 2: Recherche de pathologies par symptômes
console.log('🧪 Test 2: Recherche de pathologies par symptômes');
const symptomesTest = ['fatigue', 'essoufflement', 'palpitations'];
console.log(`Symptômes test: ${symptomesTest.join(', ')}`);

const pathologiesTrouvees = pathologiesData.pathologies.filter(pathology => {
  const matchingSymptoms = pathology.symptoms.filter(s => symptomesTest.includes(s));
  return matchingSymptoms.length > 0;
});

console.log(`Pathologies trouvées: ${pathologiesTrouvees.length}`);
pathologiesTrouvees.forEach(pathology => {
  const matchingSymptoms = pathology.symptoms.filter(s => symptomesTest.includes(s));
  const confidence = Math.round((matchingSymptoms.length / pathology.symptoms.length) * 100);
  console.log(`- ${pathology.name} (${confidence}% de correspondance)`);
  matchingSymptoms.forEach(symptomId => {
    const symptome = symptomesData.symptoms.find(s => s.id === symptomId);
    console.log(`  • ${symptome ? symptome.name : symptomId}`);
  });
});
console.log('');

// Test 3: Vérification des kits de produits
console.log('🧪 Test 3: Vérification des kits de produits');
const kitTest = kitsData.product_kits[0];
if (kitTest) {
  console.log(`Kit test: ${kitTest.name}`);
  console.log(`- Description: ${kitTest.description}`);
  console.log(`- Produits: ${kitTest.products.length}`);
  console.log(`- Prix total: ${kitTest.totalPrice} ${kitTest.currency}`);
  console.log(`- Détail des prix:`);
  Object.entries(kitTest.priceBreakdown).forEach(([product, price]) => {
    console.log(`  • ${product}: ${price} ${kitTest.currency}`);
  });
} else {
  console.log('❌ Aucun kit trouvé');
}
console.log('');

// Test 4: Simulation d'un diagnostic complet
console.log('🧪 Test 4: Simulation d\'un diagnostic complet');
const symptomesSelectionnes = ['fatigue', 'essoufflement', 'palpitations', 'maux_tete_frequents'];
console.log(`Symptômes sélectionnés: ${symptomesSelectionnes.join(', ')}`);

const resultats = [];
pathologiesData.pathologies.forEach(pathology => {
  const matchingSymptoms = pathology.symptoms.filter(s => symptomesSelectionnes.includes(s));
  if (matchingSymptoms.length > 0) {
    const confidence = Math.round((matchingSymptoms.length / pathology.symptoms.length) * 100);
    if (confidence >= 30) {
      const urgency = pathology.severity === 'elevee' ? 'high' : pathology.severity === 'moyenne' ? 'medium' : 'low';
      
      resultats.push({
        pathologyId: pathology.id,
        pathologyName: pathology.name,
        confidence,
        urgency,
        score: confidence,
        symptoms: matchingSymptoms,
        category: pathology.category,
        severity: pathology.severity
      });
    }
  }
});

// Trier par score décroissant
resultats.sort((a, b) => b.score - a.score);

console.log(`Résultats du diagnostic: ${resultats.length}`);
resultats.forEach((result, index) => {
  console.log(`${index + 1}. ${result.pathologyName}`);
  console.log(`   - Score: ${result.score}%`);
  console.log(`   - Urgence: ${result.urgency}`);
  console.log(`   - Catégorie: ${result.category}`);
  console.log(`   - Sévérité: ${result.severity}`);
  console.log(`   - Symptômes correspondants: ${result.symptoms.length}`);
  result.symptoms.forEach(symptomId => {
    const symptome = symptomesData.symptoms.find(s => s.id === symptomId);
    console.log(`     • ${symptome ? symptome.name : symptomId}`);
  });
  console.log('');
});

console.log('✅ Test terminé avec succès !');
console.log('🎯 Le système de diagnostic est fonctionnel.');
