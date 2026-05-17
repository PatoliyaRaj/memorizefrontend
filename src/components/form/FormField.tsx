'use client';

import React from 'react';
import {
  FieldPath,
  FieldValues,
  Controller,
  ControllerProps,
} from 'react-hook-form';
import { FormLabel, FormMessage, FormError } from './FormElements';

type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  label?: string;
  description?: string;
  render: (props: { field: any; fieldState: any }) => React.ReactElement;
  className?: string;
  required?: boolean;
  error?: string;
};

/**
 * FormField component for managing form field state and rendering
 * Works with react-hook-form Controller
 * 
 * Usage:
 * <FormField
 *   control={control}
 *   name="email"
 *   label="Email"
 *   required
 *   render={({ field }) => <Input {...field} />}
 * />
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  description,
  render,
  className,
  required,
  error,
  ...props
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState }) => {
        const fieldError = fieldState.error?.message || error;
        
        return (
          <div className={`space-y-2 ${className || ''}`}>
            {label && (
              <FormLabel htmlFor={field.name} required={required}>
                {label}
              </FormLabel>
            )}
            {render({ field, fieldState })}
            {description && !fieldError && (
              <p className="text-sm text-text-tertiary">{description}</p>
            )}
            {fieldError && <FormError message={fieldError} />}
          </div>
        );
      }}
    />
  );
}
