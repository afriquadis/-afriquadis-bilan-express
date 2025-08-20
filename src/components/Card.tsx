'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  delay?: number;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export default function Card({
  children,
  className = '',
  hover = true,
  clickable = false,
  onClick,
  delay = 0,
  variant = 'default',
  padding = 'lg',
  rounded = '2xl'
}: CardProps) {
  const baseClasses = 'transition-all duration-300 relative transform-gpu';
  
  const variantClasses = {
    default: 'bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-soft',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-glass',
    elevated: 'bg-white shadow-medium hover:shadow-large',
    outlined: 'bg-transparent border-2 border-neutral-300 hover:border-primary-400',
    gradient: 'bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 shadow-soft'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const roundedClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    '2xl': 'rounded-4xl',
    '3xl': 'rounded-6xl'
  };

  const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-medium' : '';
  const clickableClasses = clickable ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${roundedClasses[rounded]} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      {...(delay > 0 && { style: { animationDelay: `${delay}ms` } })}
    >
      {/* Shimmer effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-500 -skew-x-12 pointer-events-none ${roundedClasses[rounded]}`}></div>
      
      {/* Glow effect for interactive cards */}
      {clickable && (
        <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl ${roundedClasses[rounded]}`}></div>
      )}
      
      {/* Content */}
      <div className={`relative z-10 ${paddingClasses[padding]}`}>
        {children}
      </div>
    </div>
  );
}

// Modern Card variants
export function GlassCard({ children, className = '', ...props }: CardProps) {
  return (
    <Card
      variant="glass"
      className={`backdrop-blur-md ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
}

export function ElevatedCard({ children, className = '', ...props }: CardProps) {
  return (
    <Card
      variant="elevated"
      hover={true}
      className={`shadow-large hover:shadow-xl ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
}

export function InteractiveCard({ children, className = '', onClick, ...props }: CardProps) {
  return (
    <Card
      clickable={true}
      hover={true}
      onClick={onClick}
      className={`cursor-pointer hover:shadow-glow-blue ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
}

export function FeatureCard({ 
  children,
  className = '',
  icon,
  title,
  description,
  ...props
}: Omit<CardProps, 'children'> & { 
  children?: ReactNode;
  icon?: ReactNode; 
  title?: string; 
  description?: string; 
}) {
  return (
    <Card
      hover={true}
      className={`group ${className}`}
      {...props}
    >
      {icon && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-afriquadis-500 via-orange-500 to-darkBlue-600 text-white w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-xl font-bold text-darkBlue-800 mb-2 group-hover:text-afriquadis-600 transition-colors">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-neutral-600 mb-4 leading-relaxed">
          {description}
        </p>
      )}
        {children}
      </Card>
  );
}

export function StatCard({ 
  children,
  className = '',
  value,
  label,
  description,
  trend,
  ...props
}: Omit<CardProps, 'children'> & { 
  children?: ReactNode;
  value?: string | number; 
  label?: string; 
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const trendColors = {
    up: 'text-afriquadis-600',
    down: 'text-red-600',
    neutral: 'text-neutral-600'
  };

  return (
    <Card
      className={`text-center ${className}`}
      {...props}
    >
      {value && (
        <div className="text-3xl font-bold text-darkBlue-800 mb-1">
          {value}
        </div>
      )}
      {label && (
        <div className="text-sm text-orange-600 mb-2 font-semibold">
          {label}
        </div>
      )}
      {description && (
        <div className="text-xs text-neutral-600 mb-2">
          {description}
        </div>
      )}
      {trend && (
        <div className={`text-xs font-medium ${trendColors[trend]}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} Tendance
        </div>
      )}
      {children}
    </Card>
  );
}


