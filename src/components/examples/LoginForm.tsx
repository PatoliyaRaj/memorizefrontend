'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormGroup,
  Input,
  Textarea,
  Button,
} from '@/components/form';
import { loginSchema, type LoginFormData } from '@/lib/validations/schemas';
import { toastSuccess, toastError } from '@/lib/toast';

/**
 * Example login form component
 * Demonstrates:
 * - react-hook-form integration
 * - Zod validation
 * - Toast notifications
 * - Dynamic theming with CSS variables
 */
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('Form data:', data);
      toastSuccess('Login successful!', {
        description: `Welcome back, ${data.email}`,
      });
    } catch (error) {
      toastError('Login failed', {
        description: 'Please check your credentials and try again',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-6"
    >
      <FormGroup legend="Login" description="Sign in to your account">
          <FormField
          control={methods.control}
          name="email"
          label="Email Address"
          required
          render={({ field }) => <Input {...field} type="email" placeholder="you@example.com" />}
        />

        <FormField
          control={methods.control}
          name="password"
          label="Password"
          required
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              placeholder="••••••••"
            />
          )}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            {...methods.register('rememberMe')}
            className="w-4 h-4 rounded border-border-default cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-text-secondary cursor-pointer"
          >
            Remember me
          </label>
        </div>
      </FormGroup>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        className="w-full"
      >
        Sign In
      </Button>

      <div className="text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <a href="/register" className="text-text-brand hover:underline font-medium">
          Sign up
        </a>
      </div>
    </Form>
  );
}
