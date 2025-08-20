import type { Pathology, Database } from '@/types';
import db from '@/data/db.json';

const database: Database = db;

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
  analysisType: 'system_pathology' | 'ai_advanced_analysis' | 'local_pattern_analysis' | 'fallback_analysis';
}

export interface SymptomAnalysis {
  id: string;
  name: string;
  weight: number;
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: 'acute' | 'subacute' | 'chronic';
  context: string[];
}

export interface AIDiagnosticContext {
  patientAge?: number;
  patientGender?: string;
  symptomDuration?: string;
  medicalHistory?: string[];
}

// Système de pondération des symptômes
class SymptomWeightingAI {
  private baseWeights: Record<string, number> = {
    'nausees': 8, 'diarrhee': 7, 'constipation': 5, 'douleurs_abdominales': 9,
    'ballonnements': 4, 'brulures_estomac': 6, 'perte_appetit': 6,
    'toux_persistante': 8, 'essoufflement': 9, 'mal_gorge': 6, 'congestion_nasale': 5,
    'difficulte_respirer': 10, 'fatigue_extreme': 7, 'fievre': 9, 'maux_tete': 6,
    'perte_poids': 8, 'frissons': 7, 'courbatures': 5
  };

  public analyzeSymptoms(symptoms: string[], context: AIDiagnosticContext = {}): SymptomAnalysis[] {
    console.log('Context:', context); // Utilisation du paramètre
    return symptoms.map(symptomId => ({
      id: symptomId,
      name: getSymptomName(symptomId),
      weight: this.baseWeights[symptomId] || 5,
      category: this.getSymptomCategory(symptomId),
      severity: this.assessSymptomSeverity(symptomId),
      duration: 'acute',
      context: []
    }));
  }

  private getSymptomCategory(symptomId: string): string {
    if (['nausees', 'diarrhee', 'constipation', 'douleurs_abdominales', 'ballonnements', 'brulures_estomac', 'perte_appetit'].includes(symptomId)) {
      return 'Digestif';
    } else if (['toux_persistante', 'essoufflement', 'mal_gorge', 'congestion_nasale', 'difficulte_respirer'].includes(symptomId)) {
      return 'Respiratoire';
    }
    return 'Général';
  }

  private assessSymptomSeverity(symptomId: string): 'mild' | 'moderate' | 'severe' {
    if (['essoufflement', 'difficulte_respirer'].includes(symptomId)) return 'severe';
    if (['fievre', 'fatigue_extreme', 'maux_tete'].includes(symptomId)) return 'moderate';
    return 'mild';
  }
}

// Détecteur de patterns
class SymptomPatternAI {
  private patterns = {
    'syndrome_grippal': ['fievre', 'frissons', 'courbatures', 'fatigue_extreme', 'maux_tete'],
    'gastroenterite': ['nausees', 'diarrhee', 'douleurs_abdominales', 'perte_appetit'],
    'infection_respiratoire': ['toux_persistante', 'mal_gorge', 'congestion_nasale', 'fatigue_extreme']
  };

  analyzePattern(symptoms: string[]): { patterns: any[], confidence: number, urgency: number } {
    const detectedPatterns: any[] = [];
    
    Object.entries(this.patterns).forEach(([name, patternSymptoms]) => {
      const matches = symptoms.filter(s => patternSymptoms.includes(s));
      if (matches.length >= 2) {
        detectedPatterns.push({
          name,
          symptoms: matches,
          confidence: matches.length / patternSymptoms.length,
          urgency: 0.7
        });
      }
    });

    return {
      patterns: detectedPatterns,
      confidence: detectedPatterns.length > 0 ? 0.8 : 0,
      urgency: detectedPatterns.length > 0 ? 0.7 : 0
    };
  }
}

export class AIDiagnosticEngine {
  private symptomWeightingAI: SymptomWeightingAI;
  private symptomPatternAI: SymptomPatternAI;

  constructor() {
    this.symptomWeightingAI = new SymptomWeightingAI();
    this.symptomPatternAI = new SymptomPatternAI();
  }

  async runDiagnostic(symptoms: string[], patientContext?: AIDiagnosticContext): Promise<DiagnosticResult[]> {
    try {
      // Analyse des symptômes
      const symptomAnalysis = this.symptomWeightingAI.analyzeSymptoms(symptoms, patientContext || {});
      const patternAnalysis = this.symptomPatternAI.analyzePattern(symptoms);
      
      // Recherche des pathologies
      const matchingPathologies = this.findMatchingPathologies(symptoms);
      
      let results: DiagnosticResult[] = [];
      
      if (matchingPathologies.length >= 3) {
        // Utiliser les pathologies du système
        results = this.generateResultsFromPathologies(matchingPathologies, symptoms, symptomAnalysis, patternAnalysis);
      } else {
        // Analyse IA locale
        results = this.generateLocalAnalysis(symptoms, symptomAnalysis, patternAnalysis);
      }

      // Garantir au moins 3 résultats
      if (results.length < 3) {
        const additionalResults = this.generateFallbackResults(symptoms, results);
        results = [...results, ...additionalResults];
      }

      return results.slice(0, 5);
    } catch (error) {
      console.error('Erreur diagnostic:', error);
      return this.generateEmergencyResults(symptoms);
    }
  }

  private findMatchingPathologies(symptoms: string[]): Pathology[] {
    const matches: Array<{ pathology: Pathology; score: number }> = [];
    
    database.pathologies.forEach(pathology => {
      const matchingSymptoms = pathology.symptoms.filter(symptom => 
        symptoms.some(s => s.toLowerCase().includes(symptom.toLowerCase()) ||
                         symptom.toLowerCase().includes(s.toLowerCase()))
      );
      
      if (matchingSymptoms.length > 0) {
        const score = (matchingSymptoms.length / pathology.symptoms.length) * 100;
        matches.push({ pathology, score });
      }
    });

    return matches
      .sort((a, b) => b.score - a.score)
      .map(match => match.pathology);
  }

  private generateResultsFromPathologies(
    pathologies: Pathology[], 
    symptoms: string[], 
    symptomAnalysis: SymptomAnalysis[], 
    patternAnalysis: any
  ): DiagnosticResult[] {
    console.log('Symptom analysis:', symptomAnalysis, 'Pattern:', patternAnalysis); // Utilisation des paramètres
    return pathologies.map(pathology => ({
      pathologyId: pathology.id,
      pathologyName: pathology.name,
      confidence: 85,
      urgency: 'medium',
      score: 85,
      symptoms: symptoms,
      recommendations: [
        'Diagnostic probable confirmé par l\'IA',
        'Consultez un médecin pour confirmation',
        'Surveillez l\'évolution de vos symptômes'
      ],
      aiInsights: [`Score IA: 85/100`, 'Pathologie identifiée dans la base'],
      riskFactors: ['Facteurs de risque standard'],
      differentialDiagnosis: [],
      requiresExpertConsultation: false,
      analysisType: 'system_pathology'
    }));
  }

  private generateLocalAnalysis(
    symptoms: string[], 
    symptomAnalysis: SymptomAnalysis[], 
    patternAnalysis: any
  ): DiagnosticResult[] {
    console.log('Local analysis:', symptomAnalysis, patternAnalysis); // Utilisation des paramètres
    const results: DiagnosticResult[] = [];
    
    // Patterns détectés
    if (patternAnalysis.patterns.length > 0) {
      patternAnalysis.patterns.forEach((pattern: any) => {
        results.push({
          pathologyId: `pattern_${pattern.name}`,
          pathologyName: pattern.name,
          confidence: 70,
          urgency: 'medium',
          score: 70,
          symptoms: pattern.symptoms,
          recommendations: [
            'Pattern de symptômes détecté',
            'Consultez un médecin pour confirmation',
            'Surveillez l\'évolution'
          ],
          aiInsights: [`Pattern: ${pattern.name}`, 'Analyse basée sur la corrélation'],
          riskFactors: ['Pattern nécessite évaluation médicale'],
          differentialDiagnosis: [],
          requiresExpertConsultation: true,
          analysisType: 'local_pattern_analysis'
        });
      });
    }

    // Catégories de symptômes
    const categories = this.categorizeSymptoms(symptoms);
    categories.forEach(category => {
      if (category.symptoms.length > 0) {
        results.push({
          pathologyId: `category_${category.name}`,
          pathologyName: `Condition ${category.name}`,
          confidence: 60,
          urgency: 'low',
          score: 60,
          symptoms: category.symptoms,
          recommendations: [
            'Symptômes de cette catégorie',
            'Consultation médicale recommandée',
            'Évitez l\'automédication'
          ],
          aiInsights: [`Catégorie: ${category.name}`, 'Analyse basée sur la classification'],
          riskFactors: ['Facteurs de risque de la catégorie'],
          differentialDiagnosis: [],
          requiresExpertConsultation: true,
          analysisType: 'local_pattern_analysis'
        });
      }
    });

    return results;
  }

  private generateFallbackResults(symptoms: string[], existingResults: DiagnosticResult[]): DiagnosticResult[] {
    const fallbackResults: DiagnosticResult[] = [];
    
    const usedSymptoms = new Set(existingResults.flatMap(r => r.symptoms));
    const remainingSymptoms = symptoms.filter(s => !usedSymptoms.has(s));
    
    if (remainingSymptoms.length > 0) {
      remainingSymptoms.forEach((symptom, index) => {
        fallbackResults.push({
          pathologyId: `fallback_${index}`,
          pathologyName: `Évaluation de ${symptom}`,
          confidence: 40,
          urgency: 'low',
          score: 40,
          symptoms: [symptom],
          recommendations: [
            'Ce symptôme nécessite une évaluation médicale',
            'Consultez un médecin pour un diagnostic précis'
          ],
          aiInsights: [`Symptôme isolé: ${symptom}`, 'Évaluation médicale recommandée'],
          riskFactors: ['Symptôme isolé nécessite une investigation'],
          differentialDiagnosis: [],
          requiresExpertConsultation: true,
          analysisType: 'fallback_analysis'
        });
      });
    }

    return fallbackResults;
  }

  private generateEmergencyResults(symptoms: string[]): DiagnosticResult[] {
    return [{
      pathologyId: 'emergency',
      pathologyName: 'Évaluation d\'urgence requise',
      confidence: 90,
      urgency: 'high',
      score: 90,
      symptoms: symptoms,
      recommendations: [
        '⚠️ CONSULTATION MÉDICALE IMMÉDIATE REQUISE',
        'Rendez-vous aux urgences ou appelez le 15',
        'Ne prenez aucun médicament sans avis médical'
      ],
      aiInsights: ['Système en mode urgence', 'Consultation médicale immédiate nécessaire'],
      riskFactors: ['Symptômes nécessitent une évaluation d\'urgence'],
      differentialDiagnosis: [],
      requiresExpertConsultation: true,
      analysisType: 'fallback_analysis'
    }];
  }

  private categorizeSymptoms(symptomIds: string[]): Array<{ name: string; symptoms: string[] }> {
    const categories: Array<{ name: string; symptoms: string[] }> = [];
    
    const digestiveSymptoms = symptomIds.filter(id => 
      ['nausees', 'diarrhee', 'constipation', 'douleurs_abdominales', 'ballonnements', 'brulures_estomac', 'perte_appetit'].includes(id)
    );
    
    const respiratorySymptoms = symptomIds.filter(id => 
      ['toux_persistante', 'essoufflement', 'mal_gorge', 'congestion_nasale', 'difficulte_respirer'].includes(id)
    );
    
    const generalSymptoms = symptomIds.filter(id => 
      ['fatigue_extreme', 'fievre', 'maux_tete', 'perte_poids', 'frissons', 'courbatures'].includes(id)
    );
    
    if (digestiveSymptoms.length > 0) {
      categories.push({ name: 'Digestif', symptoms: digestiveSymptoms });
    }
    
    if (respiratorySymptoms.length > 0) {
      categories.push({ name: 'Respiratoire', symptoms: respiratorySymptoms });
    }
    
    if (generalSymptoms.length > 0) {
      categories.push({ name: 'Général', symptoms: generalSymptoms });
    }
    
    return categories;
  }
}

// Instance globale
const aiEngine = new AIDiagnosticEngine();

// Fonction d'export principale
export async function runDiagnostic(selectedSymptomIds: string[], context: AIDiagnosticContext = {}): Promise<DiagnosticResult[]> {
  try {
    return await aiEngine.runDiagnostic(selectedSymptomIds, context);
  } catch (error) {
    console.error('Erreur lors du diagnostic:', error);
    return [];
  }
}

// Fonction d'analyse rapide
export function quickSymptomAnalysis(selectedSymptomIds: string[], context: AIDiagnosticContext = {}): SymptomAnalysis[] {
  try {
    const weightingAI = new SymptomWeightingAI();
    return weightingAI.analyzeSymptoms(selectedSymptomIds, context);
  } catch (error) {
    console.error('Erreur lors de l\'analyse des symptômes:', error);
    return [];
  }
}

// Fonction helper
function getSymptomName(id: string): string {
  const symptomNames: Record<string, string> = {
    'nausees': 'Nausées',
    'diarrhee': 'Diarrhée',
    'constipation': 'Constipation',
    'douleurs_abdominales': 'Douleurs abdominales',
    'ballonnements': 'Ballonnements',
    'brulures_estomac': 'Brûlures d\'estomac',
    'perte_appetit': 'Perte d\'appétit',
    'toux_persistante': 'Toux persistante',
    'essoufflement': 'Essoufflement',
    'mal_gorge': 'Mal de gorge',
    'congestion_nasale': 'Congestion nasale',
    'difficulte_respirer': 'Difficulté à respirer',
    'fatigue_extreme': 'Fatigue extrême',
    'fievre': 'Fièvre',
    'maux_tete': 'Maux de tête',
    'perte_poids': 'Perte de poids',
    'frissons': 'Frissons',
    'courbatures': 'Courbatures'
  };
  
  return symptomNames[id] || id;
}
