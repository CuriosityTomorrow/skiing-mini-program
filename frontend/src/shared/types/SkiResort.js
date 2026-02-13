/**
 * 滑雪场数据模型（基于 Nomads.com 理念）
 *
 * 设计原则：
 * 1. 数据驱动 - 每个字段都服务于筛选、排序或展示
 * 2. 决策辅助 - 提供多维度评分帮助用户选择
 * 3. 社交互动 - 记录用户行为和社区数据
 */

/**
 * 滑雪场实体
 *
 * @typedef {Object} SkiResort
 */
export const SkiResortSchema = {
  // ========== 基础标识 ==========
  id: String,                    // 唯一ID（高德POI ID或自定义）
  name: String,                  // 滑雪场名称
  nameEn: String,                // 英文名称（可选）
  alias: [String],               // 别名/曾用名 ['热雪奇迹', '融创雪世界']

  // ========== 位置信息 ==========
  location: {
    province: String,            // 省份
    city: String,                // 城市
    district: String,            // 区县
    address: String,             // 详细地址
    latitude: Number,            // 纬度
    longitude: Number,           // 经度
    distance: Number,            // 距离用户的距离（动态计算）
  },

  // ========== 综合评分（核心功能）==========
  scores: {
    overall: Number,             // 综合评分 0-10
    beginner: Number,            // 新手友好度 0-10
    intermediate: Number,        // 中级友好度 0-10
    expert: Number,              // 高手推荐度 0-10
    family: Number,              // 亲子友好度 0-10
    value: Number,               // 性价比 0-10
  },

  // ========== 基本信息 ==========
  type: String,                  // 'indoor' | 'outdoor'
  description: String,           // 简介

  // ========== 雪道信息（关键筛选维度）==========
  trails: {
    total: Number,               // 总雪道数
    beginner: Number,            // 初级雪道数
    intermediate: Number,        // 中级雪道数
    advanced: Number,            // 高级雪道数
    expert: Number,              // 专家级雪道数
    maxLength: Number,           // 最长雪道（米）
    verticalDrop: Number,        // 垂直落差（米）
  },

  // ========== 价格信息（关键筛选维度）==========
  pricing: {
    daily: Number,               // 日票价格（元）
    night: Number,               // 夜场价格（元）
    weekend: Number,             // 周末价格（元）
    season: Number,              // 季卡价格（元）
    avgCost: Number,             // 平均消费/天（用于筛选）
  },

  // ========== 设施信息（筛选条件）==========
  facilities: {
    rental: Boolean,             // 租雪具
    parking: Boolean,            // 停车场
    restaurant: Boolean,         // 餐厅
    hotel: Boolean,              // 住宿
    locker: Boolean,             // 储物柜
    nightSkiing: Boolean,        // 夜场
    coach: Boolean,              // 教练服务
    magicCarpet: Boolean,        // 魔毯
    cableCar: Boolean,           // 缆车/索道
    snowPark: Boolean,           // 单板公园
    kidsArea: Boolean,           // 儿童区
  },

  // ========== 季节信息 ==========
  season: {
    openMonth: Number,           // 开业月份 (1-12)
    closeMonth: Number,          // 关闭月份 (1-12)
    status: String,              // 'open' | 'closed' | 'coming_soon'
    bestMonths: [Number],        // 最佳月份 [12, 1, 2]
    snowQuality: String,         // 'natural' | 'artificial' | 'mixed'
  },

  // ========== 交通信息 ==========
  transportation: {
    fromBeijing: String,         // 从北京出发交通方式
    fromShanghai: String,        // 从上海出发（可选）
    driveTime: Number,           // 自驾时间（分钟）
    publicTransport: Boolean,    // 是否有公共交通
  },

  // ========== 媒体资源 ==========
  media: {
    cover: String,               // 封面图
    photos: [String],            // 图片列表
    video: String,               // 视频（可选）
  },

  // ========== 联系方式 ==========
  contact: {
    phone: String,               // 电话
    website: String,             // 官网
    wechat: String,              // 微信公众号
    hours: {
      open: String,              // 开始时间 '09:00'
      close: String,             // 结束时间 '18:00'
      nightOpen: String,         // 夜场开始
      nightClose: String,        // 夜场结束
    }
  },

  // ========== 社交数据（用于展示和排序）==========
  community: {
    rating: Number,              // 用户评分 0-5
    ratingCount: Number,         // 评分人数
    reviewCount: Number,         // 评价数量
    visitedCount: Number,        // 去过人数
    wantToGoCount: Number,       // 想去人数
    favoriteCount: Number,       // 收藏数
    checkinCount: Number,        // 打卡数（今日或本周）
  },

  // ========== 标签（辅助筛选和展示）==========
  tags: [String],                // ['夜场', '公园', '温泉', '近北京', '性价比高']

  // ========== 特色亮点 ==========
  highlights: [String],          // ['2022冬奥场地', '亚洲最长雪道', '粉雪天堂']

  // ========== 适合人群（算法计算）==========
  suitableFor: {
    beginner: Boolean,           // 适合新手
    family: Boolean,             // 适合亲子
    expert: Boolean,             // 适合高手
    weekend: Boolean,            // 适合周末游
    vacation: Boolean,           // 适合度假
  },

  // ========== 元数据 ==========
  meta: {
    source: String,              // 'amap' | 'local' | 'manual'
    verified: Boolean,           // 是否人工核验
    updatedAt: Date,             // 更新时间
    viewCount: Number,           // 页面浏览量
  }
};


/**
 * 筛选条件（用于搜索和筛选）
 *
 * @typedef {Object} SkiResortFilters
 */
export const FilterSchema = {
  // 价格筛选
  priceRange: {
    min: Number,
    max: Number,
  },
  priceLevel: String,            // 'budget' | 'mid' | 'luxury'

  // 难度筛选
  difficulty: [String],          // ['beginner', 'intermediate', 'advanced', 'expert']

  // 位置筛选
  provinces: [String],           // ['河北', '北京', '黑龙江']
  maxDistance: Number,           // 最大距离（km）

  // 类型筛选
  resortType: String,            // 'indoor' | 'outdoor' | 'all'

  // 设施筛选
  requiredFacilities: [String], // ['rental', 'nightSkiing', 'hotel']

  // 雪道筛选
  minTrails: Number,             // 最少雪道数
  trailTypes: [String],          // 需要的雪道类型

  // 季节筛选
  availableIn: [Number],         // 可用月份 [12, 1, 2]
  isOpenNow: Boolean,            // 现在开放
  snowQuality: [String],         // ['natural', 'artificial']

  // 适合人群
  suitableFor: [String],         // ['beginner', 'family', 'expert']

  // 评分筛选
  minRating: Number,             // 最低评分

  // 标签筛选
  tags: [String],
};


/**
 * 排序选项
 */
export const SortOptions = {
  OVERALL_SCORE: 'overall_score',      // 综合评分
  BEGINNER_SCORE: 'beginner_score',    // 新手友好度
  EXPERT_SCORE: 'expert_score',        // 高手推荐
  FAMILY_SCORE: 'family_score',        // 亲子友好
  VALUE_SCORE: 'value_score',          // 性价比
  PRICE_LOW: 'price_low',              // 价格从低到高
  PRICE_HIGH: 'price_high',            // 价格从高到低
  DISTANCE: 'distance',                // 距离最近
  RATING: 'rating',                    // 用户评分
  POPULARITY: 'popularity',            // 热门程度
  TRAIL_COUNT: 'trail_count',          // 雪道数量
};


/**
 * Mock 数据示例（用于开发）
 */
export const mockSkiResort = {
  id: 'wanlong_001',
  name: '万龙滑雪场',
  nameEn: 'Wanlong Ski Resort',
  alias: [],

  location: {
    province: '河北省',
    city: '张家口市',
    district: '崇礼区',
    address: '红花梁',
    latitude: 40.9745,
    longitude: 115.2891,
    distance: 0,
  },

  scores: {
    overall: 8.5,
    beginner: 7.5,
    intermediate: 9.0,
    expert: 9.5,
    family: 7.0,
    value: 8.0,
  },

  type: 'outdoor',
  description: '中国顶级滑雪度假胜地，拥有32条雪道，垂直落差550米',

  trails: {
    total: 32,
    beginner: 8,
    intermediate: 12,
    advanced: 10,
    expert: 2,
    maxLength: 3500,
    verticalDrop: 550,
  },

  pricing: {
    daily: 450,
    night: 280,
    weekend: 580,
    season: 6800,
    avgCost: 500,
  },

  facilities: {
    rental: true,
    parking: true,
    restaurant: true,
    hotel: true,
    locker: true,
    nightSkiing: true,
    coach: true,
    magicCarpet: true,
    cableCar: true,
    snowPark: true,
    kidsArea: false,
  },

  season: {
    openMonth: 11,
    closeMonth: 4,
    status: 'open',
    bestMonths: [12, 1, 2],
    snowQuality: 'mixed',
  },

  transportation: {
    fromBeijing: '自驾3小时或高铁+大巴',
    driveTime: 180,
    publicTransport: true,
  },

  media: {
    cover: 'https://example.com/wanlong-cover.jpg',
    photos: [],
    video: '',
  },

  contact: {
    phone: '0313-4785555',
    website: 'http://www.wlski.com',
    wechat: 'wanlongski',
    hours: {
      open: '08:30',
      close: '16:30',
      nightOpen: '17:00',
      nightClose: '21:00',
    }
  },

  community: {
    rating: 4.8,
    ratingCount: 1234,
    reviewCount: 856,
    visitedCount: 5234,
    wantToGoCount: 328,
    favoriteCount: 892,
    checkinCount: 45,
  },

  tags: ['夜场', '高级道多', '近北京', '雪质好'],
  highlights: ['32条雪道', '550米落差', '崇礼四大雪场之一'],

  suitableFor: {
    beginner: false,
    family: true,
    expert: true,
    weekend: true,
    vacation: true,
  },

  meta: {
    source: 'manual',
    verified: true,
    updatedAt: new Date(),
    viewCount: 15234,
  }
};
