/**
 * 筛选系统使用示例
 *
 * 展示如何在页面中使用强大的筛选功能
 */

import { ResortSearchAppService } from '../../application/services/ResortSearchAppService.js'

// ========== 初始化 ==========
const searchService = new ResortSearchAppService()

// ========== 示例 1: 基础搜索（无筛选）==========
async function example1_BasicSearch() {
  const result = await searchService.getResorts({
    keyword: '万龙',
    type: 'all'
  })

  console.log('基础搜索结果:', result.data)
}

// ========== 示例 2: 价格筛选 ==========
async function example2_PriceFilter() {
  const result = await searchService.getResorts({
    keyword: '',
    filters: {
      // 价格区间：200-500元
      priceRange: {
        min: 200,
        max: 500
      }
    }
  })

  console.log('价格筛选结果:', result.data)
}

// ========== 示例 3: 多维度组合筛选（新手友好）==========
async function example3_BeginnerFriendly() {
  const result = await searchService.getResorts({
    keyword: '',
    filters: {
      // 难度：只要初级和中级雪道
      difficulty: ['beginner', 'intermediate'],

      // 设施：必须有租雪具和教练
      requiredFacilities: ['rental', 'coach'],

      // 适合人群：新手
      suitableFor: ['beginner'],

      // 价格等级：预算型
      priceLevel: 'budget'
    },
    sortBy: 'beginner_score' // 按新手友好度排序
  })

  console.log('新手友好滑雪场:', result.data)
}

// ========== 示例 4: 家庭亲子筛选 ==========
async function example4_FamilyFriendly() {
  const result = await searchService.getResorts({
    keyword: '',
    filters: {
      // 设施：儿童区、餐厅、储物柜
      requiredFacilities: ['kidsArea', 'restaurant', 'locker'],

      // 适合人群：家庭
      suitableFor: ['family'],

      // 难度：必须有初级道
      difficulty: ['beginner'],

      // 评分：至少4.0
      minRating: 4.0
    },
    sortBy: 'family_score'
  })

  console.log('亲子友好滑雪场:', result.data)
}

// ========== 示例 5: 高手挑战筛选 ==========
async function example5_ExpertLevel() {
  const result = await searchService.getResorts({
    keyword: '',
    filters: {
      // 难度：必须有高级和专家级雪道
      difficulty: ['advanced', 'expert'],

      // 雪道数量：至少20条
      minTrails: 20,

      // 设施：缆车和单板公园
      requiredFacilities: ['cableCar', 'snowPark'],

      // 类型：只要室外
      resortType: 'outdoor'
    },
    sortBy: 'expert_score'
  })

  console.log('高手级别滑雪场:', result.data)
}

// ========== 示例 6: 地理位置筛选 ==========
async function example6_LocationFilter() {
  const result = await searchService.getResorts({
    keyword: '',
    filters: {
      // 省份：河北、北京
      provinces: ['河北省', '北京市'],

      // 最大距离：100公里（需要先设置用户位置）
      maxDistance: 100
    },
    userLocation: {
      latitude: 39.9042,  // 北京天安门
      longitude: 116.4074
    }
  })

  console.log('附近的滑雪场:', result.data)
}

// ========== 示例 7: 季节和雪质筛选 ==========
async function example7_SeasonFilter() {
  const result = await searchService.getResorts({
    keyword: '',
    filters: {
      // 可用月份：12月、1月、2月
      availableIn: [12, 1, 2],

      // 是否开放
      isOpenNow: true,

      // 雪质：自然雪
      snowQuality: ['natural']
    }
  })

  console.log('自然雪滑雪场:', result.data)
}

// ========== 示例 8: 性价比筛选 ==========
async function example8_BestValue() {
  const result = await searchService.getResorts({
    keyword: '',
    filters: {
      // 价格等级：中端
      priceLevel: 'mid',

      // 评分：至少4.5
      minRating: 4.5,

      // 设施：夜场、餐厅
      requiredFacilities: ['nightSkiing', 'restaurant']
    },
    sortBy: 'value_score' // 按性价比排序
  })

  console.log('高性价比滑雪场:', result.data)
}

// ========== 示例 9: 周末游筛选 ==========
async function example9_WeekendTrip() {
  const result = await searchService.getResorts({
    keyword: '',
    filters: {
      // 适合人群：周末游
      suitableFor: ['weekend'],

      // 设施：停车场、住宿
      requiredFacilities: ['parking', 'hotel'],

      // 省份：河北省（离北京近）
      provinces: ['河北省']
    },
    sortBy: 'popularity'
  })

  console.log('周末游滑雪场:', result.data)
}

// ========== 示例 10: 标签筛选 ==========
async function example10_TagFilter() {
  const result = await searchService.getResorts({
    keyword: '',
    filters: {
      // 标签：夜场、雪质好
      tags: ['夜场', '雪质好']
    }
  })

  console.log('带特定标签的滑雪场:', result.data)
}

// ========== 示例 11: 获取筛选选项（动态UI）==========
async function example11_GetFilterOptions() {
  const result = await searchService.getFilterOptions()

  console.log('可用的省份:', result.data.provinces)
  console.log('可用的标签:', result.data.tags)
  console.log('价格范围:', result.data.priceRange)
  console.log('雪道数量范围:', result.data.trailCountRange)
  console.log('各设施的滑雪场数量:', result.data.facilities)
}

// ========== 示例 12: 综合高级筛选（Nomads风格）==========
async function example12_AdvancedCombination() {
  const result = await searchService.getResorts({
    keyword: '崇礼',
    filters: {
      // 价格
      priceRange: { min: 300, max: 600 },

      // 难度
      difficulty: ['intermediate', 'advanced'],

      // 位置
      provinces: ['河北省'],
      maxDistance: 200,

      // 雪道
      minTrails: 15,
      trailTypes: ['intermediate', 'advanced'],

      // 设施
      requiredFacilities: ['rental', 'hotel', 'restaurant', 'nightSkiing'],

      // 季节
      availableIn: [12, 1, 2],
      isOpenNow: true,

      // 适合人群
      suitableFor: ['weekend', 'vacation'],

      // 评分
      minRating: 4.5,

      // 类型
      resortType: 'outdoor'
    },
    sortBy: 'overall_score',
    userLocation: {
      latitude: 39.9042,
      longitude: 116.4074
    }
  })

  console.log('综合筛选结果:', result.data)
}

// ========== 导出所有示例 ==========
export const FilterExamples = {
  example1_BasicSearch,
  example2_PriceFilter,
  example3_BeginnerFriendly,
  example4_FamilyFriendly,
  example5_ExpertLevel,
  example6_LocationFilter,
  example7_SeasonFilter,
  example8_BestValue,
  example9_WeekendTrip,
  example10_TagFilter,
  example11_GetFilterOptions,
  example12_AdvancedCombination
}

// ========== 在控制台运行示例 ==========
// 在页面中可以这样使用：
//
// import { FilterExamples } from '@/shared/examples/filter-usage-examples'
//
// // 运行某个示例
// FilterExamples.example3_BeginnerFriendly()
