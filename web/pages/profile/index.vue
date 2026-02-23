<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-nomad-gradient py-8 md:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
            {{ user?.nickname?.[0] || '我' }}
          </div>
          <div>
            <div v-if="!editing" class="flex items-center gap-2">
              <h1 class="text-2xl font-bold text-white">{{ user?.nickname || '未登录' }}</h1>
              <button v-if="user" @click="startEdit" class="text-white/60 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>
            </div>
            <div v-else class="flex items-center gap-2">
              <input v-model="nicknameInput" @keyup.enter="saveNickname" @keyup.esc="editing=false" class="text-xl font-bold bg-white/20 text-white placeholder-white/50 rounded-lg px-2 py-0.5 outline-none focus:bg-white/30 w-40" maxlength="20" />
              <button @click="saveNickname" class="text-white/80 hover:text-white text-sm font-medium">保存</button>
              <button @click="editing=false" class="text-white/50 hover:text-white text-sm">取消</button>
            </div>
            <p class="text-white/70 text-sm mt-0.5">{{ user?.phone || '' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Not logged in -->
      <div v-if="!user" class="text-center py-20">
        <div class="text-5xl mb-4">👤</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">请先登录</h3>
        <p class="text-gray-500 mb-6">登录后可查看收藏的滑雪场</p>
        <NuxtLink to="/login" class="inline-flex items-center px-6 py-3 bg-nomad-gradient text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
          去登录
        </NuxtLink>
      </div>

      <template v-else>
        <!-- Favorites Section -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-4">我的收藏</h2>

          <!-- Loading -->
          <div v-if="pending" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-xl overflow-hidden border border-gray-100">
              <div class="h-52 bg-gray-200"></div>
              <div class="p-3"><div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div class="h-3 bg-gray-200 rounded w-1/2"></div></div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="favoriteResorts.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div class="text-5xl mb-4">🏔️</div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">还没有收藏</h3>
            <p class="text-gray-500 mb-6">去浏览滑雪场，点击心形按钮收藏吧</p>
            <NuxtLink to="/resorts" class="inline-flex items-center px-6 py-3 bg-nomad-gradient text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              浏览滑雪场
            </NuxtLink>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <NuxtLink
              v-for="resort in favoriteResorts"
              :key="resort.id"
              :to="`/resorts/${resort.id}`"
              class="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div class="relative h-52 overflow-hidden">
                <img
                  :src="resort.images?.[0] || fallbackImage"
                  :alt="resort.name"
                  class="w-full h-full object-cover group-hover:scale-105 group-hover:blur-sm transition-all duration-500"
                  @error="(e) => e.target.src = fallbackImage"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-300"></div>
                <!-- Hover overlay -->
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
                <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs font-medium z-10"
                  :class="resort.type === 'indoor' ? 'bg-blue-500/85 text-white' : 'bg-green-500/85 text-white'">
                  {{ resort.type === 'indoor' ? '室内' : '室外' }}
                </span>
                <button
                  class="absolute bottom-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-red-500 text-white"
                  @click.prevent.stop="removeFavorite(resort.id)"
                >
                  <svg class="w-3.5 h-3.5" fill="currentColor" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <div class="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 class="text-white font-bold text-sm leading-tight truncate mb-0.5">{{ resort.name }}</h3>
                  <p class="text-white/75 text-xs">{{ resort.province }} · {{ resort.city }}</p>
                </div>
              </div>
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
      </template>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })

const user = ref(null)
const favoriteResorts = ref([])
const pending = ref(false)
const editing = ref(false)
const nicknameInput = ref('')

function startEdit() {
  nicknameInput.value = user.value?.nickname || ''
  editing.value = true
}

async function saveNickname() {
  const token = localStorage.getItem('token')
  if (!token || !nicknameInput.value.trim()) return
  const res = await $fetch('/api/auth/profile', {
    method: 'PATCH',
    headers: { authorization: `Bearer ${token}` },
    body: { nickname: nicknameInput.value.trim() },
  }).catch(() => null)
  if (res?.code === 0) {
    user.value = { ...user.value, nickname: nicknameInput.value.trim() }
    localStorage.setItem('user', JSON.stringify(user.value))
  }
  editing.value = false
}
const fallbackImage = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80'

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
    { icon: '💰', label: '票价', value: priceLines.join(' / ') || '-', pct: 0, color: 'bg-green-400', wide: true },
  ]
}

async function loadFavorites() {
  const token = localStorage.getItem('token')
  if (!token) return
  pending.value = true
  const res = await $fetch('/api/favorites/details', {
    headers: { authorization: `Bearer ${token}` },
  }).catch(() => null)
  pending.value = false
  if (res?.code === 0) favoriteResorts.value = res.data
}

onMounted(async () => {
  const stored = localStorage.getItem('user')
  if (stored) user.value = JSON.parse(stored)
  await loadFavorites()
})

async function removeFavorite(resortId) {
  const token = localStorage.getItem('token')
  if (!token) return
  await $fetch('/api/favorites/toggle', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: { resortId },
  }).catch(() => null)
  await loadFavorites()
}
</script>
