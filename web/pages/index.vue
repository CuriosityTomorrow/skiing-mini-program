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
            发现中国最好的滑雪场
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
          <NuxtLink v-for="resort in featuredResorts" :key="resort.id" :to="`/resorts/${resort.id}`" class="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
            <div class="relative h-52">
              <!-- Image (blurs on hover) -->
              <img
                :src="resort.images?.[0] || fallbackImage"
                :alt="resort.name"
                class="w-full h-full object-cover scale-100 group-hover:scale-105 group-hover:blur-sm transition-all duration-500"
                @error="(e) => e.target.src = fallbackImage"
              />
              <!-- Default overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-300"></div>
              <!-- Hover overlay (dark bg for metrics) -->
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center px-5 py-4">

                <div class="space-y-2.5">
                  <div v-for="metric in getMetrics(resort)" :key="metric.label" class="flex items-center gap-2">
                    <span class="text-sm w-4">{{ metric.icon }}</span>
                    <span class="text-white/70 text-xs w-10 shrink-0">{{ metric.label }}</span>
                    <div class="flex-1 bg-white/20 rounded-full h-1.5">
                      <div class="h-1.5 rounded-full" :class="metric.color" :style="{ width: metric.pct + '%' }"></div>
                    </div>
                    <span class="text-white text-xs font-semibold w-10 text-right shrink-0">{{ metric.value }}</span>
                  </div>
                </div>
              </div>
              <!-- Type badge -->
              <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm z-10"
                :class="resort.type === 'indoor' ? 'bg-blue-500/80 text-white' : 'bg-green-500/80 text-white'">
                {{ resort.type === 'indoor' ? '室内' : '室外' }}
              </span>
              <!-- Default bottom info (hides on hover) -->
              <div class="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity duration-300">
                <h3 class="text-white font-bold text-base leading-tight mb-1">{{ resort.name }}</h3>
                <p class="text-white/75 text-xs">{{ resort.province }} · {{ resort.city }}</p>
                <div class="flex items-center gap-3 mt-2 text-white/90 text-xs">
                  <span>★ {{ resort.rating?.toFixed(1) || '-' }}</span>
                  <span>🎿 {{ resort.trails?.total || '-' }} 雪道</span>
                  <span v-if="resort.pricing?.weekdayDaily">¥{{ resort.pricing.weekdayDaily }}/天</span>
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

const fallbackImage = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80'

function getMetrics(resort) {
  const rating = resort.rating || 0
  const popularity = resort.popularity || 0
  const trails = resort.trails?.total || 0
  const price = resort.pricing?.weekdayDaily || 0
  return [
    { icon: '⭐️', label: '评分', value: rating.toFixed(1), pct: (rating / 5) * 100, color: 'bg-yellow-400' },
    { icon: '🔥', label: '人气', value: popularity, pct: Math.min((popularity / 100) * 100, 100), color: 'bg-orange-400' },
    { icon: '🎿', label: '雪道', value: trails + '条', pct: Math.min((trails / 50) * 100, 100), color: 'bg-blue-400' },
    { icon: '💰', label: '价格', value: price ? '¥' + price : '-', pct: price ? Math.max(100 - (price / 1000) * 100, 10) : 0, color: 'bg-green-400' },
  ]
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
