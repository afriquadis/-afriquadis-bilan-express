'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { runDiagnostic } from '@/lib/diagnosticEngineEnrichi';
import { getSymptomName, getProductKitById } from '@/lib/diagnosticEngineEnrichi';
import ErrorBoundary from '@/components/ErrorBoundary';

interface PatientProfile {
  nom: string;
  prenom: string;
  age: string;
  genre: string;
}

interface SimpleSymptom {
  id: string;
  name: string;
}

export default function FinalResultsPage() {
  const { data: session } = useSession();

  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SimpleSymptom[]>([]);
  const [bilanDate, setBilanDate] = useState<string>('');
  const [showAuthBanner, setShowAuthBanner] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);
  const [symptomAnalysis, setSymptomAnalysis] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Try API first if logged in
      let loaded = false;
      try {
        if (session?.user) {
          const res = await fetch('/api/diagnostic', { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            setPatient(data.patientProfile || null);
            setSelectedSymptoms(data.selectedSymptoms || []);
            setBilanDate(data.diagnosticDate ? new Date(data.diagnosticDate).toLocaleString() : '');
            loaded = true;
          }
        }
      } catch {}

      // Fallback to localStorage (guest or API miss)
      if (!loaded) {
        try {
          const p = localStorage.getItem('aq_patientProfile');
          const s = localStorage.getItem('aq_selectedSymptoms');
          const d = localStorage.getItem('aq_diagnosticDate');
          if (p) setPatient(JSON.parse(p));
          if (s) setSelectedSymptoms(JSON.parse(s));
          if (d) setBilanDate(new Date(d).toLocaleString());
        } catch {}
      }

      // Analyse diagnostic
      try {
        const symptomsFromStorage = localStorage.getItem('aq_selectedSymptoms');
        if (symptomsFromStorage) {
          const symptomsData = JSON.parse(symptomsFromStorage);
          let selectedSymptomIds: string[] = [];
          
          if (Array.isArray(symptomsData)) {
            if (symptomsData.length > 0) {
              if (typeof symptomsData[0] === 'object' && symptomsData[0] !== null) {
                selectedSymptomIds = symptomsData
                    .filter((s: any) => s && typeof s === 'object' && s.id)
                    .map((s: any) => s.id);
              } else if (typeof symptomsData[0] === 'string') {
                selectedSymptomIds = symptomsData.filter((s: any) => typeof s === 'string');
              }
            }
          }

          if (selectedSymptomIds.length > 0) {
            // Créer une analyse simple des symptômes
            try {
              const analysis = selectedSymptomIds.map((symptomId) => ({
                id: symptomId,
                name: getSymptomName(symptomId),
                severity: 'medium',
                context: 'Symptôme sélectionné par le patient'
              }));
              
              setSymptomAnalysis(analysis);
            } catch (analysisError) {
              console.error('Erreur lors de l\'analyse des symptômes:', analysisError);
              setSymptomAnalysis([]);
            }
            
            // Lancer le diagnostic
            try {
              const results = await runDiagnostic(selectedSymptomIds);
              if (Array.isArray(results)) {
                setDiagnosticResults(results);
                console.log('🎯 Résultats du diagnostic:', results);
              } else {
                console.error('runDiagnostic n\'a pas retourné un tableau valide');
                setDiagnosticResults([]);
              }
            } catch (diagnosticError) {
              console.error('Erreur lors du diagnostic:', diagnosticError);
              setDiagnosticResults([]);
            }
          } else {
            console.log('Aucun symptôme valide trouvé');
            setSymptomAnalysis([]);
            setDiagnosticResults([]);
          }
        }
      } catch (error) {
        console.error('Erreur générale lors du chargement des données:', error);
        setSymptomAnalysis([]);
        setDiagnosticResults([]);
      }
    };

    loadData();
  }, [session]);

  const getCurrentUser = () => {
    if (session?.user) {
      return { id: session.user.email || 'patient-1' } as any;
    }
    return null;
  };

  const handleOrderPack = async (kit: any) => {
    try {
      const user = getCurrentUser();
      if (user) {
        // créer une commande locale
        const order: any = {
          id: `ord-${Date.now()}`,
          userId: user.id,
          items: (kit.components || []).map((pid: any) => {
            const p = getProductKitById(pid);
            return { productId: pid, name: p?.name || pid, quantity: 1, price: p?.price };
          }),
          total: undefined,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          trackingCode: undefined
        };
         // Persister via API mock (optionnel ici)
         try {
           await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: order.items, total: order.total }) });
         } catch {}
        // rediriger vers l'espace patient onglet commandes
        window.location.href = '/account#orders';
        return;
      }
    } catch {}
    // pas connecté: proposer l'authentification
    setShowAuthBanner(true);
  };

  const handleOrderProduct = async (product: any) => {
    try {
      const user = getCurrentUser();
      if (user) {
        const order: any = {
          id: `ord-${Date.now()}`,
          userId: user.id,
          items: [{ productId: product.id, name: product.name, quantity: 1, price: product.price }],
          total: undefined,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          trackingCode: undefined
        };
         try {
           await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: order.items, total: order.total }) });
         } catch {}
        window.location.href = '/account#orders';
        return;
      }
    } catch {}
    // pas connecté: proposer l'authentification
    setShowAuthBanner(true);
  };

  const addToCart = (items: any[]) => {
    try {
      const raw = localStorage.getItem('aq_cart');
      const cart: any[] = raw ? JSON.parse(raw) : [];
      const merged = [...cart];
      items.forEach(it => {
        const idx = merged.findIndex(m => m.productId === it.productId);
        if (idx >= 0) {
          merged[idx].quantity += it.quantity;
        } else {
          merged.push({ ...it });
        }
      });
      localStorage.setItem('aq_cart', JSON.stringify(merged));
    } catch {}
  };

  const handleSave = async () => {
    try {
      const user = getCurrentUser();
      if (user) {
        try {
          await fetch('/api/bilans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pathologyId: diagnosticResults[0]?.pathologyId || 'unknown',
              productKitId: diagnosticResults[0]?.pathologyId || 'unknown',
              notes: 'Bilan sauvegardé (PDF)'
            })
          });
        } catch {}
      } else {
        setShowAuthBanner(true);
        return;
      }
    } catch {}
    window.print();
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-afriquadis-50 via-white to-yellow-50 relative overflow-hidden">
        <div className="absolute -top-12 left-24 w-48 h-48 bg-green-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-24 right-16 w-56 h-56 bg-yellow-100 rounded-full blur-3xl opacity-60"></div>
      {/* Entête local retiré: entête global seulement */}

      <main className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 via-yellow-400 to-green-500 flex items-center justify-center mx-auto mb-3 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/></svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-700 via-green-600 to-yellow-600 bg-clip-text text-transparent tracking-tight">Votre Bilan Express</h1>
            <p className="text-gray-600 mt-1">Diagnostic IA avancé avec recommandations personnalisées</p>
          </div>

          {/* Cartes statistiques résumé (UI only) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl p-5 bg-gradient-to-br from-green-50 to-green-100/60 border border-green-100 shadow-sm">
              <div className="text-3xl font-bold text-green-700">{symptomAnalysis.length || selectedSymptoms.length || 0}</div>
              <div className="text-sm text-green-700/80">Symptômes signalés</div>
            </div>
            <div className="rounded-xl p-5 bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-100 shadow-sm">
              <div className="text-3xl font-bold text-blue-700">{diagnosticResults.length || 0}</div>
              <div className="text-sm text-blue-700/80">Pathologies détectées</div>
            </div>
            <div className="rounded-xl p-5 bg-gradient-to-br from-yellow-50 to-yellow-100/60 border border-yellow-100 shadow-sm">
              <div className="text-3xl font-bold text-yellow-700">{Math.max(0, ...(diagnosticResults || []).map((r:any)=>r.score||0))}</div>
              <div className="text-sm text-yellow-700/80">Score maximum</div>
            </div>
            <div className="rounded-xl p-5 bg-gradient-to-br from-purple-50 to-purple-100/60 border border-purple-100 shadow-sm">
              <div className="text-3xl font-bold text-purple-700">{(diagnosticResults[0]?.confidence_value ?? 75)}%</div>
              <div className="text-sm text-purple-700/80">Confiance IA</div>
            </div>
          </div>

          {showAuthBanner && (
            <div className="mb-6 p-4 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-900 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.938 19h14.124c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.206 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                <div>
                  <p className="font-semibold">Identifiez-vous pour sauvegarder et commander</p>
                  <p className="text-sm">Créez un compte ou connectez-vous pour enregistrer votre bilan et suivre vos commandes.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href="/login" className="px-3 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700">Se connecter</a>
                <a href="/register" className="px-3 py-2 rounded bg-white border border-green-600 text-green-700 text-sm hover:bg-green-50">S'inscrire</a>
                <button onClick={() => setShowAuthBanner(false)} className="px-2 text-sm text-yellow-900/70 hover:text-yellow-900">Fermer</button>
              </div>
            </div>
          )}

          {/* Bloc patient + symptômes (imprimable) */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8 print:shadow-none print:border print:border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations Patient</h2>
            {patient ? (
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div><span className="font-medium">Nom:</span> {patient.nom}</div>
                <div><span className="font-medium">Prénom:</span> {patient.prenom}</div>
                <div><span className="font-medium">Âge:</span> {patient.age}</div>
                <div><span className="font-medium">Genre:</span> {patient.genre}</div>
                <div className="md:col-span-2"><span className="font-medium">Date du bilan:</span> {bilanDate || new Date().toLocaleString()}</div>
              </div>
            ) : (
              <p className="text-gray-500">Profil patient non renseigné.</p>
            )}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Symptômes sélectionnés</h3>
              {selectedSymptoms.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 grid md:grid-cols-2 gap-1">
                  {selectedSymptoms.map(s => (
                    <li key={s.id}>{s.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun symptôme sélectionné.</p>
              )}
            </div>
          </div>

          {/* Résultats du diagnostic */}
          {diagnosticResults.length > 0 ? (
            <div className="space-y-8">
              {diagnosticResults.map((result, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-6">
                  <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{result.pathology_name || 'Pathologie détectée'}</h2>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{result.category || 'Général'}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.urgency === 'élevée' ? 'bg-red-100 text-red-700' :
                          result.urgency === 'modérée' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          Urgence: {result.urgency || 'modérée'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Score</div>
                      <div className="text-3xl font-bold text-green-600">{result.score || 4}</div>
                      <div className="text-sm text-gray-500">Confiance: {result.confidence_value || 75}%</div>
                    </div>
                  </div>

                  {/* Description */}
                  {result.description && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                      <p className="text-gray-600">{result.description}</p>
                    </div>
                  )}

                  {/* Produits recommandés */}
                  {result.recommendedProducts && result.recommendedProducts.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Produits AFRIQUADIS recommandés</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.recommendedProducts.map((product: any, idx: number) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">{product.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-green-600">{product.price} FCFA</span>
                              <button 
                                onClick={() => handleOrderProduct(product)}
                                className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
                              >
                                Commander
                              </button>
                      </div>
                    </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kit recommandé */}
                  {result.recommendedKit && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Kit thérapeutique recommandé</h3>
                      <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xl font-bold text-green-800">{result.recommendedKit.name}</h4>
                            <p className="text-green-700">{result.recommendedKit.description}</p>
                            <p className="text-2xl font-bold text-green-600 mt-2">{result.recommendedKit.price} FCFA</p>
                          </div>
                          <button 
                            onClick={() => handleOrderPack(result.recommendedKit)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                          >
                            Commander le Kit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Conseils */}
                  {result.advice && result.advice.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Conseils d'hygiène de vie</h3>
                      <ul className="space-y-2">
                        {result.advice.map((conseil: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span className="text-gray-700">{conseil}</span>
                          </li>
                        ))}
                      </ul>
                </div>
                  )}
                </div>
              ))}
              </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat disponible</h2>
              <p className="text-gray-600 mb-6">Veuillez recommencer le diagnostic pour obtenir des résultats.</p>
              <a href="/diagnostic" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Recommencer le diagnostic
              </a>
            </div>
          )}

          {/* Contact expert */}
          <div className="mt-12 bg-gradient-to-br from-afriquadis-50 to-yellow-50 rounded-xl p-8 border border-afriquadis-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-afriquadis-800 mb-2">👩‍⚕️ Besoin d'un accompagnement personnalisé ?</h3>
              <p className="text-afriquadis-700">Nos experts AFRIQUADIS sont disponibles pour vous conseiller et personnaliser votre traitement.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <a href="https://wa.me/22892543376?text=Bonjour, j'ai utilisé Bilan Express AFRIQUADIS et j'aimerais parler à un conseiller." target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
                <span>WhatsApp Conseiller</span>
              </a>
              <a href={`tel:+22892543376`} className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>Appeler un Expert</span>
              </a>
            </div>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">🕒</span>
                  <span>Heures d'ouverture: Lun-Sam 8h-18h | Dim 9h-15h</span>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">📱</span>
                  <span>WhatsApp: +228 92 54 33 76</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">📞</span>
                  <span>Expert: +228 92 54 33 76</span>
                </div>
              </div>
            </div>
          </div>

          {/* Avertissement médical */}
          <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-800">Avertissement médical</h2>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-gray-700">
                Ce bilan express utilise l'intelligence artificielle pour analyser vos symptômes.
                Il s'agit d'un outil d'aide à l'orientation qui ne remplace pas une consultation médicale professionnelle.
                En cas de symptômes graves ou persistants, consultez immédiatement un professionnel de santé.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl p-8 shadow-lg print:hidden">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
                <span>Sauvegarder</span>
              </button>
              
              <a 
                href="/diagnostic"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Nouveau Bilan</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
    </ErrorBoundary>
  );
}