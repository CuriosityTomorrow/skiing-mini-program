# 滑雪场助手 - 项目技术知识库

**项目路径**: `/Users/samdediannao/skiing/`
**最后更新**: 2025-02-04

---

## 🏗️ 技术架构

### 技术栈
```
前端框架: 微信小程序原生（WXML + WXSS + JavaScript）
地图服务: 高德地图 Web服务 API
数据存储: 本地模拟数据 + 实时API
```

### 数据流架构
```
用户输入城市
    ↓
amap-service.js (高德API封装)
    ├─ 多关键词并行搜索
    ├─ 地理编码
    └─ 距离计算
    ↓
ski-resort-detector.js (智能识别)
    ├─ 名称筛选（置信度）
    └─ 坐标去重
    ↓
ski-resort-manager.js (数据管理)
    ├─ 格式化POI数据
    ├─ 计算距离和交通
    └─ 数据排序
    ↓
pages/index/index.js (页面展示)
    └─ 渲染滑雪场列表
```

---

## 🔑 核心配置

### 高德API配置 (`config/amap.js`)
```javascript
module.exports = {
  // ✅ 已配置的Web服务Key
  AMAP_WEB_KEY: '41f98310392808752b5e9ea1e6bc4776',

  // API端点
  api: {
    poiSearch: 'https://restapi.amap.com/v5/place/text',
    poiAround: 'https://restapi.amap.com/v5/place/around',
    geocode: 'https://restapi.amap.com/v3/geocode/geo',
    regeocode: 'https://restapi.amap.com/v3/geocode/regeo',
    distance: 'https://restapi.amap.com/v3/distance',
    driving: 'https://restapi.amap.com/v3/direction/driving'
  },

  // 滑雪场POI类型
  SKI_RESORT_TYPE: '080107',

  // 搜索配置
  search: {
    defaultRadius: 200000,  // 200公里
    pageSize: 50,
    cacheTimeout: 30 * 60 * 1000
  },

  // 开发模式
  devMode: false  // false=使用真实API
};
```

### 真实API开关 (`pages/index/index.js`)
```javascript
Page({
  data: {
    useRealAPI: true,  // ✅ 已启用真实API
    // ...
  }
});
```

---

## 📚 核心代码库

### 1. 高德API服务 (`utils/amap-service.js`)

**关键方法**:

```javascript
class AmapService {
  // POI文本搜索（多关键词）
  async searchPoi(keywords, city, pageSize, pageIndex) {
    // 如果指定关键词，直接搜索
    // 否则使用10个关键词并行搜索
    // 返回智能筛选后的结果
  }

  // 周边搜索（多关键词）
  async searchAround(location, radius, pageSize) {
    // 搜索指定坐标附近的滑雪场
    // 使用多关键词 + 智能识别
  }

  // 地理编码（地址 → 坐标）
  async geocode(address, city) {
    // 返回: { longitude, latitude, city, province }
  }

  // 逆地理编码（坐标 → 地址）
  async regeocode(longitude, latitude) {
    // 返回: { city, province, formattedAddress }
  }

  // 距离计算
  async calculateDistance(origin, destination, type) {
    // type: 0=直线, 1=驾车, 3=步行
    // 返回: { distance(米), duration(秒) }
  }

  // 驾车路线规划
  async getDrivingRoute(origin, destination, strategy) {
    // 返回: { distance, duration, tolls, steps }
  }
}
```

### 2. 智能识别器 (`utils/ski-resort-detector.js`)

**滑雪场关键词库**:
```javascript
const SKI_RESORT_KEYWORDS = [
  '滑雪场', '滑雪', '冰雪世界', '冰雪', '热雪',
  '乔波', '融雪', '室内滑雪', '滑雪度假村', '滑雪中心'
];
```

**排除关键词**:
```javascript
const EXCLUDE_KEYWORDS = [
  '滑雪装备', '滑雪用品', '滑雪服', '滑雪板',
  '滑雪培训', '滑雪教练', '滑雪学校',
  '滑雪租赁', '冰淇淋', '冰激凌'
];
```

**核心算法**:

```javascript
// 判断是否是滑雪场
function isSkiResortByName(name) {
  // 1. 检查排除关键词
  for (const keyword of EXCLUDE_KEYWORDS) {
    if (name.includes(keyword)) return { isSkiResort: false };
  }

  // 2. 匹配滑雪关键词
  let matched = [];
  for (const keyword of SKI_RESORT_KEYWORDS) {
    if (name.toLowerCase().includes(keyword.toLowerCase())) {
      matched.push(keyword);
    }
  }

  // 3. 计算置信度
  if (matched.length > 0) {
    let confidence = 0.5;
    if (name.includes('滑雪场') || name.includes('滑雪中心')) {
      confidence = 0.95;
    } else if (name.includes('冰雪世界') || name.includes('热雪奇迹')) {
      confidence = 0.85;
    }
    return { isSkiResort: true, confidence, reason: '匹配关键词' };
  }

  return { isSkiResort: false, confidence: 0 };
}

// 去重（基于坐标距离）
function isSameSkiResort(poi1, poi2) {
  const distance = calculateDistance(lon1, lat1, lon2, lat2);
  return distance < 100; // 小于100米视为同一位置
}
```

### 3. 滑雪场管理器 (`utils/ski-resort-manager.js`)

**主要方法**:
```javascript
class SkiResortManager {
  // 从城市搜索
  async searchFromCity(cityName) {
    // 1. 地理编码获取城市坐标
    // 2. 周边搜索滑雪场
    // 3. 计算距离和交通
    // 4. 按距离排序
  }

  // 格式化POI为滑雪场对象
  formatPoiToResort(poi, originLocation) {
    return {
      id: poi.id,
      name: poi.name,
      city: poi.cityname,
      longitude, latitude,
      distance,  // 距离（米）
      transportation: [],  // 交通方式
      type: 'indoor' | 'outdoor',
      price, rating,
      // ...
    };
  }
}
```

---

## 🎯 关键功能实现

### 多关键词搜索实现

**问题**: 单一关键词搜索遗漏很多滑雪场

**解决方案**:
```javascript
// utils/amap-service.js
async searchPoi(keywords, city, pageSize, pageIndex) {
  const allPois = new Map();

  // 使用10个关键词并行搜索
  const searchKeywords = [
    '滑雪场', '滑雪', '冰雪世界', '冰雪', '热雪',
    '乔波', '融雪', '室内滑雪', '滑雪度假村', '滑雪中心'
  ];

  for (const keyword of searchKeywords) {
    try {
      const data = await this.request(config.api.poiSearch, {
        keywords: keyword,
        city: city,
        citylimit: true,
        offset: 20
      });

      // 使用Map自动去重（基于POI ID）
      data.pois.forEach(poi => allPois.set(poi.id, poi));
    } catch (error) {
      console.warn(`关键词"${keyword}"搜索失败`);
    }
  }

  return Array.from(allPois.values());
}
```

### 坐标去重实现

**问题**: 同一滑雪场有多个POI名称（如KKPark和阿尔卑斯）

**解决方案**:
```javascript
// utils/ski-resort-detector.js
function deduplicateSkiResorts(pois) {
  const unique = [];

  for (const poi of pois) {
    let isDuplicate = false;
    const [lon1, lat1] = poi.location.split(',').map(parseFloat);

    for (const existing of unique) {
      const [lon2, lat2] = existing.location.split(',').map(parseFloat);
      const distance = calculateDistance(lon1, lat1, lon2, lat2);

      if (distance < 100) {  // 小于100米
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      unique.push(poi);
    }
  }

  return unique;
}
```

### 距离计算实现

**Haversine公式**（计算球面距离）:
```javascript
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球半径（km）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 返回公里
}
```

---

## 🐛 常见问题与解决方案

### 问题1: 所有距离显示相同

**症状**: 输入不同城市，所有滑雪场距离都是52km

**原因**:
- 滑雪场数据缺少经纬度
- 使用了相同的默认坐标

**解决**:
```javascript
// ❌ 错误
distance: calculateDistance(
  cityLat, cityLon,
  resort.latitude || 40,  // 默认北京纬度
  resort.longitude || 117 // 默认北京经度
)

// ✅ 正确
if (resort.latitude && resort.longitude) {
  distance = calculateDistance(
    cityLat, cityLon,
    resort.latitude,
    resort.longitude
  );
} else {
  // 处理缺失坐标的情况
}
```

### 问题2: API Key错误 USERKEY_PLAT_NOMATCH

**症状**: API返回 `USERKEY_PLAT_NOMATCH`

**原因**: Key的平台类型不匹配

**解决**:
- ✅ 使用"Web服务"类型（不是Android/iOS SDK）
- ❌ 不要使用Android SDK或iOS SDK类型的Key
- 重新申请时选择正确的服务类型

### 问题3: 搜索不到某些滑雪场

**症状**: 搜索深圳找不到华发滑雪场

**原因**:
- 搜索关键词太窄（只用"滑雪场"）
- 华发可能叫"华发·冰工厂"或"热雪奇迹"

**解决**:
- 使用多关键词搜索
- 添加智能名称识别

### 问题4: 搜索结果重复

**症状**: 同一位置出现多个滑雪场名称

**原因**: 同一滑雪场有多个POI

**解决**:
- 基于GPS坐标距离去重
- 距离阈值：100米

---

## 📊 数据结构

### 滑雪场对象结构
```javascript
{
  id: 'B000A7BD6J',              // POI ID
  name: '万龙滑雪场',            // 名称
  city: '张家口市',              // 城市
  province: '河北省',            // 省份
  country: '中国',               // 国家

  // 位置
  address: '崇礼区',             // 详细地址
  longitude: 115.7697,           // 经度
  latitude: 40.9515,             // 纬度

  // 类型
  type: 'outdoor',               // outdoor | indoor

  // 距离
  distance: 150000,              // 距离（米）

  // 联系方式
  telephone: '0313-4618888',     // 电话
  website: '',                   // 网站

  // 基础设施
  facilities: ['缆车', '餐厅', '租赁', '教练'],

  // 交通方式
  transportation: [
    {
      type: '自驾',              // 交通类型
      duration: '3小时',         // 时间
      distance: '180km',         // 距离
      detail: '过路费200元'      // 详情
    }
  ],

  // 价格
  price: 680,                    // 价格（元）
  priceUnit: '天',               // 单位

  // 营业信息
  season: '11月-3月',            // 季节
  elevation: 1200,               // 海拔（米）
  trails: 32,                    // 雪道数量

  // 评分
  rating: 4.8,                   // 评分
  reviewCount: 1250,             // 评价数量

  // 图片
  images: [
    'https://...'
  ],

  // 特色
  features: ['亚洲最大雪场', '奥运场馆'],
  description: '...',

  // 原始POI数据
  poi: { ... }
}
```

### 用户对象结构
```javascript
{
  id: 'user_123',
  nickname: '滑雪小王子',
  avatar: '/images/avatar.png',

  // 滑雪信息
  skiType: 'snowboard',         // ski | snowboard | both
  experience: 3,                // 滑雪年限
  skillLevel: '有点水平但不多',  // 技能等级标签
  gender: 'male',               // male | female

  // 收藏
  favorites: ['resort_id_1', 'resort_id_2'],

  // 统计
  reviewCount: 15,
  resortCount: 28
}
```

### 评价对象结构
```javascript
{
  id: 'review_123',
  userId: 'user_123',
  userName: '滑雪小王子',
  userAvatar: '/images/avatar.png',
  userSkillLevel: '有点水平但不多',
  userSkiType: 'snowboard',

  resortId: 'resort_456',
  resortName: '万龙滑雪场',

  // 评分
  aiRating: 4.5,                // AI评分
  communityRating: 4.2,         // 社区评分

  // 内容
  content: '雪质很好，雪道丰富...',
  images: ['/images/1.jpg', '/images/2.jpg'],

  // 时间
  visitDate: '2025-01-15',
  createTime: '2025-01-16T10:30:00',

  // 统计
  likes: 125,
  comments: 23
}
```

---

## 🧪 测试工具

### 1. API测试页面 (`test-api.html`)
- 测试基础API功能
- POI搜索、地理编码、周边搜索、距离计算
- 显示原始返回数据

### 2. 智能搜索测试 (`test-smart-search.html`)
- 测试多关键词搜索
- 显示筛选过程（原始→筛选→去重）
- 显示置信度评分
- 对比单关键词 vs 多关键词

### 测试命令
```bash
# 在浏览器中打开测试页面
open /Users/samdediannao/skiing/test-api.html
open /Users/samdediannao/skiing/test-smart-search.html

# 在微信开发者工具中测试
# 1. 打开微信开发者工具
# 2. 导入项目：/Users/samdediannao/skiing
# 3. 详情 → 本地设置 → 勾选"不校验合法域名"
# 4. 编译运行
```

### 测试城市列表
```javascript
const testCities = [
  '北京',      // 有多个滑雪场
  '上海',      // 室内滑雪场
  '深圳',      // 华发/热雪奇迹
  '广州',      // 室内滑雪场
  '张家口',    // 万龙等大型雪场
  '哈尔滨',    // 冰雪城市
  '成都',      // 室内滑雪
  '武汉'       // 乔波室内滑雪
];
```

---

## 📱 微信小程序开发

### 目录结构
```
pages/
├── index/              # 搜索页
│   ├── index.wxml      # 页面结构
│   ├── index.wxss      # 页面样式
│   ├── index.js        # 页面逻辑
│   └── index.json      # 页面配置
├── explore/            # 探索页
├── profile/            # 个人页
├── compare/            # 对比页
└── resort/             # 详情页
```

### 页面生命周期
```javascript
Page({
  onLoad(options) {
    // 页面加载时触发
    // options: url参数
  },

  onShow() {
    // 页面显示时触发
    // 每次显示都会触发
  },

  onReady() {
    // 页面初次渲染完成时触发
    // 只触发一次
  },

  onHide() {
    // 页面隐藏时触发
  },

  onUnload() {
    // 页面卸载时触发
  }
});
```

### 数据绑定
```javascript
// 页面JS
Page({
  data: {
    cityName: '北京',
    resorts: []
  },

  updateData() {
    this.setData({
      cityName: '上海',
      'resorts[0].name': '新名称'
    });
  }
});

// 页面WXML
<view>{{cityName}}</view>
<view wx:for="{{resorts}}" wx:key="id">{{item.name}}</view>
```

### 事件处理
```javascript
// WXML
<button bindtap="onTap">点击</button>
<input bindinput="onInput" />
<view bindtap="onResortTap" data-id="{{item.id}}">详情</view>

// JS
Page({
  onTap(e) {
    console.log('点击了按钮');
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onResortTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/resort/resort?id=${id}` });
  }
});
```

### 网络请求
```javascript
wx.request({
  url: 'https://restapi.amap.com/v5/place/text',
  data: {
    key: 'your_api_key',
    keywords: '滑雪场',
    city: '北京'
  },
  success: (res) => {
    console.log(res.data);
  },
  fail: (error) => {
    console.error(error);
  }
});
```

### 本地存储
```javascript
// 同步存储
wx.setStorageSync('selectedResorts', resorts);
const data = wx.getStorageSync('selectedResorts');

// 异步存储
wx.setStorage({
  key: 'userInfo',
  data: userInfo
});

wx.getStorage({
  key: 'userInfo',
  success: (res) => {
    console.log(res.data);
  }
});
```

### 路由跳转
```javascript
// 保留当前页面，跳转到新页面
wx.navigateTo({
  url: '/pages/resort/resort?id=123'
});

// 关闭当前页面，跳转到新页面
wx.redirectTo({
  url: '/pages/login/login'
});

// 返回上一页
wx.navigateBack({
  delta: 1  // 返回层数
});

// 跳转到tabBar页面
wx.switchTab({
  url: '/pages/index/index'
});
```

### 提示与加载
```javascript
// 显示提示
wx.showToast({
  title: '操作成功',
  icon: 'success',
  duration: 2000
});

// 显示加载
wx.showLoading({
  title: '加载中...',
  mask: true
});

// 隐藏加载
wx.hideLoading();

// 显示确认框
wx.showModal({
  title: '提示',
  content: '确定要删除吗？',
  success: (res) => {
    if (res.confirm) {
      console.log('用户点击确定');
    }
  }
});
```

---

## 🔧 调试技巧

### 1. 控制台调试
```javascript
console.log('普通日志');
console.warn('警告信息');
console.error('错误信息');
console.dir(object);  // 打印对象结构
```

### 2. 断点调试
```javascript
// 在微信开发者工具中
// 1. 打开调试器
// 2. Sources → 找到对应JS文件
// 3. 点击行号设置断点
```

### 3. 网络请求调试
```javascript
// 在调试器中
// Network → 查看所有请求
// 点击请求查看详细信息
```

### 4. 数据查看
```javascript
// 在调试器中
// Storage → 查看本地存储数据
// AppData → 查看页面数据
```

---

## 📈 性能优化建议

### 1. 减少API调用
```javascript
// ❌ 不好：每次都重新搜索
onCityChange(e) {
  this.searchResorts(e.detail.value);
}

// ✅ 好：使用防抖
onCityChange: debounce(function(e) {
  this.searchResorts(e.detail.value);
}, 500)
```

### 2. 数据缓存
```javascript
// 使用缓存
async searchResorts(city) {
  const cacheKey = `resorts_${city}`;
  const cached = wx.getStorageSync(cacheKey);

  if (cached && Date.now() - cached.time < 30 * 60 * 1000) {
    this.setData({ resorts: cached.data });
    return;
  }

  const result = await api.search(city);
  wx.setStorageSync(cacheKey, {
    data: result,
    time: Date.now()
  });
}
```

### 3. 图片优化
```javascript
// 使用懒加载
<image lazy-load src="{{src}}" />

// 压缩图片
// 使用CDN加速
// 指定图片大小
<image src="https://cdn.example.com/image?w=400&h=300" />
```

### 4. 列表优化
```javascript
// 虚拟列表
// 只渲染可见区域的item
// 使用recycle-view组件
```

---

## 🚀 部署检查清单

### 开发完成前
- [ ] 所有功能测试通过
- [ ] 多个城市测试通过
- [ ] 错误提示友好
- [ ] 加载状态完善
- [ ] 性能优化完成

### 上线前
- [ ] 配置服务器域名白名单
- [ ] 添加用户隐私协议
- [ ] 检查敏感词
- [ ] 优化首屏加载
- [ ] 压缩代码和图片
- [ ] 准备小程序截图和介绍

### 提交审核
- [ ] 小程序名称和描述
- [ ] 小程序头像（圆角）
- [ ] 小程序介绍文字
- [ ] 服务类目选择
- [ ] 资质证明（如需要）

---

## 📚 参考资源

### 官方文档
- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [高德地图API文档](https://lbs.amap.com/api/webservice/summary)

### 项目文档
- `SESSION_SUMMARY_2025-02-04.md` - 本次会话总结
- `API_KEY_GUIDE.md` - API Key申请指南
- `QUICKSTART_REAL_DATA.md` - 真实数据接入指南

---

**知识库版本**: v1.0
**最后更新**: 2025-02-04
**下次更新**: 继续开发后
