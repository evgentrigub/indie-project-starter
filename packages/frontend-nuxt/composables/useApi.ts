import type { AxiosInstance } from 'axios'

export const useApi = () => {
  const config = useRuntimeConfig()
  
  const fetchWithAuth = async <T>(url: string, options: any = {}): Promise<T> => {
    const token = localStorage.getItem('token')
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
    
    return $fetch<T>(url, {
      baseURL: config.public.apiUrl,
      ...options,
      headers
    })
  }
  
  return {
    fetchWithAuth
  }
} 