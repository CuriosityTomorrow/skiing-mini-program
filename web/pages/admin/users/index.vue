<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AdminSidebar />
    <div class="flex-1 px-6 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">用户管理</h1>
      </div>

      <!-- Search -->
      <div class="mb-4">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜索手机号、昵称..."
          class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nomad-300"
          @input="fetchUsers"
        />
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">ID</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">手机号</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">昵称</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">角色</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">注册时间</th>
              <th class="text-left px-4 py-3 text-gray-600 font-medium">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="pending">
              <td colspan="6" class="text-center py-12 text-gray-400">加载中...</td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-400">暂无数据</td>
            </tr>
            <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-400">{{ u.id }}</td>
              <td class="px-4 py-3 text-gray-900">{{ u.phone || '—' }}</td>
              <td class="px-4 py-3 text-gray-600">{{ u.nickname || '—' }}</td>
              <td class="px-4 py-3">
                <select
                  :value="u.role"
                  class="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none"
                  @change="updateRole(u, $event.target.value)"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td class="px-4 py-3 text-gray-400 text-xs">{{ u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—' }}</td>
              <td class="px-4 py-3">
                <button class="text-red-500 hover:underline text-sm" @click="deleteUser(u)">删除</button>
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
const users = ref([])
const total = ref(0)

async function fetchUsers() {
  pending.value = true
  const data = await $fetch('/api/admin/users', {
    query: { keyword: keyword.value, limit: pageSize, offset: offset.value }
  })
  users.value = data.data
  total.value = data.total
  pending.value = false
}

async function updateRole(user, role) {
  await $fetch(`/api/admin/users/${user.id}`, { method: 'PATCH', body: { role } })
  user.role = role
}

async function deleteUser(user) {
  if (!confirm(`确认删除用户「${user.nickname || user.phone}」？`)) return
  await $fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
  fetchUsers()
}

function prev() { offset.value = Math.max(0, offset.value - pageSize); fetchUsers() }
function next() { offset.value += pageSize; fetchUsers() }

onMounted(fetchUsers)
</script>
