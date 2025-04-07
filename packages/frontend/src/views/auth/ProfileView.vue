<template>
  <div class="flex justify-center">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-6 justify-center">Your Profile</h2>
        
        <div v-if="authStore.isLoading" class="flex justify-center my-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        
        <div v-else-if="authStore.error" class="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{{ authStore.error }}</span>
        </div>
        
        <div v-else>
          <div class="form-control mb-4">
            <label class="label" for="email">
              <span class="label-text">Email</span>
            </label>
            <input 
              id="email"
              v-model="userData.email" 
              type="email" 
              placeholder="Enter your email" 
              class="input input-bordered" 
              disabled
            />
            <label class="label">
              <span class="label-text-alt text-base-content/60">Email cannot be changed</span>
            </label>
          </div>
          
          <div class="flex items-center justify-between mb-6">
            <div>
              <div class="text-sm font-medium">Subscription Status</div>
              <div class="mt-1">
                <span 
                  class="badge" 
                  :class="userData.hasActiveSubscription ? 'badge-success' : 'badge-warning'"
                >
                  {{ userData.hasActiveSubscription ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
            <router-link to="/billing" class="btn btn-sm btn-outline">
              Manage Subscription
            </router-link>
          </div>
        </div>
        
        <div class="divider mt-8 mb-4"></div>
        
        <button 
          @click="logout" 
          class="btn btn-outline btn-error"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();

const userData = reactive({
  id: '',
  email: '',
  hasActiveSubscription: false
});

onMounted(async () => {
  if (authStore.user) {
    userData.id = authStore.user.id;
    userData.email = authStore.user.email;
    userData.hasActiveSubscription = authStore.user.hasActiveSubscription;
  }
});

const logout = () => {
  authStore.logout();
};
</script> 