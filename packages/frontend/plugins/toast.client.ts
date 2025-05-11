import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import { defineNuxtPlugin } from '#imports'
import type { NuxtApp } from '@nuxt/schema'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const options: PluginOptions = {
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: 'button',
    icon: true,
    rtl: false
  }

  nuxtApp.vueApp.use(Toast, options)
}) 