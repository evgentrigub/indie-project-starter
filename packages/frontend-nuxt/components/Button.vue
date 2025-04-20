<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    class="px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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