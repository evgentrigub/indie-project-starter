<template>
  <div class="container mx-auto px-4 py-8">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold mb-4">Billing</h2>
        
        <div v-if="!authStore.user?.hasActiveSubscription" class="space-y-4">
          <p>You don't have an active subscription. Choose a plan to get started:</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title">Basic</h3>
                <p class="text-3xl font-bold">$9.99<span class="text-base font-normal">/month</span></p>
                <ul class="space-y-2 mt-4">
                  <li>✓ 5 tasks</li>
                  <li>✓ Basic support</li>
                  <li>✓ Email notifications</li>
                </ul>
                <div class="card-actions justify-end mt-4">
                  <Button
                    variant="primary"
                    size="md"
                    @click="handleSubscribe('basic')"
                    :disabled="isLoading"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
            
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title">Pro</h3>
                <p class="text-3xl font-bold">$19.99<span class="text-base font-normal">/month</span></p>
                <ul class="space-y-2 mt-4">
                  <li>✓ Unlimited tasks</li>
                  <li>✓ Priority support</li>
                  <li>✓ Email & SMS notifications</li>
                  <li>✓ Advanced analytics</li>
                </ul>
                <div class="card-actions justify-end mt-4">
                  <Button
                    variant="primary"
                    size="md"
                    @click="handleSubscribe('pro')"
                    :disabled="isLoading"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
            
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title">Enterprise</h3>
                <p class="text-3xl font-bold">$49.99<span class="text-base font-normal">/month</span></p>
                <ul class="space-y-2 mt-4">
                  <li>✓ Unlimited tasks</li>
                  <li>✓ 24/7 support</li>
                  <li>✓ Custom integrations</li>
                  <li>✓ Dedicated account manager</li>
                  <li>✓ API access</li>
                </ul>
                <div class="card-actions justify-end mt-4">
                  <Button
                    variant="primary"
                    size="md"
                    @click="handleSubscribe('enterprise')"
                    :disabled="isLoading"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="space-y-4">
          <div class="alert alert-success">
            <div class="flex-1">
              <label>Active Subscription</label>
              <p>Your subscription is active and will automatically renew.</p>
            </div>
          </div>
          
          <div class="card bg-base-200">
            <div class="card-body">
              <h3 class="card-title">Current Plan</h3>
              <p class="text-2xl font-bold">Pro Plan</p>
              <p class="text-sm text-gray-500">Next billing date: {{ nextBillingDate }}</p>
              
              <div class="card-actions justify-end mt-4">
                <Button
                  variant="outline"
                  size="md"
                  @click="handleCancelSubscription"
                  :disabled="isLoading"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="error" class="alert alert-error mt-4">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref<string | null>(null)
const nextBillingDate = ref('2024-05-19') // This should come from the backend

const handleSubscribe = async (plan: string) => {
  isLoading.value = true
  error.value = null
  
  try {
    // Here you would integrate with your payment provider (e.g., Stripe)
    // For now, we'll just simulate a successful subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    await authStore.updateProfile({ hasActiveSubscription: true })
  } catch (err: any) {
    error.value = err.message || 'Failed to subscribe. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleCancelSubscription = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Here you would integrate with your payment provider
    // For now, we'll just simulate a successful cancellation
    await new Promise(resolve => setTimeout(resolve, 1000))
    await authStore.updateProfile({ hasActiveSubscription: false })
  } catch (err: any) {
    error.value = err.message || 'Failed to cancel subscription. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script> 