import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="text-center">
        <LoadingSpinner 
          size="lg" 
          color="green" 
          text="Chargement de l'application..."
        />
        <p className="text-gray-600 mt-4 text-sm">
          Initialisation des composants...
        </p>
      </div>
    </div>
  );
}
