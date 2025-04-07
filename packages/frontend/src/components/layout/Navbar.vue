<template>
  <div class="navbar bg-base-100 shadow-md">
    <div class="container mx-auto">
      <!-- Left section -->
      <div class="flex-1">
        <router-link :to="isAuthenticated ? '/' : '/login'" class="btn btn-ghost normal-case text-xl">
          Indie Todo
        </router-link>
      </div>
      
      <!-- Right section -->
      <div class="flex grow justify-end px-2">
        <div class="flex items-stretch">
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="btn btn-ghost">Login</router-link>
            <router-link to="/signup" class="btn btn-ghost">Sign Up</router-link>
          </template>

          <template v-else>
            <router-link to="/tasks" class="btn btn-ghost">Tasks</router-link>
            <router-link to="/billing" class="btn btn-ghost">Billing</router-link>
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-circle avatar flex items-center justify-center p-0">
                <div class="w-10 h-10 rounded-full bg-primary text-primary-content">
                  <span class="flex items-center justify-center h-full">{{ getInitials() }}</span>
                </div>
              </label>
              <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box">
                <li @click="closeDropdown">
                  <router-link to="/profile" class="justify-between">
                    Profile
                  </router-link>
                </li>
                <li>
                  <a @click.prevent="logout">Logout</a>
                </li>
              </ul>
            </div>
          </template>

          <button @click="toggleTheme" class="btn btn-ghost btn-circle ml-2 my-auto">
            <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          </button>
        </div>
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

const getInitials = () => {
  if (!user.value) {
    return '?';
  }
  const email = user.value.email;
  return email.charAt(0).toUpperCase();
};

const theme = ref(localStorage.getItem('theme') || 'light');

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
  document.documentElement.setAttribute('data-theme', theme.value);
};

const logout = () => {
  authStore.logout();
};

const closeDropdown = () => {
  const dropdownContent = document.activeElement as HTMLElement;
  if (dropdownContent) {
    dropdownContent.blur();
  }
};

// Initialize theme from localStorage
document.documentElement.setAttribute('data-theme', theme.value);
</script> 