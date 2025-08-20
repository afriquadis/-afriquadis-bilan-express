interface MedicalIconProps {
  className?: string;
  size?: number;
}

export default function MedicalIcon({ className = '', size = 24 }: MedicalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Caducée médical stylisé */}
      <defs>
        <linearGradient id="medicalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      
      {/* Bâton central */}
      <path
        d="M12 2L12 22"
        stroke="url(#medicalGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-pulse"
      />
      
      {/* Serpents stylisés */}
      <path
        d="M8 6C8 6 10 4 12 6C14 8 16 6 16 6"
        stroke="url(#medicalGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className="animate-float"
      />
      
      <path
        d="M8 18C8 18 10 16 12 18C14 20 16 18 16 18"
        stroke="url(#medicalGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className="animate-float"
        style={{animationDelay: '1s'}}
      />
      
      {/* Étoile de vie */}
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="url(#medicalGradient)"
        className="animate-pulse"
        style={{animationDelay: '0.5s'}}
      />
    </svg>
  );
}
