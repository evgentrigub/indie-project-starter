import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// Views
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import TasksView from '@/views/tasks/TasksView.vue';
import BillingView from '@/views/billing/BillingView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/auth/SignupView.vue'),
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('@/views/auth/AuthCallbackView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/auth/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/views/tasks/TasksView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/billing',
    name: 'Billing',
    component: () => import('@/views/billing/BillingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/billing/success',
    name: 'BillingSuccess',
    component: () => import('@/views/billing/SuccessView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/billing/cancel',
    name: 'BillingCancel',
    component: () => import('@/views/billing/CancelView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // Always scroll to top
    return { top: 0 };
  },
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.meta.requiresAuth as boolean;
  const hideForAuth = to.meta.hideForAuth as boolean;

  if (requiresAuth && !token) {
    // Redirect to login if route requires auth but user is not logged in
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (hideForAuth && token) {
    // Redirect logged in users away from auth pages like login/signup
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router; 