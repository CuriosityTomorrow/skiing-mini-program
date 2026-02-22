// web/middleware/admin.js
export default defineNuxtRouteMiddleware(() => {
  // 只在客户端执行（localStorage 是浏览器 API；SSR 阶段无法访问，直接放行）
  if (import.meta.server) return

  const stored = localStorage.getItem('user')
  if (!stored) return navigateTo('/login')

  try {
    const user = JSON.parse(stored)
    if (!user || user.role !== 'admin') return navigateTo('/')
  } catch {
    return navigateTo('/login')
  }
})
