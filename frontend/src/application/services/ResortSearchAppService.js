import { ResortSortStrategy } from '../../domain/resort/strategies/ResortSortStrategy.js'
import { AmapPoiService } from '../../infrastructure/amap/AmapPoiService.js'

/**
 * 滑雪场搜索应用服务
 * 整合高德API、缓存、排序等逻辑
 */
export class ResortSearchAppService {
  constructor() {
    this.sortStrategy = new ResortSortStrategy()
    this.amapService = new AmapPoiService()
    this.cacheKey = 'resort_search_cache'
    this.cacheExpireTime = 24 * 60 * 60 * 1000 // 24小时
  }

  /**
   * 获取滑雪场列表
   * @param {Object} params
   * @param {String} params.keyword - 搜索关键词
   * @param {String} params.type - 类型筛选 all/indoor/outdoor
   * @param {Object} params.userLocation - 用户位置
   */
  async getResorts(params = {}) {
    const { keyword = '', type = 'all', userLocation = null } = params

    try {
      let resorts = []

      // 1. 获取数据
      if (!keyword || keyword.trim() === '') {
        // 无搜索词：获取热门50个滑雪场
        resorts = await this._getPopularResorts()
      } else {
        // 有搜索词：调用高德API搜索
        resorts = await this._searchFromAmap(keyword, userLocation)
      }

      // 2. 类型筛选
      if (type !== 'all') {
        resorts = resorts.filter(r => r.type === type)
      }

      // 3. 排序
      if (!keyword || keyword.trim() === '') {
        // 默认：按人气排序
        resorts = this.sortStrategy.sortByPopularity(resorts)
      } else {
        // 搜索：按相关度排序
        resorts = this.sortStrategy.sortByRelevance(resorts, keyword, userLocation)
      }

      return {
        success: true,
        data: resorts,
        total: resorts.length
      }
    } catch (error) {
      console.error('[ResortSearchAppService] 获取滑雪场失败:', error)
      return {
        success: false,
        data: [],
        total: 0,
        error: error.message
      }
    }
  }

  /**
   * 获取热门滑雪场列表
   * 优先从缓存读取，缓存miss则从云数据库或Mock数据获取
   */
  async _getPopularResorts() {
    // 1. 尝试从本地缓存读取
    const cached = this._getCache('popular_resorts')
    if (cached) {
      console.log('[缓存] 使用本地缓存的热门滑雪场')
      return cached
    }

    // 2. TODO: 从云数据库读取
    // const cloudData = await this._getFromCloudDB()
    // if (cloudData) return cloudData

    // 3. 使用Mock数据（临时方案）
    const mockData = this._getMockPopularResorts()

    // 缓存结果
    this._setCache('popular_resorts', mockData)

    return mockData
  }

  /**
   * 从高德API搜索
   */
  async _searchFromAmap(keyword, userLocation) {
    // 检查缓存
    const cacheKey = `search_${keyword}_${userLocation?.latitude || 'none'}`
    const cached = this._getCache(cacheKey)
    if (cached) {
      console.log('[缓存] 使用搜索结果缓存')
      return cached
    }

    // 调用高德API
    console.log('[高德] 搜索滑雪场:', keyword)
    const location = userLocation
      ? `${userLocation.longitude},${userLocation.latitude}`
      : ''

    const results = await this.amapService.searchResorts({
      keywords: keyword,
      location: location,
      offset: 50
    })

    // 缓存结果
    if (results.length > 0) {
      this._setCache(cacheKey, results)
    }

    return results
  }

  /**
   * Mock 热门滑雪场数据（临时使用）
   */
  _getMockPopularResorts() {
    return [
      { id: '1', name: '万龙滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 98, latitude: 40.9814, longitude: 115.2814, trails: { totalCount: 32 }, rating: 4.8 },
      { id: '2', name: '太舞滑雪小镇', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 96, latitude: 40.9506, longitude: 115.3406, trails: { totalCount: 28 }, rating: 4.7 },
      { id: '3', name: '云顶滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 95, latitude: 40.9892, longitude: 115.3492, trails: { totalCount: 41 }, rating: 4.8 },
      { id: '4', name: '万科松花湖度假区', province: '吉林省', city: '吉林市', district: '丰满区', type: 'outdoor', popularity: 97, latitude: 43.2834, longitude: 126.6234, trails: { totalCount: 34 }, rating: 4.9 },
      { id: '5', name: '长白山国际度假区', province: '吉林省', city: '白山市', district: '抚松县', type: 'outdoor', popularity: 94, latitude: 42.0156, longitude: 127.7556, trails: { totalCount: 43 }, rating: 4.8 },
      { id: '6', name: '亚布力滑雪旅游度假区', province: '黑龙江省', city: '哈尔滨市', district: '尚志市', type: 'outdoor', popularity: 95, latitude: 44.7723, longitude: 128.4723, trails: { totalCount: 46 }, rating: 4.7 },
      { id: '7', name: '北大湖滑雪场', province: '吉林省', city: '吉林市', district: '永吉县', type: 'outdoor', popularity: 93, latitude: 43.2945, longitude: 126.5745, trails: { totalCount: 26 }, rating: 4.6 },
      { id: '8', name: '阿勒泰将军山滑雪场', province: '新疆维吾尔自治区', city: '阿勒泰地区', district: '阿勒泰市', type: 'outdoor', popularity: 91, latitude: 47.8445, longitude: 88.1445, trails: { totalCount: 22 }, rating: 4.7 },
      { id: '9', name: '富龙滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 92, latitude: 40.9745, longitude: 115.2745, trails: { totalCount: 25 }, rating: 4.6 },
      { id: '10', name: '融创雪世界（哈尔滨）', province: '黑龙江省', city: '哈尔滨市', district: '松北区', type: 'indoor', popularity: 90, latitude: 45.7923, longitude: 126.5923, trails: { totalCount: 5 }, rating: 4.5 },
      { id: '11', name: '南山滑雪场', province: '北京市', city: '北京市', district: '密云区', type: 'outdoor', popularity: 89, latitude: 40.6178, longitude: 116.9178, trails: { totalCount: 21 }, rating: 4.5 },
      { id: '12', name: '融创雪世界（广州）', province: '广东省', city: '广州市', district: '花都区', type: 'indoor', popularity: 88, latitude: 23.3789, longitude: 113.1789, trails: { totalCount: 4 }, rating: 4.6 },
      { id: '13', name: '丝绸之路国际滑雪场', province: '新疆维吾尔自治区', city: '乌鲁木齐市', district: '乌鲁木齐县', type: 'outdoor', popularity: 88, latitude: 43.4856, longitude: 87.0856, trails: { totalCount: 20 }, rating: 4.4 },
      { id: '14', name: '军都山滑雪场', province: '北京市', city: '北京市', district: '昌平区', type: 'outdoor', popularity: 87, latitude: 40.2889, longitude: 116.0889, trails: { totalCount: 15 }, rating: 4.3 },
      { id: '15', name: '融创雪世界（成都）', province: '四川省', city: '成都市', district: '都江堰市', type: 'indoor', popularity: 86, latitude: 30.9912, longitude: 103.6412, trails: { totalCount: 4 }, rating: 4.5 },
      { id: '16', name: '长春莲花山滑雪场', province: '吉林省', city: '长春市', district: '二道区', type: 'outdoor', popularity: 86, latitude: 43.7823, longitude: 125.9823, trails: { totalCount: 18 }, rating: 4.4 },
      { id: '17', name: '多乐美地滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 90, latitude: 40.9523, longitude: 115.2523, trails: { totalCount: 24 }, rating: 4.5 },
      { id: '18', name: '乔波冰雪世界（北京）', province: '北京市', city: '北京市', district: '顺义区', type: 'indoor', popularity: 85, latitude: 40.1234, longitude: 116.6534, trails: { totalCount: 3 }, rating: 4.4 },
      { id: '19', name: '银河滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 85, latitude: 40.9634, longitude: 115.2634, trails: { totalCount: 16 }, rating: 4.3 },
      { id: '20', name: '天山天池滑雪场', province: '新疆维吾尔自治区', city: '昌吉州', district: '阜康市', type: 'outdoor', popularity: 84, latitude: 43.8867, longitude: 88.1367, trails: { totalCount: 15 }, rating: 4.3 },
      { id: '21', name: '西岭雪山滑雪场', province: '四川省', city: '成都市', district: '大邑县', type: 'outdoor', popularity: 84, latitude: 30.6345, longitude: 103.1345, trails: { totalCount: 9 }, rating: 4.4 },
      { id: '22', name: '怀北国际滑雪场', province: '北京市', city: '北京市', district: '怀柔区', type: 'outdoor', popularity: 83, latitude: 40.4567, longitude: 116.6567, trails: { totalCount: 13 }, rating: 4.2 },
      { id: '23', name: '乔波冰雪世界（绍兴）', province: '浙江省', city: '绍兴市', district: '柯桥区', type: 'indoor', popularity: 83, latitude: 29.9845, longitude: 120.4845, trails: { totalCount: 3 }, rating: 4.3 },
      { id: '24', name: '帽儿山滑雪场', province: '黑龙江省', city: '哈尔滨市', district: '尚志市', type: 'outdoor', popularity: 82, latitude: 45.2134, longitude: 127.5134, trails: { totalCount: 12 }, rating: 4.2 },
      { id: '25', name: '热雪奇迹（北京）', province: '北京市', city: '北京市', district: '丰台区', type: 'indoor', popularity: 82, latitude: 39.8567, longitude: 116.2867, trails: { totalCount: 3 }, rating: 4.3 },
      { id: '26', name: '渔阳滑雪场', province: '北京市', city: '北京市', district: '平谷区', type: 'outdoor', popularity: 81, latitude: 40.2678, longitude: 117.0678, trails: { totalCount: 11 }, rating: 4.1 },
      { id: '27', name: '神农架滑雪场', province: '湖北省', city: '神农架林区', district: '神农架林区', type: 'outdoor', popularity: 80, latitude: 31.7445, longitude: 110.6745, trails: { totalCount: 8 }, rating: 4.3 },
      { id: '28', name: '棋盘山冰雪大世界', province: '辽宁省', city: '沈阳市', district: '浑南区', type: 'outdoor', popularity: 80, latitude: 41.8456, longitude: 123.5856, trails: { totalCount: 10 }, rating: 4.2 },
      { id: '29', name: '美林谷滑雪场', province: '内蒙古自治区', city: '赤峰市', district: '喀喇沁旗', type: 'outdoor', popularity: 79, latitude: 41.9123, longitude: 118.7123, trails: { totalCount: 12 }, rating: 4.1 },
      { id: '30', name: '峨眉山滑雪场', province: '四川省', city: '乐山市', district: '峨眉山市', type: 'outdoor', popularity: 78, latitude: 29.6012, longitude: 103.4812, trails: { totalCount: 7 }, rating: 4.2 },
      { id: '31', name: '雪世界滑雪场', province: '北京市', city: '北京市', district: '昌平区', type: 'outdoor', popularity: 78, latitude: 40.3123, longitude: 116.1123, trails: { totalCount: 8 }, rating: 4.0 },
      { id: '32', name: '照金国际滑雪场', province: '陕西省', city: '铜川市', district: '耀州区', type: 'outdoor', popularity: 77, latitude: 34.9845, longitude: 109.0845, trails: { totalCount: 10 }, rating: 4.1 },
      { id: '33', name: '银七星滑雪场', province: '上海市', city: '上海市', district: '闵行区', type: 'indoor', popularity: 77, latitude: 31.0123, longitude: 121.3823, trails: { totalCount: 3 }, rating: 4.2 },
      { id: '34', name: '东北亚滑雪场', province: '辽宁省', city: '沈阳市', district: '新城子区', type: 'outdoor', popularity: 76, latitude: 42.0234, longitude: 123.4234, trails: { totalCount: 9 }, rating: 4.0 },
      { id: '35', name: '大明山滑雪场', province: '浙江省', city: '杭州市', district: '临安区', type: 'outdoor', popularity: 76, latitude: 30.2634, longitude: 119.6234, trails: { totalCount: 8 }, rating: 4.1 },
      { id: '36', name: '九龙滑雪场', province: '山西省', city: '太原市', district: '娄烦县', type: 'outdoor', popularity: 75, latitude: 38.0678, longitude: 111.7678, trails: { totalCount: 7 }, rating: 3.9 },
      { id: '37', name: '金陵大报恩寺滑雪场', province: '江苏省', city: '南京市', district: '秦淮区', type: 'indoor', popularity: 75, latitude: 32.0012, longitude: 118.7812, trails: { totalCount: 2 }, rating: 4.0 },
      { id: '38', name: '太白山滑雪场', province: '陕西省', city: '宝鸡市', district: '眉县', type: 'outdoor', popularity: 74, latitude: 34.0567, longitude: 107.7567, trails: { totalCount: 6 }, rating: 4.0 },
      { id: '39', name: '伏牛山滑雪场', province: '河南省', city: '洛阳市', district: '栾川县', type: 'outdoor', popularity: 74, latitude: 33.7856, longitude: 111.6156, trails: { totalCount: 9 }, rating: 4.1 },
      { id: '40', name: '岗什卡滑雪场', province: '青海省', city: '海北州', district: '门源县', type: 'outdoor', popularity: 73, latitude: 37.6234, longitude: 101.6234, trails: { totalCount: 8 }, rating: 4.0 },
      { id: '41', name: '蓟州国际滑雪场', province: '天津市', city: '天津市', district: '蓟州区', type: 'outdoor', popularity: 73, latitude: 40.0456, longitude: 117.4056, trails: { totalCount: 10 }, rating: 4.0 },
      { id: '42', name: '和政松鸣岩滑雪场', province: '甘肃省', city: '临夏州', district: '和政县', type: 'outdoor', popularity: 72, latitude: 35.4123, longitude: 103.3123, trails: { totalCount: 6 }, rating: 3.9 },
      { id: '43', name: '江南天池滑雪场', province: '浙江省', city: '湖州市', district: '安吉县', type: 'outdoor', popularity: 72, latitude: 30.5845, longitude: 119.5845, trails: { totalCount: 6 }, rating: 4.0 },
      { id: '44', name: '轿子雪山滑雪场', province: '云南省', city: '昆明市', district: '禄劝县', type: 'outdoor', popularity: 71, latitude: 26.2456, longitude: 102.6456, trails: { totalCount: 5 }, rating: 3.9 },
      { id: '45', name: '大围山滑雪场', province: '湖南省', city: '长沙市', district: '浏阳市', type: 'outdoor', popularity: 70, latitude: 28.4178, longitude: 114.1578, trails: { totalCount: 6 }, rating: 3.9 },
      { id: '46', name: '嵩山滑雪场', province: '河南省', city: '郑州市', district: '登封市', type: 'outdoor', popularity: 70, latitude: 34.4823, longitude: 113.0423, trails: { totalCount: 7 }, rating: 3.9 },
      { id: '47', name: '云顶山滑雪场', province: '福建省', city: '福州市', district: '永泰县', type: 'outdoor', popularity: 69, latitude: 25.8723, longitude: 118.9323, trails: { totalCount: 5 }, rating: 3.8 },
      { id: '48', name: '大别山滑雪场', province: '安徽省', city: '六安市', district: '霍山县', type: 'outdoor', popularity: 68, latitude: 31.3923, longitude: 116.3323, trails: { totalCount: 6 }, rating: 3.8 },
      { id: '49', name: '蒙山滑雪场', province: '山东省', city: '临沂市', district: '蒙阴县', type: 'outdoor', popularity: 67, latitude: 35.7112, longitude: 117.9512, trails: { totalCount: 5 }, rating: 3.7 },
      { id: '50', name: '烟台塔山滑雪场', province: '山东省', city: '烟台市', district: '芝罘区', type: 'outdoor', popularity: 66, latitude: 37.5234, longitude: 121.4234, trails: { totalCount: 6 }, rating: 3.7 }
    ]
  }

  /**
   * 本地缓存操作
   */
  _getCache(key) {
    try {
      const cacheData = wx.getStorageSync(`${this.cacheKey}_${key}`)
      if (cacheData && cacheData.expireTime > Date.now()) {
        return cacheData.data
      }
      return null
    } catch (e) {
      return null
    }
  }

  _setCache(key, data) {
    try {
      wx.setStorageSync(`${this.cacheKey}_${key}`, {
        data: data,
        expireTime: Date.now() + this.cacheExpireTime
      })
    } catch (e) {
      console.error('[缓存] 设置缓存失败:', e)
    }
  }
}
