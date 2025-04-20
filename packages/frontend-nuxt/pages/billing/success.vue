<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Success!</h1>
        <p class="py-6">Your subscription has been successfully processed. Thank you for your support!</p>
        <button class="btn btn-primary" @click="navigateTo('/tasks')">
          Go to Tasks
        </button>
      </div>
    </div>
  </div>
</template> 