<template>
  <div class="flex justify-center">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-6 justify-center">Sign in</h2>
        
        <div v-if="authStore.error" class="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{{ authStore.error }}</span>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-control mb-4">
            <label class="label" for="email">
              <span class="label-text">Email</span>
            </label>
            <CommonTextInput 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="Enter your email" 
              :class="{ 'input-error': errors.email }"
              required
            />
            <label v-if="errors.email" class="label">
              <span class="label-text-alt text-error">{{ errors.email }}</span>
            </label>
          </div>
          
          <div class="form-control mb-6">
            <label class="label" for="password">
              <span class="label-text">Password</span>
            </label>
            <CommonTextInput 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="Enter your password" 
              :class="{ 'input-error': errors.password }"
              required
            />
            <label v-if="errors.password" class="label">
              <span class="label-text-alt text-error">{{ errors.password }}</span>
            </label>
          </div>
          
          <div class="form-control mt-6">
            <Button 
              @click="handleSubmit" 
              variant="primary"
              :disabled="authStore.isLoading"
              class="w-full"
            >
              <span v-if="authStore.isLoading" class="loading loading-spinner loading-xs mr-2"></span>
              Sign in
            </Button>
          </div>
        </form>
        
        <div class="divider">OR</div>
        
        <Button 
          @click="handleGoogleLogin" 
          variant="outline"
          class="w-full"
        >
          <div class="flex items-center justify-center">
            <img src="~/assets/icons/google-logo.svg" alt="Google logo" width="18" height="18" />
            <span class="ml-2">Login with Google</span>
          </div>
        </Button>
        
        <div class="text-center mt-4">
          Don't have an account? 
          <NuxtLink to="/signup" class="link link-primary">Sign up</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)

const email = ref('')
const password = ref('')
const errors = reactive({
  email: '',
  password: '',
})

const validateForm = () => {
  let isValid = true
  errors.email = ''
  errors.password = ''
  
  if (!email.value.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (!password.value) {
    errors.password = 'Password is required'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  await authStore.login(email.value, password.value)
}

const handleGoogleLogin = () => {
  authStore.googleLogin()
}
</script> 