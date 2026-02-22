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
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 9" :key="i" class="animate-pulse">
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <div class="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="flex gap-2 mb-4">
              <div class="h-5 bg-gray-200 rounded w-12"></div>
              <div class="h-5 bg-gray-200 rounded w-16"></div>
            </div>
            <div class="h-px bg-gray-200 mb-3"></div>
            <div class="flex justify-between">
              <div class="h-4 bg-gray-200 rounded w-10"></div>
              <div class="h-4 bg-gray-200 rounded w-10"></div>
              <div class="h-4 bg-gray-200 rounded w-16"></div>
              <div class="h-4 bg-gray-200 rounded w-14"></div>
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
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <NuxtLink
          v-for="resort in resortList"
          :key="resort.id"
          :to="`/resorts/${resort.id}`"
          class="group block"
        >
          <div class="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:border-nomad-200 transition-all duration-300 h-full flex flex-col">
            <!-- Header Row: Name + Type Badge -->
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-base font-bold text-gray-900 group-hover:text-nomad-500 transition-colors line-clamp-1 flex-1 mr-2">
                {{ resort.name }}
              </h3>
              <span
                class="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium"
                :class="resort.type === 'indoor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'"
              >
                {{ resort.type === 'indoor' ? '室内' : '室外' }}
              </span>
            </div>

            <!-- Location -->
            <p class="text-sm text-gray-500 mb-3">
              {{ resort.province }} {{ resort.city }}
            </p>

            <!-- Tags -->
            <div v-if="resort.tags && resort.tags.length" class="flex flex-wrap gap-1.5 mb-3">
              <span
                v-for="tag in resort.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-0.5 rounded-md text-xs font-medium"
                :class="getTagColor(tag)"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Spacer -->
            <div class="flex-1"></div>

            <!-- Stats Row -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100 text-sm">
              <!-- Popularity -->
              <div class="flex items-center space-x-1" :title="`人气 ${resort.popularity}`">
                <span class="text-orange-500">🔥</span>
                <span class="font-medium text-gray-700">{{ resort.popularity }}</span>
              </div>

              <!-- Rating -->
              <div class="flex items-center space-x-1">
                <span class="text-yellow-500">★</span>
                <span class="font-medium text-gray-700">{{ resort.rating?.toFixed(1) || '-' }}</span>
              </div>

              <!-- Trail Count -->
              <div class="text-gray-500" v-if="resort.trails">
                {{ resort.trails.total || '-' }} 雪道
              </div>

              <!-- Daily Price -->
              <div class="text-gray-700 font-medium" v-if="resort.pricing && resort.pricing.weekdayDaily">
                ¥{{ resort.pricing.weekdayDaily }}<span class="text-gray-400 text-xs font-normal">/天</span>
              </div>
              <div v-else class="text-gray-400 text-xs">
                价格待定
              </div>
            </div>

            <!-- View Detail Link -->
            <div class="mt-3 text-right">
              <span class="text-xs text-nomad-500 group-hover:text-nomad-700 font-medium transition-colors">
                查看详情 →
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

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
  // Deterministic color based on tag string
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  return tagColors[Math.abs(hash) % tagColors.length]
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
