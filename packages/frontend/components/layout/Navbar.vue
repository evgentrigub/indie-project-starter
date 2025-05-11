<template>
  <div class="navbar bg-base-100 shadow-md">
    <div class="container mx-auto">
      <!-- Left section -->
      <div class="flex-1">
        <NuxtLink to="/" class="btn btn-ghost normal-case text-xl">
          Indie Todo
        </NuxtLink>
      </div>
      
      <!-- Right section -->
      <div class="flex grow justify-end px-2">
        <div class="flex items-stretch">
          <ClientOnly>
            <template v-if="!isAuthenticated">
              <NuxtLink to="/login" class="btn btn-ghost">Sign in</NuxtLink>
              <NuxtLink to="/signup" class="btn btn-ghost">Sign up</NuxtLink>
            </template>

            <template v-else>
              <NuxtLink to="/tasks" class="btn btn-ghost">Tasks</NuxtLink>
              <NuxtLink to="/billing" class="btn btn-ghost">Billing</NuxtLink>
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar flex items-center justify-center p-0">
                  <div class="w-10 h-10 rounded-full bg-primary text-primary-content">
                    <span class="flex items-center justify-center h-full">{{ getInitials() }}</span>
                  </div>
                </label>
                <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box">
                  <li @click="closeDropdown">
                    <NuxtLink to="/profile" class="justify-between">
                      Profile
                    </NuxtLink>
                  </li>
                  <li>
                    <a @click.prevent="logout">Logout</a>
                  </li>
                </ul>
              </div>
            </template>

            <Button 
              @click="toggleTheme" 
              variant="ghost"
              class="ml-2 my-auto"
            >
              <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </Button>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const getInitials = () => {
  if (!user.value) {
    return '?'
  }
  const email = user.value.email
  return email.charAt(0).toUpperCase()
}

const theme = ref(process.client ? localStorage.getItem('theme') || 'light' : 'light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  if (process.client) {
    localStorage.setItem('theme', theme.value)
    document.documentElement.setAttribute('data-theme', theme.value)
  }
}

const logout = () => {
  authStore.logout()
}

const closeDropdown = () => {
  const dropdownContent = document.activeElement as HTMLElement
  if (dropdownContent) {
    dropdownContent.blur()
  }
}

// Initialize theme from localStorage
if (process.client) {
  document.documentElement.setAttribute('data-theme', theme.value)
}
</script> 