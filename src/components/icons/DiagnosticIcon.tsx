interface DiagnosticIconProps {
  className?: string;
  size?: number;
}

export default function DiagnosticIcon({ className = '', size = 24 }: DiagnosticIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Graphique de diagnostic avec couleurs AFRIQUADIS */}
      <defs>
        <linearGradient id="diagnosticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      
      {/* Grille de fond */}
      <path
        d="M3 3L21 3L21 21L3 21Z"
        stroke="url(#diagnosticGradient)"
        strokeWidth="1"
        strokeOpacity="0.3"
        fill="none"
      />
      
      {/* Lignes de grille */}
      <path
        d="M3 9L21 9"
        stroke="url(#diagnosticGradient)"
        strokeWidth="0.5"
        strokeOpacity="0.2"
      />
      <path
        d="M3 15L21 15"
        stroke="url(#diagnosticGradient)"
        strokeWidth="0.5"
        strokeOpacity="0.2"
      />
      <path
        d="M9 3L9 21"
        stroke="url(#diagnosticGradient)"
        strokeWidth="0.5"
        strokeOpacity="0.2"
      />
      <path
        d="M15 3L15 21"
        stroke="url(#diagnosticGradient)"
        strokeWidth="0.5"
        strokeOpacity="0.2"
      />
      
      {/* Courbe de diagnostic */}
      <path
        d="M4 18L7 15L10 16L13 12L16 14L19 8L20 6"
        stroke="url(#diagnosticGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="animate-draw"
      />
      
      {/* Points de données */}
      <circle
        cx="7"
        cy="15"
        r="2"
        fill="url(#diagnosticGradient)"
        className="animate-pulse"
      />
      <circle
        cx="10"
        cy="16"
        r="2"
        fill="url(#diagnosticGradient)"
        className="animate-pulse"
        style={{animationDelay: '0.2s'}}
      />
      <circle
        cx="13"
        cy="12"
        r="2"
        fill="url(#diagnosticGradient)"
        className="animate-pulse"
        style={{animationDelay: '0.4s'}}
      />
      <circle
        cx="16"
        cy="14"
        r="2"
        fill="url(#diagnosticGradient)"
        className="animate-pulse"
        style={{animationDelay: '0.6s'}}
      />
      <circle
        cx="19"
        cy="8"
        r="2"
        fill="url(#diagnosticGradient)"
        className="animate-pulse"
        style={{animationDelay: '0.8s'}}
      />
      
      {/* Indicateur de santé */}
      <circle
        cx="20"
        cy="6"
        r="3"
        fill="url(#diagnosticGradient)"
        className="animate-bounce"
        style={{animationDelay: '1s'}}
      />
    </svg>
  );
}
