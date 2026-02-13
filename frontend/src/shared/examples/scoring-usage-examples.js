/**
 * Ski Score 评分系统使用示例
 *
 * 展示如何使用评分算法和分数数据
 */

import { ResortScoringService } from '../../domain/resort/services/ResortScoringService.domain.js'
import { ResortSearchAppService } from '../../application/services/ResortSearchAppService.js'

// ========== 评分服务初始化 ==========
const scoringService = new ResortScoringService()
const searchService = new ResortSearchAppService()

// ========== 示例 1: 单个滑雪场评分 ==========
async function example1_ScoreSingleResort() {
  // 假设这是从数据库获取的滑雪场数据
  const resort = {
    id: 'wanlong_001',
    name: '万龙滑雪场',
    type: 'outdoor',
    popularity: 98,
    trails: {
      total: 32,
      beginner: 8,
      intermediate: 12,
      advanced: 10,
      expert: 2,
      maxLength: 3500,
      verticalDrop: 550
    },
    pricing: {
      daily: 450,
      avgCost: 500
    },
    facilities: {
      rental: true,
      parking: true,
      restaurant: true,
      hotel: true,
      locker: true,
      nightSkiing: true,
      coach: true,
      magicCarpet: true,
      cableCar: true,
      snowPark: true,
      kidsArea: false
    },
    community: {
      rating: 4.8,
      ratingCount: 1234
    }
  }

  // 计算所有分数
  const scores = scoringService.calculateAllScores(resort)

  console.log('万龙滑雪场评分:')
  console.log('- 综合评分:', scores.overall)      // 预期: 8.5-9.0
  console.log('- 新手友好:', scores.beginner)     // 预期: 6.5-7.5
  console.log('- 中级友好:', scores.intermediate) // 预期: 8.5-9.5
  console.log('- 高手推荐:', scores.expert)       // 预期: 9.0-9.5
  console.log('- 亲子友好:', scores.family)       // 预期: 6.5-7.5
  console.log('- 性价比:', scores.value)          // 预期: 7.5-8.5

  return scores
}

// ========== 示例 2: 批量评分 ==========
async function example2_ScoreMultipleResorts() {
  const resorts = [
    {
      name: '南山滑雪场',
      type: 'outdoor',
      popularity: 89,
      trails: { total: 21, beginner: 10, intermediate: 8, advanced: 3 },
      pricing: { avgCost: 300 },
      facilities: { rental: true, coach: true, magicCarpet: true },
      community: { rating: 4.5 }
    },
    {
      name: '融创雪世界（广州）',
      type: 'indoor',
      popularity: 88,
      trails: { total: 4, beginner: 2, intermediate: 2 },
      pricing: { avgCost: 280 },
      facilities: { rental: true, restaurant: true, locker: true },
      community: { rating: 4.6 }
    }
  ]

  // 批量计算分数
  const resortsWithScores = scoringService.calculateScoresForResorts(resorts)

  resortsWithScores.forEach(resort => {
    console.log(`\n${resort.name}:`)
    console.log('  综合评分:', resort.scores.overall)
    console.log('  新手友好:', resort.scores.beginner)
    console.log('  性价比:', resort.scores.value)
  })

  return resortsWithScores
}

// ========== 示例 3: 自动评分（通过搜索服务）==========
async function example3_AutoScoring() {
  // 搜索服务会自动为每个滑雪场计算分数
  const result = await searchService.getResorts({
    keyword: '',
    type: 'all'
  })

  // 结果中已经包含了 scores 字段
  result.data.forEach(resort => {
    console.log(`${resort.name}:`)
    console.log('  综合评分:', resort.scores?.overall || '未计算')
    console.log('  适合新手:', resort.scores?.beginner >= 7 ? '是' : '否')
    console.log('  适合高手:', resort.scores?.expert >= 8 ? '是' : '否')
  })

  return result.data
}

// ========== 示例 4: 按分数筛选 ==========
async function example4_FilterByScore() {
  const result = await searchService.getResorts({
    keyword: '',
    sortBy: 'beginner_score' // 按新手友好度排序
  })

  // 只显示新手友好度 >= 7.0 的滑雪场
  const beginnerFriendly = result.data.filter(r => r.scores?.beginner >= 7.0)

  console.log(`找到 ${beginnerFriendly.length} 个新手友好的滑雪场:`)
  beginnerFriendly.forEach(resort => {
    console.log(`- ${resort.name}: ${resort.scores.beginner} 分`)
  })

  return beginnerFriendly
}

// ========== 示例 5: 对比分数 ==========
async function example5_CompareScores() {
  const result = await searchService.getResorts({
    filters: {
      provinces: ['河北省']
    }
  })

  // 对比崇礼地区的滑雪场
  console.log('崇礼地区滑雪场对比:\n')
  console.log('滑雪场名称       | 综合 | 新手 | 中级 | 高手 | 亲子 | 性价比')
  console.log('----------------|------|------|------|------|------|-------')

  result.data.slice(0, 5).forEach(resort => {
    const s = resort.scores || {}
    console.log(
      `${resort.name.padEnd(16)} | ` +
      `${(s.overall || 0).toFixed(1)} | ` +
      `${(s.beginner || 0).toFixed(1)} | ` +
      `${(s.intermediate || 0).toFixed(1)} | ` +
      `${(s.expert || 0).toFixed(1)} | ` +
      `${(s.family || 0).toFixed(1)} | ` +
      `${(s.value || 0).toFixed(1)}`
    )
  })
}

// ========== 示例 6: 找最适合的滑雪场 ==========
async function example6_FindBestMatch() {
  // 场景：周末带孩子去滑雪，预算300-500
  const result = await searchService.getResorts({
    filters: {
      priceRange: { min: 300, max: 500 },
      requiredFacilities: ['kidsArea', 'restaurant', 'parking'],
      suitableFor: ['family', 'weekend']
    },
    sortBy: 'family_score' // 按亲子友好度排序
  })

  if (result.data.length > 0) {
    const best = result.data[0]
    console.log('最推荐的滑雪场:')
    console.log('名称:', best.name)
    console.log('亲子友好度:', best.scores?.family, '分')
    console.log('价格:', best.pricing?.avgCost, '元')
    console.log('初级雪道:', best.trails?.beginner, '条')
    console.log('\n推荐理由:')
    if (best.scores?.family >= 8) {
      console.log('- 非常适合家庭出游')
    }
    if (best.facilities?.kidsArea) {
      console.log('- 有专门的儿童区域')
    }
    if (best.scores?.value >= 7) {
      console.log('- 性价比高')
    }
  }

  return result.data[0]
}

// ========== 示例 7: 分数分布统计 ==========
async function example7_ScoreDistribution() {
  const result = await searchService.getResorts({
    keyword: '',
    type: 'all'
  })

  // 统计各分数段的滑雪场数量
  const distribution = {
    excellent: 0,  // >= 8.0
    good: 0,       // 7.0-7.9
    average: 0,    // 6.0-6.9
    poor: 0        // < 6.0
  }

  result.data.forEach(resort => {
    const score = resort.scores?.overall || 0
    if (score >= 8.0) distribution.excellent++
    else if (score >= 7.0) distribution.good++
    else if (score >= 6.0) distribution.average++
    else distribution.poor++
  })

  console.log('综合评分分布:')
  console.log(`优秀 (>=8.0): ${distribution.excellent} 个`)
  console.log(`良好 (7.0-7.9): ${distribution.good} 个`)
  console.log(`一般 (6.0-6.9): ${distribution.average} 个`)
  console.log(`较差 (<6.0): ${distribution.poor} 个`)

  return distribution
}

// ========== 示例 8: 个性化推荐（基于用户画像）==========
async function example8_PersonalizedRecommendation(userProfile) {
  // userProfile 示例:
  // {
  //   level: 'beginner' | 'intermediate' | 'expert',
  //   budget: 'low' | 'mid' | 'high',
  //   withFamily: boolean,
  //   preferredProvinces: ['河北省', '北京市']
  // }

  const filters = {
    provinces: userProfile.preferredProvinces
  }

  // 根据预算设置价格筛选
  if (userProfile.budget === 'low') {
    filters.priceLevel = 'budget'
  } else if (userProfile.budget === 'mid') {
    filters.priceLevel = 'mid'
  }

  // 根据是否带家人设置设施要求
  if (userProfile.withFamily) {
    filters.requiredFacilities = ['restaurant', 'parking']
    filters.suitableFor = ['family']
  }

  // 根据水平选择排序方式
  let sortBy = 'overall_score'
  if (userProfile.level === 'beginner') {
    sortBy = 'beginner_score'
  } else if (userProfile.level === 'intermediate') {
    sortBy = 'intermediate_score'  // 需要在 SortOptions 中添加
  } else if (userProfile.level === 'expert') {
    sortBy = 'expert_score'
  }

  const result = await searchService.getResorts({
    keyword: '',
    filters: filters,
    sortBy: sortBy
  })

  console.log(`为您推荐 ${result.data.length} 个滑雪场:`)
  result.data.slice(0, 3).forEach((resort, index) => {
    console.log(`\n${index + 1}. ${resort.name}`)
    console.log(`   综合评分: ${resort.scores?.overall}`)
    console.log(`   适合程度: ${resort.scores?.[userProfile.level]}`)
    console.log(`   价格: ${resort.pricing?.avgCost} 元`)
  })

  return result.data
}

// ========== 示例 9: 评分算法测试 ==========
function example9_TestScoringAlgorithm() {
  console.log('=== 评分算法测试 ===\n')

  // 测试用例1: 顶级度假区
  const premiumResort = {
    name: '测试-顶级度假区',
    type: 'outdoor',
    popularity: 98,
    trails: {
      total: 40,
      beginner: 10,
      intermediate: 15,
      advanced: 12,
      expert: 3,
      maxLength: 4000,
      verticalDrop: 700
    },
    pricing: { avgCost: 600 },
    facilities: {
      rental: true, parking: true, restaurant: true, hotel: true,
      locker: true, nightSkiing: true, coach: true, magicCarpet: true,
      cableCar: true, snowPark: true, kidsArea: true
    },
    community: { rating: 4.9 }
  }

  // 测试用例2: 新手练习场
  const beginnerResort = {
    name: '测试-新手练习场',
    type: 'outdoor',
    popularity: 75,
    trails: {
      total: 8,
      beginner: 5,
      intermediate: 3,
      advanced: 0,
      expert: 0,
      maxLength: 800,
      verticalDrop: 80
    },
    pricing: { avgCost: 200 },
    facilities: {
      rental: true, coach: true, magicCarpet: true, restaurant: true,
      locker: true, parking: true
    },
    community: { rating: 4.2 }
  }

  // 测试用例3: 室内滑雪场
  const indoorResort = {
    name: '测试-室内滑雪场',
    type: 'indoor',
    popularity: 82,
    trails: {
      total: 3,
      beginner: 2,
      intermediate: 1,
      advanced: 0
    },
    pricing: { avgCost: 280 },
    facilities: {
      rental: true, restaurant: true, locker: true
    },
    community: { rating: 4.4 }
  }

  const testCases = [premiumResort, beginnerResort, indoorResort]
  testCases.forEach(resort => {
    const scores = scoringService.calculateAllScores(resort)
    console.log(`${resort.name}:`)
    console.log(`  综合: ${scores.overall} | 新手: ${scores.beginner} | 高手: ${scores.expert}`)
    console.log(`  亲子: ${scores.family} | 性价比: ${scores.value}\n`)
  })
}

// ========== 导出所有示例 ==========
export const ScoringExamples = {
  example1_ScoreSingleResort,
  example2_ScoreMultipleResorts,
  example3_AutoScoring,
  example4_FilterByScore,
  example5_CompareScores,
  example6_FindBestMatch,
  example7_ScoreDistribution,
  example8_PersonalizedRecommendation,
  example9_TestScoringAlgorithm
}

// ========== 快速测试 ==========
// 在控制台运行：
// import { ScoringExamples } from '@/shared/examples/scoring-usage-examples'
// ScoringExamples.example1_ScoreSingleResort()
