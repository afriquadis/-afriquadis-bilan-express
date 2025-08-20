"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Mode développement : accès libre à l'admin (toujours autorisé en local)
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      setIsVerified(true);
      return;
    }
    
    if (sessionStorage.getItem('isAdmin') !== 'true') {
      router.replace('/login');
    } else {
      setIsVerified(true);
    }
  }, [router]);

  if (!isVerified) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès Admin</h2>
          <p className="text-gray-600 mb-6">Vérification des droits d'accès...</p>
          
          {/* Bouton de déverrouillage pour développement */}
          <button
            onClick={() => {
              sessionStorage.setItem('isAdmin', 'true');
              setIsVerified(true);
            }}
            className="w-full bg-gradient-to-r from-afriquadis-600 to-darkBlue-600 hover:from-afriquadis-700 hover:to-darkBlue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            🚀 Accès Développement
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            Mode développement - Accès direct autorisé
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default AdminGuard;
