<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <h2 class="card-title">{{ task ? 'Edit Task' : 'Create New Task' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-control w-full mb-4">
          <label class="label" for="task-name">
            <span class="label-text">Task Name</span>
            <span class="text-red-500">*</span>
          </label>
          <input 
            id="task-name"
            v-model="formData.name" 
            type="text" 
            placeholder="Enter task name" 
            class="input input-bordered w-full" 
            :class="{ 'input-error': errors.name }"
            required
          />
          <label v-if="errors.name" class="label">
            <span class="text-error">{{ errors.name }}</span>
          </label>
        </div>
        
        <div class="form-control w-full mb-4">
          <label class="label" for="task-description">
            <span class="label-text">Description</span>
          </label>
          <textarea 
            id="task-description"
            v-model="formData.description" 
            class="textarea textarea-bordered h-24" 
            placeholder="Enter task description (optional)"
          ></textarea>
        </div>
        
        <div class="form-control w-full mb-6">
          <label class="label" for="task-status">
            <span class="label-text">Status</span>
          </label>
          <select 
            id="task-status"
            v-model="formData.status" 
            class="select select-bordered w-full"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        
        <div class="card-actions justify-end">
          <button 
            type="button" 
            class="btn btn-ghost" 
            @click="$emit('cancel')"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading loading-spinner loading-xs mr-2"></span>
            {{ task ? 'Update Task' : 'Create Task' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { Task } from '@/store/tasks';

const props = defineProps({
  task: {
    type: Object as () => Task | null,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const formData = reactive({
  name: '',
  description: '',
  status: 'todo',
});

const errors = reactive({
  name: '',
});

// Watch for changes in the task prop
watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.name = newTask.name;
    formData.description = newTask.description || '';
    formData.status = newTask.status;
  } else {
    formData.name = '';
    formData.description = '';
    formData.status = 'todo';
  }
}, { immediate: true });

const handleSubmit = () => {
  // Reset errors
  errors.name = '';
  
  // Validate form
  if (!formData.name.trim()) {
    errors.name = 'Task name is required';
    return;
  }
  
  emit('submit', {
    name: formData.name.trim(),
    description: formData.description.trim(),
    status: formData.status,
  });
};
</script> 