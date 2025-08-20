"use client";
import { useState, useEffect } from 'react';
// import { signIn, signOut, useSession } from 'next-auth/react'; // Désactivé temporairement
import UserAccount from '@/components/UserAccount';
import type { User } from '@/types';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const { data: session } = useSession(); // Temporairement désactivé
  // const session = null; // Simulation - variable inutilisée supprimée

  useEffect(() => {
    // Simulation d'utilisateur pour éviter les erreurs NextAuth
    const simulatedUser = {
      id: 'patient-1',
      email: 'patient@example.com',
      name: 'Patient Invité',
      createdAt: new Date(),
      lastLogin: new Date(),
      preferences: { notifications: true, emailUpdates: false, language: 'fr', theme: 'light' }
    } as User;
    setUser(simulatedUser);
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    // await signIn('credentials', { email, password, redirect: true, callbackUrl: '/account' }); // Temporairement désactivé
    console.log('Login simulated:', email, password);
  };

  const handleRegister = async (userData: Partial<User>) => {
    const email = userData.email || '';
    const password = (userData as any).password || 'pass';
    // await signIn('credentials', { email, password, redirect: true, callbackUrl: '/account' }); // Temporairement désactivé
    console.log('Register simulated:', email, password);
  };

  const handleLogout = async () => {
    // await signOut({ redirect: true, callbackUrl: '/' }); // Temporairement désactivé
    console.log('Logout simulated');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre compte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-2xl font-bold text-green-800">AFRIQUADIS</h1>
            </div>
            <a href="/" className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Retour à l'accueil</span>
            </a>
          </div>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <UserAccount user={user || undefined} onLogin={handleLogin} onRegister={handleRegister} onLogout={handleLogout} defaultIsLogin={true} />
        </div>
      </main>

      <footer className="bg-green-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 AFRIQUADIS - Bilan Express. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
