import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()
  
  // Initialize auth state only on client-side
  if (process.client) {
    await authStore.initializeAuth()
  }
  
  // Add global auth middleware
  addRouteMiddleware('auth', async (to) => {
    // Skip middleware on server-side to avoid hydration mismatches
    if (!process.client) {
      return
    }

    // Wait for auth store to be ready
    await nextTick()
    
    // If the user is not authenticated and trying to access a protected route
    if (!authStore.isAuthenticated && to.path !== '/login' && to.path !== '/signup' && to.path !== '/auth/callback') {
      return navigateTo('/login')
    }
    
    // If the user is authenticated and trying to access auth pages
    if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
      return navigateTo('/tasks')
    }
  }, { global: true })
}) 