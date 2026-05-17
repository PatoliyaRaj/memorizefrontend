'use client';

import React from 'react';
import {
  FieldValues,
  FormProvider,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';

interface FormProps<T extends FieldValues>
  extends React.FormHTMLAttributes<HTMLFormElement> {
  methods: UseFormReturn<T>;
  children: React.ReactNode;
}

/**
 * Form wrapper component that provides react-hook-form context
 * Usage:
 * const methods = useForm({ resolver: zodResolver(schema) })
 * <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
 *   <FormField ... />
 * </Form>
 */
export function Form<T extends FieldValues>({
  methods,
  children,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider {...methods}>
      <form {...props}>{children}</form>
    </FormProvider>
  );
}
