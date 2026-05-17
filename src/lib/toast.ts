import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification utilities
 * Wraps sonner for consistent usage across the app
 * Uses the Design System colors and styling
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  closeButton?: boolean;
}

/**
 * Show success toast
 */
export function toastSuccess(message: string, options?: ToastOptions) {
  sonnerToast.success(message, {
    duration: options?.duration || 3000,
    description: options?.description,
    action: options?.action,
    closeButton: options?.closeButton !== false,
  });
}

/**
 * Show error toast
 */
export function toastError(message: string, options?: ToastOptions) {
  sonnerToast.error(message, {
    duration: options?.duration || 4000,
    description: options?.description,
    action: options?.action,
    closeButton: options?.closeButton !== false,
  });
}

/**
 * Show warning toast
 */
export function toastWarning(message: string, options?: ToastOptions) {
  sonnerToast.warning(message, {
    duration: options?.duration || 3000,
    description: options?.description,
    action: options?.action,
    closeButton: options?.closeButton !== false,
  });
}

/**
 * Show info toast
 */
export function toastInfo(message: string, options?: ToastOptions) {
  sonnerToast.info(message, {
    duration: options?.duration || 3000,
    description: options?.description,
    action: options?.action,
    closeButton: options?.closeButton !== false,
  });
}

/**
 * Show loading toast (promise-based)
 */
export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  options?: ToastOptions
) {
  return sonnerToast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
}

/**
 * Generic toast function
 */
export function toast(
  type: ToastType,
  message: string,
  options?: ToastOptions
) {
  const handlers = {
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
    info: toastInfo,
  };

  handlers[type](message, options);
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts() {
  sonnerToast.dismiss();
}
