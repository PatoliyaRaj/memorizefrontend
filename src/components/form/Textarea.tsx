'use client';

import React from 'react';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'flushed';
  error?: boolean;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

const variantClasses = {
  default: 'border border-border-default bg-surface-base rounded-md',
  filled:
    'border-0 bg-surface-raised border-b-2 border-border-default rounded-t-md',
  flushed: 'border-0 border-b border-border-default bg-transparent rounded-0',
};

/**
 * Textarea component with theming support
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'default',
      error,
      disabled,
      className,
      maxLength,
      showCharCount = false,
      helperText,
      value,
      ...props
    },
    ref
  ) => {
    const characterCount =
      typeof value === 'string' ? value.length : value ? value.toString().length : 0;
    const errorClasses = error
      ? 'border-error-text bg-error-bg/20 focus:border-error-text'
      : '';

    const disabledClasses = disabled
      ? 'opacity-50 cursor-not-allowed bg-surface-raised'
      : '';

    return (
      <div className="space-y-2">
        <textarea
          ref={ref}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            w-full
            font-body
            transition-all duration-200
            placeholder:text-text-tertiary
            focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-brand-600
            py-2.5 px-3
            rounded-md
            resize-vertical
            min-h-[100px]
            ${variantClasses[variant]}
            ${errorClasses}
            ${disabledClasses}
            ${className || ''}
          `}
          {...props}
        />
        <div className="flex items-center justify-between">
          {helperText && (
            <p className="text-xs text-text-tertiary">{helperText}</p>
          )}
          {showCharCount && maxLength && (
            <p className="text-xs text-text-tertiary">
              {characterCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
