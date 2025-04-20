<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">{{ error || 'Processing...' }}</h1>
        <p v-if="!error" class="py-6">Please wait while we complete your authentication.</p>
        <div v-if="!error" class="py-4">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        <div v-else class="py-4">
          <button @click="() => navigateTo('/login')" class="btn btn-primary">
            Return to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const error = ref<string | null>(null)

onMounted(async () => {
  const token = route.query.token as string
  if (token) {
    try {
      await authStore.handleAuthCallback(token)
    } catch (err: any) {
      error.value = err.data?.message || 'Authentication failed'
    }
  } else {
    error.value = 'No authentication token found'
    setTimeout(() => {
      navigateTo('/login')
    }, 2000)
  }
})
</script> 