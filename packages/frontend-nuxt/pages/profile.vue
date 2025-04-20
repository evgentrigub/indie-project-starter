<template>
  <div class="container mx-auto px-4 py-8">
    <div class="card bg-base-100 shadow-xl">
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
            <div class="badge" :class="{
              'badge-success': authStore.user?.hasActiveSubscription,
              'badge-error': !authStore.user?.hasActiveSubscription
            }">
              {{ authStore.user?.hasActiveSubscription ? 'Active' : 'Inactive' }}
            </div>
          </div>
          
          <div class="form-control mt-6">
            <Button
              type="submit"
              variant="primary"
              size="md"
              class="w-full"
              :disabled="authStore.isLoading"
            >
              {{ authStore.isLoading ? 'Saving...' : 'Save Changes' }}
            </Button>
          </div>
        </form>
        
        <div v-if="authStore.error" class="alert alert-error mt-4">
          {{ authStore.error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const profileForm = ref({
  email: authStore.user?.email || ''
})

onMounted(async () => {
  await authStore.fetchUserProfile()
  profileForm.value.email = authStore.user?.email || ''
})

const handleSubmit = async () => {
  const success = await authStore.updateProfile(profileForm.value)
  if (success) {
    // Show success message
  }
}
</script> 