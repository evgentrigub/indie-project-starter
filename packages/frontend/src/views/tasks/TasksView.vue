<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Tasks</h1>
        <p class="text-base-content/70">Manage your tasks</p>
      </div>
      <button @click="showForm = true" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Task
      </button>
    </div>
    
    <!-- Task Form (Create/Edit) -->
    <div v-if="showForm" class="mb-8">
      <TaskForm 
        :task="selectedTask" 
        :isLoading="isSubmitting"
        @submit="handleSubmit" 
        @cancel="hideForm" 
      />
    </div>

    <!-- Tasks List -->
    <TaskList 
      :tasks="tasksStore.tasks" 
      :isLoading="tasksStore.isLoading" 
      :error="tasksStore.error"
      @edit="editTask"
      @delete="showDeleteModal"
    />
    
    <!-- Delete Confirmation Modal -->
    <div class="modal" :class="{ 'modal-open': taskToDelete }">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirm Delete</h3>
        <p class="py-4">Are you sure you want to delete this task? This action cannot be undone.</p>
        <div class="modal-action">
          <button @click="taskToDelete = null" class="btn btn-ghost">Cancel</button>
          <button @click="confirmDelete" class="btn btn-error" :disabled="isDeleting">
            <span v-if="isDeleting" class="loading loading-spinner loading-xs mr-2"></span>
            Delete
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="taskToDelete = null"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTasksStore, Task } from '@/store/tasks';
import TaskList from '@/components/tasks/TaskList.vue';
import TaskForm from '@/components/tasks/TaskForm.vue';

const tasksStore = useTasksStore();
const showForm = ref(false);
const selectedTask = ref<Task | null>(null);
const isSubmitting = ref(false);
const taskToDelete = ref<string | null>(null);
const isDeleting = ref(false);

onMounted(async () => {
  await tasksStore.fetchTasks();
});

const hideForm = () => {
  showForm.value = false;
  selectedTask.value = null;
};

const handleSubmit = async (taskData: any) => {
  isSubmitting.value = true;
  
  try {
    if (selectedTask.value) {
      // Update existing task
      await tasksStore.updateTask(selectedTask.value.id, taskData);
    } else {
      // Create new task
      await tasksStore.createTask(taskData);
    }
    hideForm();
  } finally {
    isSubmitting.value = false;
  }
};

const editTask = (task: Task) => {
  selectedTask.value = task;
  showForm.value = true;
  
  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const showDeleteModal = (taskId: string) => {
  taskToDelete.value = taskId;
};

const confirmDelete = async () => {
  if (!taskToDelete.value) return;
  
  isDeleting.value = true;
  
  try {
    await tasksStore.deleteTask(taskToDelete.value);
    taskToDelete.value = null;
  } finally {
    isDeleting.value = false;
  }
};
</script> 