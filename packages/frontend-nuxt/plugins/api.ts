import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const apiFetch = $fetch.create({
    baseURL: config.public.apiUrl,
    async onRequest({ options }) {
      const token = process.client ? localStorage.getItem('token') : null
      if (token) {
        options.headers = {
          Authorization: `Bearer ${token}`
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
      }
    }
  })
  
  return {
    provide: {
      apiFetch
    }
  }
}) 