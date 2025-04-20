<template>
  <div class="hero min-h-[calc(100vh-4rem)] bg-base-200">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div class="card-body">
          <form @submit.prevent="handleLogin">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                v-model="email"
                type="email"
                placeholder="email"
                class="input input-bordered"
                required
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Password</span>
              </label>
              <input
                v-model="password"
                type="password"
                placeholder="password"
                class="input input-bordered"
                required
              />
              <label class="label">
                <a href="#" class="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>
            <div class="form-control mt-6">
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="loading loading-spinner"></span>
                Login
              </button>
            </div>
            <div class="divider">OR</div>
            <button
              type="button"
              class="btn btn-outline w-full"
              @click="handleGoogleLogin"
              :disabled="isLoading"
            >
              Login with Google
            </button>
          </form>
          <div class="text-center mt-4">
            <p>
              Don't have an account?
              <NuxtLink to="/signup" class="link link-primary">Sign up</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const { isLoading } = storeToRefs(authStore)

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (!success) {
    // Show error message
  }
}

const handleGoogleLogin = () => {
  authStore.googleLogin()
}
</script> 