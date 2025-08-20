import type { Metadata } from "next";
import SymptomForm from "@/components/SymptomForm";

export const metadata: Metadata = {
  title: "Diagnostic AFRIQUADIS - Bilan Express",
  description: "Réalisez votre bilan de santé personnalisé avec l'intelligence artificielle AFRIQUADIS"
};

export default function DiagnosticPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-600 mb-4">
          🩺 Diagnostic AFRIQUADIS
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Sélectionnez vos symptômes et recevez un diagnostic personnalisé avec nos recommandations naturelles
        </p>
      </div>
      
      <SymptomForm />
    </div>
  );
}