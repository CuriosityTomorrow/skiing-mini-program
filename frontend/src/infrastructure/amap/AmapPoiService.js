/**
 * 高德地图 POI 搜索服务
 * 文档: https://lbs.amap.com/api/webservice/guide/api/search
 */
export class AmapPoiService {
  constructor(apiKey) {
    this.apiKey = apiKey || 'YOUR_AMAP_KEY' // TODO: 配置高德API Key
    this.baseUrl = 'https://restapi.amap.com/v3'
  }

  /**
   * 搜索滑雪场
   * @param {Object} params - 搜索参数
   * @param {String} params.keywords - 关键词
   * @param {String} params.city - 城市（可选）
   * @param {String} params.location - 中心点坐标（可选）
   * @param {Number} params.offset - 返回数量，默认20
   */
  async searchResorts(params = {}) {
    const {
      keywords = '滑雪场',
      city = '',
      location = '',
      offset = 50
    } = params

    try {
      const url = `${this.baseUrl}/place/text`
      const queryParams = {
        key: this.apiKey,
        keywords: keywords,
        types: '141210', // 高德分类：滑雪场
        city: city,
        offset: offset,
        extensions: 'all' // 返回详细信息
      }

      if (location) {
        queryParams.location = location
        queryParams.radius = 50000 // 搜索半径50公里
      }

      // 微信小程序网络请求
      const result = await this._request(url, queryParams)

      if (result.status === '1' && result.pois) {
        return this._transformPois(result.pois)
      }

      return []
    } catch (error) {
      console.error('[高德搜索] 错误:', error)
      return []
    }
  }

  /**
   * 发起网络请求
   */
  _request(url, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: params,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error(`请求失败: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  /**
   * 转换高德POI数据为应用数据格式
   */
  _transformPois(pois) {
    return pois.map(poi => {
      const location = poi.location ? poi.location.split(',') : ['0', '0']

      return {
        id: poi.id,
        name: poi.name,
        province: poi.pname || '',
        city: poi.cityname || '',
        district: poi.adname || '',
        address: poi.address || '',
        latitude: parseFloat(location[1]),
        longitude: parseFloat(location[0]),
        type: this._determineType(poi.type),
        tel: poi.tel || '',
        // 从高德数据推测人气（用navi_poiid长度模拟）
        popularity: poi.biz_ext?.rating ? parseFloat(poi.biz_ext.rating) * 20 : 50,
        photos: poi.photos || [],
        source: 'amap'
      }
    })
  }

  /**
   * 判断滑雪场类型：室内/室外
   * 根据高德的类型标签和名称判断
   */
  _determineType(typeName) {
    const name = typeName || ''

    // 如果包含"室内"关键词，判定为室内
    if (name.includes('室内') || name.includes('冰雪世界') || name.includes('雪世界')) {
      return 'indoor'
    }

    // 默认为室外
    return 'outdoor'
  }
}
