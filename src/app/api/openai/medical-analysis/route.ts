import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, symptoms, patientContext } = await request.json();

    // Vérifier la clé API OpenAI
    const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!openaiApiKey) {
      // Fallback : analyse locale basée sur les données médicales
      return NextResponse.json({
        diagnostics: generateLocalMedicalDiagnostics(symptoms, patientContext)
      });
    }

    // Appel à OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Vous êtes un expert médical spécialisé dans l\'analyse des symptômes. Basez vos réponses sur les données de l\'OMS et les recherches scientifiques récentes. Ne prescrivez jamais de médicaments, mais fournissez des recommandations générales et insistez sur la nécessité de consulter un professionnel de santé.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const data = await openaiResponse.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parser la réponse JSON d'OpenAI
    try {
      const parsedResponse = JSON.parse(content);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      // Si le parsing échoue, utiliser l'analyse locale
      return NextResponse.json({
        diagnostics: generateLocalMedicalDiagnostics(symptoms, patientContext)
      });
    }

  } catch (error) {
    console.error('Erreur lors de l\'analyse médicale:', error);
    
    // Fallback : analyse locale
    const { symptoms, patientContext } = await request.json();
    return NextResponse.json({
      diagnostics: generateLocalMedicalDiagnostics(symptoms, patientContext)
    });
  }
}

function generateLocalMedicalDiagnostics(symptoms: string[], patientContext: any) {
  const diagnostics: any[] = [];
  
  // Analyser les patterns de symptômes
  const patterns = analyzeSymptomPatterns(symptoms);
  
  patterns.forEach(pattern => {
    diagnostics.push({
      name: pattern.name,
      probability: pattern.confidence * 100,
      urgency: pattern.urgency > 0.8 ? 'high' : pattern.urgency > 0.5 ? 'medium' : 'low',
      riskFactors: generateRiskFactors(symptoms, patientContext),
      recommendations: generateMedicalRecommendations(pattern.name),
      requiresExpert: true
    });
  });

  // Analyser les catégories de symptômes
  const categories = categorizeSymptoms(symptoms);
  categories.forEach(category => {
    if (category.symptoms.length > 0) {
      diagnostics.push({
        name: `Condition ${category.name}`,
        probability: 60,
        urgency: assessUrgencyFromCategory(category.name),
        riskFactors: generateRiskFactors(category.symptoms, patientContext),
        recommendations: generateCategoryRecommendations(category.name),
        requiresExpert: true
      });
    }
  });

  // S'assurer qu'on a au moins 3 diagnostics
  while (diagnostics.length < 3) {
    const remainingSymptoms = symptoms.filter(s => 
      !diagnostics.some(d => d.name.toLowerCase().includes(s.toLowerCase()))
    );
    
    if (remainingSymptoms.length > 0) {
      const symptom = remainingSymptoms[0];
      diagnostics.push({
        name: `Évaluation de ${symptom}`,
        probability: 40,
        urgency: 'low',
        riskFactors: ['Symptôme isolé nécessite une investigation'],
        recommendations: [
          'Ce symptôme nécessite une évaluation médicale',
          'Consultez un médecin pour un diagnostic précis'
        ],
        requiresExpert: true
      });
    } else {
      break;
    }
  }

  return diagnostics.slice(0, 5); // Limiter à 5 diagnostics
}

function analyzeSymptomPatterns(symptoms: string[]) {
  const patterns = [];
  
  // Syndrome grippal
  const fluSymptoms = ['fievre', 'frissons', 'courbatures', 'fatigue_extreme', 'maux_tete'];
  const fluMatches = symptoms.filter(s => fluSymptoms.some(fs => s.toLowerCase().includes(fs.toLowerCase())));
  if (fluMatches.length >= 2) {
    patterns.push({
      name: 'Syndrome grippal',
      confidence: fluMatches.length / fluSymptoms.length,
      urgency: 0.7
    });
  }

  // Gastroentérite
  const gastroSymptoms = ['nausees', 'diarrhee', 'douleurs_abdominales', 'perte_appetit'];
  const gastroMatches = symptoms.filter(s => gastroSymptoms.some(gs => s.toLowerCase().includes(gs.toLowerCase())));
  if (gastroMatches.length >= 2) {
    patterns.push({
      name: 'Gastroentérite',
      confidence: gastroMatches.length / gastroSymptoms.length,
      urgency: 0.8
    });
  }

  // Infection respiratoire
  const respSymptoms = ['toux_persistante', 'mal_gorge', 'congestion_nasale', 'fatigue_extreme'];
  const respMatches = symptoms.filter(s => respSymptoms.some(rs => s.toLowerCase().includes(rs.toLowerCase())));
  if (respMatches.length >= 2) {
    patterns.push({
      name: 'Infection respiratoire',
      confidence: respMatches.length / respSymptoms.length,
      urgency: 0.6
    });
  }

  return patterns;
}

function categorizeSymptoms(symptoms: string[]) {
  const categories = [];
  
  const digestiveSymptoms = symptoms.filter(s => 
    ['nausees', 'diarrhee', 'constipation', 'douleurs_abdominales', 'ballonnements', 'brulures_estomac', 'perte_appetit'].some(ds => s.toLowerCase().includes(ds.toLowerCase()))
  );
  
  const respiratorySymptoms = symptoms.filter(s => 
    ['toux_persistante', 'essoufflement', 'mal_gorge', 'congestion_nasale', 'difficulte_respirer'].some(rs => s.toLowerCase().includes(rs.toLowerCase()))
  );
  
  const generalSymptoms = symptoms.filter(s => 
    ['fatigue_extreme', 'fievre', 'maux_tete', 'perte_poids', 'frissons', 'courbatures'].some(gs => s.toLowerCase().includes(gs.toLowerCase()))
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

function generateRiskFactors(symptoms: string[], patientContext: any) {
  const riskFactors = [];
  
  if (patientContext?.patientAge && patientContext.patientAge > 65) {
    riskFactors.push('Patient âgé (facteur de risque)');
  }
  
  if (patientContext?.patientGender === 'F') {
    riskFactors.push('Facteurs de risque spécifiques au genre féminin');
  }
  
  if (symptoms.some(s => s.toLowerCase().includes('fièvre'))) {
    riskFactors.push('Fièvre élevée peut indiquer une infection');
  }
  
  if (symptoms.some(s => s.toLowerCase().includes('douleur'))) {
    riskFactors.push('Douleur persistante nécessite une évaluation');
  }
  
  if (symptoms.some(s => s.toLowerCase().includes('fatigue'))) {
    riskFactors.push('Fatigue chronique peut masquer d\'autres conditions');
  }
  
  return riskFactors;
}

function generateMedicalRecommendations(patternName: string) {
  const recommendations = [
    'Consultez un médecin pour un diagnostic précis',
    'Évitez l\'automédication sans avis médical'
  ];
  
  if (patternName === 'Syndrome grippal') {
    recommendations.push('Repos et hydratation abondante');
    recommendations.push('Surveillez votre température');
  } else if (patternName === 'Gastroentérite') {
    recommendations.push('Hydratation avec des solutions de réhydratation');
    recommendations.push('Régime alimentaire adapté');
  } else if (patternName === 'Infection respiratoire') {
    recommendations.push('Surveillez votre respiration');
    recommendations.push('Évitez les facteurs irritants');
  }
  
  return recommendations;
}

function generateCategoryRecommendations(categoryName: string) {
  const recommendations = [
    'Symptômes de cette catégorie nécessitent une évaluation médicale',
    'Consultez un spécialiste approprié',
    'Évitez l\'automédication'
  ];
  
  if (categoryName === 'Digestif') {
    recommendations.push('Surveillez votre alimentation');
    recommendations.push('Hydratation adéquate');
  } else if (categoryName === 'Respiratoire') {
    recommendations.push('Surveillez votre respiration');
    recommendations.push('Évitez les facteurs irritants');
  } else if (categoryName === 'Général') {
    recommendations.push('Surveillez l\'évolution de vos symptômes');
    recommendations.push('Repos adapté');
  }
  
  return recommendations;
}

function assessUrgencyFromCategory(categoryName: string) {
  const highUrgencyCategories = ['cardiovasculaire', 'neurologique', 'respiratoire'];
  const mediumUrgencyCategories = ['digestif', 'musculosquelettique', 'dermatologique'];
  
  if (highUrgencyCategories.includes(categoryName.toLowerCase())) {
    return 'high';
  } else if (mediumUrgencyCategories.includes(categoryName.toLowerCase())) {
    return 'medium';
  }
  return 'low';
}
