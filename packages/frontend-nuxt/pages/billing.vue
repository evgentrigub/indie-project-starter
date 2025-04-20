<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">Subscription Management</h1>
      <p class="text-base-content/70 mt-2">Manage your subscription plan</p>
    </div>
    
    <div class="flex justify-center">
      <div class="card bg-base-100 shadow-xl w-full max-w-md">
        <div class="card-body">
          <h2 class="card-title">Current Subscription Status</h2>
          
          <ClientOnly>
            <div v-if="isLoading" class="flex justify-center my-8">
              <span class="loading loading-spinner loading-lg"></span>
            </div>
            
            <div v-else-if="error" class="alert alert-error shadow-lg my-4">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ error }}</span>
              </div>
            </div>
            
            <div v-else>
              <div class="flex items-center mb-4">
                <div class="mr-4">
                  <div class="badge badge-lg" :class="hasActiveSubscription ? 'badge-success' : 'badge-warning'">
                    {{ hasActiveSubscription ? 'Active' : 'Inactive' }}
                  </div>
                </div>
                <div>
                  <p class="font-semibold">{{ hasActiveSubscription ? 'You have an active subscription' : 'You do not have an active subscription' }}</p>
                </div>
              </div>
              
              <div v-if="hasActiveSubscription" class="mb-4">
                <p class="text-base-content/70">Your subscription gives you access to all premium features.</p>
              </div>
              
              <div v-else class="alert alert-info mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                  <h3 class="font-bold">Premium Plan</h3>
                  <p class="text-sm">Unlock premium features with our subscription plan.</p>
                </div>
              </div>
              
              <div class="card-actions justify-end">
                <button 
                  v-if="!hasActiveSubscription" 
                  @click="createCheckoutSession" 
                  class="btn btn-primary" 
                  :disabled="processingAction"
                >
                  <span v-if="processingAction" class="loading loading-spinner loading-xs mr-2"></span>
                  Subscribe Now
                </button>
                
                <button 
                  v-else 
                  @click="cancelSubscription" 
                  class="btn btn-outline btn-error" 
                  :disabled="processingAction"
                >
                  <span v-if="processingAction" class="loading loading-spinner loading-xs mr-2"></span>
                  Cancel Subscription
                </button>
              </div>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
    
    <!-- Subscription Benefits -->
    <div class="mt-12">
      <h2 class="text-xl font-bold text-center mb-6">Subscription Benefits</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <h3 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Unlimited Tasks
            </h3>
            <p>Create and manage unlimited tasks with our premium plan.</p>
          </div>
        </div>
        
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <h3 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Advanced Features
            </h3>
            <p>Access to advanced features like task prioritization and categorization.</p>
          </div>
        </div>
        
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <h3 class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Premium Support
            </h3>
            <p>Get priority customer support with our subscription plan.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

const api = useApi()
const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const processingAction = ref(false)

const hasActiveSubscription = computed(() => {
  return authStore.user?.hasActiveSubscription || false
})

// Load user profile only on client-side
if (process.client) {
  isLoading.value = true
  authStore.fetchUserProfile()
    .catch((err: any) => {
      error.value = 'Failed to load subscription information'
    })
    .finally(() => {
      isLoading.value = false
    })
}

const createCheckoutSession = async () => {
  processingAction.value = true
  error.value = null
  
  try {
    const response = await api.post('/billing/create-checkout-session')
    // Redirect to Stripe Checkout
    window.location.href = response.data.url
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to create checkout session'
    processingAction.value = false
  }
}

const cancelSubscription = async () => {
  processingAction.value = true
  error.value = null
  
  try {
    await api.post('/billing/cancel-subscription')
    await authStore.fetchUserProfile() // Refresh user data
    processingAction.value = false
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to cancel subscription'
    processingAction.value = false
  }
}
</script> 