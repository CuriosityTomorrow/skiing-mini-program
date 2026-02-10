/**
 * 滑雪场 Mock 数据
 * 用于本地开发调试
 */

export const mockResorts = [
  {
    _id: 'resort_001',
    id: 'resort_001',
    name: '万龙滑雪场',
    province: '河北省',
    city: '张家口市',
    address: '崇礼区红花梁区域',
    latitude: 40.9717,
    longitude: 115.3348,
    type: 'outdoor',
    facilities: {
      hasRental: true,
      hasParking: true,
      hasRestaurant: true,
      hasHotel: true,
      hasNightSkiing: true,
    },
    openHour: 9,
    closeHour: 17,
    openTime: '09:00',
    closeTime: '17:00',
    tickets: [
      { type: '平日全天', price: 580, description: '周一至周五全天滑雪' },
      { type: '周末全天', price: 780, description: '周六日全天滑雪' },
    ],
    trails: {
      totalCount: 32,
      beginner: 8,
      intermediate: 16,
      advanced: 6,
      expert: 2,
    },
    popularity: 9560,
    rating: 4.8,
    createTime: '2025-01-01T00:00:00.000Z',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    _id: 'resort_002',
    id: 'resort_002',
    name: '太舞滑雪场',
    province: '河北省',
    city: '张家口市',
    address: '崇礼区营忱村',
    latitude: 40.9567,
    longitude: 115.3267,
    type: 'outdoor',
    facilities: {
      hasRental: true,
      hasParking: true,
      hasRestaurant: true,
      hasHotel: true,
      hasNightSkiing: true,
    },
    openHour: 9,
    closeHour: 17,
    openTime: '09:00',
    closeTime: '17:00',
    tickets: [
      { type: '平日全天', price: 520, description: '周一至周五全天滑雪' },
      { type: '周末全天', price: 680, description: '周六日全天滑雪' },
    ],
    trails: {
      totalCount: 28,
      beginner: 6,
      intermediate: 14,
      advanced: 6,
      expert: 2,
    },
    popularity: 8920,
    rating: 4.7,
    createTime: '2025-01-01T00:00:00.000Z',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    _id: 'resort_003',
    id: 'resort_003',
    name: '乔波冰雪世界',
    province: '北京市',
    city: '北京市',
    address: '顺义区顺安路6号',
    latitude: 40.1289,
    longitude: 116.6547,
    type: 'indoor',
    facilities: {
      hasRental: true,
      hasParking: true,
      hasRestaurant: true,
      hasHotel: false,
      hasNightSkiing: true,
    },
    openHour: 10,
    closeHour: 21,
    openTime: '10:00',
    closeTime: '21:00',
    tickets: [
      { type: '3小时', price: 280, description: '平日3小时滑雪' },
      { type: '全天', price: 480, description: '平日全天滑雪' },
    ],
    trails: {
      totalCount: 12,
      beginner: 6,
      intermediate: 4,
      advanced: 2,
      expert: 0,
    },
    popularity: 7850,
    rating: 4.5,
    createTime: '2025-01-01T00:00:00.000Z',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    _id: 'resort_004',
    id: 'resort_004',
    name: '军都山滑雪场',
    province: '北京市',
    city: '北京市',
    address: '昌平区崔村镇真顺村588号',
    latitude: 40.2156,
    longitude: 116.2314,
    type: 'outdoor',
    facilities: {
      hasRental: true,
      hasParking: true,
      hasRestaurant: true,
      hasHotel: false,
      hasNightSkiing: true,
    },
    openHour: 9,
    closeHour: 18,
    openTime: '09:00',
    closeTime: '18:00',
    tickets: [
      { type: '平日全天', price: 360, description: '周一至周五全天滑雪' },
      { type: '周末全天', price: 460, description: '周六日全天滑雪' },
    ],
    trails: {
      totalCount: 15,
      beginner: 7,
      intermediate: 5,
      advanced: 2,
      expert: 1,
    },
    popularity: 6230,
    rating: 4.3,
    createTime: '2025-01-01T00:00:00.000Z',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    _id: 'resort_005',
    id: 'resort_005',
    name: '融创雪世界',
    province: '广东省',
    city: '广州市',
    address: '花都区花城街道凤凰北路',
    latitude: 23.4017,
    longitude: 113.2012,
    type: 'indoor',
    facilities: {
      hasRental: true,
      hasParking: true,
      hasRestaurant: true,
      hasHotel: true,
      hasNightSkiing: true,
    },
    openHour: 11,
    closeHour: 22,
    openTime: '11:00',
    closeTime: '22:00',
    tickets: [
      { type: '4小时', price: 398, description: '平日4小时滑雪' },
      { type: '全天', price: 698, description: '平日全天滑雪' },
    ],
    trails: {
      totalCount: 10,
      beginner: 5,
      intermediate: 3,
      advanced: 2,
      expert: 0,
    },
    popularity: 8760,
    rating: 4.6,
    createTime: '2025-01-01T00:00:00.000Z',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
]

/**
 * Mock 云函数响应
 */
export const mockCloudFunction = {
  /**
   * 模拟搜索滑雪场
   */
  'resort-search': (data) => {
    const { keyword, type, limit = 20, offset = 0 } = data

    console.log('[Mock] 搜索滑雪场:', { keyword, type, limit, offset })

    // 过滤数据
    let results = mockResorts

    // 关键词过滤
    if (keyword && keyword.trim()) {
      const searchKeyword = keyword.trim().toLowerCase()
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(searchKeyword) ||
          r.city.toLowerCase().includes(searchKeyword) ||
          r.province.toLowerCase().includes(searchKeyword)
      )
    }

    // 类型过滤
    if (type && (type === 'indoor' || type === 'outdoor')) {
      results = results.filter((r) => r.type === type)
    }

    // 分页
    const start = offset
    const end = offset + limit
    const paginatedResults = results.slice(start, end)

    return {
      code: 0,
      message: 'success',
      data: paginatedResults,
      total: paginatedResults.length,
    }
  },

  /**
   * 模拟获取详情
   */
  'resort-detail': (data) => {
    const { id } = data
    console.log('[Mock] 获取滑雪场详情:', id)

    const resort = mockResorts.find((r) => r.id === id || r._id === id)

    if (!resort) {
      return {
        code: -1,
        message: '滑雪场不存在',
        data: null,
      }
    }

    return {
      code: 0,
      message: 'success',
      data: resort,
    }
  },
}
