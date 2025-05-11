import { useToast as useNuxtToast } from 'vue-toastification'

export const useToast = () => {
  const toast = useNuxtToast()

  return {
    success: (message: string) => {
      toast.success(message, {
        position: 'top-right',
        timeout: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      })
    },
    error: (message: string) => {
      toast.error(message, {
        position: 'top-right',
        timeout: 5000,
        closeOnClick: true,
        pauseOnHover: true,
      })
    }
  }
} 