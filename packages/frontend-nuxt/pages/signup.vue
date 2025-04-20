<template>
  <div class="flex justify-center">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-6 justify-center">Sign Up</h2>
        
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
              Sign Up
            </Button>
          </div>
        </form>
        
        <div class="divider">OR</div>
        
        <Button 
          @click="handleGoogleLogin" 
          variant="outline"
          class="w-full"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
          Sign Up with Google
        </Button>
        
        <div class="text-center mt-4">
          Already have an account? 
          <NuxtLink to="/login" class="link link-primary">Login</NuxtLink>
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
  
  if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (!password.value || password.value.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  await authStore.signup(email.value, password.value)
}

const handleGoogleLogin = () => {
  authStore.googleLogin()
}
</script> 