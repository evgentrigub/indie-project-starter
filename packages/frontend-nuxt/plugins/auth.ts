export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Initialize auth state
  await authStore.initializeAuth()
  
  // Add global auth middleware
  addRouteMiddleware('auth', (to) => {
    // If the user is not authenticated and trying to access a protected route
    if (!authStore.isAuthenticated && to.path !== '/login' && to.path !== '/signup') {
      return navigateTo('/login')
    }
    
    // If the user is authenticated and trying to access auth pages
    if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
      return navigateTo('/tasks')
    }
  }, { global: true })
}) 