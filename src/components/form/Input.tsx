'use client';

import React from 'react';

// Omit the native `size` attribute (HTMLInputElement.size is a number) to avoid conflict
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'filled' | 'flushed';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  error?: boolean;
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'py-1.5 px-2 text-sm',
  md: 'py-2.5 px-3 text-base',
  lg: 'py-3 px-4 text-lg',
};

const variantClasses: Record<'default' | 'filled' | 'flushed', string> = {
  default: 'border border-border-default bg-surface-base rounded-md',
  filled:
    'border-0 bg-surface-raised border-b-2 border-border-default rounded-t-md',
  flushed: 'border-0 border-b border-border-default bg-transparent rounded-0',
};

/**
 * Input component with theming support
 * Uses CSS variables from Design.md
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon,
      error,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const errorClasses = error
      ? 'border-error-text bg-error-bg/20 focus:border-error-text'
      : '';

    const disabledClasses = disabled
      ? 'opacity-50 cursor-not-allowed bg-surface-raised'
      : '';

    return (
      <div className="relative">
        <input
          ref={ref}
          disabled={disabled}
          className={`
            w-full
            font-body
            transition-all duration-200
            placeholder:text-text-tertiary
            focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-brand-600
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${errorClasses}
            ${disabledClasses}
            ${className || ''}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
            {icon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
