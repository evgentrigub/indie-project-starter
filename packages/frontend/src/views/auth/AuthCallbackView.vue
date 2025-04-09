<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">Authenticating...</h1>
      <div class="flex justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  // Extract token from URL
  const token = route.query.token as string;
  
  if (token) {
    // Add a slight delay to avoid FrameIsBrowserFrameError
    setTimeout(async () => {
      try {
        // Process the auth callback
        await authStore.handleAuthCallback(token);
      } catch (error) {
        console.error('Authentication error:', error);
        // Redirect to login on error
        router.push('/login');
      }
    }, 100);
  } else {
    // No token found, redirect to login
    router.push('/login');
  }
});
</script> 