'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormGroup,
  Input,
  Textarea,
  Button,
} from '@/components/form';
import { toastSuccess, toastError } from '@/lib/toast';

/**
 * Complete form example with:
 * - Multiple input types (text, email, number, textarea)
 * - Custom validation
 * - Loading states
 * - Error handling
 * - Toast notifications
 */

const createBucketSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  capacity: z
    .number()
    .min(1, 'Capacity must be at least 1')
    .max(1000, 'Capacity must be less than 1000'),
  isPublic: z.boolean().default(false),
});

// Use output type (after defaults are applied) for the form
type CreateBucketFormData = z.output<typeof createBucketSchema>;

/**
 * Example: Create Study Bucket Form
 */
export function CreateBucketForm() {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<CreateBucketFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createBucketSchema) as any,
    mode: 'onChange',  // Validate as user types
    defaultValues: {
      name: '',
      description: '',
      capacity: 50,
      isPublic: false,
    },
  });

  const { watch } = methods;
  const description = watch('description');

  async function onSubmit(data: CreateBucketFormData) {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Created bucket:', data);
      
      toastSuccess('Bucket created!', {
        description: `Created "${data.name}" with capacity ${data.capacity}`,
      });

      // Reset form
      methods.reset();
    } catch (error) {
      toastError('Failed to create bucket', {
        description: 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="heading-display text-3xl">Create Study Bucket</h1>
        <p className="text-text-secondary">
          Organize your flashcards into focused study sessions
        </p>
      </div>

      {/* Form */}
      <Form
        methods={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormGroup
          legend="Bucket Details"
          description="Basic information about your bucket"
        >
          {/* Bucket Name */}
          <FormField
            control={methods.control}
            name="name"
            label="Bucket Name"
            description="Give your bucket a clear, memorable name"
            required
            render={({ field }) => (
              <Input
                {...field}
                placeholder="e.g., Biology Chapter 3: Cells"
                maxLength={50}
              />
            )}
          />

          {/* Description */}
          <FormField
            control={methods.control}
            name="description"
            label="Description"
            description="Optional: Describe what's in this bucket"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="What topics are covered in this bucket?"
                maxLength={500}
                showCharCount
              />
            )}
          />

          {/* Capacity */}
          <FormField
            control={methods.control}
            name="capacity"
            label="Initial Capacity"
            description="Expected number of cards in this bucket"
            required
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                min="1"
                max="1000"
                placeholder="50"
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            )}
          />

          {/* Public Toggle */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...methods.register('isPublic')}
                className="w-5 h-5 rounded border-border-default cursor-pointer"
              />
              <span className="text-base font-medium text-text-primary">
                Make this bucket public
              </span>
            </label>
            <p className="text-sm text-text-tertiary ml-8">
              Other learners can see and study from this bucket
            </p>
          </div>
        </FormGroup>

        {/* Form Actions */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Bucket'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => methods.reset()}
            disabled={isLoading}
          >
            Clear
          </Button>
        </div>
      </Form>

      {/* Form State Display (for debugging) */}
      <div className="p-4 rounded-lg border border-border-default bg-surface-raised">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">
          Form State (Debug)
        </h3>
        <pre className="text-xs text-text-tertiary overflow-auto">
          {JSON.stringify(
            {
              values: methods.getValues(),
              isDirty: methods.formState.isDirty,
              isValid: methods.formState.isValid,
              errors: methods.formState.errors,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}

/**
 * Example: Advanced Form with Conditional Fields
 */
const advancedFormSchema = z.object({
  type: z.enum(['quick', 'detailed']),
  title: z.string().min(1, 'Title is required'),
  quickAnswer: z.string().optional(),
  detailedAnswer: z.string().optional(),
  explanation: z.string().optional(),
  tags: z.string().optional(),
});

type AdvancedFormData = z.infer<typeof advancedFormSchema>;

export function CreateFlashcardForm() {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<AdvancedFormData>({
    resolver: zodResolver(advancedFormSchema),
    defaultValues: {
      type: 'quick',
      title: '',
      quickAnswer: '',
      detailedAnswer: '',
      explanation: '',
      tags: '',
    },
  });

  const cardType = methods.watch('type');

  async function onSubmit(data: AdvancedFormData) {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toastSuccess('Flashcard created!', {
        description: `Created ${cardType} flashcard: "${data.title}"`,
      });

      methods.reset();
    } catch (error) {
      toastError('Failed to create flashcard');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      className="w-full max-w-2xl space-y-6"
    >
      <FormGroup legend="Card Type">
        <div className="flex gap-4">
          {['quick', 'detailed'].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={type}
                {...methods.register('type')}
                className="w-4 h-4"
              />
              <span className="capitalize">{type} Card</span>
            </label>
          ))}
        </div>
      </FormGroup>

      <FormField
        control={methods.control}
        name="title"
        label="Question"
        required
        render={({ field }) => (
          <Input {...field} placeholder="What do you want to remember?" />
        )}
      />

      {/* Show based on card type */}
      {cardType === 'quick' && (
        <FormField
          control={methods.control}
          name="quickAnswer"
          label="Short Answer"
          required
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Brief answer (one sentence)"
            />
          )}
        />
      )}

      {cardType === 'detailed' && (
        <>
          <FormField
            control={methods.control}
            name="detailedAnswer"
            label="Detailed Answer"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Complete explanation"
                maxLength={1000}
                showCharCount
              />
            )}
          />

          <FormField
            control={methods.control}
            name="explanation"
            label="Additional Context"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Why is this important? Related concepts?"
                maxLength={500}
              />
            )}
          />
        </>
      )}

      <FormField
        control={methods.control}
        name="tags"
        label="Tags (comma-separated)"
        render={({ field }) => (
          <Input
            {...field}
            placeholder="biology, cells, structure"
          />
        )}
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="w-full"
      >
        Create Card
      </Button>
    </Form>
  );
}
