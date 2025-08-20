"use client";
import { forwardRef } from 'react';
import type { DiagnosticResult, ProductKit } from '@/types';

interface ReportToPrintProps { result: DiagnosticResult; kit: ProductKit | undefined; }

export const ReportToPrint = forwardRef<HTMLDivElement, ReportToPrintProps>(({ result, kit }, ref) => (
    <div ref={ref} className="p-10 text-gray-800">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">AFRIQUADIS - Bilan d'Autodiagnostic</h1>
        <p>Généré le {new Date().toLocaleDateString('fr-FR')}</p>
      </div>
      <div className="mb-6 p-4 border-l-4 border-yellow-500 bg-yellow-50">
        <h2 className="text-2xl font-semibold text-yellow-600 mb-2">{result.pathology.name}</h2>
        <p>Probabilité estimée : <strong>{result.score.toFixed(0)}%</strong></p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
            <h3 className="text-xl font-bold text-green-700 mb-3">Kit Conseillé</h3>
            {kit ? <div className="p-4 bg-green-50 rounded-lg"><h4 className="font-semibold text-lg">{kit.name}</h4><p className="text-sm">{kit.description}</p></div> : <p>Aucun kit.</p>}
        </div>
        <div>
            <h3 className="text-xl font-bold text-green-700 mb-3">Conseils Pratiques</h3>
            <ul className="text-sm space-y-2 list-disc list-inside">
                <li><strong>Alimentation:</strong> {result.pathology.advice.alimentation}</li>
                <li><strong>Hydratation:</strong> {result.pathology.advice.hydratation}</li>
                <li><strong>Repos:</strong> {result.pathology.advice.repos}</li>
                <li><strong>Hygiène:</strong> {result.pathology.advice.hygiene}</li>
                <li><strong>Activité:</strong> {result.pathology.advice.activite_physique}</li>
            </ul>
        </div>
      </div>
      <div className="mt-8 text-xs text-center text-gray-500">
        <p>Ce bilan est purement indicatif et ne constitue pas un avis médical. Pour toute question, consultez un professionnel de santé.</p>
        <p>www.afriquadis.com</p>
      </div>
    </div>
));
ReportToPrint.displayName = 'ReportToPrint';
