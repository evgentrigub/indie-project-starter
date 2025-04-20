<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="card bg-base-100 shadow-xl w-full max-w-md">
      <div class="card-body text-center">
        <div class="mb-4 text-warning">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 mx-auto">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zM12 15h.008v.008H12V15z" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold">Payment Cancelled</h1>
        
        <p class="py-4">
          Your subscription process was cancelled. No charges have been made to your payment method.
        </p>
        
        <p class="text-base-content/70 text-sm mb-6">
          If you encountered any issues during the payment process or have questions, please feel free to contact our support team.
        </p>
        
        <div class="card-actions justify-center">
          <NuxtLink to="/billing" class="btn btn-primary">Try Again</NuxtLink>
          <NuxtLink to="/" class="btn btn-outline">Back to Home</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No special logic needed for the cancel view
</script> 