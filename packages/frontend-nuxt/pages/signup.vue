<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold mb-4">Sign Up</h2>
        
        <form @submit.prevent="handleSignup" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              type="email"
              v-model="email"
              class="input input-bordered"
              required
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              type="password"
              v-model="password"
              class="input input-bordered"
              required
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              v-model="confirmPassword"
              class="input input-bordered"
              required
            />
          </div>
          
          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary" :disabled="authStore.isLoading">
                <span v-if="authStore.isLoading" class="loading loading-spinner"></span>
                SIGN UP
              </button>
          </div>
          
          <div class="divider">OR</div>
          
          <Button
            variant="outline"
            size="md"
            class="w-full"
            @click="authStore.googleLogin"
          >
            Continue with Google
          </Button>
          
          <p class="text-center mt-4">
            Already have an account?
            <NuxtLink to="/login" class="link link-primary">Login</NuxtLink>
          </p>
        </form>
        
        <div v-if="authStore.error" class="alert alert-error mt-4">
          {{ authStore.error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const authStore = useAuthStore()

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    authStore.error = 'Passwords do not match'
    return
  }
  
  const success = await authStore.signup(email.value, password.value)
  if (success) {
    // Navigation is handled in the store
  }
}
</script> 