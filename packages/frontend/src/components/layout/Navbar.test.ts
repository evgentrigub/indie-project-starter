import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Navbar from './Navbar.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/store/auth';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock document.documentElement
const documentElementMock = {
  setAttribute: vi.fn(),
};
Object.defineProperty(document, 'documentElement', { value: documentElementMock });

// Mock auth store
const mockAuthStore = {
  isAuthenticated: false,
  user: null as { email: string } | null,
  logout: vi.fn(),
  $patch: vi.fn(function(this: any, state) {
    Object.assign(this, state);
  }),
};

vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn(() => mockAuthStore),
}));

describe('Navbar', () => {
  const mountNavbar = () => {
    return mount(Navbar, {
      global: {
        stubs: {
          'router-link': {
            template: '<a :href="to" @click="$emit(\'click\')"><slot /></a>',
            props: ['to'],
          },
        },
        plugins: [createPinia()],
      },
    });
  };

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();
    // Reset mock store state
    Object.assign(mockAuthStore, {
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
      $patch: vi.fn(function(this: any, state) {
        Object.assign(this, state);
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication State', () => {
    it('renders login and signup buttons when not authenticated', () => {
      const wrapper = mountNavbar();
      
      expect(wrapper.find('a[href="/login"]').exists()).toBe(true);
      expect(wrapper.find('a[href="/signup"]').exists()).toBe(true);
      expect(wrapper.find('.avatar').exists()).toBe(false);
    });

    it('renders user menu and navigation when authenticated', () => {
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = { email: 'test@example.com' };
      
      const wrapper = mountNavbar();
      
      expect(wrapper.find('a[href="/tasks"]').exists()).toBe(true);
      expect(wrapper.find('a[href="/billing"]').exists()).toBe(true);
      expect(wrapper.find('.avatar').exists()).toBe(true);
      expect(wrapper.find('.avatar span').text()).toBe('T');
    });
  });

  describe('User Menu', () => {
    beforeEach(() => {
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = { email: 'test@example.com' };
    });

    it('displays user initials from email', () => {
      const wrapper = mountNavbar();
      expect(wrapper.find('.avatar span').text()).toBe('T');
    });

    it('shows question mark when user email is not available', () => {
      mockAuthStore.user = null;
      const wrapper = mountNavbar();
      expect(wrapper.find('.avatar span').text()).toBe('?');
    });

    it('handles logout when clicking logout button', async () => {
      const wrapper = mountNavbar();
      
      // Open dropdown
      await wrapper.find('.avatar').trigger('click');
      // Click logout
      const logoutLink = wrapper.findAll('a').find(w => w.text() === 'Logout');
      expect(logoutLink).toBeTruthy();
      await logoutLink?.trigger('click');
      
      expect(mockAuthStore.logout).toHaveBeenCalled();
    });

    it('closes dropdown when clicking profile link', async () => {
      const wrapper = mountNavbar();
      const mockActiveElement = document.createElement('div');
      const blurSpy = vi.spyOn(mockActiveElement, 'blur');
      vi.spyOn(document, 'activeElement', 'get').mockReturnValue(mockActiveElement);
      
      // Open dropdown
      await wrapper.find('.avatar').trigger('click');
      // Click profile link
      await wrapper.find('a[href="/profile"]').trigger('click');
      
      expect(blurSpy).toHaveBeenCalled();
    });
  });

  describe('Theme Toggle', () => {
    it('toggles theme when clicking theme button', async () => {
      localStorageMock.getItem.mockReturnValue('light');
      
      const wrapper = mountNavbar();
      
      // Initial state
      expect(wrapper.find('svg[viewBox="0 0 24 24"]').exists()).toBe(true);
      
      // Click theme toggle
      await wrapper.find('button.btn-ghost').trigger('click');
      
      // Check localStorage was updated
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
      // Check document theme was updated
      expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('initializes theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      mountNavbar();
      
      expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('toggles between light and dark themes', async () => {
      localStorageMock.getItem.mockReturnValue('light');
      
      const wrapper = mountNavbar();
      
      // First toggle (light -> dark)
      await wrapper.find('button.btn-ghost').trigger('click');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
      
      // Second toggle (dark -> light)
      await wrapper.find('button.btn-ghost').trigger('click');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });
}); 