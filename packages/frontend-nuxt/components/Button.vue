<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <button
    class="px-4 py-2 rounded-md font-medium transition-colors"
    :class="{
      'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
      'bg-gray-600 text-white hover:bg-gray-700': variant === 'secondary',
      'border border-gray-300 hover:bg-gray-100': variant === 'outline',
      'text-sm': size === 'sm',
      'text-base': size === 'md',
      'text-lg': size === 'lg'
    }"
  >
    <slot />
  </button>
</template> 