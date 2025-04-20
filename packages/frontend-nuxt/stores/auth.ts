import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AxiosInstance } from 'axios'
import { useApi } from '../composables/useApi'

export interface User {
  id: string
  email: string
  hasActiveSubscription: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const api: AxiosInstance = useApi()

  const initializeAuth = async () => {
    if (process.client) {
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
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', { email, password })
      const { accessToken, user: userData } = response.data
      
      token.value = accessToken
      user.value = userData
      isAuthenticated.value = true
      
      if (process.client) {
        localStorage.setItem('token', accessToken)
      }
      
      // Set Authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      const router = useRouter()
      const redirectPath = router.currentRoute.value.query.redirect as string || '/tasks'
      router.push(redirectPath)
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed. Please check your credentials.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const signup = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/register', { email, password })
      const { accessToken, user: userData } = response.data
      
      token.value = accessToken
      user.value = userData
      isAuthenticated.value = true
      
      if (process.client) {
        localStorage.setItem('token', accessToken)
      }
      
      // Set Authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      const router = useRouter()
      router.push('/tasks')
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Signup failed. Please try again.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const googleLogin = () => {
    window.location.href = `${useRuntimeConfig().public.apiUrl}/auth/google`
  }

  const handleAuthCallback = async (callbackToken: string) => {
    try {
      const response = await api.get('/auth/callback', {
        params: { token: callbackToken }
      })
      const { accessToken, user: userData } = response.data
      
      token.value = accessToken
      user.value = userData
      isAuthenticated.value = true
      
      if (process.client) {
        localStorage.setItem('token', accessToken)
      }
      
      // Set Authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      const router = useRouter()
      router.push('/tasks')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Authentication failed'
      throw err
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile')
      user.value = response.data
      return response.data
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
    delete api.defaults.headers.common['Authorization']
    
    const router = useRouter()
    router.push('/login')
  }

  const updateProfile = async (userData: Partial<User>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/users/${user.value?.id}`, userData)
      user.value = response.data
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update profile.'
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