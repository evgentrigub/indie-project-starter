<template>
  <div>
    <div v-if="isLoading" class="flex justify-center my-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    
    <div v-else-if="error" class="alert alert-error shadow-lg my-4">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ error }}</span>
      </div>
    </div>
    
    <div v-else-if="tasks.length === 0" class="text-center my-8">
      <h3 class="text-lg font-semibold">No tasks found</h3>
      <p class="text-base-content/70 mt-2">Create your first task to get started!</p>
    </div>
    
    <div v-else class="grid grid-cols-1 gap-4 my-4">
      <div v-for="task in tasks" :key="task.id" class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body p-4">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="card-title" :class="{ 'line-through': task.status === 'done' }">
                {{ task.name }}
              </h2>
              <p v-if="task.description" class="mt-2 text-base-content/70">{{ task.description }}</p>
            </div>
            <div class="badge badge-lg" 
                :class="{
                  'badge-primary': task.status === 'todo',
                  'badge-secondary': task.status === 'in_progress',
                  'badge-success': task.status === 'done'
                }">
              {{ formatStatus(task.status) }}
            </div>
          </div>
          
          <div class="card-actions justify-end mt-4">
            <button @click="$emit('edit', task)" class="btn btn-sm btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit
            </button>
            
            <button 
              @click="updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')" 
              class="btn btn-sm" 
              :class="task.status === 'done' ? 'btn-outline btn-error' : 'btn-outline btn-success'"
            >
              <svg v-if="task.status === 'done'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {{ task.status === 'done' ? 'Reopen' : 'Complete' }}
            </button>
            
            <button @click="$emit('delete', task.id)" class="btn btn-sm btn-error btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTasksStore, Task } from '@/store/tasks';

const props = defineProps({
  tasks: {
    type: Array as () => Task[],
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
});

defineEmits(['edit', 'delete']);

const tasksStore = useTasksStore();

const formatStatus = (status: string) => {
  if (status === 'todo') return 'To Do';
  if (status === 'in_progress') return 'In Progress';
  if (status === 'done') return 'Done';
  return status;
};

const updateTaskStatus = async (id: string, status: string) => {
  await tasksStore.updateTask(id, { status });
};
</script> 