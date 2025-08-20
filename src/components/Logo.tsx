import Image from 'next/image';
import { useState } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  ring?: boolean;
  src?: string; // chemin personnalisé du logo
}

export default function Logo({ size = 40, className = '', ring = true, src = '/afriquadis-logo.png' }: LogoProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      aria-label="AFRIQUADIS Logo"
    >
      {/* Anneau dégradé propre via wrapper */}
      <div className={`absolute inset-0 ${ring ? 'p-[2px]' : ''} rounded-full bg-gradient-to-br from-afriquadis-500 via-orange-500 to-darkBlue-600 shadow-lg`}></div>
      {/* Halo doux */}
      {ring && (
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-afriquadis-400/20 via-orange-400/20 to-darkBlue-400/20 blur-md"></div>
      )}

      {/* Conteneur image */}
      <div className="relative inset-0 w-full h-full rounded-full overflow-hidden bg-white">
        <Image
          src={imageSrc}
          alt="AFRIQUADIS Logo"
          fill
          sizes="(max-width: 768px) 40px, 64px"
          className="object-cover"
          priority
          onError={() => {
            // Fallback automatique vers l'icône par défaut
            if (imageSrc !== '/icon.svg') setImageSrc('/icon.svg');
          }}
        />
      </div>
    </div>
  );
}


