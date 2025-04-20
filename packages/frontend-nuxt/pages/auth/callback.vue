<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Processing...</h1>
        <p class="py-6">Please wait while we complete your authentication.</p>
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const route = useRoute()

onMounted(async () => {
  const token = route.query.token as string
  if (token) {
    await authStore.handleAuthCallback(token)
  } else {
    // Handle error case
    navigateTo('/login')
  }
})
</script> 