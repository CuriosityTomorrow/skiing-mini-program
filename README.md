# 滑雪小程序 DDD 架构设计

## 技术栈

### 前端
- **框架**: uni-app (Vue 3 + TypeScript)
- **UI库**: uView UI 2.0
- **状态管理**: Pinia
- **HTTP请求**: lunlun-request
- **开发工具**: HBuilderX + 微信开发者工具

### 后端
- **平台**: 微信云开发
- **运行时**: Node.js 18+
- **语言**: TypeScript
- **框架**: 云函数（函数式开发）
- **数据库**: 微信云数据库（类MongoDB）

### 外部服务
- **地图API**: 高德地图微信小程序SDK
- **登录**: 微信登录

## DDD 分层架构

```
skiing-miniprogram/
├── frontend/                    # 前端应用（uni-app）
│   ├── src/
│   │   ├── domain/             # 领域层（核心业务逻辑）
│   │   │   ├── resort/         # 滑雪场领域
│   │   │   │   ├── entities/   # 实体
│   │   │   │   ├── value-objects/  # 值对象
│   │   │   │   ├── repositories/   # 仓储接口
│   │   │   │   └── services/   # 领域服务
│   │   │   ├── user/           # 用户领域
│   │   │   └── favorite/       # 收藏领域
│   │   ├── application/        # 应用层（用例编排）
│   │   │   ├── services/       # 应用服务
│   │   │   └── dto/            # 数据传输对象
│   │   ├── infrastructure/     # 基础设施层
│   │   │   ├── api/            # API客户端
│   │   │   ├── storage/        # 本地存储
│   │   │   └── map/            # 地图服务封装
│   │   ├── interfaces/         # 接口层（UI）
│   │   │   ├── pages/          # 页面
│   │   │   ├── components/     # 组件
│   │   │   └── hooks/          # 组合式函数
│   │   └── shared/             # 共享模块
│   │       ├── constants/      # 常量
│   │       ├── utils/          # 工具函数
│   │       └── types/          # 类型定义
│
└── backend/                     # 后端应用（云函数）
    ├── cloudfunctions/          # 云函数
    │   ├── resort-search/      # 滑雪场搜索
    │   ├── resort-detail/      # 滑雪场详情
    │   ├── favorite-manage/    # 收藏管理
    │   └── user-share/         # 用户分享
    ├── database/                # 数据库设计
    │   ├── init.json           # 初始数据
    │   └── design.md           # 数据库设计文档
    └── src/
        ├── domain/             # 领域层
        │   ├── resort/
        │   ├── user/
        │   └── share/
        ├── application/        # 应用层
        │   ├── use-cases/
        │   └── dto/
        ├── infrastructure/     # 基础设施层
        │   ├── database/       # 数据库实现
        │   ├── amap/           # 高德地图API封装
        │   └── wechat/         # 微信API封装
        └── interfaces/         # 接口层
            └── cloud-functions/  # 云函数入口
```

## 核心领域模型

### 1. 滑雪场（Resort）聚合根

```typescript
// Resort 实体
{
  id: string;                    // 滑雪场ID
  name: string;                  // 名称
  location: Location;            // 位置（值对象）
  type: ResortType;              // 类型：室内/室外
  facilities: Facilities;        // 设施信息（值对象）
  operatingHours: OperatingHours;  // 营业时间（值对象）
  tickets: Ticket[];             // 票价信息
  trails: TrailInfo;             // 雪道信息（值对象）
  popularity: number;            // 人气排名
  rating: number;                // 评分
  shares: Share[];               // 用户分享（关联）
  createdAt: Date;
  updatedAt: Date;
}

// 值对象
Location { province; city; address; coordinates: { lat, lng } }
Facilities { hasRental; hasParking; hasRestaurant; hasHotel }
OperatingHours { openTime; closeTime; seasonalSchedule }
TrailInfo { totalCount; beginner; intermediate; advanced; expert }
```

### 2. 用户（User）聚合根

```typescript
{
  id: string;
  openId: string;                // 微信openId
  nickname: string;
  avatar: string;
  favorites: Favorite[];         // 收藏的滑雪场
  shares: Share[];               // 发布的分享
  level: SkiLevel;               // 滑雪水平
  createdAt: Date;
}
```

### 3. 收藏（Favorite）

```typescript
{
  id: string;
  userId: string;
  resortId: string;
  createdAt: Date;
}
```

### 4. 分享（Share）

```typescript
{
  id: string;
  userId: string;
  resortId: string;
  type: ShareType;               // 类型：体验/评价/找搭子
  content: string;
  images: string[];
  rating?: number;               // 评分（评价类）
  skiLevel?: SkiLevel;           // 寻找搭子的水平要求
  createdDate: Date;
  likes: number;
}
```

## 数据库设计

### 集合（表）设计

1. **resorts** - 滑雪场表
2. **users** - 用户表
3. **favorites** - 收藏表
4. **shares** - 分享表
5. **resort_cache** - 滑雪场缓存表（高德数据缓存）

## 关键业务流程

### 搜索滑雪场用例

```
1. 用户输入搜索关键词
2. 前端调用应用层服务 ResortSearchService
3. 应用层通过仓储接口查询：
   - 优先查缓存数据库
   - 缓存miss时调用高德地图API
   - 将结果存入缓存
4. 根据筛选条件过滤（室内/室外）
5. 按相关度/人气排序
6. 返回DTO给前端展示
```

### 收藏滑雪场用例

```
1. 用户点击收藏按钮
2. 前端调用应用层服务 FavoriteService
3. 应用层检查是否已收藏
4. 创建Favorite实体
5. 通过仓储持久化
6. 返回结果
```

## API设计

### 云函数接口

```
POST /resort/search           # 搜索滑雪场
GET  /resort/detail/:id       # 获取滑雪场详情
POST /favorite/add            # 添加收藏
POST /favorite/remove         # 取消收藏
GET  /favorite/list           # 获取收藏列表
POST /share/create            # 创建分享
GET  /share/list/:resortId    # 获取滑雪场的分享列表
```

## 开发流程

### 第一阶段：基础框架搭建
1. 初始化uni-app项目
2. 配置微信云开发环境
3. 实现基础页面结构和导航

### 第二阶段：搜索功能
1. 集成高德地图API
2. 实现滑雪场搜索
3. 实现列表展示和筛选

### 第三阶段：详情页
1. 滑雪场详情页
2. 展示基本信息、票价、雪道
3. 用户分享展示

### 第四阶段：收藏功能
1. 收藏/取消收藏
2. 收藏列表

### 第五阶段：上线准备
1. 性能优化
2. 提交微信审核
3. 正式发布

## 环境准备

### Mac开发环境
```bash
# 1. 安装HBuilderX
https://www.dcloud.io/hbuilderx.html

# 2. 安装微信开发者工具
https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

# 3. 安装Node.js 18+
node --version

# 4. 初始化项目
npm create vite@latest skiing-frontend -- --template vue-ts
```

### 微信小程序配置
1. 注册微信小程序账号
2. 获取AppID
3. 开通云开发服务
4. 配置服务器域名（云开发不需要）

### 高德地图API配置
1. 注册高德开放平台账号
2. 创建微信小程序应用
3. 获取API Key和安全密钥
4. 配置微信小程序域名白名单

## 下一步行动

1. **确认技术栈**：确认是否选择 uni-app + 微信云开发
2. **环境搭建**：搭建开发环境
3. **数据准备**：调研高德地图API，准备初始滑雪场数据
4. **开始开发**：从搜索页面开始实现
