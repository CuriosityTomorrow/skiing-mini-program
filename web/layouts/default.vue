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
              去滑雪吧
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
              to="/profile"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path.startsWith('/profile') }"
            >
              我的
            </NuxtLink>
          </nav>

          <!-- Profile Icon -->
          <div class="flex items-center space-x-4">
            <NuxtLink v-if="!user" to="/login" class="px-4 py-1.5 bg-nomad-gradient text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
              登录
            </NuxtLink>
            <div v-else class="relative" @mouseenter="openDropdown" @mouseleave="scheduleClose">
              <button class="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <div class="w-8 h-8 rounded-full bg-nomad-gradient flex items-center justify-center text-white text-sm font-bold">
                  {{ user.nickname?.[0] || '我' }}
                </div>
              </button>
              <!-- Dropdown -->
              <div v-show="dropdownOpen" class="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50" @mouseenter="openDropdown" @mouseleave="scheduleClose">
                <div class="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">{{ user.nickname }}</div>
                <NuxtLink v-if="user.role === 'admin'" to="/admin/resorts" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">🛠 管理后台</NuxtLink>
                <button class="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-50" @click="logout">退出登录</button>
              </div>
            </div>
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
              to="/profile"
              class="nav-link-mobile"
              :class="{ 'nav-link-mobile-active': $route.path.startsWith('/profile') }"
              @click="mobileMenuOpen = false"
            >
              我的
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
            <span class="font-semibold bg-nomad-gradient bg-clip-text text-transparent">去滑雪吧</span>
          </div>
          <p class="text-sm text-gray-500">
            &copy; {{ new Date().getFullYear() }} 去滑雪吧 - Nomads Style. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const mobileMenuOpen = ref(false)
const user = ref(null)
const dropdownOpen = ref(false)
let closeTimer = null

function openDropdown() {
  clearTimeout(closeTimer)
  dropdownOpen.value = true
}

function scheduleClose() {
  closeTimer = setTimeout(() => { dropdownOpen.value = false }, 300)
}

onMounted(() => {
  const stored = localStorage.getItem('user')
  if (stored) user.value = JSON.parse(stored)
})

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  user.value = null
  navigateTo('/')
}

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
