<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="flex items-center gap-3 mb-6">
        <NuxtLink to="/admin/resorts" class="text-gray-400 hover:text-gray-600">← 返回列表</NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">新增滑雪场</h1>
      </div>

      <form class="bg-white rounded-xl shadow-sm p-6 space-y-5" @submit.prevent="save">
        <!-- 基本信息 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">名称 *</label>
            <input v-model="form.name" required class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">省份 *</label>
            <input v-model="form.province" required class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">城市 *</label>
            <input v-model="form.city" required class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">区县</label>
            <input v-model="form.district" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">类型 *</label>
            <select v-model="form.type" required class="input">
              <option value="outdoor">室外</option>
              <option value="indoor">室内</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">评分 (0-5)</label>
            <input v-model.number="form.rating" type="number" min="0" max="5" step="0.1" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">人气 (0-100)</label>
            <input v-model.number="form.popularity" type="number" min="0" max="100" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">纬度</label>
            <input v-model.number="form.latitude" type="number" step="any" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">经度</label>
            <input v-model.number="form.longitude" type="number" step="any" class="input" />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
            <input v-model="form.address" class="input" />
          </div>
        </div>

        <!-- 图片 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">图片（每行一个 URL，第一张为封面）</label>
          <textarea
            v-model="imagesText"
            rows="4"
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            class="input font-mono text-xs"
          />
          <div v-if="imageList.length" class="flex gap-2 mt-2 flex-wrap">
            <div v-for="(url, i) in imageList" :key="i" class="relative">
              <img :src="url" class="w-20 h-14 object-cover rounded border" @error="(e) => e.target.style.opacity='0.3'" />
              <span v-if="i === 0" class="absolute top-0 left-0 bg-nomad-gradient text-white text-xs px-1 rounded-tl rounded-br">封面</span>
            </div>
          </div>
        </div>

        <!-- 雪道信息 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">雪道信息</label>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="key in ['total','beginner','intermediate','advanced','expert']" :key="key">
              <label class="block text-xs text-gray-500 mb-1">{{ trailLabels[key] }}</label>
              <input v-model.number="form.trails[key]" type="number" min="0" class="input" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">最长雪道(m)</label>
              <input v-model.number="form.trails.maxLength" type="number" min="0" class="input" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">垂直落差(m)</label>
              <input v-model.number="form.trails.verticalDrop" type="number" min="0" class="input" />
            </div>
          </div>
        </div>

        <!-- 票价 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">票价</label>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">工作日全天 (¥)</label>
              <input v-model.number="form.pricing.weekdayDaily" type="number" min="0" class="input" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">周末全天 (¥)</label>
              <input v-model.number="form.pricing.weekendDaily" type="number" min="0" class="input" />
            </div>
          </div>
        </div>

        <!-- 雪季 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">雪季</label>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 text-sm">
              <input v-model="form.season.yearRound" type="checkbox" />
              全年开放
            </label>
            <template v-if="!form.season.yearRound">
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-500">开放月份</span>
                <input v-model.number="form.season.openMonth" type="number" min="1" max="12" class="input w-16" />
                <span class="text-gray-400">月 ~</span>
                <input v-model.number="form.season.closeMonth" type="number" min="1" max="12" class="input w-16" />
                <span class="text-gray-400">月</span>
              </div>
            </template>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button type="submit" :disabled="saving" class="px-6 py-2 bg-nomad-gradient text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
            {{ saving ? '保存中...' : '保存' }}
          </button>
          <NuxtLink to="/admin/resorts" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">取消</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'admin', layout: false })

const router = useRouter()
const saving = ref(false)
const imagesText = ref('')

const form = ref({
  name: '', province: '', city: '', district: '', address: '',
  type: 'outdoor', rating: 0, popularity: 0, latitude: null, longitude: null,
  trails: { total: 0, beginner: 0, intermediate: 0, advanced: 0, expert: 0, maxLength: 0, verticalDrop: 0 },
  pricing: { weekdayDaily: 0, weekendDaily: 0 },
  season: { yearRound: false, openMonth: 11, closeMonth: 3 },
})

const trailLabels = { total: '总数', beginner: '初级', intermediate: '中级', advanced: '高级', expert: '专家' }
const imageList = computed(() => imagesText.value.split('\n').map(s => s.trim()).filter(Boolean))

async function save() {
  saving.value = true
  await $fetch('/api/admin/resorts', { method: 'POST', body: { ...form.value, images: imageList.value } })
  saving.value = false
  router.push('/admin/resorts')
}
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nomad-300;
}
</style>
