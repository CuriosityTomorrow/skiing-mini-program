# 数据库设计

## 微信云数据库设计

微信云数据库是基于MongoDB的文档型数据库，以下是针对滑雪小程序的数据库集合设计。

## 1. resorts 集合（滑雪场表）

```javascript
{
  _id: string,                  // 主键
  name: string,                 // 滑雪场名称
  type: string,                 // 类型：'indoor' | 'outdoor'

  // 位置信息
  province: string,             // 省份
  city: string,                 // 城市
  address: string,              // 详细地址
  location: {                   // 地理坐标（用于地图展示和距离计算）
    type: 'Point',
    coordinates: [longitude, latitude]  // GeoJSON格式
  },

  // 设施信息
  facilities: {
    hasRental: boolean,         // 是否有租赁服务
    hasParking: boolean,        // 是否有停车场
    hasRestaurant: boolean,     // 是否有餐厅
    hasHotel: boolean,          // 是否有酒店
    hasNightSkiing: boolean     // 是否有夜场
  },

  // 营业时间
  operatingHours: {
    openHour: number,           // 开门时间（24小时制）
    closeHour: number,          // 关门时间
    seasonalSchedule: {         // 季节性营业时间（可选）
      winterSeason: {
        start: string,          // 开始日期 'MM-DD'
        end: string             // 结束日期 'MM-DD'
      },
      summerSeason?: {
        start: string,
        end: string
      }
    }
  },

  // 票价信息
  tickets: [{
    type: string,               // 票种：成人票/儿童票/全天票/半天票
    price: number,              // 价格（元）
    description?: string        // 描述
  }],

  // 雪道信息
  trails: {
    totalCount: number,         // 雪道总数
    beginner: number,           // 初级道数量
    intermediate: number,       // 中级道数量
    advanced: number,           // 高级道数量
    expert: number              // 专家道数量
  },

  // 统计信息
  popularity: number,           // 人气排名（1-100）
  rating: number,               // 平均评分（0-5）
  ratingCount: number,          // 评分人数

  // 外部数据源信息
  dataSource: {
    provider: 'amap' | 'manual', // 数据来源
    externalId?: string,         // 外部系统ID（高德POI ID）
    lastSyncAt?: Date           // 最后同步时间
  },

  // 时间戳
  createdAt: Date,
  updatedAt: Date
}

// 索引设计
db.resorts.createIndex({ "location": "2dsphere" })  // 地理位置索引
db.resorts.createIndex({ "type": 1 })               // 类型索引
db.resorts.createIndex({ "popularity": -1 })        // 人气降序索引
db.resorts.createIndex({ "city": 1, "province": 1 }) // 城市省份索引
db.resorts.createIndex({ "name": "text", "address": "text" }) // 全文搜索索引
```

## 2. users 集合（用户表）

```javascript
{
  _id: string,                  // 主键
  openId: string,               // 微信openId（唯一）
  unionId?: string,             // 微信unionId（开放平台唯一）

  // 基本信息
  nickname: string,             // 昵称
  avatarUrl: string,            // 头像URL

  // 滑雪信息
  skiLevel: string,             // 滑雪水平：'beginner' | 'intermediate' | 'advanced' | 'expert'
  skiYears?: number,            // 滑雪年限
  favoriteResorts?: [string],   // 喜欢的滑雪场类型（室外/室内）

  // 统计信息
  shareCount: number,           // 分享数量
  favoriteCount: number,        // 收藏数量
  likeCount: number,            // 获赞数量

  // 状态
  status: 'active' | 'suspended', // 用户状态

  // 时间戳
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}

// 索引
db.users.createIndex({ "openId": 1 }, { unique: true })
db.users.createIndex({ "unionId": 1 })
db.users.createIndex({ "nickname": 1 })
```

## 3. favorites 集合（收藏表）

```javascript
{
  _id: string,                  // 主键
  userId: string,               // 用户ID
  resortId: string,             // 滑雪场ID

  // 时间戳
  createdAt: Date
}

// 索引
db.favorites.createIndex({ "userId": 1, "resortId": 1 }, { unique: true })  // 唯一索引
db.favorites.createIndex({ "userId": 1, "createdAt": -1 })                 // 用户收藏列表
db.favorites.createIndex({ "resortId": 1 })                                // 滑雪场被收藏统计
```

## 4. shares 集合（分享表）

```javascript
{
  _id: string,                  // 主键
  userId: string,               // 用户ID
  resortId: string,             // 滑雪场ID

  // 分享内容
  type: string,                 // 类型：'experience' | 'review' | 'partner'
  content: string,              // 文字内容
  images: [string],             // 图片URL数组（云存储ID）

  // 评价相关（仅review类型）
  rating?: number,              // 评分（1-5）
  serviceRating?: number,       // 服务评分
  facilityRating?: number,      // 设施评分
  priceRating?: number,         // 性价比评分

  // 找搭子相关（仅partner类型）
  skiLevel?: string,            // 期望对方的滑雪水平
  activityDate?: Date,          // 计划滑雪日期
  genderRequirement?: 'any' | 'male' | 'female',  // 性别要求
  participantCount?: number,    // 已报名人数
  maxParticipants?: number,     // 最大人数

  // 体验相关（仅experience类型）
  visitDate: Date,              // 滑雪日期
  snowQuality?: number,         // 雪质评分（1-5）
  crowdLevel?: string,          // 拥挤程度：'low' | 'medium' | 'high'

  // 统计信息
  likeCount: number,            // 点赞数
  commentCount: number,         // 评论数
  viewCount: number,            // 浏览数

  // 状态
  status: 'active' | 'hidden' | 'deleted',

  // 时间戳
  createdAt: Date,
  updatedAt: Date
}

// 索引
db.shares.createIndex({ "resortId": 1, "createdAt": -1 })   // 滑雪场的分享列表
db.shares.createIndex({ "userId": 1, "createdAt": -1 })     // 用户的分享列表
db.shares.createIndex({ "type": 1 })                        // 按类型筛选
db.shares.createIndex({ "activityDate": 1 })               // 找搭子日期
db.shares.createIndex({ "createdAt": -1 })                 // 时间线
```

## 5. share_likes 集合（点赞表）

```javascript
{
  _id: string,                  // 主键
  userId: string,               // 用户ID
  shareId: string,              // 分享ID
  createdAt: Date
}

// 索引
db.share_likes.createIndex({ "userId": 1, "shareId": 1 }, { unique: true })
db.share_likes.createIndex({ "shareId": 1 })  // 用于统计点赞数
```

## 6. comments 集合（评论表）

```javascript
{
  _id: string,                  // 主键
  shareId: string,              // 分享ID
  userId: string,               // 评论者ID
  content: string,              // 评论内容

  // 嵌套评论（回复）
  parentId?: string,            // 父评论ID（如果是回复）
  replyToUserId?: string,       // 被回复的用户ID

  // 统计
  likeCount: number,            // 点赞数

  // 时间戳
  createdAt: Date,
  updatedAt: Date
}

// 索引
db.comments.createIndex({ "shareId": 1, "createdAt": 1 })   // 分享的评论列表
db.comments.createIndex({ "userId": 1, "createdAt": -1 })   // 用户的评论列表
db.comments.createIndex({ "parentId": 1 })                  // 子评论查询
```

## 7. resort_stats 集合（滑雪场统计表）

```javascript
{
  _id: string,                  // 主键（resortId）
  resortId: string,             // 滑雪场ID

  // 实时统计
  viewCount: number,            // 浏览次数
  favoriteCount: number,        // 收藏次数
  shareCount: number,           // 分享数量
  checkInCount: number,         // 打卡次数

  // 时间维度统计（用于分析）
  dailyStats: [{
    date: string,               // 日期 YYYY-MM-DD
    views: number,
    favorites: number,
    shares: number,
    checkIns: number
  }],

  // 热度计算（用于排序）
  hotScore: number,             // 热度分数（综合计算）

  updatedAt: Date
}

// 索引
db.resort_stats.createIndex({ "hotScore": -1 })
db.resort_stats.createIndex({ "dailyStats.date": 1 })
```

## 8. cache 集合（缓存表）

```javascript
{
  _id: string,                  // 主键
  key: string,                  // 缓存键
  value: any,                   // 缓存值（可以是任何JSON结构）
  expireAt: Date,               // 过期时间

  createdAt: Date
}

// 索引
db.cache.createIndex({ "key": 1 }, { unique: true })
db.cache.createIndex({ "expireAt": 1 }, { expireAfterSeconds: 0 })  // TTL索引，自动删除过期数据
```

## 数据库安全规则（云数据库权限）

```javascript
{
  "read": "auth != null",    // 所有登录用户可读
  "write": false             // 禁止客户端直接写，必须通过云函数
}
```

## 初始数据设计

### 热门滑雪场初始数据

```javascript
// database/init-data/popular-resorts.js

module.exports = [
  {
    name: '万龙滑雪场',
    type: 'outdoor',
    province: '河北省',
    city: '张家口市',
    address: '崇礼区红花梁',
    location: {
      type: 'Point',
      coordinates: [115.499, 40.973]
    },
    facilities: {
      hasRental: true,
      hasParking: true,
      hasRestaurant: true,
      hasHotel: true,
      hasNightSkiing: true
    },
    operatingHours: {
      openHour: 8,
      closeHour: 17,
      seasonalSchedule: {
        winterSeason: {
          start: '11-01',
          end: '03-31'
        }
      }
    },
    tickets: [
      { type: '成人全天票', price: 580 },
      { type: '成人半天票', price: 400 },
      { type: '儿童全天票', price: 320 }
    ],
    trails: {
      totalCount: 32,
      beginner: 6,
      intermediate: 16,
      advanced: 8,
      expert: 2
    },
    popularity: 95,
    rating: 4.5,
    ratingCount: 1200,
    dataSource: {
      provider: 'manual',
      lastSyncAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '将军山滑雪场',
    type: 'outdoor',
    province: '新疆维吾尔自治区',
    city: '阿勒泰地区',
    address: '阿勒泰市将军山',
    location: {
      type: 'Point',
      coordinates: [88.139, 47.844]
    },
    facilities: {
      hasRental: true,
      hasParking: true,
      hasRestaurant: true,
      hasHotel: true,
      hasNightSkiing: true
    },
    operatingHours: {
      openHour: 10,
      closeHour: 18,
      seasonalSchedule: {
        winterSeason: {
          start: '10-01',
          end: '04-30'
        }
      }
    },
    tickets: [
      { type: '成人全天票', price: 268 },
      { type: '成人半天票', price: 198 }
    ],
    trails: {
      totalCount: 40,
      beginner: 12,
      intermediate: 18,
      advanced: 8,
      expert: 2
    },
    popularity: 98,
    rating: 4.8,
    ratingCount: 890,
    dataSource: {
      provider: 'manual',
      lastSyncAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '太舞滑雪场',
    type: 'outdoor',
    province: '河北省',
    city: '张家口市',
    address: '崇礼区营岔村',
    location: {
      type: 'Point',
      coordinates: [115.467, 40.962]
    },
    facilities: {
      hasRental: true,
      hasParking: true,
      hasRestaurant: true,
      hasHotel: true,
      hasNightSkiing: true
    },
    operatingHours: {
      openHour: 9,
      closeHour: 16,
      seasonalSchedule: {
        winterSeason: {
          start: '11-01',
          end: '03-31'
        }
      }
    },
    tickets: [
      { type: '成人全天票', price: 520 },
      { type: '儿童全天票', price: 280 }
    ],
    trails: {
      totalCount: 28,
      beginner: 8,
      intermediate: 12,
      advanced: 6,
      expert: 2
    },
    popularity: 92,
    rating: 4.6,
    ratingCount: 980,
    dataSource: {
      provider: 'manual',
      lastSyncAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '成都融创雪世界',
    type: 'indoor',
    province: '四川省',
    city: '成都市',
    address: '都江堰市至臻路',
    location: {
      type: 'Point',
      coordinates: [103.648, 30.987]
    },
    facilities: {
      hasRental: true,
      hasParking: true,
      hasRestaurant: true,
      hasHotel: true,
      hasNightSkiing: false
    },
    operatingHours: {
      openHour: 10,
      closeHour: 22
    },
    tickets: [
      { type: '4小时平日票', price: 388 },
      { type: '4小时周末票', price: 488 },
      { type: '全天票', price: 688 }
    ],
    trails: {
      totalCount: 7,
      beginner: 3,
      intermediate: 3,
      advanced: 1,
      expert: 0
    },
    popularity: 88,
    rating: 4.3,
    ratingCount: 650,
    dataSource: {
      provider: 'manual',
      lastSyncAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: '广州融创雪世界',
    type: 'indoor',
    province: '广东省',
    city: '广州市',
    address: '花都区凤凰北路',
    location: {
      type: 'Point',
      coordinates: [113.224, 23.404]
    },
    facilities: {
      hasRental: true,
      hasParking: true,
      hasRestaurant: true,
      hasHotel: true,
      hasNightSkiing: false
    },
    operatingHours: {
      openHour: 11,
      closeHour: 21
    },
    tickets: [
      { type: '4小时平日票', price: 388 },
      { type: '全天票', price: 658 }
    ],
    trails: {
      totalCount: 5,
      beginner: 2,
      intermediate: 2,
      advanced: 1,
      expert: 0
    },
    popularity: 85,
    rating: 4.2,
    ratingCount: 540,
    dataSource: {
      provider: 'manual',
      lastSyncAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
```

## 云数据库初始化脚本

```javascript
// database/init.js

const cloud = require('wx-server-sdk');
const resortData = require('./init-data/popular-resorts');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

async function initDatabase() {
  try {
    // 创建索引（通过云数据库控制台手动创建或通过云函数）
    console.log('开始初始化数据库...');

    // 插入初始滑雪场数据
    for (const resort of resortData) {
      try {
        await db.collection('resorts').add({
          data: resort
        });
        console.log(`已添加滑雪场: ${resort.name}`);
      } catch (e) {
        if (e.errCode !== -501001) {  // 忽略重复插入错误
          console.error(`插入 ${resort.name} 失败:`, e);
        }
      }
    }

    console.log('数据库初始化完成！');
  } catch (error) {
    console.error('初始化失败:', error);
  }
}

initDatabase();
```

## 数据一致性考虑

1. **收藏数统计**：使用云函数触发器，当favorites表增删时，自动更新resort_stats表
2. **热门度计算**：定期云函数每天重新计算hotScore
3. **缓存更新**：当resorts数据更新时，清除相关缓存
4. **软删除**：shares表使用status字段实现软删除

## 查询优化

1. **分页查询**：使用limit和skip实现分页
2. **字段过滤**：只查询需要的字段，减少数据传输
3. **聚合查询**：使用聚合管道进行复杂统计
4. **缓存策略**：热门数据缓存，减少数据库查询
