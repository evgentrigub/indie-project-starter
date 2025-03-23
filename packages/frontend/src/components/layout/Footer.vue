<template>
  <footer class="footer footer-center p-4 bg-base-300 text-base-content fixed bottom-0 w-full">
    <div>
      <p>Copyright © {{ currentYear }} - Indie Todo - All Rights Reserved</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script> 