<template>
  <div class="min-h-screen bg-base-200">
    <LayoutNavbar />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const logout = () => {
  authStore.logout()
}
</script> 