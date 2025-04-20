<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Tasks</h1>
      <Button
        variant="primary"
        size="md"
        @click="showCreateModal = true"
      >
        Create Task
      </Button>
    </div>

    <ClientOnly>
      <div v-if="isLoading" class="flex justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <div v-else-if="error" class="alert alert-error">
        <span>{{ error }}</span>
      </div>

      <div v-else-if="tasks.length === 0" class="text-center py-8">
        <p class="text-gray-500">No tasks found. Create your first task!</p>
      </div>

      <div v-else class="grid gap-4">
        <div v-for="task in tasks" :key="task.id" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="card-title">{{ task.name }}</h2>
                <p class="mt-2 text-gray-600">{{ task.description }}</p>
              </div>
              <div class="badge" :class="{
                'badge-primary': task.status === 'todo',
                'badge-warning': task.status === 'in_progress',
                'badge-success': task.status === 'done'
              }">
                {{ task.status.replace('_', ' ') }}
              </div>
            </div>
            <div class="card-actions justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                @click="editTask(task)"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                @click="deleteTask(task.id)"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Create/Edit Task Modal -->
    <div v-if="showCreateModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">
          {{ editingTask ? 'Edit Task' : 'Create Task' }}
        </h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Name</span>
            </label>
            <input
              type="text"
              v-model="taskForm.name"
              class="input input-bordered"
              required
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Description</span>
            </label>
            <textarea
              v-model="taskForm.description"
              class="textarea textarea-bordered"
              required
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Status</span>
            </label>
            <select
              v-model="taskForm.status"
              class="select select-bordered"
              required
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          
          <div class="modal-action">
            <Button
              type="button"
              variant="outline"
              size="md"
              @click="showCreateModal = false"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              :disabled="isLoading"
            >
              {{ editingTask ? 'Update' : 'Create' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTasksStore } from '~/stores/tasks'
import type { Task } from '~/stores/tasks'
import { storeToRefs } from 'pinia'
import { useToast } from '~/composables/useToast'

const tasksStore = useTasksStore()
const { tasks, isLoading, error } = storeToRefs(tasksStore)

const showCreateModal = ref(false)
const editingTask = ref<Task | null>(null)
const taskForm = ref({
  name: '',
  description: '',
  status: 'todo' as Task['status']
})

onMounted(async () => {
  await tasksStore.fetchTasks()
})

const editTask = (task: Task) => {
  editingTask.value = task
  taskForm.value = {
    name: task.name,
    description: task.description || '',
    status: task.status
  }
  showCreateModal.value = true
}

const deleteTask = async (id: string) => {
  if (confirm('Are you sure you want to delete this task?')) {
    const success = await tasksStore.deleteTask(id)
    if (success) {
      useToast().success('Task deleted successfully')
    } else {
      useToast().error('Failed to delete task')
    }
  }
}

const handleSubmit = async () => {
  try {
    if (editingTask.value) {
      const updated = await tasksStore.updateTask(editingTask.value.id, taskForm.value)
      if (updated) {
        useToast().success('Task updated successfully')
      } else {
        useToast().error('Failed to update task')
      }
    } else {
      const created = await tasksStore.createTask(taskForm.value)
      if (created) {
        useToast().success('Task created successfully')
      } else {
        useToast().error('Failed to create task')
      }
    }
    
    showCreateModal.value = false
    editingTask.value = null
    taskForm.value = {
      name: '',
      description: '',
      status: 'todo'
    }
  } catch (err) {
    useToast().error('An error occurred')
  }
}
</script> 