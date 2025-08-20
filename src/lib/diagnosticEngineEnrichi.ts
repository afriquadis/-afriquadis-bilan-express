import pathologiesData from '@/data/pathologies-enrichies.json';
import symptomesData from '@/data/symptomes-enrichis.json';
import kitsData from '@/data/kits-produits-prix-reels.json';

export interface DiagnosticResult {
  pathologyId: string;
  pathologyName: string;
  confidence: number;
  urgency: 'high' | 'medium' | 'low';
  score: number;
  symptoms: string[];
  recommendations: string[];
  aiInsights: string[];
  riskFactors: string[];
  differentialDiagnosis: string[];
  requiresExpertConsultation: boolean;
  analysisType: string;
  productKit?: any;
  advice?: any;
}

export async function runDiagnostic(selectedSymptomIds: string[]): Promise<DiagnosticResult[]> {
  console.log('🔍 Démarrage du diagnostic avec symptômes:', selectedSymptomIds);
  
  const results: DiagnosticResult[] = [];
  
  // Recherche des pathologies correspondantes
  pathologiesData.pathologies.forEach(pathology => {
    const matchingSymptoms = pathology.symptoms.filter(s => selectedSymptomIds.includes(s));
    if (matchingSymptoms.length > 0) {
      const confidence = Math.round((matchingSymptoms.length / pathology.symptoms.length) * 100);
      if (confidence >= 30) {
        const urgency = pathology.severity === 'elevee' ? 'high' : pathology.severity === 'moyenne' ? 'medium' : 'low';
        
        // Trouver le kit de produits correspondant
        const productKit = kitsData.product_kits.find(kit => kit.id === pathology.product_kit_id);
        
        results.push({
          pathologyId: pathology.id,
          pathologyName: pathology.name,
          confidence,
          urgency,
          score: confidence,
          symptoms: matchingSymptoms,
          recommendations: [
            `Consulter un spécialiste en ${pathology.category}`,
            'Suivre les conseils d\'hygiène de vie recommandés',
            'Surveiller l\'évolution des symptômes'
          ],
          aiInsights: [
            `Pathologie identifiée: ${pathology.name}`,
            `Catégorie: ${pathology.category}`,
            `Sévérité: ${pathology.severity}`,
            `${matchingSymptoms.length} symptômes correspondants détectés`
          ],
          riskFactors: [
            pathology.severity === 'elevee' ? 'Pathologie de haute sévérité' : '',
            matchingSymptoms.length >= 5 ? 'Nombre élevé de symptômes' : '',
            ['cardiovasculaire', 'neurologique'].includes(pathology.category) ? 'Catégorie à risque' : ''
          ].filter(Boolean),
          differentialDiagnosis: generateDifferentialDiagnosis(pathology, selectedSymptomIds),
          requiresExpertConsultation: pathology.severity === 'elevee',
          analysisType: 'system_pathology',
          productKit,
          advice: pathology.advice
        });
      }
    }
  });
  
  // Trier par score décroissant
  results.sort((a, b) => b.score - a.score);
  
  // Si moins de 3 résultats, générer des analyses supplémentaires
  if (results.length < 3) {
    console.log('⚠️ Moins de 3 résultats, génération d\'analyses supplémentaires');
    const additionalResults = generateAdditionalAnalysis(selectedSymptomIds, results);
    results.push(...additionalResults);
  }
  
  // Limiter à 5 résultats maximum
  const finalResults = results.slice(0, 5);
  
  console.log(`🎯 Diagnostic terminé: ${finalResults.length} résultats générés`);
  return finalResults;
}

function generateDifferentialDiagnosis(pathology: any, symptoms: string[]): string[] {
  const differential = [];
  
  // Trouver des pathologies similaires
  const similarPathologies = pathologiesData.pathologies.filter(p => 
    p.id !== pathology.id && 
    p.category === pathology.category &&
    p.symptoms.some(s => symptoms.includes(s))
  );
  
  similarPathologies.slice(0, 3).forEach(p => {
    differential.push(p.name);
  });
  
  return differential;
}

function generateAdditionalAnalysis(symptoms: string[], existingResults: DiagnosticResult[]): DiagnosticResult[] {
  const results: DiagnosticResult[] = [];
  
  // Analyser les symptômes non couverts
  const coveredSymptoms = new Set(existingResults.flatMap(r => r.symptoms));
  const uncoveredSymptoms = symptoms.filter(s => !coveredSymptoms.has(s));
  
  if (uncoveredSymptoms.length > 0) {
    // Grouper par catégorie
    const categories = groupSymptomsByCategory(uncoveredSymptoms);
    
    Object.entries(categories).forEach(([category, sympts]) => {
      if (sympts.length >= 2) {
        results.push({
          pathologyId: `fallback_${category}`,
          pathologyName: `Troubles ${category}`,
          confidence: 40,
          urgency: assessUrgencyFromSymptoms(sympts),
          score: 40,
          symptoms: sympts,
          recommendations: [
            'Consulter un professionnel de santé pour un diagnostic précis',
            'Surveiller l\'évolution des symptômes',
            'Éviter l\'automédication'
          ],
          aiInsights: [`Symptômes ${category} détectés nécessitant une évaluation médicale`],
          riskFactors: ['Symptômes persistants', 'Absence de diagnostic précis'],
          differentialDiagnosis: ['Plusieurs causes possibles', 'Évaluation médicale requise'],
          requiresExpertConsultation: true,
          analysisType: 'fallback_analysis'
        });
      }
    });
  }
  
  return results;
}

function groupSymptomsByCategory(symptoms: string[]): Record<string, string[]> {
  const categories: Record<string, string[]> = {};
  
  symptoms.forEach(symptomId => {
    const symptome = symptomesData.symptoms.find(s => s.id === symptomId);
    if (symptome) {
      if (!categories[symptome.category]) {
        categories[symptome.category] = [];
      }
      categories[symptome.category].push(symptomId);
    }
  });
  
  return categories;
}

function assessUrgencyFromSymptoms(symptoms: string[]): 'high' | 'medium' | 'low' {
  const urgentSymptoms = ['essoufflement', 'douleur_poitrine', 'crises_convulsives', 'perte_conscience_temporaire'];
  const hasUrgent = symptoms.some(s => urgentSymptoms.includes(s));
  
  if (hasUrgent) return 'high';
  if (symptoms.length >= 3) return 'medium';
  return 'low';
}

// Fonction utilitaire pour obtenir le nom d'un symptôme
export function getSymptomName(id: string): string {
  const symptome = symptomesData.symptoms.find(s => s.id === id);
  return symptome ? symptome.name : id;
}

// Fonction utilitaire pour obtenir une pathologie par ID
export function getPathologyById(id: string): any {
  return pathologiesData.pathologies.find(p => p.id === id);
}

// Fonction utilitaire pour obtenir un kit de produits par ID
export function getProductKitById(id: string): any {
  return kitsData.product_kits.find(k => k.id === id);
}
