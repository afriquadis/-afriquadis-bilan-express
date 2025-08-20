// Service OpenAI pour diagnostic médical avancé
export interface OpenAIDiagnosticRequest {
  symptoms: string[];
  patientContext?: {
    age?: number;
    gender?: string;
    medicalHistory?: string[];
    currentMedications?: string[];
  };
  availablePathologies: Array<{
    id: string;
    name: string;
    symptoms: string[];
    description?: string;
  }>;
}

export interface OpenAIDiagnosticResponse {
  primaryDiagnosis: {
    pathologyId: string;
    confidence: number;
    reasoning: string;
    urgency: 'low' | 'medium' | 'high';
  };
  differentialDiagnosis: Array<{
    pathologyId: string;
    confidence: number;
    reasoning: string;
  }>;
  recommendations: string[];
  riskFactors: string[];
  nextSteps: string[];
  aiInsights: string[];
}

class OpenAIService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.baseURL = 'https://api.openai.com/v1';
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erreur OpenAI: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la requête OpenAI:', error);
      throw error;
    }
  }

  async generateDiagnostic(request: OpenAIDiagnosticRequest): Promise<OpenAIDiagnosticResponse> {
    const prompt = this.buildDiagnosticPrompt(request);
    
    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Tu es un médecin expert en diagnostic médical. Analyse les symptômes du patient et propose un diagnostic basé sur la base de données des pathologies disponibles. Sois précis, professionnel et toujours prudent dans tes recommandations.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      });

      return this.parseOpenAIResponse(response, request);
    } catch (error) {
      console.error('Erreur lors de la génération du diagnostic OpenAI:', error);
      // Fallback vers le diagnostic local
      return this.generateFallbackDiagnostic(request);
    }
  }

  private buildDiagnosticPrompt(request: OpenAIDiagnosticRequest): string {
    const symptomsText = request.symptoms.join(', ');
    const pathologiesText = request.availablePathologies
      .map(p => `- ${p.name}: ${p.symptoms.join(', ')}`)
      .join('\n');

    let contextText = '';
    if (request.patientContext) {
      const ctx = request.patientContext;
      if (ctx.age) contextText += `Âge: ${ctx.age} ans\n`;
      if (ctx.gender) contextText += `Genre: ${ctx.gender}\n`;
      if (ctx.medicalHistory?.length) contextText += `Antécédents: ${ctx.medicalHistory.join(', ')}\n`;
      if (ctx.currentMedications?.length) contextText += `Médicaments actuels: ${ctx.currentMedications.join(', ')}\n`;
    }

    return `Analyse médicale pour un patient présentant les symptômes suivants:

SYMPTÔMES: ${symptomsText}

${contextText ? `CONTEXTE PATIENT:\n${contextText}` : ''}

PATHOLOGIES DISPONIBLES DANS LA BASE DE DONNÉES:
${pathologiesText}

Veuillez fournir:
1. Un diagnostic principal avec niveau de confiance et urgence
2. Des diagnostics différentiels possibles
3. Des recommandations médicales appropriées
4. Des facteurs de risque identifiés
5. Les prochaines étapes recommandées
6. Des insights médicaux pertinents

Répondez au format JSON structuré.`;
  }

  private parseOpenAIResponse(response: any, request: OpenAIDiagnosticRequest): OpenAIDiagnosticResponse {
    try {
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Réponse OpenAI vide');
      }

      // Essayer de parser le JSON
      const parsed = JSON.parse(content);
      
      // Validation et normalisation de la réponse
      return {
        primaryDiagnosis: {
          pathologyId: parsed.primaryDiagnosis?.pathologyId || request.availablePathologies[0]?.id || 'unknown',
          confidence: Math.min(100, Math.max(0, parsed.primaryDiagnosis?.confidence || 50)),
          reasoning: parsed.primaryDiagnosis?.reasoning || 'Analyse basée sur les symptômes présentés',
          urgency: ['low', 'medium', 'high'].includes(parsed.primaryDiagnosis?.urgency) 
            ? parsed.primaryDiagnosis.urgency 
            : 'medium'
        },
        differentialDiagnosis: Array.isArray(parsed.differentialDiagnosis) 
          ? parsed.differentialDiagnosis.slice(0, 3).map(d => ({
              pathologyId: d.pathologyId || 'unknown',
              confidence: Math.min(100, Math.max(0, d.confidence || 30)),
              reasoning: d.reasoning || 'Diagnostic différentiel possible'
            }))
          : [],
        recommendations: Array.isArray(parsed.recommendations) 
          ? parsed.recommendations.slice(0, 5) 
          : ['Consultation médicale recommandée'],
        riskFactors: Array.isArray(parsed.riskFactors) 
          ? parsed.riskFactors.slice(0, 3) 
          : ['Facteurs de risque à évaluer'],
        nextSteps: Array.isArray(parsed.nextSteps) 
          ? parsed.nextSteps.slice(0, 3) 
          : ['Suivi médical recommandé'],
        aiInsights: Array.isArray(parsed.aiInsights) 
          ? parsed.aiInsights.slice(0, 3) 
          : ['Analyse IA en cours']
      };
    } catch (error) {
      console.error('Erreur lors du parsing de la réponse OpenAI:', error);
      return this.generateFallbackDiagnostic(request);
    }
  }

  private generateFallbackDiagnostic(request: OpenAIDiagnosticRequest): OpenAIDiagnosticResponse {
    // Diagnostic de fallback basé sur la logique locale
    const matchedPathologies = request.availablePathologies.filter(p => 
      p.symptoms.some(s => request.symptoms.includes(s))
    );

    const primaryPathology = matchedPathologies[0] || request.availablePathologies[0];

    return {
      primaryDiagnosis: {
        pathologyId: primaryPathology?.id || 'unknown',
        confidence: 60,
        reasoning: 'Diagnostic basé sur l\'analyse locale des symptômes',
        urgency: 'medium'
      },
      differentialDiagnosis: matchedPathologies.slice(1, 3).map(p => ({
        pathologyId: p.id,
        confidence: 40,
        reasoning: 'Diagnostic différentiel basé sur la correspondance des symptômes'
      })),
      recommendations: [
        'Consultation médicale recommandée',
        'Surveillance des symptômes',
        'Suivi de l\'évolution'
      ],
      riskFactors: ['Évaluation médicale requise'],
      nextSteps: [
        'Prise de rendez-vous médical',
        'Documentation des symptômes',
        'Surveillance continue'
      ],
      aiInsights: [
        'Analyse locale effectuée (OpenAI non disponible)',
        'Recommandation de consultation médicale'
      ]
    };
  }

  // Méthode pour améliorer les recommandations existantes
  async enhanceRecommendations(
    pathologyName: string, 
    symptoms: string[], 
    currentRecommendations: string[]
  ): Promise<string[]> {
    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un médecin expert qui améliore les recommandations médicales existantes.'
          },
          {
            role: 'user',
            content: `Améliore et enrichis ces recommandations médicales pour la pathologie "${pathologyName}" avec les symptômes: ${symptoms.join(', ')}.

Recommandations actuelles:
${currentRecommendations.join('\n')}

Fournis 5-7 recommandations améliorées, détaillées et pratiques.`
          }
        ],
        temperature: 0.3,
        max_tokens: 800,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        // Extraire les recommandations de la réponse
        const lines = content.split('\n').filter(line => 
          line.trim() && (line.includes('-') || line.includes('•') || line.includes('*'))
        );
        
        if (lines.length > 0) {
          return lines.slice(0, 7).map(line => 
            line.replace(/^[-•*]\s*/, '').trim()
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'amélioration des recommandations:', error);
    }

    // Retourner les recommandations originales en cas d'erreur
    return currentRecommendations;
  }
}

// Instance singleton
export const openAIService = new OpenAIService();

// Fonction d'export pour utilisation directe
export async function generateOpenAIDiagnostic(request: OpenAIDiagnosticRequest): Promise<OpenAIDiagnosticResponse> {
  return openAIService.generateDiagnostic(request);
}

export async function enhanceRecommendationsWithAI(
  pathologyName: string, 
  symptoms: string[], 
  currentRecommendations: string[]
): Promise<string[]> {
  return openAIService.enhanceRecommendations(pathologyName, symptoms, currentRecommendations);
}
