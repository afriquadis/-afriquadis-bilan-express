'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
  rounded = 'xl'
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden transform-gpu';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-afriquadis-600 via-orange-500 to-darkBlue-600 text-white hover:from-afriquadis-700 hover:via-orange-600 hover:to-darkBlue-700 focus:ring-afriquadis-500 shadow-medium hover:shadow-glow-blue',
    secondary: 'bg-white/80 backdrop-blur-sm text-neutral-700 border border-neutral-200 hover:border-afriquadis-400 hover:text-afriquadis-700 hover:shadow-soft focus:ring-afriquadis-500',
    accent: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-orange-500 shadow-medium hover:shadow-glow-orange',
    ghost: 'text-neutral-600 hover:text-afriquadis-600 hover:bg-neutral-50 focus:ring-afriquadis-500',
    outline: 'border-2 border-afriquadis-500 text-afriquadis-600 hover:bg-afriquadis-50 hover:border-afriquadis-600 focus:ring-afriquadis-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-medium',
    success: 'bg-gradient-to-r from-afriquadis-500 to-afriquadis-600 text-white hover:from-afriquadis-600 hover:to-afriquadis-700 focus:ring-afriquadis-500 shadow-medium'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3'
  };

  const roundedClasses = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses[rounded]} ${widthClass} ${className} hover:scale-105 active:scale-95`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-xl">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <span className={`flex items-center ${sizeClasses[size].split(' ').pop()} ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>
      
      {/* Shimmer effect for primary buttons */}
      {(variant === 'primary' || variant === 'accent') && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-500 -skew-x-12 animate-shimmer"></div>
      )}
      
      {/* Glow pulse for interactive feedback */}
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-30 transition-opacity duration-300 bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
    </button>
  );
}

// Button variants for common use cases
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="secondary" {...props} />
);

export const AccentButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="accent" {...props} />
);

export const GhostButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="ghost" {...props} />
);

export const IconButton = ({ icon, ...props }: ButtonProps & { icon: ReactNode }) => (
  <Button 
    variant="ghost" 
    size="sm" 
    rounded="full" 
    className="!p-2 aspect-square" 
    {...props}
  >
    {icon}
  </Button>
);
