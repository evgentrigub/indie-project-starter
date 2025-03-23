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
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const route = useRoute();
const authStore = useAuthStore();

onMounted(async () => {
  // Extract token from URL
  const token = route.query.token as string;
  
  if (token) {
    try {
      // Process the auth callback
      await authStore.handleAuthCallback(token);
    } catch (error) {
      console.error('Authentication error:', error);
      // Redirect to login on error
      window.location.href = '/login';
    }
  } else {
    // No token found, redirect to login
    window.location.href = '/login';
  }
});
</script> 