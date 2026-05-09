"use client";

import { toast } from "sonner";

/**
 * Wrapped toast API — consistent notification feedback.
 */
export function useToast() {
  return {
    success: (message: string, description?: string) =>
      toast.success(message, { description }),
    error: (message: string, description?: string) =>
      toast.error(message, { description }),
    warning: (message: string, description?: string) =>
      toast.warning(message, { description }),
    info: (message: string, description?: string) =>
      toast.info(message, { description }),
    loading: (message: string) => toast.loading(message),
    dismiss: (id?: string | number) => toast.dismiss(id),
    promise: toast.promise,
  };
}
