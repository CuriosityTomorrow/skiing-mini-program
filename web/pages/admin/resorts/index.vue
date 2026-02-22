<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">滑雪场管理</h1>
        <NuxtLink to="/admin/resorts/new" class="px-4 py-2 bg-nomad-gradient text-white rounded-lg font-medium hover:opacity-90">
          + 新增滑雪场
        </NuxtLink>
      </div>

      <!-- Search -->
      <div class="mb-4">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜索名称、省份、城市..."
          class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-300"
          @input="fetchResorts"
        />
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">ID</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">名称</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">省份/城市</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">类型</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">评分</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">图片</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="pending">
              <td colspan="7" class="text-center py-12 text-gray-400">加载中...</td>
            </tr>
            <tr v-else-if="resorts.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-400">暂无数据</td>
            </tr>
            <tr v-for="resort in resorts" :key="resort.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-400">{{ resort.id }}</td>
              <td class="px-4 py-3 font-medium text-gray-900">{{ resort.name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ resort.province }} · {{ resort.city }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded-full text-xs" :class="resort.type === 'indoor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'">
                  {{ resort.type === 'indoor' ? '室内' : '室外' }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ resort.rating }}</td>
              <td class="px-4 py-3">
                <img v-if="resort.images?.[0]" :src="resort.images[0]" class="w-12 h-8 object-cover rounded" @error="(e) => e.target.style.display='none'" />
                <span v-else class="text-gray-300 text-xs">无图片</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <NuxtLink :to="`/admin/resorts/${resort.id}/edit`" class="text-blue-600 hover:underline">编辑</NuxtLink>
                  <button class="text-red-500 hover:underline" @click="deleteResort(resort)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-4 text-sm text-gray-500">
        <span>共 {{ total }} 条</span>
        <div class="flex gap-2">
          <button :disabled="offset === 0" class="px-3 py-1 border rounded disabled:opacity-40" @click="prev">上一页</button>
          <button :disabled="offset + pageSize >= total" class="px-3 py-1 border rounded disabled:opacity-40" @click="next">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'admin', layout: false })

const keyword = ref('')
const offset = ref(0)
const pageSize = 20
const pending = ref(false)
const resorts = ref([])
const total = ref(0)

async function fetchResorts() {
  pending.value = true
  const data = await $fetch('/api/admin/resorts', {
    query: { keyword: keyword.value, limit: pageSize, offset: offset.value }
  })
  resorts.value = data.data
  total.value = data.total
  pending.value = false
}

function prev() { offset.value = Math.max(0, offset.value - pageSize); fetchResorts() }
function next() { offset.value += pageSize; fetchResorts() }

async function deleteResort(resort) {
  if (!confirm(`确认删除「${resort.name}」？`)) return
  await $fetch(`/api/admin/resorts/${resort.id}`, { method: 'DELETE' })
  fetchResorts()
}

onMounted(fetchResorts)
</script>
