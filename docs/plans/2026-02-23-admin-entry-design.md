# 管理员后台入口 — 设计文档

**日期**：2026-02-23
**范围**：MVP，仅前端权限管控，API 安全加固留待后续

## 背景

管理员后台页面（`/admin/resorts/*`）和 API 均已实现，缺少：
1. 管理员入口按钮（普通用户不可见）
2. 路由级别权限保护

## MVP 范围

### 1. 头像下拉菜单加入"管理后台"按钮
- 文件：`web/layouts/default.vue`
- 条件：`user.role === 'admin'` 才渲染
- 跳转：`/admin/resorts`

### 2. Nuxt 路由中间件
- 新文件：`web/middleware/admin.js`
- 规则：
  - 未登录 → 跳 `/login`
  - 已登录非 admin → 跳 `/`
  - admin → 放行
- 挂载：在 `pages/admin/` 下各页面声明 `definePageMeta({ middleware: 'admin' })`

## 遗留事项

- [ ] **Admin API 安全加固**：`/api/admin/resorts/*` 所有写操作（POST/PUT/DELETE）目前无鉴权，任何人可直接调用。需提取 `server/utils/requireAdmin.js` 工具函数，在各 admin API handler 中校验 JWT + `role === 'admin'`，否则返回 403。
