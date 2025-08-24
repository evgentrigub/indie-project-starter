<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

// Handle navigation after hydration is complete
onMounted(async () => {
  await nextTick()
  
  setTimeout(() => {
    if (isAuthenticated.value) {
      navigateTo('/tasks')
    } else {
      navigateTo('/login')
    }
  }, 0)
})
</script>

<template>
</template> 