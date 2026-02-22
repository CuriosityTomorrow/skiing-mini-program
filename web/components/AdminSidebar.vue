<template>
  <aside class="w-48 min-h-screen bg-white border-r border-gray-200 flex-shrink-0">
    <div class="p-4 border-b border-gray-200">
      <NuxtLink to="/" class="text-sm text-gray-500 hover:text-gray-700">← 返回前台</NuxtLink>
    </div>
    <nav class="p-2">
      <NuxtLink
        to="/admin/resorts"
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="$route.path.startsWith('/admin/resorts') ? 'bg-nomad-50 text-nomad-600' : 'text-gray-600 hover:bg-gray-50'"
      >
        🎿 滑雪场管理
      </NuxtLink>
      <NuxtLink
        to="/admin/users"
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="$route.path.startsWith('/admin/users') ? 'bg-nomad-50 text-nomad-600' : 'text-gray-600 hover:bg-gray-50'"
      >
        👤 用户管理
      </NuxtLink>
    </nav>
  </aside>
</template>
