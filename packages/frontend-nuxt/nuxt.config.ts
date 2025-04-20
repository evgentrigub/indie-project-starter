import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  typescript: {
    strict: false,
    typeCheck: false
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  css: [
    '~/assets/css/main.css',
    'vue-toastification/dist/index.css'
  ],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: true,
    viewer: true,
  },

  compatibilityDate: '2025-04-19',

  build: {
    transpile: ['@headlessui/vue', 'vue-toastification']
  },

  devServer: {
    port: 3002,
  }
})