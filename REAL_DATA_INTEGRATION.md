# 滑雪场小程序真实数据接入方案

> 本文档详细说明如何获取真实的滑雪场数据、用户定位和距离计算

## 📋 目录
1. [地图API选择](#地图api选择)
2. [获取真实滑雪场数据](#获取真实滑雪场数据)
3. [获取用户定位](#获取用户定位)
4. [距离计算](#距离计算)
5. [路线规划与交通信息](#路线规划与交通信息)
6. [完整实施步骤](#完整实施步骤)

---

## 🗺️ 地图API选择

### 推荐方案对比

| 特性 | 高德地图 | 腾讯地图 | 百度地图 |
|------|---------|---------|---------|
| **小程序支持** | ✅ 专门SDK | ✅ 原生支持 | ✅ 专门SDK |
| **POI数据** | ✅ 丰富（滑雪场分类：080107） | ✅ 丰富 | ✅ 丰富 |
| **路线规划** | ✅ 支持驾车/公交/步行/骑行 | ✅ 支持 | ✅ 支持 |
| **距离计算** | ✅ 直线距离/驾车距离 | ✅ 直线距离/驾车距离 | ✅ 支持 |
| **免费额度** | ✅ 个人开发者30万次/天 | ✅ 个人开发者免费 | ✅ 免费额度较高 |
| **文档质量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **推荐度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

### 🏆 最终推荐：高德地图

**理由：**
1. 微信小程序有专门的SDK（`amap-wx.js`）
2. POI分类中明确包含滑雪场（分类代码：080107）
3. 文档详细，社区活跃
4. 免费额度足够（个人开发者30万次/天）
5. 提供周边搜索、关键词搜索、路线规划等完整功能

---

## 🎿 获取真实滑雪场数据

### 方案一：高德地图POI搜索（推荐）

#### 1. 注册高德开放平台账号

```
官网：https://lbs.amap.com/
步骤：
1. 注册开发者账号
2. 进入控制台
3. 创建新应用
4. 添加 key，选择「微信小程序」平台
```

#### 2. 使用POI搜索API

**API地址：** `https://restapi.amap.com/v5/place/text`

**请求参数：**
```javascript
{
  key: '你的API Key',
  keywords: '滑雪场',
  types: '080107',  // 滑雪场分类代码
  city: '全国',      // 搜索范围
  offset: 20,        // 每页数量
  page: 1            // 页码
}
```

**返回数据示例：**
```json
{
  "status": "1",
  "info": "OK",
  "pois": [
    {
      "id": "B000A7BD6C",
      "name": "万龙滑雪场",
      "type": "体育休闲服务;运动场馆;滑雪场",
      "typecode": "080107",
      "address": "张家口市崇礼区四台嘴乡",
      "location": "115.7697,40.9515",
      "tel": "0313-4618888",
      "distance": "12453.5"  // 距离搜索点的距离（米）
    }
  ]
}
```

#### 3. 搜索所有滑雪场的代码示例

```javascript
// utils/amap.js
const AMAP_KEY = '你的高德API Key';

/**
 * 搜索滑雪场
 * @param {string} keywords - 搜索关键词（如：滑雪场）
 * @param {string} city - 城市名称（如：北京）
 * @param {string} location - 中心点坐标（经度,纬度）
 */
async function searchSkiResorts(keywords = '滑雪场', city = '全国', location = '') {
  try {
    const url = `https://restapi.amap.com/v5/place/text`;
    const params = {
      key: AMAP_KEY,
      keywords: keywords,
      types: '080107',  // 滑雪场分类
      city: city,
      citylimit: false,  // 不限制城市
      offset: 50,        // 每页50条
      page: 1,
      extensions: 'all'  // 返回详细信息
    };

    if (location) {
      params.location = location;
    }

    const response = await wx.request({
      url: url,
      data: params
    });

    if (response.data.status === '1') {
      return response.data.pois;
    } else {
      throw new Error(response.data.info);
    }
  } catch (error) {
    console.error('搜索滑雪场失败', error);
    throw error;
  }
}

/**
 * 周边搜索滑雪场
 * @param {string} location - 当前位置（经度,纬度）
 * @param {number} radius - 搜索半径（米），默认50000米（50公里）
 */
async function searchNearbySkiResorts(location, radius = 50000) {
  try {
    const url = `https://restapi.amap.com/v5/place/around`;
    const params = {
      key: AMAP_KEY,
      keywords: '滑雪场',
      types: '080107',
      location: location,
      radius: radius,
      offset: 50
    };

    const response = await wx.request({
      url: url,
      data: params
    });

    if (response.data.status === '1') {
      return response.data.pois;
    } else {
      throw new Error(response.data.info);
    }
  } catch (error) {
    console.error('周边搜索失败', error);
    throw error;
  }
}

module.exports = {
  searchSkiResorts,
  searchNearbySkiResorts
};
```

### 方案二：使用高德地图小程序SDK

#### 1. 下载SDK

```bash
# 下载地址
https://lbs.amap.com/api/wx/download

# 或使用npm安装
npm install amap-wx
```

#### 2. 配置小程序

```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于搜索附近的滑雪场"
    }
  },
  "requiredPrivateInfos": [
    "getLocation",
    "chooseLocation"
  ]
}
```

#### 3. 使用SDK搜索

```javascript
// pages/index/index.js
const amapFile = require('../../libs/amap-wx.js');

Page({
  data: {
    skiResorts: []
  },

  onLoad() {
    // 初始化高德地图SDK
    this.amap = new amapFile.AMapWX({
      key: '你的高德API Key'
    });

    // 获取用户位置后搜索
    this.getUserLocationAndSearch();
  },

  // 获取位置并搜索周边滑雪场
  getUserLocationAndSearch() {
    this.amap.getRegeo({
      success: (data) => {
        const { longitude, latitude } = data[0];
        const location = `${longitude},${latitude}`;

        // 搜索周边滑雪场
        this.searchNearby(location);
      },
      fail: (error) => {
        console.error('获取位置失败', error);
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      }
    });
  },

  // 搜索周边滑雪场
  searchNearby(location) {
    this.amap.getPoiAroundSearch({
      keywords: '滑雪场',
      location: location,
      radius: 100000,  // 100公里
      success: (data) => {
        this.setData({
          skiResorts: data.markers
        });
      },
      fail: (error) => {
        console.error('搜索失败', error);
      }
    });
  }
});
```

---

## 📍 获取用户定位

### 方法一：使用微信原生API（推荐）

```javascript
// app.js 或页面js
Page({
  data: {
    userLocation: null
  },

  // 获取用户位置
  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',  // 返回国测局坐标
      isHighAccuracy: true,  // 开启高精度定位
      highAccuracyExpireTime: 3000,  // 高精度定位超时时间
      success: (res) => {
        const { latitude, longitude } = res;

        this.setData({
          userLocation: {
            latitude,
            longitude
          }
        });

        console.log('获取位置成功', latitude, longitude);
      },
      fail: (error) => {
        console.error('获取位置失败', error);

        // 引导用户开启定位权限
        wx.showModal({
          title: '定位权限',
          content: '需要获取您的位置信息来推荐附近的滑雪场',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting();
            }
          }
        });
      }
    });
  },

  // 获取逆地理编码（将坐标转换为城市名称）
  getAddress(latitude, longitude) {
    // 使用高德地图SDK
    const amapFile = require('../../libs/amap-wx.js');
    const amap = new amapFile.AMapWX({
      key: '你的高德API Key'
    });

    amap.getRegeo({
      location: `${longitude},${latitude}`,
      success: (data) => {
        const { formattedAddress, regeocode } = data[0];
        const { city, province, adcode } = regeocode.addressComponent;

        console.log('当前城市：', city, province);

        this.setData({
          currentCity: city,
          currentProvince: province
        });
      }
    });
  }
});
```

### 注意事项（2025年最新审核要求）

1. **必须配置隐私协议**
2. **必须在app.json中声明用途**
3. **距离误差需控制在50米内**
4. **需要详细说明业务场景**

```json
// app.json
{
  "permission": {
    "scope.userLocation": {
      "desc": "用于搜索附近的滑雪场并计算距离"
    }
  },
  "requiredPrivateInfos": [
    "getLocation",
    "chooseLocation"
  ]
}
```

---

## 📏 距离计算

### 方法一：高德地图距离计算API（推荐）

**API地址：** `https://restapi.amap.com/v3/distance`

**请求参数：**
```javascript
{
  key: '你的API Key',
  origins: '116.481028,39.989643',  // 起点坐标
  destination: '115.7697,40.9515',    // 终点坐标
  type: '1'                           // 0=直线距离，1=驾车距离
}
```

**代码示例：**
```javascript
// utils/distance.js
const AMAP_KEY = '你的高德API Key';

/**
 * 计算两点间距离
 * @param {string} origin - 起点坐标（经度,纬度）
 * @param {string} destination - 终点坐标（经度,纬度）
 * @param {number} type - 0=直线距离，1=驾车距离，3=步行距离
 */
async function calculateDistance(origin, destination, type = 1) {
  try {
    const url = `https://restapi.amap.com/v3/distance`;

    const response = await wx.request({
      url: url,
      data: {
        key: AMAP_KEY,
        origins: origin,
        destination: destination,
        type: type
      }
    });

    if (response.data.status === '1') {
      const results = response.data.results;
      if (results && results.length > 0) {
        // 返回距离（米）和时间（秒）
        return {
          distance: results[0].distance,
          duration: results[0].duration
        };
      }
    }

    return null;
  } catch (error) {
    console.error('计算距离失败', error);
    throw error;
  }
}

/**
 * 批量计算距离
 * @param {string} origin - 起点坐标
 * @param {array} destinations - 终点坐标数组
 */
async function calculateBatchDistance(origin, destinations) {
  const promises = destinations.map(dest =>
    calculateDistance(origin, dest)
  );

  return await Promise.all(promises);
}

module.exports = {
  calculateDistance,
  calculateBatchDistance
};
```

### 方法二：Haversine公式（直线距离）

```javascript
// utils/haversine.js

/**
 * 计算两点间的球面距离（Haversine公式）
 * @param {number} lat1 - 起点纬度
 * @param {number} lon1 - 起点经度
 * @param {number} lat2 - 终点纬度
 * @param {number} lon2 - 终点经度
 * @returns {number} 距离（公里）
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球半径（公里）
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * 格式化距离显示
 * @param {number} meters - 距离（米）
 * @returns {string} 格式化后的距离
 */
function formatDistance(meters) {
  if (meters < 1000) {
    return Math.round(meters) + 'm';
  } else {
    return (meters / 1000).toFixed(1) + 'km';
  }
}

module.exports = {
  haversineDistance,
  formatDistance
};
```

---

## 🚗 路线规划与交通信息

### 使用高德路线规划API

**API地址：** `https://restapi.amap.com/v3/direction/driving`

**代码示例：**
```javascript
// utils/route.js
const AMAP_KEY = '你的高德API Key';

/**
 * 获取驾车路线
 * @param {string} origin - 起点坐标（经度,纬度）
 * @param {string} destination - 终点坐标
 */
async function getDrivingRoute(origin, destination) {
  try {
    const url = `https://restapi.amap.com/v3/direction/driving`;

    const response = await wx.request({
      url: url,
      data: {
        key: AMAP_KEY,
        origin: origin,
        destination: destination,
        strategy: 10,  // 路径规划策略，10=速度优先
        extensions: 'all'  // 返回详细信息
      }
    });

    if (response.data.status === '1') {
      const route = response.data.route;
      const steps = route.paths[0].steps;

      return {
        distance: route.paths[0].distance,    // 总距离（米）
        duration: route.paths[0].duration,     // 总时间（秒）
        tolls: route.paths[0].tolls,          // 过路费（元）
        toll_distance: route.paths[0].toll_distance,  // 收费里程
        steps: steps  // 详细步骤
      };
    }

    return null;
  } catch (error) {
    console.error('获取路线失败', error);
    throw error;
  }
}

/**
 * 获取多种出行方式对比
 */
async function getMultiRoute(origin, destination) {
  try {
    const results = {};

    // 驾车
    results.driving = await getDrivingRoute(origin, destination);

    // 骑行
    results.riding = await getRidingRoute(origin, destination);

    // 步行（短距离）
    const distance = await calculateDistance(origin, destination);
    if (distance < 5000) {
      results.walking = await getWalkingRoute(origin, destination);
    }

    return results;
  } catch (error) {
    console.error('获取路线失败', error);
    throw error;
  }
}

module.exports = {
  getDrivingRoute,
  getMultiRoute
};
```

---

## 🎯 完整实施步骤

### 第一步：注册高德开放平台

```
1. 访问：https://lbs.amap.com/
2. 注册/登录账号
3. 进入「应用管理」→「我的应用」→「创建新应用」
4. 添加 Key，选择「微信小程序」
5. 记录下生成的 Key
```

### 第二步：配置小程序

```json
// project.config.json
{
  "appid": "你的小程序AppID",
  "projectname": "滑雪场助手",
  "libVersion": "2.19.4",
  "compileType": "miniprogram"
}

// app.json
{
  "permission": {
    "scope.userLocation": {
      "desc": "用于搜索附近的滑雪场并计算距离"
    }
  },
  "requiredPrivateInfos": [
    "getLocation",
    "chooseLocation"
  ]
}
```

### 第三步：集成高德地图SDK

```bash
# 1. 下载SDK
wget https://lbs.amap.com/api/download/sdk/download?key=service&name=amap-wx

# 2. 解压到项目的 libs 目录
# 项目结构：
# ├── libs/
# │   └── amap-wx.js
# ├── utils/
# │   ├── amap.js
# │   └── distance.js
# └── pages/
```

### 第四步：实现数据获取逻辑

```javascript
// utils/skiData.js
const amapFile = require('../libs/amap-wx.js');
const { haversineDistance, formatDistance } = require('./distance');

const AMAP_KEY = '你的高德API Key';

class SkiDataManager {
  constructor() {
    this.amap = new amapFile.AMapWX({
      key: AMAP_KEY
    });
    this.cache = new Map();  // 缓存滑雪场数据
    this.cacheTimeout = 30 * 60 * 1000;  // 30分钟缓存
  }

  /**
   * 获取用户位置
   */
  async getUserLocation() {
    return new Promise((resolve, reject) => {
      this.amap.getRegeo({
        success: (data) => {
          const { longitude, latitude } = data[0];
          resolve({ longitude, latitude });
        },
        fail: reject
      });
    });
  }

  /**
   * 搜索附近的滑雪场
   */
  async searchNearbySkiResorts(location) {
    return new Promise((resolve, reject) => {
      this.amap.getPoiAroundSearch({
        keywords: '滑雪场',
        types: '080107',
        location: location,
        radius: 200000,  // 200公里
        offset: 50,
        success: (data) => {
          const resorts = this.formatSkiResorts(data.markers, location);
          resolve(resorts);
        },
        fail: reject
      });
    });
  }

  /**
   * 格式化滑雪场数据
   */
  formatSkiResorts(markers, userLocation) {
    return markers.map(marker => {
      const [longitude, latitude] = marker.location.split(',');

      // 计算距离
      const distance = haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(latitude),
        parseFloat(longitude)
      );

      return {
        id: marker.id,
        name: marker.name,
        address: marker.address,
        city: marker.cityname || marker.adname,
        province: marker.pname,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        telephone: marker.tel,
        type: marker.type === '室内滑雪场' ? 'indoor' : 'outdoor',
        distance: Math.round(distance * 1000),  // 转换为米
        distanceText: formatDistance(distance * 1000),
        // 默认信息，实际应该从其他接口获取
        price: this.estimatePrice(distance),
        rating: 4.5,
        reviewCount: 0
      };
    }).sort((a, b) => a.distance - b.distance);  // 按距离排序
  }

  /**
   * 估算价格（基于距离）
   */
  estimatePrice(distance) {
    // 这是一个简单的估算，实际应该从滑雪场获取
    if (distance < 100) {
      return Math.round(500 + Math.random() * 300);
    } else if (distance < 500) {
      return Math.round(800 + Math.random() * 400);
    } else {
      return Math.round(1000 + Math.random() * 500);
    }
  }

  /**
   * 获取路线规划
   */
  async getRoute(origin, destination) {
    const url = `https://restapi.amap.com/v3/direction/driving`;

    const response = await wx.request({
      url: url,
      data: {
        key: AMAP_KEY,
        origin: origin,
        destination: destination,
        strategy: 10,
        extensions: 'base'
      }
    });

    if (response.data.status === '1') {
      const path = response.data.route.paths[0];
      return {
        distance: path.distance,
        duration: path.duration,
        distanceText: formatDistance(path.distance),
        durationText: this.formatDuration(path.duration)
      };
    }

    return null;
  }

  /**
   * 格式化时间
   */
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    } else {
      return `${minutes}分钟`;
    }
  }
}

module.exports = SkiDataManager;
```

### 第五步：在页面中使用

```javascript
// pages/index/index.js
const SkiDataManager = require('../../utils/skiData.js');

Page({
  data: {
    departureCity: '',
    userLocation: null,
    skiResorts: [],
    loading: false
  },

  onLoad() {
    this.dataManager = new SkiDataManager();
    this.getUserLocation();
  },

  // 获取用户位置
  async getUserLocation() {
    this.setData({ loading: true });

    try {
      const location = await this.dataManager.getUserLocation();

      this.setData({
        userLocation: location
      });

      // 获取逆地理编码获取城市名
      this.getCityName(location);

      // 搜索周边滑雪场
      await this.searchNearbyResorts(location);
    } catch (error) {
      console.error('获取位置失败', error);
      wx.showToast({
        title: '获取位置失败，请检查定位权限',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 获取城市名称
  getCityName(location) {
    this.dataManager.amap.getRegeo({
      location: `${location.longitude},${location.latitude}`,
      success: (data) => {
        const city = data[0].regeocode.addressComponent.city;
        this.setData({
          departureCity: city
        });
      }
    });
  },

  // 搜索周边滑雪场
  async searchNearbyResorts(location) {
    try {
      const resorts = await this.dataManager.searchNearbySkiResorts(
        `${location.longitude},${location.latitude}`
      );

      this.setData({
        skiResorts: resorts
      });
    } catch (error) {
      console.error('搜索失败', error);
    }
  },

  // 输入出发城市
  async onDepartureInput(e) {
    const city = e.detail.value;
    this.setData({ departureCity: city });

    // 使用高德地理编码API获取城市坐标
    this.getCityCoordinates(city);
  },

  // 获取城市坐标
  async getCityCoordinates(city) {
    try {
      const url = `https://restapi.amap.com/v3/geocode/geo`;

      const response = await wx.request({
        url: url,
        data: {
          key: '你的高德API Key',
          address: city,
          city: city
        }
      });

      if (response.data.status === '1' && response.data.geocodes.length > 0) {
        const location = response.data.geocodes[0].location.split(',');

        await this.searchNearbyResorts({
          longitude: parseFloat(location[0]),
          latitude: parseFloat(location[1])
        });
      }
    } catch (error) {
      console.error('获取城市坐标失败', error);
    }
  }
});
```

---

## 💰 成本说明

### 高德地图API免费额度

| 接口类型 | 免费额度/天 | 个人开发者 |
|---------|------------|----------|
| Web服务API | 30万次 | 免费 |
| JavaScript SDK | 无限制 | 免费 |
| 小程序SDK | 无限制 | 免费 |

**对于滑雪场小程序：**
- 日活1万用户 × 平均10次请求 = 10万次/天 ✅ 免费额度内
- 即使日活10万，也在免费范围内

---

## ⚠️ 注意事项

### 1. 隐私协议
必须在小程序中配置用户隐私保护指引

### 2. 定位权限审核
微信对定位权限审核较严，需要：
- 详细说明使用场景
- 提供隐私协议
- 距离误差控制在50米内

### 3. 数据缓存
建议实现数据缓存，避免重复请求：
- 滑雪场数据缓存30分钟
- 路线数据缓存5分钟

### 4. 错误处理
- 网络请求失败的处理
- 定位失败的引导
- 数据为空的提示

---

## 📚 参考文档

- [高德地图微信小程序SDK](https://lbs.amap.com/api/wx/summary)
- [高德地图POI搜索API](https://lbs.amap.com/api/webservice/guide/api/search)
- [高德地图路线规划API](https://lbs.amap.com/api/webservice/guide/api/direction)
- [微信小程序定位API](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html)
- [微信社区 - 定位权限审核](https://developers.weixin.qq.com/community/develop/doc)

---

## 🚀 下一步

1. 注册高德开放平台账号
2. 创建应用并获取 Key
3. 按照本文档集成 SDK
4. 测试数据获取功能
5. 优化用户体验

祝你开发顺利！🎿
