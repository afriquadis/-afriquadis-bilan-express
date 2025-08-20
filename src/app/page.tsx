'use client';

import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  HeartIcon, 
  BoltIcon,
  SparklesIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Card, { FeatureCard, StatCard } from '@/components/Card';
import Button from '@/components/Button';
import MedicalIcon from '@/components/icons/MedicalIcon';
import DiagnosticIcon from '@/components/icons/DiagnosticIcon';

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-afriquadis-50 via-orange-50 to-darkBlue-50 opacity-60"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-24 h-24 bg-darkBlue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-afriquadis-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
        
        <div className="relative space-y-6">
          {/* Logo et titre */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-afriquadis-500 via-orange-500 to-darkBlue-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-3xl text-white font-bold">A</span>
            </div>
        </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-heading bg-gradient-to-r from-afriquadis-600 via-orange-500 to-darkBlue-600 bg-clip-text text-transparent">
            Bilan Express
          </h1>
          
          <p className="text-xl md:text-2xl text-darkBlue-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Diagnostic médical intelligent et personnalisé basé sur l'IA
          </p>
          
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Analysez vos symptômes avec l'intelligence artificielle et recevez des recommandations personnalisées de produits AFRIQUADIS
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link href="/diagnostic">
            <Button 
              variant="primary" 
              size="lg"
              className="px-8 py-4"
              icon={<DiagnosticIcon className="w-6 h-6" />}
            >
              Commencer le Bilan
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button 
              variant="secondary" 
              size="lg"
              className="px-6 py-4"
              icon={<MagnifyingGlassIcon className="w-5 h-5" />}
            >
              Tableau de Bord
            </Button>
              </Link>
            
          <Link href="/contact">
            <Button 
              variant="accent" 
              size="lg"
              className="px-6 py-4"
              icon={<UserGroupIcon className="w-5 h-5" />}
            >
              Parler à un Expert
            </Button>
              </Link>
            </div>
      </section>

        {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<DiagnosticIcon className="w-8 h-8" />}
          title="Diagnostic Rapide"
          description="Analyse de vos symptômes en moins de 5 minutes avec notre IA médicale avancée"
          className="animate-fade-in-up"
          delay={100}
        />
        <FeatureCard
          icon={<ShieldCheckIcon className="w-8 h-8" />}
          title="Fiable et Sécurisé"
          description="Algorithmes validés médicalement et protection complète de vos données"
          className="animate-fade-in-up"
          delay={200}
        />
        <FeatureCard
          icon={<MedicalIcon className="w-8 h-8" />}
          title="Recommandations Personnalisées"
          description="Conseils adaptés à votre profil et produits AFRIQUADIS recommandés"
          className="animate-fade-in-up"
          delay={300}
        />
        <FeatureCard
          icon={<ClockIcon className="w-8 h-8" />}
          title="Suivi en Temps Réel"
          description="Suivez l'évolution de vos symptômes et votre progression santé"
          className="animate-fade-in-up"
          delay={400}
        />
        <FeatureCard
          icon={<UserGroupIcon className="w-8 h-8" />}
          title="Historique Complet"
          description="Accédez à tous vos diagnostics et consultez votre évolution"
          className="animate-fade-in-up"
          delay={500}
        />
        <FeatureCard
          icon={<SparklesIcon className="w-8 h-8" />}
          title="Conseils Personnalisés"
          description="Recevez des conseils santé adaptés à votre situation"
          className="animate-fade-in-up"
          delay={600}
        />
      </section>

      {/* Statistics */}
      <section className="grid md:grid-cols-3 gap-8">
        <StatCard
          value="98%"
          label="Précision"
          description="Taux de précision de nos diagnostics"
          className="animate-scale-up"
          delay={400}
        />
        <StatCard
          value="5min"
          label="Rapidité"
          description="Temps moyen pour un diagnostic complet"
          className="animate-scale-up"
          delay={500}
        />
        <StatCard
          value="50k+"
          label="Utilisateurs"
          description="Personnes qui nous font confiance"
          className="animate-scale-up"
          delay={600}
        />
      </section>

      {/* Recent Activity */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-heading text-neutral-800 mb-4">
            Dernière Activité
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Consultez vos diagnostics récents et suivez votre santé
          </p>
        </div>

        <Card padding="xl" className="animate-fade-in delay-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-primary-600" />
              </div>
            <div>
                <h3 className="font-semibold text-neutral-800">Aucun diagnostic récent</h3>
                <p className="text-neutral-600">Commencez votre premier bilan de santé</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/register">
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="px-6 py-4"
                >
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}