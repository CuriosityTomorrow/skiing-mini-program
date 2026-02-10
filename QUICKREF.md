# 滑雪小程序 - 快速参考

## 一句话总结
基于 DDD 架构的滑雪小程序，使用 uni-app + 微信云开发 + 高德地图。

## 技术栈速览

| 分类 | 技术 | 说明 |
|------|------|------|
| **前端** | uni-app (Vue3 + TS) | 跨平台小程序框架 |
| **UI** | uView UI 2.0 | 组件库 |
| **状态** | Pinia | 状态管理 |
| **后端** | 微信云开发 | 零运维云平台 |
| **数据库** | 云数据库 (MongoDB) | 文档型数据库 |
| **地图** | 高德地图微信SDK | POI搜索 |
| **DI** | tsyringe | 依赖注入(DDD) |

## 项目结构

```
skiing/
├── frontend/                 # 前端(uni-app)
│   ├── src/
│   │   ├── domain/          # 领域层(核心业务)
│   │   ├── application/     # 应用层(用例)
│   │   ├── infrastructure/  # 基础设施层(技术实现)
│   │   └── interfaces/      # 表现层(UI)
│   └── package.json
├── backend/                  # 后端(云函数)
│   └── cloudfunctions/      # 云函数
├── docs/                     # 文档
│   ├── 01-ddd-design.md     # DDD设计详解
│   ├── 02-database-design.md # 数据库设计
│   ├── 03-quick-start.md    # 快速开始
│   ├── 04-high-level-summary.md # 架构总结
│   └── 05-architecture-diagram.md # 架构图
└── scripts/
    └── init-project.sh      # 初始化脚本
```

## 快速开始

### 1. 运行初始化脚本
```bash
bash scripts/init-project.sh
cd frontend
npm install
```

### 2. 配置三个关键参数
- **AppID**: 微信小程序后台获取
- **云环境ID**: 云开发控制台获取
- **高德Key**: 高德开放平台获取

### 3. 运行项目
```bash
npm run dev:mp-weixin
```

### 4. 微信开发者工具
导入 `frontend/dist/dev/mp-weixin` 目录

## 核心领域模型

```
User (用户)
  ├─ Favorite (收藏)
  └─ Share (分享)
       │
       └─→ Resort (滑雪场)
            - Location (位置)
            - Facilities (设施)
            - Trails (雪道)
            - Tickets (票价)
```

## DDD 分层职责

| 层级 | 职责 | 示例 |
|------|------|------|
| **领域层** | 业务规则 | Resort.calculateMatchScore() |
| **应用层** | 用例编排 | ResortSearchAppService.search() |
| **基础设施层** | 技术实现 | AmapService, CloudDatabase |
| **表现层** | UI交互 | useResortList() hook |

## 典型调用流程

```
UI Component
  → AppService (用例编排)
    → DomainService (业务逻辑)
      → Repository (数据访问)
        → AmapAPI / Database
```

## 数据库集合

| 集合 | 用途 | 关键字段 |
|------|------|----------|
| `resorts` | 滑雪场 | name, type, location, popularity |
| `users` | 用户 | openId, skiLevel |
| `favorites` | 收藏 | userId, resortId |
| `shares` | 分享 | userId, resortId, type, content |

## 云函数列表

| 云函数 | 功能 | 路径 |
|--------|------|------|
| `resort-search` | 搜索滑雪场 | /backend/cloudfunctions/ |
| `resort-detail` | 滑雪场详情 | /backend/cloudfunctions/ |
| `favorite-add` | 添加收藏 | /backend/cloudfunctions/ |
| `favorite-remove` | 取消收藏 | /backend/cloudfunctions/ |

## 常用命令

```bash
# 安装依赖
npm install

# 开发运行
npm run dev:mp-weixin

# 生产构建
npm run build:mp-weixin

# 类型检查
npm run type-check
```

## 配置文件速查

| 文件 | 作用 | 关键配置 |
|------|------|----------|
| `manifest.json` | 小程序配置 | appid, permission |
| `pages.json` | 页面路由 | pages[], tabBar |
| `.env.development` | 开发环境变量 | CLOUD_ENV, AMAP_KEY |
| `tsconfig.json` | TypeScript | paths(别名) |

## 关键代码位置

| 功能 | 文件路径 |
|------|----------|
| **Resort实体** | `src/domain/resort/entities/Resort.entity.ts` |
| **仓储接口** | `src/domain/resort/repositories/IResortRepository.ts` |
| **仓储实现** | `src/infrastructure/api/ResortRepository.impl.ts` |
| **应用服务** | `src/application/services/ResortSearchService.app.ts` |
| **页面Hook** | `src/interfaces/hooks/useResortList.ts` |
| **搜索页面** | `src/interfaces/pages/resort/list/index.vue` |

## 开发顺序建议

1. ✅ **环境搭建** (0.5天)
   - 安装工具
   - 运行初始化脚本
   - 配置外部服务

2. 🔄 **搜索功能** (2-3天)
   - 领域层: Resort实体
   - 基础设施层: 高德API集成
   - 应用层: 搜索服务
   - 表现层: 搜索页面

3. 🔄 **详情页** (1-2天)
   - 滑雪场详情展示

4. 🔄 **收藏功能** (1-2天)
   - 收藏/取消收藏
   - 收藏列表

5. ⏳ **测试上线** (1-2天)
   - 功能测试
   - 性能优化
   - 提交审核

## 常见问题

### Q: 云函数调用失败?
A: 检查云开发环境是否已开通，环境ID是否正确

### Q: 高德地图API失败?
A: 检查Key是否正确，小程序域名白名单是否配置

### Q: TypeScript编译错误?
A: 检查 tsconfig.json，确保依赖已安装

### Q: 小程序页面空白?
A: 检查 pages.json 是否注册了页面路径

## 外部资源

- [uni-app官方文档](https://uniapp.dcloud.net.cn/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [高德地图微信SDK](https://lbs.amap.com/api/wx/guide/prepare/)
- [uView UI文档](https://www.uviewui.com/)

## 待讨论事项

- [ ] 第一版功能范围确认
- [ ] 初始滑雪场数据来源
- [ ] UI设计风格参考
- [ ] 项目时间规划

---

**最后更新**: 2024-02-08
**当前阶段**: 架构设计完成，等待初始化项目
