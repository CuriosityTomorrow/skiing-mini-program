<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="pending" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-32 mb-8"></div>
        <div class="bg-gray-200 rounded-2xl h-48 mb-8"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-200 rounded-2xl h-64"></div>
          <div class="bg-gray-200 rounded-2xl h-64"></div>
          <div class="bg-gray-200 rounded-2xl h-64"></div>
          <div class="bg-gray-200 rounded-2xl h-64"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !resort" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div class="text-5xl mb-4">😞</div>
      <h2 class="text-xl font-semibold text-gray-700 mb-2">滑雪场不存在</h2>
      <p class="text-gray-500 mb-6">该滑雪场可能已被移除或 ID 无效</p>
      <NuxtLink
        to="/resorts"
        class="inline-flex items-center px-6 py-2.5 bg-nomad-gradient text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        返回滑雪场列表
      </NuxtLink>
    </div>

    <!-- Resort Detail -->
    <template v-else>
      <!-- Hero Section -->
      <div class="bg-nomad-gradient relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-5 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div class="absolute bottom-5 left-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>

        <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <!-- Back Button -->
          <NuxtLink
            to="/resorts"
            class="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回列表
          </NuxtLink>

          <!-- Resort Name + Badge -->
          <div class="flex flex-wrap items-start gap-3 mb-4">
            <h1 class="text-3xl md:text-4xl font-bold text-white">{{ resort.name }}</h1>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium mt-1"
              :class="resort.type === 'indoor'
                ? 'bg-blue-400/20 text-blue-100 border border-blue-300/30'
                : 'bg-green-400/20 text-green-100 border border-green-300/30'"
            >
              {{ resort.type === 'indoor' ? '室内' : '室外' }}
            </span>
          </div>

          <!-- Location -->
          <p class="text-white/80 text-base mb-4">
            📍 {{ resort.province }} {{ resort.city }}
            <span v-if="resort.district"> {{ resort.district }}</span>
          </p>

          <!-- Tags -->
          <div v-if="resort.tags && resort.tags.length" class="flex flex-wrap gap-2">
            <span
              v-for="tag in resort.tags"
              :key="tag"
              class="px-3 py-1 rounded-lg text-sm bg-white/15 text-white/90 backdrop-blur-sm border border-white/10"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Score Placeholder -->
        <div class="bg-gradient-to-r from-nomad-50 to-purple-50 rounded-2xl p-6 mb-8 border border-nomad-100">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-nomad-gradient flex items-center justify-center text-white font-bold text-lg">
              {{ resort.rating?.toFixed(1) || '-' }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">综合评分</h3>
              <p class="text-sm text-gray-500">6 维度详细评分将在后续版本计算</p>
            </div>
          </div>
        </div>

        <!-- Info Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- 基本信息 -->
          <div class="info-card">
            <h3 class="info-card-title">基本信息</h3>
            <div class="space-y-3">
              <div class="info-row">
                <span class="info-label">类型</span>
                <span class="info-value">{{ resort.type === 'indoor' ? '室内滑雪场' : '室外滑雪场' }}</span>
              </div>
              <div class="info-row" v-if="resort.address">
                <span class="info-label">地址</span>
                <span class="info-value text-right max-w-[60%]">{{ resort.address }}</span>
              </div>
              <div class="info-row" v-if="resort.season">
                <span class="info-label">雪季</span>
                <span class="info-value">
                  <template v-if="resort.season.yearRound">全年开放</template>
                  <template v-else-if="resort.season.openMonth && resort.season.closeMonth">
                    {{ resort.season.openMonth }}月 - {{ resort.season.closeMonth }}月
                  </template>
                  <template v-else>-</template>
                </span>
              </div>
              <div v-if="resort.season && resort.season.description" class="pt-2">
                <p class="text-sm text-gray-500">{{ resort.season.description }}</p>
              </div>
            </div>
          </div>

          <!-- 雪道信息 -->
          <div class="info-card">
            <h3 class="info-card-title">雪道信息</h3>
            <template v-if="resort.trails">
              <div class="mb-4">
                <span class="text-3xl font-bold text-gray-900">{{ resort.trails.total || 0 }}</span>
                <span class="text-gray-500 ml-1">条雪道</span>
              </div>

              <!-- Trail Breakdown Bar -->
              <div v-if="resort.trails.total > 0" class="mb-4">
                <div class="flex h-3 rounded-full overflow-hidden bg-gray-200">
                  <div
                    v-if="resort.trails.beginner"
                    class="bg-green-400"
                    :style="{ width: trailPercent('beginner') + '%' }"
                    :title="`初级 ${resort.trails.beginner} 条`"
                  ></div>
                  <div
                    v-if="resort.trails.intermediate"
                    class="bg-blue-500"
                    :style="{ width: trailPercent('intermediate') + '%' }"
                    :title="`中级 ${resort.trails.intermediate} 条`"
                  ></div>
                  <div
                    v-if="resort.trails.advanced"
                    class="bg-red-500"
                    :style="{ width: trailPercent('advanced') + '%' }"
                    :title="`高级 ${resort.trails.advanced} 条`"
                  ></div>
                  <div
                    v-if="resort.trails.expert"
                    class="bg-gray-900"
                    :style="{ width: trailPercent('expert') + '%' }"
                    :title="`专家级 ${resort.trails.expert} 条`"
                  ></div>
                </div>
                <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                  <span v-if="resort.trails.beginner" class="flex items-center">
                    <span class="w-2.5 h-2.5 rounded-full bg-green-400 mr-1"></span>
                    初级 {{ resort.trails.beginner }}
                  </span>
                  <span v-if="resort.trails.intermediate" class="flex items-center">
                    <span class="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1"></span>
                    中级 {{ resort.trails.intermediate }}
                  </span>
                  <span v-if="resort.trails.advanced" class="flex items-center">
                    <span class="w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></span>
                    高级 {{ resort.trails.advanced }}
                  </span>
                  <span v-if="resort.trails.expert" class="flex items-center">
                    <span class="w-2.5 h-2.5 rounded-full bg-gray-900 mr-1"></span>
                    专家级 {{ resort.trails.expert }}
                  </span>
                </div>
              </div>

              <!-- Vertical Drop -->
              <div v-if="resort.trails.maxVerticalDrop" class="info-row">
                <span class="info-label">最大落差</span>
                <span class="info-value font-semibold">{{ resort.trails.maxVerticalDrop }}m</span>
              </div>
            </template>
            <p v-else class="text-gray-400 text-sm">暂无雪道数据</p>
          </div>

          <!-- 票价信息 -->
          <div class="info-card">
            <h3 class="info-card-title">票价信息</h3>
            <template v-if="resort.pricing">
              <table class="w-full text-sm">
                <tbody>
                  <tr v-if="resort.pricing.weekdayDaily" class="border-b border-gray-100">
                    <td class="py-2.5 text-gray-500">工作日全天</td>
                    <td class="py-2.5 text-right font-semibold text-gray-900">¥{{ resort.pricing.weekdayDaily }}</td>
                  </tr>
                  <tr v-if="resort.pricing.weekendDaily" class="border-b border-gray-100">
                    <td class="py-2.5 text-gray-500">周末/节假日全天</td>
                    <td class="py-2.5 text-right font-semibold text-gray-900">¥{{ resort.pricing.weekendDaily }}</td>
                  </tr>
                  <tr v-if="resort.pricing.halfDay" class="border-b border-gray-100">
                    <td class="py-2.5 text-gray-500">半天票</td>
                    <td class="py-2.5 text-right font-semibold text-gray-900">¥{{ resort.pricing.halfDay }}</td>
                  </tr>
                  <tr v-if="resort.pricing.nightSkiing" class="border-b border-gray-100">
                    <td class="py-2.5 text-gray-500">夜场</td>
                    <td class="py-2.5 text-right font-semibold text-gray-900">¥{{ resort.pricing.nightSkiing }}</td>
                  </tr>
                  <tr v-if="resort.pricing.seasonPass">
                    <td class="py-2.5 text-gray-500">季卡</td>
                    <td class="py-2.5 text-right font-semibold text-gray-900">¥{{ resort.pricing.seasonPass }}</td>
                  </tr>
                </tbody>
              </table>
            </template>
            <p v-else class="text-gray-400 text-sm">暂无票价数据</p>
          </div>

          <!-- 设施 -->
          <div class="info-card">
            <h3 class="info-card-title">设施</h3>
            <template v-if="resort.facilities">
              <div class="grid grid-cols-2 gap-2.5">
                <div
                  v-for="f in facilityItems"
                  :key="f.key"
                  class="flex items-center space-x-2 text-sm"
                >
                  <span :class="resort.facilities[f.key] ? 'text-green-500' : 'text-gray-300'">
                    {{ resort.facilities[f.key] ? '✅' : '❌' }}
                  </span>
                  <span :class="resort.facilities[f.key] ? 'text-gray-700' : 'text-gray-400'">
                    {{ f.label }}
                  </span>
                </div>
              </div>
              <div v-if="resort.facilities.liftCount" class="mt-3 pt-3 border-t border-gray-100">
                <div class="info-row">
                  <span class="info-label">缆车/魔毯数量</span>
                  <span class="info-value font-semibold">{{ resort.facilities.liftCount }}</span>
                </div>
              </div>
            </template>
            <p v-else class="text-gray-400 text-sm">暂无设施数据</p>
          </div>

          <!-- 适合人群 -->
          <div v-if="resort.suitableFor && resort.suitableFor.length" class="info-card">
            <h3 class="info-card-title">适合人群</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="s in resort.suitableFor"
                :key="s"
                class="px-3 py-1.5 rounded-lg text-sm bg-nomad-50 text-nomad-600 font-medium border border-nomad-100"
              >
                {{ s }}
              </span>
            </div>
          </div>

          <!-- 亮点 -->
          <div v-if="resort.highlights && resort.highlights.length" class="info-card">
            <h3 class="info-card-title">亮点</h3>
            <ul class="space-y-2">
              <li
                v-for="(h, i) in resort.highlights"
                :key="i"
                class="flex items-start text-sm text-gray-700"
              >
                <span class="text-nomad-500 mr-2 mt-0.5 flex-shrink-0">●</span>
                <span>{{ h }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Community Stats -->
        <div v-if="resort.community" class="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
          <h3 class="text-lg font-bold text-gray-900 mb-4">社群数据</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <div class="text-2xl font-bold text-gray-900">{{ resort.community.rating?.toFixed(1) || '-' }}</div>
              <div class="text-xs text-gray-500 mt-1">用户评分</div>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <div class="text-2xl font-bold text-gray-900">{{ resort.community.reviewCount || 0 }}</div>
              <div class="text-xs text-gray-500 mt-1">评价数</div>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <div class="text-2xl font-bold text-gray-900">{{ resort.community.favoriteCount || 0 }}</div>
              <div class="text-xs text-gray-500 mt-1">收藏数</div>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-xl">
              <div class="text-2xl font-bold text-gray-900">{{ resort.community.shareCount || 0 }}</div>
              <div class="text-xs text-gray-500 mt-1">分享数</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

const route = useRoute()
const resortId = route.params.id

const { data: resortData, pending, error } = useFetch(`/api/resorts/${resortId}`)

const resort = computed(() => {
  if (!resortData.value || resortData.value.code !== 0) return null
  return resortData.value.data
})

// Facility display config
const facilityItems = [
  { key: 'hasRental', label: '雪具租赁' },
  { key: 'hasParking', label: '停车场' },
  { key: 'hasRestaurant', label: '餐厅' },
  { key: 'hasHotel', label: '住宿' },
  { key: 'hasNightSkiing', label: '夜场滑雪' },
  { key: 'hasSnowmaking', label: '人工造雪' },
  { key: 'hasSkiSchool', label: '滑雪学校' },
  { key: 'hasChildrenArea', label: '儿童区' },
  { key: 'hasLocker', label: '储物柜' },
  { key: 'hasMedical', label: '医疗救护' },
]

// Trail percentage calculation
function trailPercent(level) {
  if (!resort.value || !resort.value.trails || !resort.value.trails.total) return 0
  return ((resort.value.trails[level] || 0) / resort.value.trails.total * 100).toFixed(1)
}

// Page title
useHead({
  title: computed(() => resort.value ? `${resort.value.name} - 滑雪场指南` : '加载中... - 滑雪场指南'),
})
</script>

<style scoped>
.info-card {
  @apply bg-white rounded-2xl p-6 border border-gray-100;
}
.info-card-title {
  @apply text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100;
}
.info-row {
  @apply flex items-center justify-between;
}
.info-label {
  @apply text-sm text-gray-500;
}
.info-value {
  @apply text-sm text-gray-900;
}
</style>
