<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-center">
      <div class="card bg-base-100 shadow-xl w-full max-w-md">
        <div class="card-body">
          <h2 class="card-title text-2xl font-bold mb-4">Profile</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                type="email"
                v-model="profileForm.email"
                class="input input-bordered"
                required
                disabled
              />
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Subscription Status</span>
              </label>
              <ClientOnly>
                <div v-if="pending" class="loading loading-spinner loading-sm"></div>
                <div v-else class="badge" :class="{
                  'badge-success': authStore.user?.hasActiveSubscription,
                  'badge-error': !authStore.user?.hasActiveSubscription
                }">
                  {{ authStore.user?.hasActiveSubscription ? 'Active' : 'Inactive' }}
                </div>
              </ClientOnly>
            </div>
            
            <div class="form-control mt-6">
              <ClientOnly>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  class="w-full"
                  :disabled="authStore.isLoading || pending"
                >
                  {{ authStore.isLoading ? 'Saving...' : 'Save Changes' }}
                </Button>
              </ClientOnly>
            </div>
          </form>
          
          <div v-if="authStore.error" class="alert alert-error mt-4">
            {{ authStore.error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const profileForm = ref({
  email: authStore.user?.email || ''
})

const { pending } = useAsyncData('profile', async () => {
  if (process.client) {
    await authStore.fetchUserProfile()
    profileForm.value.email = authStore.user?.email || ''
  }
})

const handleSubmit = async () => {
  try {
    const success = await authStore.updateProfile(profileForm.value)
    if (success) {
      useToast().success('Profile updated successfully')
    }
  } catch (error) {
    useToast().error('Failed to update profile')
  }
}
</script> 