import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskList from './TaskList.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useTasksStore, Task } from '@/store/tasks';

// Create mock store
const mockUpdateTask = vi.fn().mockImplementation(async (id: string, data: { status: string }) => {
  return { id, ...data };
});

vi.mock('@/store/tasks', () => ({
  useTasksStore: vi.fn(() => ({
    tasks: [],
    isLoading: false,
    error: null,
    updateTask: mockUpdateTask,
  })),
}));

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      name: 'Test Task 1',
      description: 'Test Description 1',
      status: 'todo',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'Test Task 2',
      description: 'Test Description 2',
      status: 'in_progress',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '3',
      name: 'Test Task 3',
      description: 'Test Description 3',
      status: 'done',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ];

  let pinia: ReturnType<typeof createPinia>;

  beforeAll(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [] as Task[],
        isLoading: true,
        error: null,
      },
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to load tasks';
    const wrapper = mount(TaskList, {
      props: {
        tasks: [] as Task[],
        isLoading: false,
        error: errorMessage,
      },
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.find('.alert-error').exists()).toBe(true);
    expect(wrapper.find('.alert-error').text()).toContain(errorMessage);
  });

  it('renders empty state correctly', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [] as Task[],
        isLoading: false,
        error: null,
      },
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.find('h3').text()).toBe('No tasks found');
    expect(wrapper.find('p').text()).toBe('Create your first task to get started!');
  });

  it('renders tasks correctly', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: mockTasks,
        isLoading: false,
        error: null,
      },
      global: {
        plugins: [createPinia()],
      },
    });

    const taskCards = wrapper.findAll('.card');
    expect(taskCards).toHaveLength(3);

    // Check first task
    expect(taskCards[0].find('.card-title').text()).toBe('Test Task 1');
    expect(taskCards[0].find('p').text()).toBe('Test Description 1');
    expect(taskCards[0].find('.badge').text()).toBe('To Do');

    // Check second task
    expect(taskCards[1].find('.card-title').text()).toBe('Test Task 2');
    expect(taskCards[1].find('p').text()).toBe('Test Description 2');
    expect(taskCards[1].find('.badge').text()).toBe('In Progress');

    // Check third task
    expect(taskCards[2].find('.card-title').text()).toBe('Test Task 3');
    expect(taskCards[2].find('p').text()).toBe('Test Description 3');
    expect(taskCards[2].find('.badge').text()).toBe('Done');
  });

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: mockTasks,
        isLoading: false,
        error: null,
      },
      global: {
        plugins: [createPinia()],
      },
    });

    await wrapper.findAll('.btn-ghost')[0].trigger('click');
    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockTasks[0]]);
  });

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: mockTasks,
        isLoading: false,
        error: null,
      },
      global: {
        plugins: [createPinia()],
      },
    });

    await wrapper.findAll('.btn-error')[0].trigger('click');
    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockTasks[0].id]);
  });

  it('updates task status when complete/reopen button is clicked', async () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: mockTasks,
        isLoading: false,
        error: null,
      },
      global: {
        plugins: [pinia],
      },
    });

    // Get all task cards
    const taskCards = wrapper.findAll('.card');
    
    // Test completing first task (todo -> done)
    const firstTaskButtons = taskCards[0].findAll('button');
    const completeButton = firstTaskButtons.find(b => b.text().includes('Complete'));
    await completeButton?.trigger('click');
    expect(mockUpdateTask).toHaveBeenCalledWith('1', { status: 'done' });

    // Test reopening third task (done -> todo)
    const thirdTaskButtons = taskCards[2].findAll('button');
    const reopenButton = thirdTaskButtons.find(b => b.text().includes('Reopen'));
    await reopenButton?.trigger('click');
    
    // Check all calls to the mock
    expect(mockUpdateTask.mock.calls).toEqual([
      ['1', { status: 'done' }],
      ['3', { status: 'todo' }]
    ]);
  });

  it('formats task status correctly', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: mockTasks,
        isLoading: false,
        error: null,
      },
      global: {
        plugins: [createPinia()],
      },
    });

    const badges = wrapper.findAll('.badge');
    expect(badges[0].text()).toBe('To Do');
    expect(badges[1].text()).toBe('In Progress');
    expect(badges[2].text()).toBe('Done');
  });

  it('applies correct styling based on task status', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: mockTasks,
        isLoading: false,
        error: null,
      },
      global: {
        plugins: [createPinia()],
      },
    });

    const badges = wrapper.findAll('.badge');
    expect(badges[0].classes()).toContain('badge-primary');
    expect(badges[1].classes()).toContain('badge-secondary');
    expect(badges[2].classes()).toContain('badge-success');

    const taskTitles = wrapper.findAll('.card-title');
    expect(taskTitles[2].classes()).toContain('line-through');
  });
}); 