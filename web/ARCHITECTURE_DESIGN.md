# 滑雪场 Web 版架构设计文档 v2.0

> 修订日期：2026-02-15
> 修订原因：简化架构，采用 Nuxt 3 全栈单体方案，去掉独立后端和独立数据库

---

## 一、架构概览

### 核心思路

单体全栈应用，一个进程搞定一切。参考 nomads.com 的架构哲学（PHP + SQLite + 单台 VPS），用现代技术栈替代：

```
Nuxt 3 全栈应用（单进程）
├── 页面 (SSR/SSG)        ← Vue 3 Server/Client Components
├── API 层 (server/api/)   ← Nitro server routes，供小程序调用
├── 业务逻辑 (lib/)        ← 从小程序直接复用的纯 JS 代码
├── 数据库 (SQLite)        ← better-sqlite3，文件型，零运维
└── 高德地图 API           ← 服务端代理，隐藏 API Key
```

### 技术栈

```yaml
框架: Nuxt 3 (Vue 3 + Nitro server engine)
语言: JavaScript (和小程序保持一致，不用 TypeScript)
样式: Tailwind CSS
UI 组件: Shadcn-vue
状态管理: Pinia (客户端状态)
数据库: SQLite (better-sqlite3)
ORM: Drizzle ORM (轻量，支持 SQLite)
地图: 高德地图 JSAPI
部署: 轻量服务器, Node.js + PM2
```

### 与小程序的关系

```
┌──────────────────────────────────────────┐
│            Nuxt 3 全栈应用                │
│                                          │
│  ┌─────────────────┐  ┌───────────────┐  │
│  │  Web 页面 (SSR)  │  │ API Routes    │  │
│  │  /resorts        │  │ /api/resorts  │◄─┼── 小程序 wx.request()
│  │  /resorts/:id    │  │ /api/...      │  │
│  └────────┬────────┘  └───────┬───────┘  │
│           │                   │          │
│  ┌────────▼───────────────────▼────────┐ │
│  │     共享业务逻辑 (lib/domain/)       │ │
│  │  筛选 / 评分 / 排序 — 从小程序复用   │ │
│  └────────────────┬────────────────────┘ │
│                   │                      │
│  ┌────────────────▼────────────────────┐ │
│  │        SQLite (better-sqlite3)      │ │
│  └─────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

小程序未来改为调用 Web 版的 `/api/*` 接口获取数据，不再依赖微信云函数和 Mock 数据。

---

## 二、为什么选择这个方案

### 对比其他方案

| 维度 | 方案A: Nuxt全栈+SQLite (当前) | 方案B: Nuxt+独立后端+MySQL | 方案C: BFF模式+MongoDB Atlas |
|---|---|---|---|
| 进程数 | 1 | 2-3 | 2-3 |
| 部署复杂度 | 低（一台机器） | 高 | 中 |
| 运维成本 | 几乎为零 | 需维护数据库 | 需维护数据库+BFF |
| 开发效率 | 高 | 中 | 中 |
| 扩展上限 | 中（够用） | 高 | 高 |
| 语言一致性 | JS 全栈，和小程序一致 | 可能引入 Java | TypeScript |

### 为什么 SQLite

- nomads.com 用 SQLite 支撑数万用户，性能验证过
- 滑雪场数据读多写少（全国几百家），SQLite 的读性能极强
- 零配置、零运维、单文件备份
- 未来如果需要迁移到 MySQL/PostgreSQL，换 Drizzle ORM 的 driver 即可

### 为什么不用 TypeScript

- 小程序用 JavaScript（HBuilderX 对 TS 有兼容性问题）
- 保持一致，领域逻辑代码可以直接复制，不需要翻译
- 用 JSDoc 注释提供类型提示

---

## 三、项目结构

```
web/
├── server/                    # Nuxt server routes (API 层)
│   ├── api/
│   │   ├── resorts/
│   │   │   ├── index.get.js   # GET /api/resorts (列表+搜索+筛选)
│   │   │   └── [id].get.js    # GET /api/resorts/:id (详情)
│   │   ├── favorites/
│   │   │   └── [...].js       # 收藏相关 API
│   │   └── reviews/
│   │       └── [...].js       # 评价相关 API
│   ├── utils/
│   │   └── db.js              # SQLite 数据库连接
│   └── middleware/
│       └── cors.js            # CORS (允许小程序跨域)
│
├── pages/                     # Nuxt 页面 (SSR/SSG)
│   ├── index.vue              # 首页
│   ├── resorts/
│   │   ├── index.vue          # 列表页
│   │   └── [id].vue           # 详情页
│   ├── community.vue          # 社群
│   └── profile.vue            # 个人中心
│
├── components/                # Vue 组件
│   ├── resort/
│   │   ├── ResortCard.vue     # 滑雪场卡片
│   │   ├── ResortFilter.vue   # 筛选面板
│   │   ├── ResortScores.vue   # 评分展示
│   │   └── ResortMap.vue      # 地图组件
│   ├── layout/
│   │   ├── Header.vue         # 顶部导航
│   │   ├── Footer.vue         # 页脚
│   │   └── Sidebar.vue        # 侧边栏
│   └── ui/                    # 通用 UI 组件
│
├── lib/                       # 业务逻辑 (从小程序直接复用)
│   ├── domain/
│   │   └── resort/
│   │       ├── ResortFilterService.js    # 20+ 维度筛选 (直接复用)
│   │       ├── ResortScoringService.js   # 6维度评分 (直接复用)
│   │       └── ResortSortStrategy.js     # 排序策略 (直接复用)
│   └── shared/
│       ├── constants.js
│       └── utils.js
│
├── db/
│   ├── schema.js              # Drizzle schema 定义
│   ├── index.js               # 数据库初始化
│   ├── migrate.js             # 迁移脚本
│   └── seed.js                # 种子数据 (TOP50 滑雪场)
│
├── assets/
│   └── css/
│       └── main.css           # Tailwind 入口
│
├── public/
│   └── images/
│
├── nuxt.config.js
├── tailwind.config.js
├── drizzle.config.js
├── package.json
└── .env                       # 环境变量（高德 API Key 等）
```

---

## 四、数据模型

### SQLite Schema (Drizzle ORM)

与小程序的数据模型保持一致：

```javascript
// db/schema.js
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const resorts = sqliteTable('resorts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  province: text('province').notNull(),
  city: text('city').notNull(),
  district: text('district'),
  address: text('address'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  type: text('type').notNull(),           // 'indoor' | 'outdoor'
  popularity: integer('popularity').default(0),
  rating: real('rating').default(0),

  // JSON 字段（SQLite 存为 text，读取时 JSON.parse）
  facilities: text('facilities', { mode: 'json' }),
  trails: text('trails', { mode: 'json' }),
  pricing: text('pricing', { mode: 'json' }),
  season: text('season', { mode: 'json' }),
  contact: text('contact', { mode: 'json' }),
  community: text('community', { mode: 'json' }),
  scores: text('scores', { mode: 'json' }),
  suitableFor: text('suitable_for', { mode: 'json' }),
  highlights: text('highlights', { mode: 'json' }),
  tags: text('tags', { mode: 'json' }),

  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})
```

### 数据字段说明

```javascript
// facilities 字段结构
{
  rental: true,        // 租赁
  parking: true,       // 停车
  restaurant: true,    // 餐厅
  hotel: false,        // 住宿
  locker: true,        // 储物柜
  nightSkiing: false,  // 夜场
  coach: true,         // 教练
  magicCarpet: true,   // 魔毯
  cableCar: false,     // 缆车
  snowPark: false,     // 单板公园
  kidsArea: true       // 儿童区
}

// trails 字段结构
{
  total: 32,
  beginner: 8,
  intermediate: 12,
  advanced: 8,
  expert: 4,
  maxLength: 3800,     // 最长雪道 (米)
  verticalDrop: 510    // 垂直落差 (米)
}

// scores 字段结构 (6维度，0-10分)
{
  overall: 8.5,
  beginner: 6.2,
  intermediate: 7.8,
  expert: 9.1,
  family: 5.5,
  value: 7.3
}
```

---

## 五、API 设计

### 滑雪场列表/搜索

```
GET /api/resorts?keyword=万龙&type=outdoor&province=河北省&sortBy=popularity&limit=20&offset=0
```

**响应：**
```json
{
  "code": 0,
  "data": [...],
  "total": 50,
  "message": "success"
}
```

### 滑雪场详情

```
GET /api/resorts/:id
```

### 收藏 / 评价（后续）

```
POST /api/favorites    { resortId }
DELETE /api/favorites   { resortId }
POST /api/reviews       { resortId, content, rating }
```

### 响应格式

统一响应格式，和小程序现有云函数的返回格式保持一致：

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "total": 0
}
```

---

## 六、从小程序复用的代码

以下文件可以直接复制到 `lib/domain/` 目录，无需修改：

| 小程序路径 | Web 路径 | 说明 |
|---|---|---|
| `domain/resort/services/ResortFilterService.domain.js` | `lib/domain/resort/ResortFilterService.js` | 20+维度筛选，纯 JS |
| `domain/resort/services/ResortScoringService.domain.js` | `lib/domain/resort/ResortScoringService.js` | 6维度评分算法，纯 JS |
| `domain/resort/strategies/ResortSortStrategy.js` | `lib/domain/resort/ResortSortStrategy.js` | 排序策略+Haversine，纯 JS |

以下文件需要适配（去掉 `wx.xxx` 调用）：

| 小程序路径 | 改动 |
|---|---|
| `application/services/ResortSearchAppService.js` | 去掉 `wx.getStorageSync`/`wx.setStorageSync`，数据改为从 SQLite 读取 |

---

## 七、设计风格

### Nomads 主题

延续小程序的 Nomads (游牧民族) 设计风格：

- **主色调**：紫色渐变 `#667eea → #764ba2`
- **辅助色**：绿色（开放状态）、蓝色（信息）、橙色（警告）
- **布局**：数据密集型，类 nomads.com 的表格+卡片混合
- **字体**：系统字体栈，中文优先
- **图标**：Emoji 风格（和 nomads.com 一致）

### 页面规划

| 页面 | 路由 | 渲染模式 | 说明 |
|---|---|---|---|
| 首页 | `/` | SSG | 品牌展示 + 热门推荐 |
| 滑雪场列表 | `/resorts` | SSR | 搜索、筛选、排序 |
| 滑雪场详情 | `/resorts/:id` | ISR (1小时) | 完整信息 + 评分 |
| 社群 | `/community` | SSR | 笔记分享、找雪友 |
| 个人中心 | `/profile` | CSR | 收藏、设置 |

---

## 八、部署方案

### 本地开发

```bash
npm run dev    # Nuxt 开发服务器，http://localhost:3000
```

### 生产部署

**目标平台**（二选一）：
- 腾讯云/阿里云轻量服务器 (68元/年起，需 ICP 备案)
- 腾讯云开发 CloudBase (容器化部署)

**部署方式**：

```bash
# 构建
npm run build

# 运行（PM2 管理）
pm2 start .output/server/index.mjs --name skiing-web

# 反向代理
# Nginx 配置 → proxy_pass http://localhost:3000
```

**SQLite 数据库文件**：
- 路径：`/data/skiing.db`
- 备份：定期 cp 文件即可
- 迁移：`npm run db:migrate`
- 种子数据：`npm run db:seed`

---

## 九、实施顺序

### 阶段 1：基础骨架
- [x] 架构设计文档
- [ ] 初始化 Nuxt 3 项目
- [ ] Tailwind CSS 配置
- [ ] SQLite + Drizzle ORM 配置
- [ ] 种子数据导入 (TOP50)

### 阶段 2：核心功能
- [ ] API: GET /api/resorts (列表+搜索)
- [ ] API: GET /api/resorts/:id (详情)
- [ ] 页面: 滑雪场列表 (搜索+筛选+排序)
- [ ] 页面: 滑雪场详情 (评分+设施+雪道)

### 阶段 3：体验完善
- [ ] 首页设计
- [ ] 响应式布局 (桌面+移动)
- [ ] 高德地图集成
- [ ] SEO 优化 (meta, sitemap)

### 阶段 4：用户功能
- [ ] 用户认证
- [ ] 收藏功能
- [ ] 评价功能
- [ ] 社群页面

---

## 十、参考

- **nomads.com** - 对标产品，数据密集型城市评分平台
  - 技术栈：PHP + SQLite + jQuery + 单台 VPS
  - 启发：数据密度 > 技术花哨，简单架构也能支撑大流量
- **Nuxt 3 官方文档** - https://nuxt.com/docs
- **Drizzle ORM** - https://orm.drizzle.team
- **Tailwind CSS** - https://tailwindcss.com
- **Shadcn-vue** - https://www.shadcn-vue.com

---

文档版本：v2.0
创建日期：2026-02-15
作者：Claude (Opus 4.6)
