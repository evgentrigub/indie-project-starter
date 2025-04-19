import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskForm from './TaskForm.vue';
import { Task } from '@/store/tasks';

describe('TaskForm', () => {
  const mockTask: Task = {
    id: '1',
    name: 'Test Task',
    description: 'Test Description',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('renders create task form by default', () => {
    const wrapper = mount(TaskForm);
    
    expect(wrapper.find('h2').text()).toBe('Create New Task');
    expect(wrapper.find('button[type="submit"]').text()).toBe('Create Task');
  });

  it('renders edit task form when task prop is provided', () => {
    const wrapper = mount(TaskForm, {
      props: {
        task: mockTask,
      },
    });
    
    expect(wrapper.find('h2').text()).toBe('Edit Task');
    expect(wrapper.find('button[type="submit"]').text()).toBe('Update Task');
  });

  it('initializes form with task data when editing', () => {
    const wrapper = mount(TaskForm, {
      props: {
        task: mockTask,
      },
    });
    
    const nameInput = wrapper.find('#task-name').element as HTMLInputElement;
    const descriptionInput = wrapper.find('#task-description').element as HTMLTextAreaElement;
    const statusSelect = wrapper.find('#task-status').element as HTMLSelectElement;
    
    expect(nameInput.value).toBe(mockTask.name);
    expect(descriptionInput.value).toBe(mockTask.description);
    expect(statusSelect.value).toBe(mockTask.status);
  });

  it('emits submit event with form data when form is submitted', async () => {
    const wrapper = mount(TaskForm);
    
    await wrapper.find('#task-name').setValue('New Task');
    await wrapper.find('#task-description').setValue('New Description');
    await wrapper.find('#task-status').setValue('done');
    
    await wrapper.find('form').trigger('submit');
    
    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')![0][0]).toEqual({
      name: 'New Task',
      description: 'New Description',
      status: 'done',
    });
  });

  it('shows error message when name is empty', async () => {
    const wrapper = mount(TaskForm);
    
    await wrapper.find('#task-name').setValue('');
    await wrapper.find('form').trigger('submit');
    
    expect(wrapper.find('.text-error').text()).toBe('Task name is required');
    expect(wrapper.emitted('submit')).toBeFalsy();
  });

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(TaskForm);
    
    await wrapper.find('button.btn-ghost').trigger('click');
    
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('disables submit button when loading', () => {
    const wrapper = mount(TaskForm, {
      props: {
        isLoading: true,
      },
    });
    
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes('disabled')).toBeDefined();
    expect(submitButton.find('.loading-spinner').exists()).toBeTruthy();
  });

  it('validates form before submission', async () => {
    const wrapper = mount(TaskForm);
    
    // Try submitting with empty name
    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted('submit')).toBeFalsy();
    
    // Fill in name and try again
    await wrapper.find('#task-name').setValue('Valid Task');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted('submit')).toBeTruthy();
  });
}); 