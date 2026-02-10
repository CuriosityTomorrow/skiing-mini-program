#!/bin/bash

# 滑雪小程序项目初始化脚本
# 使用方法: bash scripts/init-project.sh

set -e  # 遇到错误立即退出

echo "========================================="
echo "  滑雪小程序项目初始化脚本"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Node.js
echo -e "${BLUE}检查开发环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js 未安装，请先安装 Node.js 18+${NC}"
    echo "推荐使用 Homebrew 安装: brew install node@18"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js 版本: $NODE_VERSION${NC}"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}❌ npm 未安装${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm 版本: $NPM_VERSION${NC}"

echo ""
echo -e "${BLUE}创建项目目录结构...${NC}"

# 创建前端项目目录
mkdir -p frontend/src

# 创建 DDD 分层结构
mkdir -p frontend/src/domain/resort/{entities,value-objects,repositories,services}
mkdir -p frontend/src/domain/user/{entities,repositories,services}
mkdir -p frontend/src/domain/favorite/{entities,repositories}
mkdir -p frontend/src/domain/share/{entities,repositories}
mkdir -p frontend/src/application/{services,dto,mappers}
mkdir -p frontend/src/infrastructure/{api,storage,map}
mkdir -p frontend/src/interfaces/{pages,resort,favorite,shared}
mkdir -p frontend/src/interfaces/pages/resort/{list,detail}
mkdir -p frontend/src/interfaces/pages/favorite
mkdir -p frontend/src/interfaces/components/common
mkdir -p frontend/src/interfaces/hooks
mkdir -p frontend/src/shared/{constants,utils,types}
mkdir -p frontend/src/di
mkdir -p frontend/src/static/{tab,images}
mkdir -p frontend/src/uni_modules

# 创建后端云函数目录
mkdir -p backend/cloudfunctions/resort-search
mkdir -p backend/cloudfunctions/resort-detail
mkdir -p backend/cloudfunctions/favorite-add
mkdir -p backend/cloudfunctions/favorite-remove
mkdir -p backend/cloudfunctions/share-create
mkdir -p backend/cloudfunctions/share-list
mkdir -p backend/database/init-data

# 创建文档目录
mkdir -p docs/api

echo -e "${GREEN}✓ 目录结构创建完成${NC}"

echo ""
echo -e "${BLUE}创建配置文件...${NC}"

# 创建前端 package.json
cat > frontend/package.json << 'EOF'
{
  "name": "skiing-frontend",
  "version": "1.0.0",
  "description": "滑雪小程序前端",
  "scripts": {
    "dev:mp-weixin": "uni -p mp-weixin",
    "build:mp-weixin": "uni build -p mp-weixin",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.7",
    "tsyringe": "^2.4.2",
    "tcb-js-sdk": "^1.8.4",
    "uview-ui": "^2.0.36",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@dcloudio/types": "^3.4.8",
    "@dcloudio/uni-app": "3.0.0-4020920240930001",
    "@dcloudio/vite-plugin-uni": "3.0.0-4020920240930001",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.0"
  }
}
EOF

# 创建 TypeScript 配置
cat > frontend/tsconfig.json << 'EOF'
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
    "resolveJsonModule": true,
    "isolatedModules": true,
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
EOF

# 创建 Vite 配置
cat > frontend/vite.config.ts << 'EOF'
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
EOF

# 创建 uni-app 配置
cat > frontend/src/pages.json << 'EOF'
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
EOF

# 创建 manifest.json (需要用户填写 AppID)
cat > frontend/src/manifest.json << 'EOF'
{
  "name": "滑雪小程序",
  "appid": "__UNI__SKIING",
  "description": "滑雪爱好者的小程序",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  "mp-weixin": {
    "appid": "YOUR_APPID_HERE",
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
    }
  }
}
EOF

# 创建主应用文件
cat > frontend/src/App.vue << 'EOF'
<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import 'uview-ui/index.scss';

page {
  background-color: #f5f5f5;
}
</style>
EOF

# 创建 main.ts
cat > frontend/src/main.ts << 'EOF'
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import uView from 'uview-ui'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(uView)

  return {
    app,
    pinia
  }
}

createApp().app.mount('#app')
EOF

# 创建环境变量文件
cat > frontend/.env.development << 'EOF'
# 开发环境配置
VITE_APP_TITLE=滑雪小程序
VITE_CLOUD_ENV=your-env-id
VITE_AMAP_KEY=your-amap-key
EOF

cat > frontend/.env.production << 'EOF'
# 生产环境配置
VITE_APP_TITLE=滑雪小程序
VITE_CLOUD_ENV=your-env-id
VITE_AMAP_KEY=your-amap-key
EOF

echo -e "${GREEN}✓ 配置文件创建完成${NC}"

echo ""
echo -e "${BLUE}创建依赖注入容器...${NC}"

cat > frontend/src/di/container.ts << 'EOF'
import { container } from 'tsyringe';

// 注册所有依赖关系
export function configureDI() {
  // TODO: 注册依赖
  // container.registerSingleton('IResortRepository', ResortRepositoryImpl);
  // container.registerSingleton('ResortSearchService', ResortSearchService);
}

export { container };
EOF

# 创建共享类型
cat > frontend/src/shared/types/index.ts << 'EOF'
// 滑雪场类型
export type ResortType = 'indoor' | 'outdoor';

// 滑雪水平
export type SkiLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// 分享类型
export type ShareType = 'experience' | 'review' | 'partner';

// 用户信息
export interface UserInfo {
  id: string;
  openId: string;
  nickname: string;
  avatarUrl: string;
  skiLevel: SkiLevel;
}
EOF

# 创建常量
cat > frontend/src/shared/constants/index.ts << 'EOF'
// API 基础配置
export const API_CONFIG = {
  CLOUD_ENV: import.meta.env.VITE_CLOUD_ENV,
  AMAP_KEY: import.meta.env.VITE_AMAP_KEY,
};

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// 滑雪场类型
export const RESORT_TYPES = {
  INDOOR: 'indoor',
  OUTDOOR: 'outdoor',
} as const;

// 滑雪水平
export const SKI_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const;
EOF

echo -e "${GREEN}✓ 依赖注入容器创建完成${NC}"

echo ""
echo -e "${BLUE}创建云函数...${NC}"

# 创建搜索云函数
cat > backend/cloudfunctions/resort-search/index.js << 'EOF'
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
EOF

cat > backend/cloudfunctions/resort-search/package.json << 'EOF'
{
  "name": "resort-search",
  "version": "1.0.0",
  "description": "搜索滑雪场云函数",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
EOF

echo -e "${GREEN}✓ 云函数创建完成${NC}"

echo ""
echo -e "${BLUE}创建 .gitignore 文件...${NC}"

cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# uni-app
unpackage/
.hbuilderx/

# Environment
.env.local
.env.*.local
EOF

echo -e "${GREEN}✓ .gitignore 创建完成${NC}"

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  项目初始化完成！${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}接下来的步骤：${NC}"
echo ""
echo "1. 进入前端目录并安装依赖："
echo -e "   ${YELLOW}cd frontend && npm install${NC}"
echo ""
echo "2. 配置微信小程序："
echo "   - 在微信小程序后台获取 AppID"
echo "   - 更新 frontend/src/manifest.json 中的 appid"
echo ""
echo "3. 配置云开发："
echo "   - 开通微信云开发，获取环境ID"
echo "   - 更新 .env.development 中的 VITE_CLOUD_ENV"
echo ""
echo "4. 配置高德地图："
echo "   - 注册高德开放平台账号"
echo "   - 创建微信小程序应用，获取 Key"
echo "   - 更新 .env.development 中的 VITE_AMAP_KEY"
echo "   - 下载高德地图微信小程序SDK到 frontend/src/static/"
echo ""
echo "5. 运行项目："
echo -e "   ${YELLOW}npm run dev:mp-weixin${NC}"
echo ""
echo "6. 在微信开发者工具中导入项目："
echo "   - 目录: frontend/dist/dev/mp-weixin"
echo "   - AppID: 你的小程序AppID"
echo ""
echo -e "${BLUE}详细文档：${NC}"
echo "   - README.md: 项目概览"
echo "   - docs/01-ddd-design.md: DDD架构设计"
echo "   - docs/02-database-design.md: 数据库设计"
echo "   - docs/03-quick-start.md: 快速开始指南"
echo ""
