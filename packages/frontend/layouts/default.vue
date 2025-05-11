<template>
  <div class="min-h-screen bg-base-200">
    <LayoutNavbar />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <ClientOnly>
      <SpeedInsights />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Initialize auth state on client-side
if (process.client) {
  authStore.initializeAuth()
}
</script> 