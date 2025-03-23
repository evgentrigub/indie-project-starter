<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="card bg-base-100 shadow-xl max-w-md">
      <div class="card-body text-center">
        <h1 class="text-4xl font-bold text-error mb-4">404</h1>
        <h2 class="text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p class="mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div class="card-actions justify-center">
          <router-link to="/" class="btn btn-primary">
            Return Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template> 