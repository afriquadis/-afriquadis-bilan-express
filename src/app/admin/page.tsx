'use client';

// import { useSession } from 'next-auth/react'; // Désactivé temporairement
import AdminGuard from '@/components/AdminGuard';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';

export default function AdminPage() {
  // const { data: session } = useSession(); // Temporairement désactivé
  const session: any = null; // Simulation

  return (
    <AdminGuard>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-neutral-800">
            Administration
          </h1>
          <p className="text-neutral-600">
            Panneau d'administration de Bilan Express
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card padding="lg" hover>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-800">
                Pathologies
              </h3>
              <p className="text-neutral-600">
                Gerer les pathologies et leurs relations avec les symptomes
              </p>
              <Link href="/admin/pathologies">
                <Button variant="primary" fullWidth>
                  Gerer les Pathologies
                </Button>
              </Link>
            </div>
          </Card>

          <Card padding="lg" hover>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-800">
                Utilisateurs
              </h3>
              <p className="text-neutral-600">
                Consulter les statistiques des utilisateurs
              </p>
              <Button variant="secondary" fullWidth disabled>
                Bientot disponible
              </Button>
            </div>
          </Card>

          <Card padding="lg" hover>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-800">
                Diagnostics
              </h3>
              <p className="text-neutral-600">
                Analyser les diagnostics realises
              </p>
              <Button variant="secondary" fullWidth disabled>
                Bientot disponible
              </Button>
            </div>
          </Card>
        </div>

        {session && (
          <Card padding="lg">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                Informations de session
              </h3>
              <div className="text-sm text-neutral-600">
                <p>Utilisateur: {session?.user?.email || 'Non connecté'}</p>
                <p>Role: Administrateur</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AdminGuard>
  );
}