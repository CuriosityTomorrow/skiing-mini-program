// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 3,
  },
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  // 服务端配置
  nitro: {
    // SQLite 需要 better-sqlite3 作为外部依赖
    externals: {
      external: ['better-sqlite3'],
    },
  },

  // 运行时配置
  runtimeConfig: {
    // 服务端私有配置
    amapApiKey: process.env.AMAP_API_KEY || '41f98310392808752b5e9ea1e6bc4776',
    dbPath: process.env.DB_PATH || './db/skiing.db',
    jwtSecret: process.env.JWT_SECRET || 'skiing-app-secret-change-in-prod',
    aliyunAccessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
    aliyunAccessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
    // 公共配置（客户端可访问）
    public: {
      siteName: '去滑雪吧',
    },
  },

  // Tailwind CSS 配置
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  // 应用配置
  app: {
    head: {
      title: '去滑雪吧 - 找到最适合你的滑雪场',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '中国滑雪场搜索、评分、对比平台 - Nomads 风格' },
      ],
      htmlAttrs: {
        lang: 'zh-CN',
      },
    },
  },
})
