import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from 'nuxt/app'

export interface User {
  id: string
  email: string
  hasActiveSubscription: boolean
}

export interface LoginResponse {
  accessToken: string
  user: User
}

type ApiFetch = <T>(url: string, options?: any) => Promise<T>

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const { $apiFetch } = useNuxtApp()
  const apiFetch = $apiFetch as ApiFetch

  const initializeAuth = async () => {
    if (!process.client) return

    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      isAuthenticated.value = true
      
      try {
        await fetchUserProfile()
      } catch (err) {
        // If unable to fetch user profile, token might be expired
        logout()
      }
    }
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      const { accessToken, user: userData } = response
      
      token.value = accessToken
      user.value = userData
      isAuthenticated.value = true
      
      if (process.client) {
        localStorage.setItem('token', accessToken)
      }
      
      await navigateTo('/tasks')
      
      return true
    } catch (err: any) {
      error.value = err.data?.message || 'Login failed. Please check your credentials.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const signup = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiFetch<LoginResponse>('/auth/register', {
        method: 'POST',
        body: { email, password }
      })
      
      const { accessToken, user: userData } = response
      
      token.value = accessToken
      user.value = userData
      isAuthenticated.value = true
      
      if (process.client) {
        localStorage.setItem('token', accessToken)
      }
      
      await navigateTo('/tasks')
      
      return true
    } catch (err: any) {
      error.value = err.data?.message || 'Signup failed. Please try again.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const googleLogin = () => {
    if (!process.client) return
    const config = useRuntimeConfig()
    window.location.href = `${config.public.apiUrl}/auth/google`
  }

  const handleAuthCallback = async (callbackToken: string) => {
    try {
      const response = await apiFetch<LoginResponse>('/auth/callback', {
        method: 'POST',
        body: { token: callbackToken }
      })
      
      const { accessToken, user: userData } = response
      
      token.value = accessToken
      user.value = userData
      isAuthenticated.value = true
      
      if (process.client) {
        localStorage.setItem('token', accessToken)
      }
      
      await navigateTo('/tasks')
    } catch (err: any) {
      error.value = err.data?.message || 'Authentication failed'
      await navigateTo('/login')
      throw err
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await apiFetch<User>('/users/profile')
      user.value = response
      return response
    } catch (err) {
      throw err
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    
    if (process.client) {
      localStorage.removeItem('token')
    }
    
    navigateTo('/login')
  }

  const updateProfile = async (userData: Partial<User>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiFetch<User>(`/users/${user.value?.id}`, {
        method: 'PUT',
        body: userData
      })
      user.value = response
      return true
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to update profile.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    initializeAuth,
    login,
    signup,
    googleLogin,
    handleAuthCallback,
    fetchUserProfile,
    logout,
    updateProfile,
  }
}) 