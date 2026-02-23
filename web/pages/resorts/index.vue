<template>
  <div class="min-h-screen">
    <!-- Page Header -->
    <div class="bg-nomad-gradient py-8 md:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-6">滑雪场</h1>

        <!-- Search Bar -->
        <div class="max-w-2xl">
          <form @submit.prevent="handleSearch" class="relative">
            <input
              v-model="searchInput"
              type="text"
              placeholder="搜索滑雪场名称、城市、省份..."
              class="w-full px-5 py-3.5 pl-12 rounded-xl text-gray-800 bg-white/95 backdrop-blur shadow-lg text-base focus:outline-none focus:ring-4 focus:ring-white/30 placeholder-gray-400"
            />
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              type="submit"
              class="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-nomad-gradient text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              搜索
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex flex-wrap items-center gap-3">
          <!-- Type Pills -->
          <div class="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
            <button
              v-for="t in typeOptions"
              :key="t.value"
              class="px-3.5 py-1.5 rounded-md text-sm font-medium transition-all"
              :class="currentType === t.value
                ? 'bg-white text-nomad-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'"
              @click="setType(t.value)"
            >
              {{ t.label }}
            </button>
          </div>

          <!-- Province Dropdown -->
          <div class="relative">
            <select
              v-model="currentProvince"
              class="appearance-none bg-gray-100 border-0 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-nomad-300 cursor-pointer"
              @change="applyFilters"
            >
              <option value="">全部省份</option>
              <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
            </select>
            <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- Sort Dropdown -->
          <div class="relative ml-auto">
            <select
              v-model="currentSort"
              class="appearance-none bg-gray-100 border-0 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-nomad-300 cursor-pointer"
              @change="applyFilters"
            >
              <option v-for="s in sortOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
            <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Result Count -->
      <div class="flex items-center justify-between mb-4">
        <p v-if="!pending && resortList.length > 0" class="text-sm text-gray-500">
          共找到 <span class="font-semibold text-gray-700">{{ totalCount }}</span> 个滑雪场
        </p>
        <p v-else-if="!pending" class="text-sm text-gray-500">&nbsp;</p>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="i in 8" :key="i" class="animate-pulse bg-white rounded-xl overflow-hidden border border-gray-100">
          <div class="h-48 bg-gray-200"></div>
          <div class="p-3">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div class="flex gap-3">
              <div class="h-3 bg-gray-200 rounded w-8"></div>
              <div class="h-3 bg-gray-200 rounded w-10"></div>
              <div class="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="resortList.length === 0" class="text-center py-20">
        <div class="text-5xl mb-4">🏔️</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">未找到滑雪场</h3>
        <p class="text-gray-500 mb-6">请尝试修改搜索条件或清除筛选</p>
        <button
          class="px-6 py-2.5 bg-nomad-gradient text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          @click="clearFilters"
        >
          清除筛选
        </button>
      </div>

      <!-- Resort Cards Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="resort in resortList"
          :key="resort.id"
          :to="`/resorts/${resort.id}`"
          class="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <!-- Image -->
          <div class="relative h-52 overflow-hidden">
            <img
              :src="getResortImage(resort)"
              :alt="resort.name"
              class="w-full h-full object-cover group-hover:scale-105 group-hover:blur-sm transition-all duration-500"
              @error="(e) => e.target.src = fallbackImage"
            />
            <!-- Default overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-300"></div>
            <!-- Hover overlay with metrics -->
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center px-4 py-3">
              <div class="space-y-2">
                <div v-for="metric in getMetrics(resort)" :key="metric.label" class="flex items-center gap-2">
                  <span class="text-sm w-4">{{ metric.icon }}</span>
                  <span class="text-white/70 text-xs w-10 shrink-0">{{ metric.label }}</span>
                  <template v-if="metric.wide">
                    <span class="text-white text-xs font-semibold flex-1">{{ metric.value }}</span>
                  </template>
                  <template v-else>
                    <div class="flex-1 bg-white/20 rounded-full h-1.5">
                      <div class="h-1.5 rounded-full" :class="metric.color" :style="{ width: metric.pct + '%' }"></div>
                    </div>
                    <span class="text-white text-xs font-semibold w-10 text-right shrink-0">{{ metric.value }}</span>
                  </template>
                </div>
              </div>
            </div>
            <!-- Type badge -->
            <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs font-medium z-10"
              :class="resort.type === 'indoor' ? 'bg-blue-500/85 text-white' : 'bg-green-500/85 text-white'">
              {{ resort.type === 'indoor' ? '室内' : '室外' }}
            </span>
            <!-- Open status -->
            <span v-if="isOpen(resort)" class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-500/85 text-white z-10">开板中</span>
            <!-- Favorite button -->
            <button
              class="absolute bottom-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
              :class="favoritedIds.has(resort.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-500 hover:bg-white hover:text-red-500'"
              @click.prevent.stop="toggle(resort.id)"
            >
              <svg class="w-3.5 h-3.5" :fill="favoritedIds.has(resort.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <!-- Default bottom info -->
            <div class="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
              <h3 class="text-white font-bold text-sm leading-tight truncate mb-0.5">{{ resort.name }}</h3>
              <p class="text-white/75 text-xs">{{ resort.province }} · {{ resort.city }}</p>
              <div class="flex items-center gap-2 mt-1.5 text-white/90 text-xs">
                <span>★ {{ resort.rating?.toFixed(1) || '-' }}</span>
                <span>🎿 {{ resort.trails?.total || '-' }}</span>
                <span v-if="resort.pricing?.weekdayDaily">¥{{ resort.pricing.weekdayDaily }}/天</span>
              </div>
            </div>
          </div>
          <!-- Info -->
          <div class="p-3">
            <h3 class="font-semibold text-gray-900 text-sm leading-tight truncate mb-0.5">{{ resort.name }}</h3>
            <p class="text-gray-400 text-xs mb-2">{{ resort.province }} · {{ resort.city }}</p>
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span class="font-medium text-amber-500">★ {{ resort.rating?.toFixed(1) || '-' }}</span>
              <span>🎿 {{ resort.trails?.total || '-' }}</span>
              <span v-if="resort.pricing?.weekdayDaily" class="ml-auto font-medium text-gray-700">¥{{ resort.pricing.weekdayDaily }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })

const { favoritedIds, load, toggle } = useFavorites()
onMounted(load)

// Filter options
const typeOptions = [
  { label: '全部', value: '' },
  { label: '室内', value: 'indoor' },
  { label: '室外', value: 'outdoor' },
]

const sortOptions = [
  { label: '按人气', value: 'popularity' },
  { label: '按评分', value: 'rating' },
  { label: '价格低到高', value: 'price_low' },
  { label: '价格高到低', value: 'price_high' },
  { label: '按雪道数', value: 'trail_count' },
]

const provinces = [
  '北京市', '天津市', '上海市',
  '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
  '江苏省', '浙江省', '安徽省', '福建省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省',
  '四川省', '云南省', '陕西省', '甘肃省', '青海省',
  '内蒙古自治区', '新疆维吾尔自治区',
]

// State from URL query
const route = useRoute()
const router = useRouter()

const searchInput = ref(route.query.keyword || '')
const currentType = ref(route.query.type || '')
const currentProvince = ref(route.query.province || '')
const currentSort = ref(route.query.sortBy || 'popularity')

// API query parameters (reactive, derived from state)
const queryParams = computed(() => ({
  keyword: route.query.keyword || '',
  type: route.query.type || '',
  province: route.query.province || '',
  sortBy: route.query.sortBy || 'popularity',
  limit: 50,
  offset: 0,
}))

// Fetch resorts from API
const { data: resortData, pending, error } = useFetch('/api/resorts', {
  query: queryParams,
  watch: [queryParams],
})

const resortList = computed(() => {
  if (!resortData.value || resortData.value.code !== 0) return []
  return resortData.value.data || []
})

const totalCount = computed(() => {
  if (!resortData.value || resortData.value.code !== 0) return 0
  return resortData.value.total || 0
})

// Sync URL query to local state when route changes
watch(() => route.query, (q) => {
  searchInput.value = q.keyword || ''
  currentType.value = q.type || ''
  currentProvince.value = q.province || ''
  currentSort.value = q.sortBy || 'popularity'
}, { immediate: true })

// Actions
function handleSearch() {
  applyFilters()
}

function setType(type) {
  currentType.value = type
  applyFilters()
}

function applyFilters() {
  const query = {}
  if (searchInput.value.trim()) query.keyword = searchInput.value.trim()
  if (currentType.value) query.type = currentType.value
  if (currentProvince.value) query.province = currentProvince.value
  if (currentSort.value && currentSort.value !== 'popularity') query.sortBy = currentSort.value
  router.push({ path: '/resorts', query })
}

function clearFilters() {
  searchInput.value = ''
  currentType.value = ''
  currentProvince.value = ''
  currentSort.value = 'popularity'
  router.push({ path: '/resorts' })
}

// Hover tooltip metrics
function getMetrics(resort) {
  const rating = resort.rating || 0
  const popularity = resort.popularity || 0
  const trails = resort.trails?.total || 0
  const p = resort.pricing || {}
  const priceLines = [
    p.weekdayDaily && `工作日 ¥${p.weekdayDaily}`,
    p.weekendDaily && `周末 ¥${p.weekendDaily}`,
    p.halfDay && `半日 ¥${p.halfDay}`,
    p.nightSkiing && `夜场 ¥${p.nightSkiing}`,
  ].filter(Boolean)
  return [
    { icon: '⭐️', label: '评分', value: rating.toFixed(1), pct: (rating / 5) * 100, color: 'bg-yellow-400' },
    { icon: '🔥', label: '人气', value: popularity, pct: Math.min((popularity / 100) * 100, 100), color: 'bg-orange-400' },
    { icon: '🎿', label: '雪道', value: trails + '条', pct: Math.min((trails / 50) * 100, 100), color: 'bg-blue-400' },
    { icon: '💰', label: '票价', value: priceLines.join(' / ') || '-', pct: p.weekdayDaily ? Math.max(100 - (p.weekdayDaily / 1000) * 100, 10) : 0, color: 'bg-green-400', wide: true },
  ]
}

// Tag color helper
const tagColors = [
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
]

function getTagColor(tag) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  return tagColors[Math.abs(hash) % tagColors.length]
}

const fallbackImage = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80'

function getResortImage(resort) {
  return resort.images?.[0] || fallbackImage
}

function isOpen(resort) {
  if (!resort.season) return false
  const season = typeof resort.season === 'string' ? JSON.parse(resort.season) : resort.season
  if (season.yearRound) return true
  const now = new Date()
  const month = now.getMonth() + 1
  const open = season.openMonth
  const close = season.closeMonth
  // Handle cross-year season (e.g. Nov-Mar)
  if (open > close) return month >= open || month <= close
  return month >= open && month <= close
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
