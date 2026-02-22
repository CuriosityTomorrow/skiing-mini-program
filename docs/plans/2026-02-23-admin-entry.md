# 管理员后台入口 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在导航栏头像下拉菜单中加入"管理后台"入口，仅 admin 用户可见；并用 Nuxt 路由中间件保护所有 `/admin/*` 页面。

**Architecture:** 两步实现——先建 Nuxt 客户端中间件 `middleware/admin.js` 拦截非管理员访问，再在 `layouts/default.vue` 的头像下拉里按 `user.role === 'admin'` 条件渲染入口按钮，最后给所有 admin 页面声明使用该中间件。

**Tech Stack:** Nuxt 3, Vue 3 `<script setup>`, Tailwind CSS, localStorage（存储 user 对象，含 role 字段）

---

### Task 1: 创建路由中间件 `middleware/admin.js`

**Files:**
- Create: `web/middleware/admin.js`

**Step 1: 创建文件并写入内容**

```js
// web/middleware/admin.js
export default defineNuxtRouteMiddleware(() => {
  // 只在客户端执行（localStorage 是浏览器 API）
  if (import.meta.server) return

  const stored = localStorage.getItem('user')
  if (!stored) return navigateTo('/login')

  const user = JSON.parse(stored)
  if (user.role !== 'admin') return navigateTo('/')
})
```

**Step 2: 在三个 admin 页面声明使用该中间件**

在每个文件的 `<script setup>` 顶部（或新建 `<script setup>`）加入：

```js
definePageMeta({ middleware: 'admin' })
```

涉及文件：
- `web/pages/admin/resorts/index.vue`
- `web/pages/admin/resorts/new.vue`
- `web/pages/admin/resorts/[id]/edit.vue`

每个文件在已有的 `<script setup>` 块第一行加入 `definePageMeta`，如果没有 `<script setup>` 则新建一个。

**Step 3: 手动验证中间件工作**

启动服务：`cd web && npm run dev`

- 在浏览器未登录状态直接访问 `http://localhost:3000/admin/resorts` → 应跳转到 `/login`
- 登录普通用户（role 非 admin）后访问同一地址 → 应跳转到 `/`

**Step 4: Commit**

```bash
git add web/middleware/admin.js web/pages/admin/resorts/index.vue web/pages/admin/resorts/new.vue "web/pages/admin/resorts/[id]/edit.vue"
git commit -m "feat: add admin route middleware to protect /admin/* pages"
```

---

### Task 2: 在头像下拉菜单加入"管理后台"按钮

**Files:**
- Modify: `web/layouts/default.vue`

**Step 1: 在下拉菜单中添加管理后台入口**

定位到 `default.vue` 中的下拉菜单部分（约第 52 行），当前结构：

```html
<div class="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
  <div class="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">{{ user.nickname }}</div>
  <button class="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-50" @click="logout">退出登录</button>
</div>
```

在昵称和退出登录之间插入：

```html
<NuxtLink
  v-if="user.role === 'admin'"
  to="/admin/resorts"
  class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
>
  🛠 管理后台
</NuxtLink>
```

**Step 2: 手动验证按钮显示逻辑**

- 以 `role !== 'admin'` 的用户登录 → 下拉菜单里不应出现"管理后台"
- 将 localStorage 中 user 的 role 改为 `admin`（浏览器控制台操作）→ 刷新后下拉里出现"管理后台"，点击跳转到 `/admin/resorts`

**Step 3: Commit**

```bash
git add web/layouts/default.vue
git commit -m "feat: show admin panel button in nav dropdown for admin users"
```

---

### Task 3: 启动开发服务器做整体联调

**Step 1: 确保开发服务器正在运行**

```bash
cd web && npm run dev
```

**Step 2: 端对端验证流程**

1. 未登录 → 直接访问 `/admin/resorts` → 跳 `/login` ✓
2. 普通用户登录 → 导航栏头像下拉里没有"管理后台" ✓
3. 普通用户直接输 URL 访问 `/admin/resorts` → 跳首页 ✓
4. Admin 用户登录 → 下拉里有"管理后台"，点击进入管理页面正常工作 ✓

> **注意：** 若本地没有 admin 用户，可在 Drizzle Studio (`npx drizzle-kit studio`) 中将 users 表某条记录的 role 字段改为 `admin`，再重新登录。

**Step 3: 整体 commit（如 task 1/2 未分开提交）**

```bash
git add -A
git commit -m "feat: admin panel entry with route guard (MVP)"
```
