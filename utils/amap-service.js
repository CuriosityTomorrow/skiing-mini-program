/**
 * 高德地图 API 封装
 * 提供滑雪场相关的所有地图服务
 */

const config = require('../config/amap.js');
const detector = require('./ski-resort-detector.js');

class AmapService {
  constructor() {
    this.cache = new Map();  // 数据缓存
  }

  /**
   * 通用请求方法
   */
  async request(apiUrl, params = {}) {
    try {
      // 添加 Key
      params.key = config.AMAP_WEB_KEY;

      const response = await wx.request({
        url: apiUrl,
        data: params,
        method: 'GET'
      });

      if (response.data.status === '1') {
        return response.data;
      } else {
        throw new Error(response.data.info || '请求失败');
      }
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }

  /**
   * POI 文本搜索 - 搜索滑雪场（智能多关键词）
   * @param {string} keywords - 搜索关键词（可选，默认使用多关键词）
   * @param {string} city - 城市名称
   * @param {number} pageSize - 每页数量
   * @param {number} pageIndex - 页码
   */
  async searchPoi(keywords = null, city = '全国', pageSize = 50, pageIndex = 1) {
    try {
      const allPois = new Map(); // 使用Map去重（基于id）

      // 如果指定了关键词，直接搜索
      if (keywords) {
        const data = await this.request(config.api.poiSearch, {
          keywords: keywords,
          city: city,
          citylimit: true,
          offset: pageSize,
          page: pageIndex,
          extensions: 'all'
        });

        if (data.pois) {
          data.pois.forEach(poi => allPois.set(poi.id, poi));
        }
      } else {
        // 使用多关键词搜索
        const searchKeywords = detector.getSearchKeywords(city);

        for (const keyword of searchKeywords) {
          try {
            const data = await this.request(config.api.poiSearch, {
              keywords: keyword,
              city: city,
              citylimit: true,
              offset: 20, // 每个关键词少取一些
              page: 1,
              extensions: 'all'
            });

            if (data.pois) {
              data.pois.forEach(poi => allPois.set(poi.id, poi));
            }
          } catch (error) {
            // 单个关键词失败不影响其他
            console.warn(`关键词"${keyword}"搜索失败:`, error.message);
          }
        }
      }

      // 转换回数组
      const poisArray = Array.from(allPois.values());

      // 使用智能检测筛选和去重
      const filtered = detector.filterSkiResorts(poisArray, {
        minConfidence: 0.5,
        removeDuplicates: true,
        verbose: true
      });

      console.log(`搜索完成：原始${filtered.summary.total}条，筛选后${filtered.summary.final}条`);

      return {
        pois: filtered.filtered,
        count: filtered.summary.final,
        total: filtered.summary.total,
        details: filtered
      };
    } catch (error) {
      console.error('POI搜索失败:', error);
      throw error;
    }
  }

  /**
   * 周边搜索 - 搜索附近的滑雪场（智能多关键词）
   * @param {string} location - 中心点坐标（经度,纬度）
   * @param {number} radius - 搜索半径（米）
   * @param {number} pageSize - 每页数量
   */
  async searchAround(location, radius = 200000, pageSize = 50) {
    try {
      const allPois = new Map();
      const searchKeywords = detector.getSearchKeywords();

      for (const keyword of searchKeywords) {
        try {
          const data = await this.request(config.api.poiAround, {
            keywords: keyword,
            location: location,
            radius: radius,
            offset: 20,
            extensions: 'all'
          });

          if (data.pois) {
            data.pois.forEach(poi => allPois.set(poi.id, poi));
          }
        } catch (error) {
          console.warn(`周边搜索关键词"${keyword}"失败:`, error.message);
        }
      }

      const poisArray = Array.from(allPois.values());

      // 智能检测和去重
      const filtered = detector.filterSkiResorts(poisArray, {
        minConfidence: 0.5,
        removeDuplicates: true
      });

      return {
        pois: filtered.filtered,
        count: filtered.summary.final,
        details: filtered
      };
    } catch (error) {
      console.error('周边搜索失败:', error);
      throw error;
    }
  }

  /**
   * 地理编码 - 地址转坐标
   * @param {string} address - 地址（如：北京市）
   * @param {string} city - 城市
   */
  async geocode(address, city = '') {
    try {
      const data = await this.request(config.api.geocode, {
        address: address,
        city: city
      });

      if (data.geocodes && data.geocodes.length > 0) {
        const geocode = data.geocodes[0];
        const [longitude, latitude] = geocode.location.split(',');

        return {
          address: geocode.formatted_address,
          province: geocode.province,
          city: geocode.city,
          district: geocode.district,
          longitude: parseFloat(longitude),
          latitude: parseFloat(latitude),
          level: geocode.level
        };
      }

      return null;
    } catch (error) {
      console.error('地理编码失败:', error);
      throw error;
    }
  }

  /**
   * 逆地理编码 - 坐标转地址
   * @param {number} longitude - 经度
   * @param {number} latitude - 纬度
   */
  async regeocode(longitude, latitude) {
    try {
      const location = `${longitude},${latitude}`;
      const data = await this.request(config.api.regeocode, {
        location: location,
        extensions: 'all'  // 返回详细信息
      });

      if (data.regeocode) {
        const addressComponent = data.regeocode.addressComponent;

        return {
          formattedAddress: data.regeocode.formatted_address,
          province: addressComponent.province,
          city: addressComponent.city,
          district: addressComponent.district,
          township: addressComponent.township,
          street: addressComponent.streetNumber ? addressComponent.streetNumber.street : '',
          adcode: addressComponent.adcode,
          citycode: addressComponent.citycode
        };
      }

      return null;
    } catch (error) {
      console.error('逆地理编码失败:', error);
      throw error;
    }
  }

  /**
   * 距离计算 - 计算两点间的驾车距离
   * @param {string} origin - 起点坐标（经度,纬度）
   * @param {string} destination - 终点坐标（经度,纬度）
   * @param {number} type - 0=直线距离，1=驾车距离，3=步行距离
   */
  async calculateDistance(origin, destination, type = 1) {
    try {
      const data = await this.request(config.api.distance, {
        origins: origin,
        destination: destination,
        type: type
      });

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          distance: result.distance,    // 距离（米）
          duration: result.duration     // 时间（秒）
        };
      }

      return null;
    } catch (error) {
      console.error('距离计算失败:', error);
      throw error;
    }
  }

  /**
   * 驾车路线规划
   * @param {string} origin - 起点坐标（经度,纬度）
   * @param {string} destination - 终点坐标（经度,纬度）
   * @param {number} strategy - 路径规划策略
   *   0=速度优先
   *   1=费用优先
   *   2=距离优先
   *   10=不走高速
   */
  async getDrivingRoute(origin, destination, strategy = 0) {
    try {
      const data = await this.request(config.api.driving, {
        origin: origin,
        destination: destination,
        strategy: strategy,
        extensions: 'all'  // 返回详细信息
      });

      if (data.route && data.route.paths && data.route.paths.length > 0) {
        const path = data.route.paths[0];

        return {
          distance: path.distance,           // 总距离（米）
          duration: path.duration,            // 总时间（秒）
          tolls: path.tolls,                  // 过路费（元）
          tollDistance: path.toll_distance,  // 收费里程（米）
          steps: this.formatRouteSteps(path.steps)
        };
      }

      return null;
    } catch (error) {
      console.error('驾车路线规划失败:', error);
      throw error;
    }
  }

  /**
   * 格式化路线步骤
   */
  formatRouteSteps(steps) {
    if (!steps || steps.length === 0) return [];

    return steps.map(step => ({
      instruction: step.instruction,
      distance: step.distance,
      duration: step.duration,
      action: step.action,
      road: step.road
    }));
  }

  /**
   * 批量计算距离
   * @param {string} origin - 起点坐标
   * @param {Array} destinations - 终点坐标数组
   */
  async calculateBatchDistance(origin, destinations) {
    try {
      // 高德距离计算API支持批量查询
      const destStr = destinations.join('|');

      const data = await this.request(config.api.distance, {
        origins: origin,
        destination: destStr,
        type: 1
      });

      if (data.results) {
        return data.results.map(result => ({
          distance: result.distance,
          duration: result.duration
        }));
      }

      return [];
    } catch (error) {
      console.error('批量距离计算失败:', error);
      throw error;
    }
  }

  /**
   * 格式化距离显示
   */
  formatDistance(meters) {
    if (meters < 1000) {
      return Math.round(meters) + 'm';
    } else {
      return (meters / 1000).toFixed(1) + 'km';
    }
  }

  /**
   * 格式化时间显示
   */
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    } else if (minutes > 0) {
      return `${minutes}分钟`;
    } else {
      return `${seconds}秒`;
    }
  }

  /**
   * 缓存数据
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * 获取缓存数据
   */
  getCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const { data, timestamp } = cached;
    const isExpired = Date.now() - timestamp > config.search.cacheTimeout;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return data;
  }

  /**
   * 清除缓存
   */
  clearCache(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// 创建单例
const amapService = new AmapService();

module.exports = amapService;
