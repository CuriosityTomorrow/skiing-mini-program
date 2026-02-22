# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**GitHub 仓库**：https://github.com/CuriosityTomorrow/skiing-mini-program

**滑雪场助手微信小程序** - 帮助滑雪爱好者搜索和评价滑雪场的微信小程序

**核心功能**：搜索/筛选滑雪场（室内/室外）、查看详情、收藏、用户经验分享（寻找雪友、评价、照片）

---

## 技术栈

### 小程序前端（frontend/）
- **框架**：uni-app (Vue 3) + JavaScript（非 TypeScript）
- **UI组件**：@dcloudio/uni-ui
- **构建**：HBuilderX（禁止用命令行 `npm run dev:mp-weixin`）
- **云服务**：微信云开发（类 MongoDB 数据库 + 云函数）

### Web 版本（web/）
- **框架**：Nuxt 3 全栈（SSR）
- **数据库**：SQLite via Drizzle ORM（`web/db/skiing.db`）
- **状态管理**：Pinia
- **样式**：Tailwind CSS
- **认证**：jose (JWT)

---

## 关键配置

### 微信小程序
- **AppID**：`wx26ec61e86b268268`
- **环境ID**：`cloudbase-0g4g10cr89711adb`
- **小程序入口路径**（微信开发者工具导入）：`frontend/unpackage/dist/dev/mp-weixin`

### 高德地图
- **Web Service API Key**：`41f98310392808752b5e9ea1e6bc4776`
- **配置文件**：`frontend/src/infrastructure/config/amap.config.js`
- **合法域名**：`restapi.amap.com`（已在小程序后台配置）

### Mock 模式开关（重要）
`frontend/src/infrastructure/config/index.js` 中 `useMock: true` 表示使用本地 Mock 数据，不调用云函数：
```javascript
export const appConfig = {
  useMock: true,   // ← 改为 false 启用真实云函数
  cloud: { env: 'cloudbase-0g4g10cr89711adb', traceUser: true },
}
```
Mock 数据文件：`frontend/src/infrastructure/mock/resortMockData.js`（5个示例滑雪场）

---

## 开发命令

### 小程序（必须用 HBuilderX）
1. HBuilderX 打开 `frontend/` 目录
2. 右键项目 → 运行 → 运行到小程序模拟器 → 微信开发者工具
3. 首次需在微信开发者工具导入 `frontend/unpackage/dist/dev/mp-weixin`
4. 微信开发者工具 → 设置 → 安全设置 → 开启服务端口

### Web 版本
```bash
cd web
npm run dev          # 开发服务器 http://localhost:3000
npm run build        # 生产构建
npm run db:seed      # 初始化 TOP50 滑雪场数据（首次必须执行）
npm run db:push      # 推送 Drizzle schema 变更到 SQLite
npm run db:generate  # 生成 Drizzle migration 文件
```

### 云函数部署
微信开发者工具 → 右键云函数目录 → 上传并部署 → 在云开发控制台查看日志

---

## 项目结构

```
skiing/
├── frontend/src/              # 小程序源码（DDD 4层架构）
│   ├── domain/resort/         # 领域层：实体、仓储接口、领域服务、策略
│   ├── application/           # 应用层：DTO、Mapper、AppService
│   ├── infrastructure/        # 基础设施层：API客户端、Mock数据、高德地图、配置
│   ├── interfaces/            # 接口层：hooks (use*.js)、通用组件
│   ├── pages/                 # 页面路由：resort/list, resort/detail, resort/compare, community, profile
│   ├── di/container.js        # 依赖注入容器（单例）
│   └── shared/                # 共享：types (JSDoc)、constants、utils
│
├── web/                       # Nuxt 3 全栈 Web 版本
│   ├── server/api/resorts/    # Nitro API: index.get.js, [id].get.js
│   ├── lib/domain/resort/     # 从小程序复制的领域逻辑
│   └── db/schema.js           # SQLite 表：users, authCodes, resorts
│
└── backend/cloudfunctions/    # 微信云函数：resort-search, resort-detail, favorite-add, favorite-remove
```

**文件命名约定**：
- 实体：`*.entity.js` | 领域服务：`*.domain.js` | 应用服务：`*AppService.js`
- 仓储接口：`I*.js` | DTO：`*.dto.js` | Mapper：`*.mapper.js` | Hooks：`use*.js`

---

## 重要决策

### 禁用 TypeScript
HBuilderX 编译与 TypeScript 不兼容。所有代码用 `.js`，类型用 JSDoc 注释。即使 package.json 中有 TypeScript 依赖，也仅用于 IDE 类型提示，不编译。

### 必须使用相对路径
`@/` 别名在 HBuilderX 下不稳定，所有导入必须用相对路径（`./`、`../`）。已存在的 `@/` 保持现状，新代码一律用相对路径。

### Nomads 设计主题
当前分支 `nomads`，UI 采用游牧民族风格，色彩/交互遵循该主题。

---

## DDD 架构

### 依赖方向
```
Interface (UI / pages) → Application → Domain ← Infrastructure
```

### 应用服务的两个实现（注意区分）

`application/services/` 下存在两个同名类（历史遗留），用途不同：

| 文件 | 用途 | 谁在用 |
|------|------|--------|
| `ResortSearchAppService.js` | 功能完整版：含高德API、缓存、TOP50数据、筛选、评分 | 所有页面直接 import |
| `ResortSearchService.app.js` | 精简DDD版：通过构造函数注入 domainService | DI 容器（`di/container.js`） |

**当前实际使用情况**：
- `pages/resort/list/index.vue`、`detail/index.vue`、`compare/index.vue` 直接实例化 `ResortSearchAppService.js`
- `interfaces/hooks/useResortList.js` 通过 `diContainer.getResortSearchAppService()` 使用精简版

新开发页面建议直接参考现有页面的方式（直接 import `ResortSearchAppService.js`）。

### 依赖注入容器
`src/di/container.js` 导出 `diContainer` 单例，通过具名方法访问（**没有** `.get()` 方法）：

```javascript
// ✅ 正确用法
import { diContainer } from '../../di/container'
const appService = diContainer.getResortSearchAppService()

// 容器提供的方法：
// diContainer.getResortRepository()
// diContainer.getResortSearchService()
// diContainer.getResortSearchAppService()
```

### DDD 层级调用规则
```javascript
// ✅ 正确：页面直接使用应用服务
import { ResortSearchAppService } from '../../../application/services/ResortSearchAppService.js'
const resortService = new ResortSearchAppService()
const results = await resortService.search(params)

// ❌ 错误：UI 直接调用 Infrastructure
import { AmapPoiService } from '../../../infrastructure/amap/AmapPoiService.js'
```

---

## 搜索架构（核心功能）

- **策略模式**：`domain/resort/strategies/ResortSortStrategy.js` — 按人气/相关度排序，Haversine 公式计算距离
- **应用服务**（`ResortSearchAppService.js`）：混合策略 — 本地缓存(24h) → 高德 API → 本地 TOP50 fallback
- **高德搜索**：`infrastructure/amap/AmapPoiService.js`，POI 接口 `/v3/place/text`
- **日志标记**：`[高德]` `[加载]` `[搜索]` `[缓存]` `[Fallback]`（便于控制台调试）

---

## 数据库设计

### 微信云数据库（小程序）— resorts 集合
```javascript
{
  _id, id, name, province, city, address,
  latitude, longitude, type,            // 'indoor' | 'outdoor'
  facilities: { hasRental, hasParking, hasRestaurant, hasHotel, hasNightSkiing },
  openTime, closeTime,
  tickets: [{ type, price, description }],
  trails: { totalCount, beginner, intermediate, advanced, expert },
  popularity, rating, createTime
}
```

### SQLite（Web 版本）— web/db/schema.js
三张表：`users`（手机号/微信openid/角色）、`authCodes`（验证码）、`resorts`（字段与小程序类似，facilities/trails/pricing/season 等用 JSON 列存储）

---

## 云函数 API

| 函数 | 参数 | 返回 |
|------|------|------|
| `resort-search` | `{ keyword?, type, limit=20, offset=0 }` | `{ code, data: Array, total }` |
| `resort-detail` | `{ id }` | `{ code, data: Object }` |
| `favorite-add/remove` | `{ resortId, userId }` | `{ code, message }` |

返回码：`code: 0` 成功，`code: -1` 失败

---

## 常见问题排查

| 问题 | 解决 |
|------|------|
| 模块导入错误 | 检查是否用了 `@/` 别名或 `.ts` 扩展名 |
| 页面不刷新 | 等1-2秒；手动点"编译"；清除缓存 |
| 微信开发者工具未打开/刷新 | 检查登录状态；开启服务端口；确认导入路径；`killall wechatwebdevtools` |
| 云函数调用失败 | 确认 `useMock: false`；确认函数已上传；查看云函数日志 |
| 数据不更新 | 检查 Mock 模式开关；查看控制台 `[Mock模式]` 日志标记 |

---

## 编码规范

```javascript
// JSDoc 替代 TypeScript 类型
/**
 * @param {string} keyword - 搜索关键词
 * @param {'indoor'|'outdoor'|'all'} type
 * @returns {Promise<Array>}
 */
async function searchResorts(keyword, type) {}

// 命名：PascalCase 类，UPPER_SNAKE_CASE 常量，camelCase 其余
class ResortEntity {}
const MAX_SEARCH_RESULTS = 50
```

```vue
<script>
// Options API + setup() 组合式风格
import { ref, onMounted } from 'vue'
export default {
  name: 'ResortList',
  setup() {
    const resorts = ref([])
    return { resorts }
  }
}
</script>
```

---

## 相关文档

- **README.md** - DDD 架构设计详细说明（部分内容已过时，以本文件为准）
- **MOCK_MODE_GUIDE.md** - Mock 模式详细说明和切换方法
- **DEBUG_GUIDE.md** - 本地调试指南
- **GET_STARTED.md** - 首次运行快速开始
- **QUICKREF.md** - 一页纸速查表
- **docs/** - 详细设计文档（DDD设计、数据库设计、架构图等）

---

## 开发日志

### 2026-02-23：管理员后台入口 + 用户管理

**完成功能**：
1. ✅ Nuxt 路由中间件 `web/middleware/admin.js`：未登录跳 `/login`，非 admin 跳首页
2. ✅ 导航栏头像下拉菜单加"🛠 管理后台"入口，仅 `role === 'admin'` 用户可见
3. ✅ 管理后台左侧导航栏（`web/components/AdminSidebar.vue`）：滑雪场管理 + 用户管理
4. ✅ 用户管理页面（`web/pages/admin/users/index.vue`）：搜索、角色授权（下拉切换 user/admin）、删除用户
5. ✅ 用户管理 API：`GET /api/admin/users`、`PATCH /api/admin/users/:id`、`DELETE /api/admin/users/:id`

**遗留**：Admin API 写操作（POST/PUT/DELETE）暂无服务端鉴权，见技术债务表。

---

## 已知技术债务 / 待处理事项

| 优先级 | 问题 | 位置 | 说明 |
|--------|------|------|------|
| 🔴 高 | Admin API 无鉴权 | `server/api/admin/resorts/*` 所有 POST/PUT/DELETE | 当前任何人可直接调用写操作，需提取 `server/utils/requireAdmin.js`，校验 JWT + `role === 'admin'`，否则返回 403 |

---

## 工作流规范

**收到需求后，先确认再实施**：用1-3句话说明理解（要做什么、怎么做），等用户确认后再写代码。
