<template>
  <div class="form-control w-full">
    <label v-if="label" class="label" :for="inputId">
      <span class="label-text">{{ label }}</span>
      <span v-if="required" class="text-error">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="input input-bordered w-full"
      :class="{ 'input-error': error }"
    />
    <label v-if="error" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur']);

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`);

// Wrap input handler in try-catch to prevent extension errors from breaking the app
const handleInput = (event: Event) => {
  try {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
  } catch (error) {
    console.debug('Error in input handler (possibly from extension):', error);
  }
};

const handleFocus = (event: Event) => {
  try {
    emit('focus', event);
  } catch (error) {
    console.debug('Error in focus handler (possibly from extension):', error);
  }
};

const handleBlur = (event: Event) => {
  try {
    emit('blur', event);
  } catch (error) {
    console.debug('Error in blur handler (possibly from extension):', error);
  }
};
</script> 