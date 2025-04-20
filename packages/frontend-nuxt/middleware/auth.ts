export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // If the user is not authenticated and trying to access a protected route
  if (!authStore.isAuthenticated && to.path !== '/login' && to.path !== '/signup') {
    return navigateTo('/login')
  }
  
  // If the user is authenticated and trying to access auth pages
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/tasks')
  }
}) 