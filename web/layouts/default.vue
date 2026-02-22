<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Top Navigation -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo / Site Name -->
          <NuxtLink to="/" class="flex items-center space-x-2 flex-shrink-0">
            <span class="text-2xl">⛷️</span>
            <span class="text-xl font-bold bg-nomad-gradient bg-clip-text text-transparent">
              滑雪场指南
            </span>
          </NuxtLink>

          <!-- Navigation Links (Desktop) -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink
              to="/"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/' }"
            >
              首页
            </NuxtLink>
            <NuxtLink
              to="/resorts"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path.startsWith('/resorts') }"
            >
              滑雪场
            </NuxtLink>
            <NuxtLink
              to="/community"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/community' }"
            >
              社群
            </NuxtLink>
          </nav>

          <!-- Profile Icon -->
          <div class="flex items-center space-x-4">
            <button class="p-2 rounded-full text-gray-500 hover:text-nomad-500 hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <!-- Mobile menu button -->
            <button
              class="md:hidden p-2 rounded-md text-gray-500 hover:text-nomad-500 hover:bg-gray-100"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  v-if="!mobileMenuOpen"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  v-else
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-gray-100">
          <nav class="flex flex-col space-y-2 pt-3">
            <NuxtLink
              to="/"
              class="nav-link-mobile"
              :class="{ 'nav-link-mobile-active': $route.path === '/' }"
              @click="mobileMenuOpen = false"
            >
              首页
            </NuxtLink>
            <NuxtLink
              to="/resorts"
              class="nav-link-mobile"
              :class="{ 'nav-link-mobile-active': $route.path.startsWith('/resorts') }"
              @click="mobileMenuOpen = false"
            >
              滑雪场
            </NuxtLink>
            <NuxtLink
              to="/community"
              class="nav-link-mobile"
              :class="{ 'nav-link-mobile-active': $route.path === '/community' }"
              @click="mobileMenuOpen = false"
            >
              社群
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div class="flex items-center space-x-2">
            <span class="text-lg">⛷️</span>
            <span class="font-semibold bg-nomad-gradient bg-clip-text text-transparent">滑雪场指南</span>
          </div>
          <p class="text-sm text-gray-500">
            &copy; {{ new Date().getFullYear() }} 滑雪场指南 - Nomads Style. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const mobileMenuOpen = ref(false)

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-nomad-500 font-medium transition-colors relative py-1;
}
.nav-link-active {
  @apply text-nomad-500;
}
.nav-link-active::after {
  content: '';
  @apply absolute bottom-0 left-0 right-0 h-0.5 bg-nomad-gradient rounded-full;
}
.nav-link-mobile {
  @apply px-3 py-2 rounded-md text-gray-600 hover:text-nomad-500 hover:bg-gray-50 font-medium transition-colors;
}
.nav-link-mobile-active {
  @apply text-nomad-500 bg-nomad-50;
}
</style>
