// web/middleware/admin.js
export default defineNuxtRouteMiddleware(() => {
  // 只在客户端执行（localStorage 是浏览器 API）
  if (import.meta.server) return

  const stored = localStorage.getItem('user')
  if (!stored) return navigateTo('/login')

  const user = JSON.parse(stored)
  if (user.role !== 'admin') return navigateTo('/')
})
