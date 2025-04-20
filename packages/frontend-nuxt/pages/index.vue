<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/tasks')
  } else {
    router.push('/login')
  }
})
</script>

<template>
  <div>
    <p>Redirecting...</p>
  </div>
</template> 