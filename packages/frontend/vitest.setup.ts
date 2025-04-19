import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Create and set up Pinia store
const pinia = createPinia();
setActivePinia(pinia);

// Create a test router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/login', component: { template: '<div>Login</div>' } },
    { path: '/signup', component: { template: '<div>Signup</div>' } },
    { path: '/tasks', component: { template: '<div>Tasks</div>' } },
    { path: '/billing', component: { template: '<div>Billing</div>' } },
    { path: '/profile', component: { template: '<div>Profile</div>' } },
  ],
});

// Configure Vue Test Utils
config.global.plugins = [pinia, router];

// Mock global components
config.global.components = {
  'router-link': {
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
}); 