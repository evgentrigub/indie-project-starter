<template>
  <div class="navbar bg-base-100 shadow-md">
    <div class="container mx-auto">
      <!-- Left section -->
      <div class="flex-1">
        <router-link to="/" class="btn btn-ghost normal-case text-xl">
          Indie Todo
        </router-link>
      </div>
      
      <!-- Right section -->
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <!-- Public navigation -->
          <template v-if="!isAuthenticated">
            <li>
              <router-link to="/login">Login</router-link>
            </li>
            <li>
              <router-link to="/signup">Sign Up</router-link>
            </li>
          </template>
          
          <!-- Authenticated navigation -->
          <template v-else>
            <li>
              <router-link to="/tasks">Tasks</router-link>
            </li>
            <li>
              <router-link to="/billing">Billing</router-link>
            </li>
            <li>
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                  <div class="w-10 rounded-full bg-primary text-primary-content grid place-items-center">
                    <span>{{ userInitials }}</span>
                  </div>
                </label>
                <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                  <li>
                    <router-link to="/profile" class="justify-between">
                      Profile
                    </router-link>
                  </li>
                  <li>
                    <a @click.prevent="logout">Logout</a>
                  </li>
                </ul>
              </div>
            </li>
          </template>
          
          <!-- Theme toggle -->
          <li>
            <button @click="toggleTheme" class="btn btn-ghost btn-circle">
              <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const userInitials = computed(() => {
  if (!user.value || !user.value.name) {
    return user.value?.email.substring(0, 1).toUpperCase() || 'U';
  }
  
  const names = user.value.name.split(' ');
  if (names.length > 1) {
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }
  
  return names[0].charAt(0).toUpperCase();
});

const theme = ref(localStorage.getItem('theme') || 'light');

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
  document.documentElement.setAttribute('data-theme', theme.value);
};

const logout = () => {
  authStore.logout();
};

// Initialize theme from localStorage
document.documentElement.setAttribute('data-theme', theme.value);
</script> 