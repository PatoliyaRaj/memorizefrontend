'use client';

import React from 'react';

/**
 * FormLabel component - styled label for form fields
 */
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export function FormLabel({
  children,
  required,
  className,
  ...props
}: FormLabelProps) {
  return (
    <label
      className={`block text-sm font-medium text-text-primary ${className || ''}`}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-error-text">*</span>}
    </label>
  );
}

/**
 * FormError component - displays validation error messages
 */
interface FormErrorProps {
  message: string;
}

export function FormError({ message }: FormErrorProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-error-bg border border-error-border">
      <svg
        className="w-4 h-4 flex-shrink-0 text-error-text"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <p className="text-sm text-error-text">{message}</p>
    </div>
  );
}

/**
 * FormMessage component - displays help text below fields
 */
interface FormMessageProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'success';
}

export function FormMessage({
  children,
  type = 'info',
}: FormMessageProps) {
  const typeClasses = {
    info: 'text-info-text',
    warning: 'text-warning-text',
    success: 'text-success-text',
  };

  return (
    <p className={`text-xs ${typeClasses[type]}`}>{children}</p>
  );
}

/**
 * FormGroup component - groups related form fields
 */
interface FormGroupProps {
  children: React.ReactNode;
  legend?: string;
  description?: string;
  className?: string;
}

export function FormGroup({
  children,
  legend,
  description,
  className,
}: FormGroupProps) {
  return (
    <fieldset className={`space-y-4 ${className || ''}`}>
      {legend && (
        <div>
          <legend className="text-base font-semibold text-text-primary">
            {legend}
          </legend>
          {description && (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}
