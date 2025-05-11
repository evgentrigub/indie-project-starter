<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

// Handle navigation in setup to avoid hydration issues
if (process.client) {
  watchEffect(() => {
    if (isAuthenticated.value) {
      navigateTo('/tasks')
    } else {
      navigateTo('/login')
    }
  })
}
</script>

<template>
  <SpeedInsights />
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">Welcome to Indie Todo</h1>
      <p class="mb-4">Please wait while we redirect you...</p>
      <div class="loading loading-spinner loading-lg"></div>
    </div>
  </div>
</template> 