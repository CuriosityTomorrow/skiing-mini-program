/**
 * 高德地图配置文件
 *
 * 使用说明：
 * 1. 注册高德开放平台：https://lbs.amap.com/
 * 2. 创建应用并获取 Web服务 API Key
 * 3. 将 Key 填入下面的 AMAP_WEB_KEY
 * 4. 小程序发布时需要在微信公众平台配置服务器域名：
 *    - https://restapi.amap.com
 */

module.exports = {
  // 高德地图 Web服务 API Key
  AMAP_WEB_KEY: '41f98310392808752b5e9ea1e6bc4776',

  // 高德地图小程序 SDK Key（可选，如果使用小程序SDK）
  AMAP_MINI_KEY: '',

  // API 配置
  api: {
    // POI 搜索
    poiSearch: 'https://restapi.amap.com/v5/place/text',
    // 周边搜索
    poiAround: 'https://restapi.amap.com/v5/place/around',
    // 地理编码（地址转坐标）
    geocode: 'https://restapi.amap.com/v3/geocode/geo',
    // 逆地理编码（坐标转地址）
    regeocode: 'https://restapi.amap.com/v3/geocode/regeo',
    // 距离计算
    distance: 'https://restapi.amap.com/v3/distance',
    // 驾车路线规划
    driving: 'https://restapi.amap.com/v3/direction/driving',
    // 步行路线规划
    walking: 'https://restapi.amap.com/v3/direction/walking',
    // 骑行路线规划
    biking: 'https://restapi.amap.com/v3/direction/biking',
    // 天气查询
    weather: 'https://restapi.amap.com/v3/weather/weatherInfo'
  },

  // 滑雪场 POI 分类代码
  SKI_RESORT_TYPE: '080107',  // 体育休闲服务 > 运动场馆 > 滑雪场

  // 搜索配置
  search: {
    // 默认搜索半径（米）
    defaultRadius: 200000,  // 200公里
    // 每页显示数量
    pageSize: 50,
    // 缁存时间（毫秒）
    cacheTimeout: 30 * 60 * 1000  // 30分钟
  },

  // ✅ 已启用真实数据（改为true使用真实API）
  devMode: false
};
