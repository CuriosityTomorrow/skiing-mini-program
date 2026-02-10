# 项目搭建快速开始

## 前置准备

### 1. 开发工具安装

在Mac上安装以下工具：

```bash
# 1. 安装Homebrew（如果还没有）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 安装Node.js 18+
brew install node@18

# 3. 验证安装
node --version  # 应该显示 v18.x.x
npm --version   # 应该显示 9.x.x 或更高
```

### 2. 安装开发工具

**HBuilderX**（推荐用于uni-app开发）：
```bash
# 下载HBuilderX
https://www.dcloud.io/hbuilderx.html

# 选择"标准版"即可，包含App开发、小程序开发等功能
```

**微信开发者工具**：
```bash
# 下载并安装
https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
```

## 项目初始化

### 方式一：使用 HBuilderX 创建项目（推荐）

1. 打开 HBuilderX
2. 菜单栏选择：文件 -> 新建 -> 项目
3. 选择项目类型：uni-app
4. 填写项目信息：
   - 项目名称：`skiing-miniprogram`
   - 选择模板：`Vue 3 + TypeScript`
   - 选择目录：选择你的工作目录
5. 点击"创建"

### 方式二：使用命令行创建项目

```bash
# 1. 安装Vue CLI（如果还没有）
npm install -g @vue/cli

# 2. 创建uni-app项目
vue create -p dcloudio/uni-preset-vue skiing-frontend

# 3. 进入项目目录
cd skiing-frontend

# 4. 安装依赖
npm install
```

### 项目目录结构

创建后的项目结构如下：

```
skiing-frontend/
├── src/
│   ├── pages/              # 页面
│   │   └── index/         # 首页
│   ├── components/        # 组件
│   ├── static/           # 静态资源
│   ├── uni_modules/      # uni-app插件
│   ├── App.vue           # 应用配置
│   ├── main.ts           # 入口文件
│   ├── manifest.json     # 应用配置
│   └── pages.json        # 页面路由配置
├── package.json
├── tsconfig.json
└── vite.config.ts        # Vite配置
```

## 安装必要依赖

```bash
# 在项目根目录执行

# 1. 安装UI库（uView UI 2.0）
npm install uview-ui@2.0.36

# 2. 安装状态管理（Pinia）
npm install pinia

# 3. 安装依赖注入（tsyringe）
npm install tsyringe

# 4. 安装微信云开发SDK
npm install tcb-js-sdk

# 5. 安装HTTP请求库
npm install @dcloudio/uni-ajax

# 6. 安装类型定义
npm install -D @types/node

# 7. 安装工具库
npm install date-fns lodash-es
```

## 配置项目

### 1. 配置 TypeScript

编辑 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassExtensions": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "types": ["@dcloudio/types", "node"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ]
}
```

### 2. 配置路径别名

编辑 `vite.config.ts`：

```typescript
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'path';

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

### 3. 配置 manifest.json

在微信小程序后台获取AppID后，编辑 `src/manifest.json`：

```json
{
  "mp-weixin": {
    "appid": "你的微信小程序AppID",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "usingComponents": true,
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于寻找附近的滑雪场"
      }
    },
    "requiredPrivateInfos": [
      "getLocation",
      "chooseLocation"
    ]
  }
}
```

### 4. 配置 pages.json

编辑 `src/pages.json`：

```json
{
  "pages": [
    {
      "path": "pages/resort/list/index",
      "style": {
        "navigationBarTitleText": "滑雪场",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/resort/detail/index",
      "style": {
        "navigationBarTitleText": "滑雪场详情"
      }
    },
    {
      "path": "pages/favorite/index",
      "style": {
        "navigationBarTitleText": "我的收藏"
      }
    }
  ],
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/resort/list/index",
        "iconPath": "static/tab/home.png",
        "selectedIconPath": "static/tab/home-active.png",
        "text": "滑雪场"
      },
      {
        "pagePath": "pages/favorite/index",
        "iconPath": "static/tab/favorite.png",
        "selectedIconPath": "static/tab/favorite-active.png",
        "text": "收藏"
      }
    ]
  },
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "滑雪小程序",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  }
}
```

## 微信小程序配置

### 1. 注册小程序

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 注册小程序账号
3. 完成实名认证
4. 获取 AppID

### 2. 开通云开发

1. 登录微信小程序后台
2. 进入"云开发" -> "开通"
3. 创建云开发环境：
   - 环境名称：`skiing-prod`
   - 基础版：免费额度足够前期使用
4. 记录环境ID（Env ID）

### 3. 配置云函数权限

在云开发控制台：
- 设置 -> 数据库权限 -> 选择"仅创建者可读写"（通过云函数操作）

## 高德地图配置

### 1. 注册高德开放平台

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册账号并登录
3. 进入"应用管理" -> "我的应用"
4. 创建新应用：
   - 应用名称：`滑雪小程序`
   - 应用类型：`微信小程序`

### 2. 添加Key

1. 点击"添加Key"
2. 填写信息：
   - Key名称：`skiing-miniprogram`
   - 服务平台：`微信小程序`
3. 获取Key和密钥

### 3. 配置小程序域名白名单

在高德控制台：
1. 应用管理 -> 我的应用
2. 点击Key后的"设置"
3. 添加小程序域名白名单（使用微信小程序的request合法域名）

### 4. 下载微信小程序SDK

```bash
# 创建static目录
mkdir -p src/static

# 下载SDK
wget https://a.amap.com/jsapi_demos/static/amap-wx.js -O src/static/amap-wx.js
```

或者在浏览器下载后放到 `src/static/` 目录。

## 创建项目结构

```bash
# 在src目录下创建DDD分层结构
cd src

# 创建各层目录
mkdir -p domain/resort/{entities,value-objects,repositories,services}
mkdir -p domain/user/{entities,repositories}
mkdir -p domain/favorite/{entities,repositories}
mkdir -p application/{services,dto,mappers}
mkdir -p infrastructure/{api,storage,map}
mkdir -p interfaces/{pages/components,hooks}
mkdir -p shared/{constants,utils,types}
mkdir -p di

# 创建配置文件
touch di/container.ts
```

## 初始化云函数

```bash
# 创建云函数目录（可以和前端项目分离）
mkdir -p ../backend/cloudfunctions

# 创建云函数
mkdir -p ../backend/cloudfunctions/resort-search
mkdir -p ../backend/cloudfunctions/resort-detail
mkdir -p ../backend/cloudfunctions/favorite-add
mkdir -p ../backend/cloudfunctions/favorite-remove

# 创建云函数入口文件
touch ../backend/cloudfunctions/resort-search/index.js
touch ../backend/cloudfunctions/resort-search/package.json
```

云函数示例：

```javascript
// backend/cloudfunctions/resort-search/index.js
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { keyword, type, limit = 20, offset = 0 } = event;

  try {
    let query = db.collection('resorts');

    // 构建查询条件
    if (keyword) {
      query = query.where({
        $or: [
          { name: db.RegExp({ regexp: keyword, options: 'i' }) },
          { city: db.RegExp({ regexp: keyword, options: 'i' }) },
          { province: db.RegExp({ regexp: keyword, options: 'i' }) },
        ],
      });
    }

    if (type) {
      query = query.where({ type });
    }

    const result = await query
      .orderBy('popularity', 'desc')
      .limit(limit)
      .skip(offset)
      .get();

    return {
      code: 0,
      message: 'success',
      data: result.data,
    };
  } catch (error) {
    console.error('搜索失败:', error);
    return {
      code: -1,
      message: error.message,
      data: [],
    };
  }
};
```

```json
// backend/cloudfunctions/resort-search/package.json
{
  "name": "resort-search",
  "version": "1.0.0",
  "description": "搜索滑雪场",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

## 开发调试

### 1. 运行项目

在HBuilderX中：
1. 右键项目 -> 运行 -> 运行到小程序模拟器 -> 微信开发者工具
2. 首次运行会自动打开微信开发者工具

或者在命令行：
```bash
npm run dev:mp-weixin
```

### 2. 配置微信开发者工具

1. 打开微信开发者工具
2. 导入项目：选择项目的 `dist/dev/mp-weixin` 目录
3. AppID：使用你的小程序AppID
4. 开启"不校验合法域名"（开发阶段）
5. 开启"云开发"（本地调试云函数需要）

### 3. 调试云函数

在微信开发者工具中：
1. 点击"云开发"按钮
2. 切换到"云函数"标签
3. 右键云函数 -> 本地调试（需要安装Node.js环境）

## 项目运行检查清单

- [ ] Node.js 18+ 已安装
- [ ] HBuilderX 已安装
- [ ] 微信开发者工具已安装
- [ ] 微信小程序已注册，获取到AppID
- [ ] 云开发已开通，获取到环境ID
- [ ] 高德地图Key已获取
- [ ] 高德地图SDK已下载到项目中
- [ ] 项目依赖已安装
- [ ] TypeScript配置正确
- [ ] 路径别名配置正确
- [ ] manifest.json配置正确
- [ ] pages.json配置正确
- [ ] 项目可以在微信开发者工具中运行

## 下一步

项目搭建完成后，按照以下顺序开发：

1. **基础组件开发**（1天）
   - 创建项目基础结构
   - 配置uView UI
   - 创建通用组件

2. **搜索功能开发**（2-3天）
   - 实现领域层：Resort实体、仓储接口
   - 实现基础设施层：高德地图集成
   - 实现应用层：搜索服务
   - 实现表现层：搜索页面

3. **详情页开发**（2天）
   - 滑雪场详情页
   - 信息展示

4. **收藏功能开发**（1-2天）
   - 收藏接口
   - 收藏列表

5. **测试和优化**（1-2天）
   - 功能测试
   - 性能优化
   - UI优化

6. **上线准备**（1天）
   - 提交审核
   - 配置生产环境

## 常见问题

### 1. 云函数调用失败
检查：
- 云开发环境是否已开通
- 环境ID是否正确配置
- 云函数是否已上传部署

### 2. 高德地图API调用失败
检查：
- Key是否正确
- 小程序域名白名单是否配置
- 网络请求是否正常

### 3. TypeScript编译错误
检查：
- tsconfig.json配置是否正确
- 类型定义是否安装
- 路径别名是否配置

### 4. 小程序页面空白
检查：
- pages.json中是否注册了页面
- 页面路径是否正确
- 控制台是否有错误信息

## 参考资源

- [uni-app官方文档](https://uniapp.dcloud.net.cn/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [高德地图微信小程序SDK](https://lbs.amap.com/api/wx/guide/prepare/)
- [uView UI文档](https://www.uviewui.com/)
- [Pinia状态管理](https://pinia.vuejs.org/)
