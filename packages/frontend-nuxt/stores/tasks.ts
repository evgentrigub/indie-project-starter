import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'

export interface Task {
  id: string
  name: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  createdAt: string
  updatedAt: string
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const api = useApi()

  const fetchTasks = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.fetchWithAuth<Task[]>('/tasks')
      tasks.value = response
      return response
    } catch (err: any) {
      console.error('Error fetching tasks:', err)
      error.value = err.data?.message || 'Failed to fetch tasks'
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getTaskById = (id: string) => {
    return tasks.value.find(task => task.id === id)
  }

  const createTask = async (taskData: { name: string; description?: string; status?: string }) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.fetchWithAuth<Task>('/tasks', {
        method: 'POST',
        body: taskData
      })
      tasks.value.unshift(response)
      return response
    } catch (err: any) {
      console.error('Error creating task:', err)
      error.value = err.data?.message || 'Failed to create task'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateTask = async (id: string, taskData: { name?: string; description?: string; status?: string }) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.fetchWithAuth<Task>(`/tasks/${id}`, {
        method: 'PUT',
        body: taskData
      })
      
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value[index] = response
      }
      return response
    } catch (err: any) {
      console.error('Error updating task:', err)
      error.value = err.data?.message || 'Failed to update task'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteTask = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await api.fetchWithAuth(`/tasks/${id}`, {
        method: 'DELETE'
      })
      
      tasks.value = tasks.value.filter(task => task.id !== id)
      return true
    } catch (err: any) {
      console.error('Error deleting task:', err)
      error.value = err.data?.message || 'Failed to delete task'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
  }
}) 