import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '@/services/api';

export interface Task {
  id: string;
  name: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchTasks = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.get('/tasks');
      tasks.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const getTaskById = (id: string) => {
    return tasks.value.find(task => task.id === id);
  };

  const createTask = async (taskData: { name: string; description?: string; status?: string }) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.post('/tasks', taskData);
      tasks.value.unshift(response.data); // Add to the beginning of the array
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create task';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateTask = async (id: string, taskData: { name?: string; description?: string; status?: string }) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiService.put(`/tasks/${id}`, taskData);
      
      // Update task in the local state
      const index = tasks.value.findIndex(task => task.id === id);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }
      
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteTask = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await apiService.delete(`/tasks/${id}`);
      
      // Remove task from the local state
      tasks.value = tasks.value.filter(task => task.id !== id);
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
  };
}); 