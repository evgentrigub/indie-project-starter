declare module 'vue-toastification' {
  export function useToast(): {
    success: (message: string, options?: any) => void;
    error: (message: string, options?: any) => void;
  };
} 