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
            <label class="label" for="name">
              <span class="label-text">Name</span>
            </label>
            <input 
              id="name"
              v-model="name" 
              type="text" 
              placeholder="Enter your name" 
              class="input input-bordered" 
              :class="{ 'input-error': errors.name }"
            />
            <label v-if="errors.name" class="label">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>
          
          <div class="form-control mb-4">
            <label class="label" for="email">
              <span class="label-text">Email</span>
            </label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="Enter your email" 
              class="input input-bordered" 
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
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="Enter your password" 
              class="input input-bordered" 
              :class="{ 'input-error': errors.password }"
              required
            />
            <label v-if="errors.password" class="label">
              <span class="label-text-alt text-error">{{ errors.password }}</span>
            </label>
          </div>
          
          <div class="form-control mt-6">
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="authStore.isLoading"
            >
              <span v-if="authStore.isLoading" class="loading loading-spinner loading-xs mr-2"></span>
              Sign Up
            </button>
          </div>
        </form>
        
        <div class="divider">OR</div>
        
        <button 
          @click="handleGoogleLogin" 
          class="btn btn-outline"
          :disabled="authStore.isLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mr-2">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign Up with Google
        </button>
        
        <div class="text-center mt-4">
          Already have an account? 
          <router-link to="/login" class="link link-primary">Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const errors = reactive({
  name: '',
  email: '',
  password: '',
});

const validateForm = () => {
  let isValid = true;
  errors.name = '';
  errors.email = '';
  errors.password = '';
  
  if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  if (!password.value || password.value.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  await authStore.signup(email.value, password.value, name.value);
};

const handleGoogleLogin = () => {
  authStore.googleLogin();
};
</script> 