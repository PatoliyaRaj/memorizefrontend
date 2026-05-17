'use client';

import React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  asChild?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-600',
  secondary:
    'bg-surface-raised text-text-primary border border-border-default hover:bg-surface-hover focus:ring-brand-600',
  ghost:
    'bg-transparent text-text-brand hover:bg-surface-raised focus:ring-brand-600',
  danger:
    'bg-error-text text-white hover:opacity-90 focus:ring-error-text',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm font-medium',
  md: 'px-4 py-2.5 text-base font-medium',
  lg: 'px-6 py-3 text-lg font-semibold',
};

/**
 * Button component with multiple variants and sizes
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading,
      disabled,
      icon,
      className,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const disabledClasses = disabled || isLoading
      ? 'opacity-60 cursor-not-allowed'
      : 'cursor-pointer';

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2
          font-body font-medium
          rounded-md
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-base
          active:scale-95
          whitespace-nowrap
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabledClasses}
          ${className || ''}
        `}
        {...props}
      >
        {isLoading && (
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !isLoading && <span className="flex">{icon}</span>}
        <Slottable>{children}</Slottable>
      </Comp>
    );
  }
);

Button.displayName = 'Button';
