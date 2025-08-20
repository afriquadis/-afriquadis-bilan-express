'use client';


import { useRouter } from 'next/navigation';
import UserAccount from '@/components/UserAccount';
import type { User } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  
  const onLogin = async (email: string, password: string): Promise<void> => {
    // TODO: Implémenter la logique de connexion
    console.log('Login attempt:', email, password);
    // Rediriger vers la page de diagnostic après connexion
    router.push('/diagnostic');
  };

  const onRegister = async (userData: Partial<User>): Promise<void> => {
    // TODO: Implémenter la logique d'inscription
    console.log('Register attempt:', userData);
    // Rediriger vers la page de diagnostic après inscription
    router.push('/diagnostic');
  };

  const onLogout = async (): Promise<void> => {
    // TODO: Implémenter la logique de déconnexion
    console.log('Logout');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <div className="max-w-4xl mx-auto p-6">
        <UserAccount onLogin={onLogin} onRegister={onRegister} onLogout={onLogout} defaultIsLogin={false} />
      </div>
    </div>
  );
}


