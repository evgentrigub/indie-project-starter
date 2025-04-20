<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Subscription Cancelled</h1>
        <p class="py-6">Your subscription has been cancelled. You can still use the free features of our service.</p>
        <button class="btn btn-primary" @click="navigateTo('/tasks')">
          Go to Tasks
        </button>
      </div>
    </div>
  </div>
</template> 