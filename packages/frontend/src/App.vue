<template>
  <div class="min-h-screen bg-base-200">
    <Navbar />
    <main class="container-custom pb-16">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  // Load user from local storage if token exists
  await authStore.initializeAuth();
});
</script> 