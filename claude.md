# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**滑雪场助手微信小程序** - 帮助滑雪爱好者搜索和评价滑雪场的微信小程序

**核心功能**：
- 搜索和筛选滑雪场（室内/室外）
- 查看滑雪场详情（设施、票价、雪道、用户分享）
- 收藏功能
- 用户经验分享（寻找雪友、评价、照片分享）

---

## 技术栈

### 前端
- **框架**：uni-app (Vue 3)
- **语言**：JavaScript（注意：不是 TypeScript）
- **UI组件**：@dcloudio/uni-ui
- **构建工具**：Vite 5.0
- **IDE**：HBuilderX + 微信开发者工具

### 后端
- **云服务**：微信云开发
- **数据库**：微信云数据库（类 MongoDB）
- **云函数**：Node.js
- **存储**：微信云存储

### 架构
- **设计模式**：领域驱动设计（DDD）
- **分层**：4层架构（Domain, Application, Infrastructure, Interface）

---

## 关键配置

### 微信小程序
- **AppID**：`wx26ec61e86b268268`
- **环境ID**：`cloudbase-0g4g10cr89711adb`
- **配置文件**：
  - `frontend/manifest.json` - 小程序基础配置
  - `frontend/pages.json` - 页面路由和导航配置
  - `frontend/project.config.json` - 微信开发者工具项目配置

### 高德地图配置
- **Web Service API Key**：`41f98310392808752b5e9ea1e6bc4776`
- **配置文件**：`frontend/src/infrastructure/config/amap.config.js`
- **合法域名**：已在微信小程序后台配置 `restapi.amap.com`

### 项目路径
- **前端**：`/Users/samdediannao/skiing/frontend`
- **后端云函数**：`/Users/samdediannao/skiing/backend/cloudfunctions`
- **文档**：`/Users/samdediannao/skiing/docs/`

---

## 开发命令

### ⚠️ 重要：请使用 HBuilderX 编译
**不要使用命令行编译此项目**（`npm run dev:mp-weixin` 或 `npm run build:mp-weixin`）

**原因**：
- 这是微信小程序项目，使用 HBuilderX 编译最稳定
- 命令行编译容易引入兼容性问题和构建错误
- HBuilderX 对 uni-app 微信小程序有最佳支持

### 正确的开发流程
1. 使用 HBuilderX 打开项目
2. 右键项目 → 运行 → 运行到小程序模拟器 → 微信开发者工具
3. 代码会自动编译并在微信开发者工具中刷新

**重要提示**：
- **首次运行**：需要在微信开发者工具中导入项目，路径为：`frontend/unpackage/dist/dev/mp-weixin`
- **服务端口**：确保微信开发者工具已开启服务端口（设置 → 安全设置 → 开启服务端口）
- **登录状态**：确保微信开发者工具处于登录状态，登录失效会导致无法自动刷新

### 云函数部署
1. 在微信开发者工具中右键云函数目录
2. 选择"上传并部署"
3. 在云开发控制台查看日志

---

## 项目结构

```
/Users/samdediannao/skiing/
├── frontend/                      # 前端应用
│   ├── src/                       # 源代码（所有DDD层在这里）
│   │   ├── domain/                # 领域层
│   │   │   ├── resort/            # 滑雪场领域
│   │   │   │   ├── entities/      # 实体 (*.entity.js)
│   │   │   │   ├── repositories/  # 仓储接口 (I*.js)
│   │   │   │   ├── services/      # 领域服务 (*.domain.js)
│   │   │   │   ├── strategies/    # 策略模式 (*.js)
│   │   │   │   └── value-objects/ # 值对象 (*.vo.js)
│   │   │   ├── user/              # 用户领域
│   │   │   ├── favorite/          # 收藏领域
│   │   │   └── share/             # 分享领域
│   │   ├── application/           # 应用层
│   │   │   ├── dto/               # 数据传输对象 (*.dto.js)
│   │   │   ├── mappers/           # 映射器 (*.mapper.js)
│   │   │   └── services/          # 应用服务 (*AppService.js)
│   │   ├── infrastructure/        # 基础设施层
│   │   │   ├── api/               # API客户端
│   │   │   ├── config/            # 配置文件
│   │   │   ├── mock/              # Mock数据
│   │   │   ├── storage/           # 本地存储
│   │   │   ├── amap/              # 高德地图服务
│   │   │   └── map/               # 地图服务
│   │   ├── interfaces/            # 接口层
│   │   │   ├── hooks/             # 组合式函数 (use*.js)
│   │   │   └── components/        # 组件
│   │   │       └── common/        # 通用组件
│   │   ├── pages/                 # 页面
│   │   │   ├── resort/
│   │   │   │   ├── list/          # 滑雪场列表页
│   │   │   │   ├── detail/        # 滑雪场详情页
│   │   │   │   └── compare/       # 滑雪场对比页
│   │   │   ├── community/         # 社群页
│   │   │   └── profile/           # 个人中心
│   │   ├── shared/                # 共享模块
│   │   │   ├── types/             # 类型定义 (JSDoc注释)
│   │   │   ├── constants/         # 常量
│   │   │   ├── utils/             # 工具函数
│   │   │   └── examples/          # 示例代码
│   │   ├── static/                # 静态资源
│   │   │   └── images/            # 图片
│   │   ├── di/                    # 依赖注入容器
│   │   ├── App.vue                # 根组件
│   │   └── main.js                # 入口文件
│   ├── manifest.json              # 小程序配置
│   ├── pages.json                 # 页面配置
│   ├── project.config.json        # 微信开发者工具配置
│   ├── vite.config.js             # Vite配置
│   └── package.json               # 依赖配置
│
└── backend/                       # 后端（云函数）
    ├── cloudfunctions/            # 云函数目录
    │   ├── resort-search/         # 搜索滑雪场
    │   ├── resort-detail/         # 滑雪场详情
    │   ├── favorite-add/          # 添加收藏
    │   └── favorite-remove/       # 取消收藏
    └── database/                  # 数据库设计和初始数据
        └── init-data/
            └── top-resorts.js     # TOP50滑雪场数据
```

**文件命名约定**：
- 实体：`*.entity.js` (如 `Resort.entity.js`)
- 领域服务：`*.domain.js` (如 `ResortSearchService.domain.js`)
- 应用服务：`*AppService.js` (如 `ResortSearchAppService.js`)
- 仓储接口：`I*.js` (如 `IResortRepository.js`)
- DTO：`*.dto.js`
- Mapper：`*.mapper.js`
- Hooks：`use*.js` (如 `useResortList.js`)

---

## 重要决策记录

### 决策1：使用 JavaScript 而非 TypeScript
**原因**：HBuilderX 对 TypeScript 的编译存在兼容性问题
**影响**：
- 所有代码使用 `.js` 扩展名
- 没有类型注解
- interface 定义改为 JSDoc 注释形式

**重要**：不要尝试添加 TypeScript，已经确认在当前环境下无法正常工作。即使 package.json 中有 TypeScript 依赖，也仅用于类型提示，不用于编译。

### 决策2：使用相对路径导入
**原因**：虽然 vite.config.js 中配置了 `@` 别名（指向 `frontend/` 根目录），但在 HBuilderX 编译时不稳定
**规则**：
- 同级目录：`./module`
- 父级目录：`../module` 或 `../../module`
- **强制要求**：避免使用 `@/` 别名，始终使用相对路径
- 例外：如果 `@/` 在某些文件中已经存在且工作正常，保持现状，但新代码必须使用相对路径

### 决策3：DDD 分层在 src/ 目录下
**结构**：所有 DDD 层（domain, application, infrastructure, interfaces）都在 `frontend/src/` 目录下
**原因**：HBuilderX 编译需要这种结构

**注意**：`pages/` 和 `interfaces/` 的区别
- `pages/` - 页面级组件（.vue 文件，有路由，在 pages.json 中注册）
- `interfaces/` - 接口层的 hooks 和可复用组件（逻辑层）

### 决策4：Nomads 风格设计
**当前分支**：`nomads`
**设计风格**：采用 Nomads (游牧民族) 主题风格
**影响**：UI 设计、色彩方案、交互风格遵循此主题

---

## 数据库设计

### resorts 集合（滑雪场）
```javascript
{
  _id: String,              // MongoDB自动生成
  id: String,               // 业务ID
  name: String,             // 滑雪场名称
  province: String,         // 省份
  city: String,             // 城市
  address: String,          // 详细地址
  latitude: Number,         // 纬度
  longitude: Number,        // 经度
  type: String,             // 'indoor' | 'outdoor'
  facilities: {             // 设施
    hasRental: Boolean,     // 租雪具
    hasParking: Boolean,    // 停车场
    hasRestaurant: Boolean, // 餐厅
    hasHotel: Boolean,      // 住宿
    hasNightSkiing: Boolean // 夜场
  },
  openTime: String,         // 开放时间 "9:00"
  closeTime: String,        // 关闭时间 "18:00"
  tickets: [{               // 票价
    type: String,           // 票种
    price: Number,          // 价格
    description: String     // 描述
  }],
  trails: {                 // 雪道
    totalCount: Number,     // 总数
    beginner: Number,       // 初级
    intermediate: Number,   // 中级
    advanced: Number,       // 高级
    expert: Number          // 专家级
  },
  popularity: Number,       // 人气值
  rating: Number,           // 评分 0-5
  createTime: Date          // 创建时间
}
```

---

## 云函数 API

### resort-search（搜索滑雪场）
**请求参数**：
```javascript
{
  keyword: String,   // 搜索关键词（可选）
  type: String,      // 'indoor' | 'outdoor' | 'all'
  limit: Number,     // 返回数量，默认20
  offset: Number     // 分页偏移量，默认0
}
```
**返回**：
```javascript
{
  code: 0,           // 0成功, -1失败
  message: String,   // 消息
  data: Array,       // 滑雪场列表
  total: Number      // 总数
}
```

### resort-detail（滑雪场详情）
**请求参数**：
```javascript
{
  id: String         // 滑雪场ID
}
```
**返回**：
```javascript
{
  code: 0,
  message: String,
  data: Object       // 滑雪场详情对象
}
```

### favorite-add / favorite-remove
**请求参数**：
```javascript
{
  resortId: String,  // 滑雪场ID
  userId: String     // 用户ID（通常从云函数上下文获取）
}
```

---

## 开发注意事项

### 调试
- **查看日志**：微信开发者工具 → 控制台
- **查看网络请求**：微信开发者工具 → Network 标签
- **云函数日志**：云开发控制台 → 云函数 → 日志
- **清除缓存**：工具栏 → 清除缓存 → 全部清除

### 常见问题

**问题：模块导入错误**
- 检查是否使用了相对路径（不要用 `@/` 别名）
- 确认文件扩展名是 `.js` 而非 `.ts`

**问题：云函数调用失败**
- 确认云函数已上传部署
- 检查环境ID配置是否正确
- 查看云函数日志排查错误

**问题：页面不刷新**
- 保存文件后等待1-2秒
- 如果未自动刷新，手动点击微信开发者工具的"编译"按钮
- 必要时清除缓存重新编译

**问题：HBuilderX 运行后微信开发者工具没有自动打开/刷新**
- **检查登录状态**：微信开发者工具的登录可能已失效，重新扫码登录
- **开启服务端口**：微信开发者工具 → 设置 → 安全设置 → 勾选"开启服务端口"
- **检查项目路径**：确认微信开发者工具导入的是正确路径：`frontend/unpackage/dist/dev/mp-weixin`（不是 `dist/`）
- **关闭多个实例**：确保只有一个微信开发者工具在运行，必要时 `killall wechatwebdevtools`

---

## DDD 架构说明

### 依赖方向
```
Interface (UI) → Application → Domain ← Infrastructure
```

### 各层职责

**Domain（领域层）**：
- 核心业务逻辑
- 实体（Entity）和值对象（Value Object）
- 仓储接口定义（不包含实现）
- 领域服务

**Application（应用层）**：
- 用例编排
- 调用领域服务
- DTO 转换
- 事务管理

**Infrastructure（基础设施层）**：
- 仓储实现（API调用、本地存储）
- 第三方服务集成
- 配置管理
- Mock 数据

**Interface（接口层）**：
- 页面（pages/）：resort/list, resort/detail, resort/compare, community, profile
- 组件（interfaces/components/）：通用 UI 组件
- 组合式函数（interfaces/hooks/）：页面逻辑复用

### 依赖注入
使用 `src/di/container.js` 管理依赖注入。

**导入示例**（使用相对路径）：
```javascript
// 从 pages/resort/list/index.vue 导入
import { container } from '../../../di/container.js'
const resortService = container.get('ResortSearchService')
```

**注意**：根据你所在文件的位置，调整相对路径深度。

---

## 相关文档

本项目有多个文档文件，各有侧重：

- **CLAUDE.md** (本文件) - Claude Code 开发指南，包含架构、决策、配置
- **README.md** - DDD 架构设计详细说明 (注意：部分内容已过时，以 CLAUDE.md 为准)
- **GET_STARTED.md** - 快速开始指南，适合首次运行项目
- **QUICKREF.md** - 快速参考，一页纸速查表
- **CHECKLIST.md** - 配置清单，逐步完成配置
- **CONFIG_QUICKREF.md** - 配置快速参考
- **docs/** - 详细设计文档目录
  - `01-ddd-design.md` - DDD 设计
  - `02-database-design.md` - 数据库设计
  - `03-quick-start.md` - 快速开始
  - `04-high-level-summary.md` - 架构总结
  - `05-architecture-diagram.md` - 架构图
  - `06-local-debugging.md` - 本地调试指南

**建议阅读顺序**：
1. 首次上手：GET_STARTED.md → CHECKLIST.md
2. 日常开发：CLAUDE.md (本文) → QUICKREF.md
3. 深入理解：docs/ 目录下的文档

---

## 开发日志

### 2026-02-15：当前状态
- **当前分支**：nomads
- **主要功能**：滑雪场搜索、列表展示、高德地图集成
- **设计主题**：Nomads (游牧民族) 风格
- **技术栈**：uni-app (Vue 3) + JavaScript + 微信云开发 + 高德地图API

### 2026-02-10：高德地图 API 集成与搜索功能实现

**核心功能完成**：
1. ✅ 集成高德地图 Web Service API
2. ✅ 实现滑雪场搜索功能
3. ✅ TOP50 热门滑雪场数据
4. ✅ 修复编译和启动问题

**技术实现**：

**1. 高德地图 API 集成**
- 配置文件：`src/infrastructure/config/amap.config.js`
- API Key：`41f98310392808752b5e9ea1e6bc4776`
- 服务封装：`src/infrastructure/amap/AmapPoiService.js`
- POI 搜索接口：`/v3/place/text`
- 域名白名单：已在微信小程序后台配置 `restapi.amap.com`

**2. 搜索架构**
- **策略模式**：`src/domain/resort/strategies/ResortSortStrategy.js`
  - 按人气排序：`sortByPopularity()`
  - 按相关度排序：`sortByRelevance()`（支持距离和关键词匹配）
  - Haversine 公式计算地理距离

- **应用服务**：`src/application/services/ResortSearchAppService.js`
  - 混合数据策略：本地缓存 → 高德 API → 本地 TOP50 fallback
  - 24小时本地缓存
  - 类型筛选（室内/室外）
  - 关键词自动补全（如"石京龙" → "石京龙 滑雪场"）

- **数据来源**：
  - 无关键词：展示 TOP50 热门滑雪场
  - 有关键词：调用高德 API 搜索，失败时在本地数据中搜索

**3. TOP50 滑雪场数据**
- 文件位置：`backend/database/init-data/top-resorts.js`
- 数据来源：`ResortSearchAppService.js` 内嵌 Mock 数据
- 覆盖范围：全国主要省市的热门滑雪场
- 数据字段：name, province, city, district, type, popularity, latitude, longitude, trails, rating

**4. 编译问题修复**
- ✅ 添加 `project.config.json` 到源码根目录
- ✅ 在 `pages.json` 中添加 `subPackages: []` 字段
- ✅ 解决微信开发者工具 "Cannot read property 'subPackages' of undefined" 错误
- ✅ 清除编译缓存并重新编译成功

**5. 调试优化**
- 添加详细的 console.log 日志
- 日志标记：`[高德]`、`[加载]`、`[搜索]`、`[缓存]`、`[Fallback]`
- 便于追踪数据流向和 API 调用情况

**测试结果**：
- ✅ 页面成功渲染（顶部标题栏、底部 TabBar、内容区域）
- ✅ 能够加载 TOP50 热门滑雪场列表
- ✅ 搜索功能正常工作
- ✅ 高德 API 正常返回数据
- ✅ 类型筛选功能正常

**下一步计划**：
- [ ] 完善滑雪场详情页
- [ ] 实现滑雪场对比功能
- [ ] 开发社群功能（笔记分享、寻找雪友）
- [ ] 用户个人中心
- [ ] 收藏功能实现

---

## 编码规范

### JavaScript 编码风格
```javascript
// 1. 使用 JSDoc 注释代替 TypeScript 类型
/**
 * 搜索滑雪场
 * @param {string} keyword - 搜索关键词
 * @param {string} type - 滑雪场类型 'indoor' | 'outdoor' | 'all'
 * @returns {Promise<Array>} 滑雪场列表
 */
async function searchResorts(keyword, type) {
  // ...
}

// 2. 导入使用相对路径
import { Resort } from '../entities/Resort.entity.js'
import { ResortMapper } from '../../application/mappers/ResortMapper.js'

// 3. 类和构造函数使用 PascalCase
class ResortEntity {
  constructor(data) {
    this.id = data.id
    this.name = data.name
  }
}

// 4. 常量使用 UPPER_SNAKE_CASE
const MAX_SEARCH_RESULTS = 50
const DEFAULT_PAGE_SIZE = 20

// 5. 函数和变量使用 camelCase
const searchKeyword = 'Beijing'
function calculateDistance(lat1, lng1, lat2, lng2) { }
```

### Vue 组件规范
```vue
<template>
  <!-- 使用 kebab-case 命名组件 -->
  <resort-card :resort="resort" @click="handleClick" />
</template>

<script>
// 组合式 API 风格
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ResortList',
  setup() {
    const resorts = ref([])

    onMounted(() => {
      // 初始化逻辑
    })

    return {
      resorts
    }
  }
}
</script>
```

### DDD 层级调用规则
```javascript
// ✅ 正确：UI → Application → Domain → Infrastructure
// pages/resort/list/index.vue
import { ResortSearchAppService } from '../../../application/services/ResortSearchAppService.js'
const appService = new ResortSearchAppService()
const results = await appService.search(params)

// ❌ 错误：UI 直接调用 Infrastructure
// 不要这样做：
import { AmapPoiService } from '../../../infrastructure/amap/AmapPoiService.js'
const results = await AmapPoiService.search() // ❌ 跨层调用

// ✅ 正确：Application 调用 Domain 和 Infrastructure
// application/services/ResortSearchAppService.js
import { ResortSearchService } from '../../domain/resort/services/ResortSearchService.domain.js'
import { AmapPoiService } from '../../infrastructure/amap/AmapPoiService.js'
```

