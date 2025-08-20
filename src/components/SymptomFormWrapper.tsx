'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

interface PatientProfile {
  nom: string;
  prenom: string;
  age: string;
  genre: string;
}

interface SymptomFormWrapperProps {
  patientProfile?: PatientProfile;
}

export default function SymptomFormWrapper({ patientProfile }: SymptomFormWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [SymptomFormComponent, setSymptomFormComponent] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadSymptomForm = async () => {
      try {
        setIsLoading(true);
        
        // Import dynamique pour éviter les erreurs de chargement
        const { default: SymptomForm } = await import('./SymptomForm');
        setSymptomFormComponent(() => SymptomForm);
        
      } catch (err) {
        console.error('Erreur lors du chargement du SymptomForm:', err);
        setError('Impossible de charger le formulaire de symptômes');
      } finally {
        setIsLoading(false);
      }
    };

    loadSymptomForm();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner 
          size="lg" 
          color="green" 
          text="Chargement du formulaire de diagnostic..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Recharger la page
            </button>
            <br />
            <button
              onClick={() => router.push('/diagnostic')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Retour au diagnostic
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!SymptomFormComponent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Formulaire non disponible</p>
      </div>
    );
  }

  return <SymptomFormComponent patientProfile={patientProfile} />;
}
