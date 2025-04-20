import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const baseURL = typeof window !== 'undefined' ? (config.public.apiUrl || '/api') : '/api'

  const apiService = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return {
    provide: {
      api: apiService
    }
  }
}) 