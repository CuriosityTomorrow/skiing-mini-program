/**
 * 滑雪场数据管理器
 * 整合高德地图API，提供滑雪场数据的完整解决方案
 */

const amapService = require('./amap-service.js');

/**
 * Haversine公式计算两点间的球面距离（直线距离）
 * 当API调用失败时使用此方法作为备用
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 滑雪场数据管理类
 */
class SkiResortManager {
  constructor() {
    this.userLocation = null;  // 用户当前位置
    this.departureCity = null; // 出发城市
    this.resortsCache = null;  // 滑雪场缓存
  }

  /**
   * 设置用户位置
   */
  setUserLocation(location) {
    this.userLocation = location;
  }

  /**
   * 设置出发城市
   */
  setDepartureCity(city) {
    this.departureCity = city;
  }

  /**
   * 搜索全国的滑雪场
   */
  async searchAllSkiResorts() {
    try {
      const result = await amapService.searchPoi('滑雪场', '全国', 100);

      const resorts = result.pois.map(poi => this.formatPoiToResort(poi));

      return {
        resorts,
        total: result.count
      };
    } catch (error) {
      console.error('搜索滑雪场失败:', error);
      throw error;
    }
  }

  /**
   * 搜索指定城市的滑雪场
   */
  async searchSkiResortsByCity(city) {
    try {
      // 先获取城市坐标
      const geoData = await amapService.geocode(city);

      if (!geoData) {
        throw new Error('找不到该城市');
      }

      const location = `${geoData.longitude},${geoData.latitude}`;

      // 搜索周边滑雪场
      const result = await amapService.searchAround(location, 200000, 50);

      const resorts = result.pois
        .map(poi => this.formatPoiToResort(poi, geoData))
        .sort((a, b) => a.distance - b.distance);

      return {
        resorts,
        total: result.count,
        city: geoData.city,
        province: geoData.province
      };
    } catch (error) {
      console.error('搜索城市滑雪场失败:', error);
      throw error;
    }
  }

  /**
   * 搜索附近的滑雪场（基于用户位置）
   */
  async searchNearbySkiResorts(location, radius = 200000) {
    try {
      const result = await amapService.searchAround(location, radius, 50);

      const resorts = result.pois
        .map(poi => this.formatPoiToResort(poi, { longitude: parseFloat(location.split(',')[0]), latitude: parseFloat(location.split(',')[1]) }))
        .sort((a, b) => a.distance - b.distance);

      return {
        resorts,
        total: result.count
      };
    } catch (error) {
      console.error('搜索附近滑雪场失败:', error);
      throw error;
    }
  }

  /**
   * 格式化 POI 数据为滑雪场数据
   */
  formatPoiToResort(poi, originLocation = null) {
    const [longitude, latitude] = poi.location.split(',');

    let distance = 0;
    let transportation = [];

    // 如果有起点位置，计算距离和交通方式
    if (originLocation) {
      // 计算直线距离（备用）
      distance = haversineDistance(
        originLocation.latitude,
        originLocation.longitude,
        parseFloat(latitude),
        parseFloat(longitude)
      ) * 1000; // 转换为米

      // 尝试获取驾车路线
      this.getTransportation(originLocation, { longitude: parseFloat(longitude), latitude: parseFloat(latitude) })
        .then(trans => {
          transportation = trans;
        })
        .catch(() => {
          // 失败时使用估算
          transportation = this.estimateTransportation(distance);
        });
    }

    // 判断是室内还是室外
    const type = poi.type && poi.type.includes('室内') ? 'indoor' : 'outdoor';

    return {
      id: poi.id,
      name: poi.name,
      nameEn: '', // 高德没有英文名，需要后续补充
      city: poi.cityname || poi.adname,
      province: poi.pname,
      country: '中国', // 高德主要覆盖国内
      type: type,

      // 位置信息
      address: poi.address || '',
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),

      // 距离
      distance: Math.round(distance),

      // 联系方式
      telephone: poi.tel || '',
      website: poi.website || '',

      // 基础设施
      facilities: this.parseFacilities(poi),

      // 交通方式（异步填充）
      transportation: transportation,

      // 默认信息（需要从其他数据源补充）
      elevation: 0,
      trails: 0,
      trailsDistribution: null,
      price: this.estimatePrice(distance),
      priceUnit: type === 'indoor' ? '4小时' : '天',
      season: type === 'indoor' ? '全年开放' : '11月-3月',
      rating: 4.5,
      reviewCount: 0,

      // 图片（高德POI不提供图片，需要补充）
      images: [
        'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800'
      ],

      // 特色
      features: [],
      description: poi.address || '',

      // 原始POI数据
      poi: poi
    };
  }

  /**
   * 解析设施信息
   */
  parseFacilities(poi) {
    const facilities = [];

    // 基于POI名称判断
    if (poi.name && poi.name.includes('室内')) {
      facilities.push('魔毯');
    } else {
      facilities.push('缆车');
    }

    // 基本设施
    facilities.push('餐厅', '租赁', '教练');

    return facilities;
  }

  /**
   * 估算价格（基于距离和类型）
   */
  estimatePrice(distance) {
    const distanceKm = distance / 1000;

    if (distanceKm < 100) {
      return Math.round(500 + Math.random() * 300);
    } else if (distanceKm < 500) {
      return Math.round(800 + Math.random() * 400);
    } else if (distanceKm < 2000) {
      return Math.round(1200 + Math.random() * 500);
    } else {
      return Math.round(1500 + Math.random() * 500);
    }
  }

  /**
   * 获取交通方式（真实API）
   */
  async getTransportation(origin, destination) {
    try {
      const route = await amapService.getDrivingRoute(
        `${origin.longitude},${origin.latitude}`,
        `${destination.longitude},${destination.latitude}`
      );

      if (route) {
        return [
          {
            type: '自驾',
            duration: amapService.formatDuration(route.duration),
            distance: amapService.formatDistance(route.distance),
            detail: route.tolls ? `过路费${route.tolls}元` : '免费'
          }
        ];
      }

      // 备用：直线距离估算
      const distance = haversineDistance(
        origin.latitude,
        origin.longitude,
        destination.latitude,
        destination.longitude
      ) * 1000;

      return this.estimateTransportation(distance);
    } catch (error) {
      console.error('获取交通方式失败，使用估算:', error);
      const distance = haversineDistance(
        origin.latitude,
        origin.longitude,
        destination.latitude,
        destination.longitude
      ) * 1000;

      return this.estimateTransportation(distance);
    }
  }

  /**
   * 估算交通方式（备用方案）
   */
  estimateTransportation(distance) {
    const distanceKm = distance / 1000;
    const transports = [];

    // 自驾
    const drivingHours = Math.ceil(distanceKm / 80);
    if (drivingHours > 0) {
      transports.push({
        type: '自驾',
        duration: drivingHours > 24 ? `${Math.floor(drivingHours / 24)}天${drivingHours % 24}小时` : `${drivingHours}小时`,
        detail: '约' + amapService.formatDistance(distance)
      });
    }

    // 火车（中长距离）
    if (distanceKm > 100 && distanceKm < 2000) {
      const trainHours = Math.ceil(distanceKm / 150);
      transports.push({
        type: '高铁',
        duration: trainHours > 24 ? `${Math.floor(trainHours / 24)}天${trainHours % 24}小时` : `${trainHours}小时`,
        detail: '需中转'
      });
    }

    // 飞机（长距离）
    if (distanceKm > 500) {
      const flightHours = Math.ceil(distanceKm / 800) + 1; // 加上候机时间
      transports.push({
        type: '飞机',
        duration: flightHours > 24 ? `${Math.floor(flightHours / 24)}天${flightHours % 24}小时` : `${flightHours}小时`,
        detail: '含候机时间'
      });
    }

    return transports;
  }

  /**
   * 根据出发城市搜索并排序滑雪场
   */
  async searchFromCity(cityName) {
    try {
      // 1. 获取城市坐标
      const geoData = await amapService.geocode(cityName);

      if (!geoData) {
        throw new Error('找不到该城市');
      }

      // 2. 搜索周边滑雪场
      const result = await this.searchSkiResortsByCity(geoData.city);

      return {
        resorts: result.resorts,
        city: result.city,
        province: result.province
      };
    } catch (error) {
      console.error('从城市搜索失败:', error);
      throw error;
    }
  }

  /**
   * 获取滑雪场详情
   */
  async getResortDetail(resortId) {
    // 从缓存中查找
    if (this.resortsCache) {
      const resort = this.resortsCache.find(r => r.id === resortId);
      if (resort) {
        return resort;
      }
    }

    // 如果缓存中没有，可以调用POI详情接口
    // 这里暂时返回空，需要后续实现
    return null;
  }

  /**
   * 搜索并排序滑雪场
   */
  async searchAndSort(params) {
    const {
      city = null,
      location = null,
      radius = 200000,
      keyword = '滑雪场',
      sortBy = 'distance' // distance, rating
    } = params;

    let result;

    // 根据搜索方式选择API
    if (location) {
      result = await this.searchNearbySkiResorts(location, radius);
    } else if (city) {
      result = await this.searchSkiResortsByCity(city);
    } else {
      result = await this.searchAllSkiResorts();
    }

    // 关键词筛选
    let resorts = result.resorts;
    if (keyword && keyword !== '滑雪场') {
      resorts = resorts.filter(r =>
        r.name.includes(keyword) ||
        r.city.includes(keyword) ||
        r.address.includes(keyword)
      );
    }

    // 排序
    if (sortBy === 'distance') {
      resorts.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      resorts.sort((a, b) => b.rating - a.rating);
    }

    // 缓存结果
    this.resortsCache = resorts;

    return {
      resorts,
      total: result.total
    };
  }
}

// 创建单例
const skiResortManager = new SkiResortManager();

module.exports = skiResortManager;
