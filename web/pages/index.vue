<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-nomad-gradient relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            找到最适合你的滑雪场
          </h1>
          <p class="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            中国 50+ 滑雪场数据对比平台，多维度评分，助你选出完美雪场
          </p>

          <!-- Search Bar -->
          <div class="max-w-xl mx-auto">
            <form @submit.prevent="handleSearch" class="relative">
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索滑雪场名称、城市、省份..."
                class="w-full px-6 py-4 pl-14 rounded-2xl text-gray-800 bg-white shadow-xl text-lg focus:outline-none focus:ring-4 focus:ring-white/30 placeholder-gray-400"
              />
              <svg
                class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                type="submit"
                class="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-nomad-gradient text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                搜索
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Wave decoration at bottom -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 80V40C240 0 480 0 720 40C960 80 1200 80 1440 40V80H0Z" fill="#f9fafb"/>
        </svg>
      </div>
    </section>

    <!-- Quick Stats Section -->
    <section class="py-12 md:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-3 gap-4 md:gap-8">
          <div class="text-center p-4 md:p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div class="text-3xl md:text-4xl font-bold bg-nomad-gradient bg-clip-text text-transparent">50+</div>
            <div class="text-sm md:text-base text-gray-500 mt-1">滑雪场</div>
          </div>
          <div class="text-center p-4 md:p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div class="text-3xl md:text-4xl font-bold bg-nomad-gradient bg-clip-text text-transparent">20+</div>
            <div class="text-sm md:text-base text-gray-500 mt-1">筛选维度</div>
          </div>
          <div class="text-center p-4 md:p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div class="text-3xl md:text-4xl font-bold bg-nomad-gradient bg-clip-text text-transparent">6</div>
            <div class="text-sm md:text-base text-gray-500 mt-1">维度评分</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Resorts Section -->
    <section class="py-12 md:py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">热门滑雪场</h2>
            <p class="text-gray-500 mt-1">最受欢迎的滑雪目的地</p>
          </div>
          <NuxtLink
            to="/resorts"
            class="hidden md:inline-flex items-center text-nomad-500 hover:text-nomad-700 font-medium transition-colors"
          >
            查看全部滑雪场
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-gray-200 rounded-2xl h-64"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-gray-500">加载失败，请稍后重试</p>
        </div>

        <!-- Resort Cards Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="resort in featuredResorts"
            :key="resort.id"
            :to="`/resorts/${resort.id}`"
            class="group block"
          >
            <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-nomad-200 transition-all duration-300 h-full">
              <!-- Header: Name + Type Badge -->
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-bold text-gray-900 group-hover:text-nomad-500 transition-colors line-clamp-1">
                  {{ resort.name }}
                </h3>
                <span
                  class="flex-shrink-0 ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="resort.type === 'indoor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'"
                >
                  {{ resort.type === 'indoor' ? '室内' : '室外' }}
                </span>
              </div>

              <!-- Location -->
              <p class="text-sm text-gray-500 mb-4">
                📍 {{ resort.province }} {{ resort.city }}
              </p>

              <!-- Tags -->
              <div v-if="resort.tags && resort.tags.length" class="flex flex-wrap gap-1.5 mb-4">
                <span
                  v-for="tag in resort.tags.slice(0, 3)"
                  :key="tag"
                  class="px-2 py-0.5 rounded-md text-xs bg-nomad-50 text-nomad-600 font-medium"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Stats Row -->
              <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                <div class="flex items-center space-x-1">
                  <span class="text-yellow-500 text-sm">★</span>
                  <span class="text-sm font-semibold text-gray-700">{{ resort.rating?.toFixed(1) || '-' }}</span>
                </div>
                <div class="flex items-center space-x-1 text-sm text-gray-500">
                  <span>🔥</span>
                  <span>{{ resort.popularity }}</span>
                </div>
                <div v-if="resort.trails" class="text-sm text-gray-500">
                  {{ resort.trails.total || '-' }} 条雪道
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- View All Link (Mobile) -->
        <div class="mt-8 text-center md:hidden">
          <NuxtLink
            to="/resorts"
            class="inline-flex items-center px-6 py-3 bg-nomad-gradient text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            查看全部滑雪场
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>

        <!-- View All Link (Desktop) - bottom -->
        <div class="mt-8 text-center hidden md:block">
          <NuxtLink
            to="/resorts"
            class="inline-flex items-center text-nomad-500 hover:text-nomad-700 font-medium transition-colors"
          >
            查看全部滑雪场 →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">准备好开始你的滑雪之旅了吗？</h2>
        <p class="text-gray-500 mb-8 max-w-lg mx-auto">
          从崇礼到长白山，从室内到室外，找到最适合你水平和需求的滑雪场
        </p>
        <NuxtLink
          to="/resorts"
          class="inline-flex items-center px-8 py-4 bg-nomad-gradient text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-nomad-500/25"
        >
          探索滑雪场
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

const searchKeyword = ref('')

const { data: resortData, pending, error } = useFetch('/api/resorts', {
  query: {
    sortBy: 'popularity',
    limit: 6,
    offset: 0,
  },
})

const featuredResorts = computed(() => {
  if (!resortData.value || resortData.value.code !== 0) return []
  return resortData.value.data || []
})

function handleSearch() {
  const keyword = searchKeyword.value.trim()
  if (keyword) {
    navigateTo({ path: '/resorts', query: { keyword } })
  } else {
    navigateTo('/resorts')
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
