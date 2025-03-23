<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="card bg-base-100 shadow-xl w-full max-w-md">
      <div class="card-body text-center">
        <div class="mb-4 text-success">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 mx-auto">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold">Payment Successful</h1>
        
        <p class="py-4">
          Thank you for your subscription! Your account has been successfully upgraded to our premium plan.
        </p>
        
        <div v-if="isLoading" class="flex justify-center my-4">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        
        <div v-else-if="error" class="alert alert-error shadow-lg my-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{{ error }}</span>
        </div>
        
        <div class="card-actions justify-center mt-6">
          <router-link to="/billing" class="btn btn-primary">Manage Subscription</router-link>
          <router-link to="/tasks" class="btn btn-outline">Go to Tasks</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    // Refresh user profile to get updated subscription status
    await authStore.fetchUserProfile();
    isLoading.value = false;
  } catch (err) {
    error.value = 'Failed to update your profile. Please contact support if your subscription is not active.';
    isLoading.value = false;
  }
});
</script> 