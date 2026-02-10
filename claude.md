# 滑雪小程序开发笔记

## 项目概述

**项目名称**：滑雪场助手微信小程序

**项目目标**：
- 帮助滑雪爱好者选择滑雪场
- 搜索和筛选滑雪场（室内/室外）
- 查看滑雪场详情（设施、票价、雪道、用户分享）
- 收藏功能
- 用户经验分享（寻找雪友、评价、照片分享）

**开发时间**：2026年2月8日开始

---

## 技术栈

### 前端
- **框架**：uni-app (Vue 3)
- **语言**：JavaScript（原计划 TypeScript，因编译问题改为 JS）
- **IDE**：HBuilderX
- **调试工具**：微信开发者工具

### 后端
- **云服务**：微信云开发
- **数据库**：微信云数据库（MongoDB）
- **云函数**：Node.js
- **存储**：微信云存储

### 架构
- **设计模式**：领域驱动设计（DDD）
- **分层**：4层架构
  - Domain（领域层）
  - Application（应用层）
  - Infrastructure（基础设施层）
  - Interface（接口层）

---

## 关键配置信息

### 微信小程序
- **AppID**：`wx26ec61e86b268268`
- **环境ID**：`cloudbase-0g4g10cr89711adb`

### 项目路径
- **前端路径**：`/Users/samdediannao/skiing/frontend`
- **云函数路径**：`/Users/samdediannao/skiing/backend/cloudfunctions`

---

## 项目结构

```
/Users/samdediannao/skiing/frontend/
├── pages/                  # 页面
│   └── resort/
│       └── list/
│           └── index.vue   # 滑雪场列表页（搜索页）
├── domain/                 # 领域层
│   ├── resort/            # 滑雪场领域
│   │   ├── entities/      # 实体
│   │   ├── repositories/  # 仓储接口
│   │   └── services/      # 领域服务
│   └── user/              # 用户领域
├── application/           # 应用层
│   ├── dto/              # 数据传输对象
│   ├── mappers/          # 映射器
│   └── services/         # 应用服务
├── infrastructure/        # 基础设施层
│   ├── api/             # API实现
│   └── config/          # 配置
├── interfaces/           # 接口层
│   └── hooks/           # 组合式函数
├── shared/              # 共享模块
│   └── types/           # 类型定义
├── di/                  # 依赖注入
├── App.vue              # 根组件
├── main.js              # 入口文件
└── pages.json           # 页面配置

/Users/samdediannao/skiing/backend/cloudfunctions/
├── resort-search/       # 搜索滑雪场云函数
├── resort-detail/       # 滑雪场详情云函数
├── favorite-add/        # 添加收藏云函数
└── favorite-remove/     # 取消收藏云函数
```

---

## 开发流程

### 1. 本地开发
```
HBuilderX（编辑代码）
    ↓
运行到微信开发者工具
    ↓
微信开发者工具（预览+调试）
```

### 2. 代码修改流程
1. 在本地修改代码（通过 HBuilderX 或我直接修改）
2. 保存文件
3. 微信开发者工具自动刷新
4. 在模拟器中查看效果
5. 在控制台查看日志和错误

### 3. 云函数部署流程
1. 编写云函数代码（在 `backend/cloudfunctions/` 目录）
2. 在微信开发者工具中上传云函数
3. 在云开发控制台测试云函数
4. 前端调用云函数

---

## 重要决策记录

### 决策1：从 TypeScript 转为 JavaScript
**时间**：2026年2月8日
**原因**：
- HBuilderX 对 TypeScript 的编译存在兼容性问题
- Vue 3.4 与 TypeScript 类型检查冲突
- 多次尝试配置 tsconfig.json 未果
- 编译错误耗时过长

**结果**：
- 将所有 `.ts` 文件重命名为 `.js`
- 移除所有类型注解（`: string`, `ref<Type>()` 等）
- 将 interface 定义转为注释
- 项目成功编译运行

**经验教训**：
- uni-app + HBuilderX 组合对 TypeScript 支持有限
- 如果再次遇到类似问题，可以考虑：
  - 使用 Vue CLI 版本的 uni-app
  - 等待 HBuilderX TypeScript 支持更成熟
  - 或直接使用 JavaScript 开发

### 决策2：扁平化项目结构
**原计划**：所有代码在 `src/` 目录下
**实际**：DDD 各层目录直接在项目根目录
**原因**：HBuilderX 编译路径问题
**结果**：成功编译

### 决策3：使用相对路径导入
**原计划**：使用 `@/` 别名导入
**实际**：使用相对路径（`../../`, `../../../`）
**原因**：HBuilderX 不支持 `@/` 别名
**规则**：
- 1级目录（di/, application/等）：`../`
- 2级目录（domain/resort/）：`../../`
- 3级目录（domain/resort/entities/）：`../../../`
- pages/ 目录：`../../../`

---

## 当前进度

### ✅ 已完成
1. **项目架构搭建**
   - DDD 四层架构
   - 依赖注入容器
   - 领域实体和服务

2. **微信云开发配置**
   - 创建云开发环境
   - 创建数据库集合 `resorts`
   - 添加测试数据

3. **滑雪场搜索页面**
   - 搜索框
   - 类型筛选（全部/室内/室外）
   - 滑雪场列表
   - 上拉加载更多
   - 页面样式

4. **云函数编写**
   - `resort-search`：搜索滑雪场
   - `resort-detail`：获取详情
   - `favorite-add`：添加收藏
   - `favorite-remove`：取消收藏

5. **项目成功运行**
   - 在微信开发者工具中成功运行
   - 搜索页面正常显示

### 🚧 进行中
1. **云函数上传**
   - 需要在微信开发者工具中上传云函数
   - 测试云函数是否正常工作

### 📋 待开发
1. **滑雪场详情页**
   - 基本信息
   - 开放时间
   - 票价信息
   - 雪道信息
   - 设施展示
   - 用户分享（经验、评价、寻找雪友、照片）

2. **收藏功能**
   - 添加收藏
   - 取消收藏
   - 收藏列表

3. **用户系统**
   - 微信登录
   - 用户信息
   - 个人中心

4. **分享功能**
   - 发布滑雪经验
   - 上传照片
   - 评价滑雪场
   - 寻找雪友

---

## 数据库结构

### resorts 集合
```javascript
{
  _id: String,              // 自动生成
  id: String,               // 业务ID
  name: String,             // 滑雪场名称
  province: String,         // 省份
  city: String,             // 城市
  address: String,          // 地址
  latitude: Number,         // 纬度
  longitude: Number,        // 经度
  type: String,             // 类型：'indoor' | 'outdoor'
  facilities: {             // 设施
    hasRental: Boolean,     // 租雪具
    hasParking: Boolean,    // 停车场
    hasRestaurant: Boolean, // 餐厅
    hasHotel: Boolean,      // 住宿
    hasNightSkiing: Boolean // 夜场
  },
  openTime: String,         // 开放时间 "9:00"
  closeTime: String,        // 关闭时间 "18:00"
  tickets: [                // 票价
    {
      type: String,         // 票种
      price: Number,        // 价格
      description: String   // 描述
    }
  ],
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

## 云函数接口

### resort-search
**功能**：搜索滑雪场
**参数**：
```javascript
{
  keyword: String,   // 搜索关键词（城市/省份/名称）
  type: String,      // 类型 'indoor' | 'outdoor'
  limit: Number,     // 返回数量（默认20）
  offset: Number     // 分页偏移量
}
```
**返回**：
```javascript
{
  code: Number,      // 0:成功, -1:失败
  message: String,   // 消息
  data: Array,       // 滑雪场列表
  total: Number      // 数量
}
```

### resort-detail
**功能**：获取滑雪场详情
**参数**：
```javascript
{
  id: String         // 滑雪场ID
}
```
**返回**：
```javascript
{
  code: Number,      // 0:成功, -1:失败
  message: String,   // 消息
  data: Object       // 滑雪场详情
}
```

---

## 常用命令

### HBuilderX
- **运行到微信开发者工具**：右键项目 → 运行 → 运行到小程序模拟器 → 微信开发者工具
- **重新编译**：停止运行 → 重新运行

### 微信开发者工具
- **打开云开发控制台**：点击工具栏 "云开发" 按钮
- **上传云函数**：右键 cloudfunctions 目录下的函数文件夹 → 上传并部署
- **查看日志**：控制台 → 云函数 → 日志
- **查看数据库**：云开发控制台 → 数据库

### 调试技巧
- **查看 console.log**：微信开发者工具 → 控制台
- **查看网络请求**：微信开发者工具 → Network
- **查看页面元素**：微信开发者工具 → DevTools（Elements）
- **清除缓存**：工具栏 → 清除缓存 → 全部清除

---

## 问题解决记录

### 问题1：HBuilderX 自动选择 VSCode 风格
**现象**：项目总是被识别为 VS Code 项目
**解决**：清除 HBuilderX 用户配置
```bash
rm -rf ~/Library/Application\ Support/HBuilder\ X/
rm ~/Library/Preferences/io.dcloud.HBuilderX.plist
```

### 问题2：TypeScript 编译错误
**现象**：各种 TypeScript 类型检查错误
**尝试方案**：
1. 修改 tsconfig.json（无效）
2. 降级 Vue 版本（无效）
3. 排除 .vue 文件（无效）
**最终方案**：转换为 JavaScript

### 问题3：模块导入路径错误
**现象**：Module not found 错误
**原因**：使用了 `@/` 别名，HBuilderX 不支持
**解决**：全部改为相对路径

---

## 下一步计划

### 立即任务
1. **上传云函数**
   - 在微信开发者工具中上传 `resort-search`
   - 在微信开发者工具中上传 `resort-detail`
   - 测试搜索功能

2. **测试搜索功能**
   - 查看是否能正常加载滑雪场列表
   - 测试搜索功能
   - 测试筛选功能

### 短期任务
1. **实现详情页**
   - 创建详情页面
   - 实现详情展示
   - 测试跳转

2. **优化搜索体验**
   - 添加加载动画
   - 优化错误提示
   - 添加空状态

### 中期任务
1. **收藏功能**
2. **用户登录**
3. **分享功能**

---

## 联系方式

如果需要继续开发，直接告诉 Claude：
- "继续开发"
- "实现详情页"
- "添加收藏功能"
- 或者直接描述需求

Claude 可以：
- 查看和修改任何代码文件
- 运行终端命令
- 创建新文件
- 调试问题
- 查看日志

**注意**：所有代码修改会实时同步到微信开发者工具，你可以立即看到效果。
