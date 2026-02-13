/**
 * 滑雪场评分算法服务（Nomads风格）
 *
 * 设计理念：
 * - 数据驱动：基于客观数据计算分数
 * - 多维评估：6个维度全面评价滑雪场
 * - 透明算法：可解释的评分逻辑
 *
 * 评分维度：
 * 1. Overall Score (综合评分) - 综合所有维度
 * 2. Beginner Score (新手友好度) - 适合初学者程度
 * 3. Intermediate Score (中级友好度) - 适合中级滑雪者程度
 * 4. Expert Score (高手推荐度) - 适合高手程度
 * 5. Family Score (亲子友好度) - 适合家庭出游程度
 * 6. Value Score (性价比) - 物有所值程度
 *
 * 分数范围：0-10 分
 */
export class ResortScoringService {
  /**
   * 计算滑雪场的所有分数
   *
   * @param {Object} resort - 滑雪场数据
   * @returns {Object} 包含6个维度分数的对象
   */
  calculateAllScores(resort) {
    return {
      overall: this.calculateOverallScore(resort),
      beginner: this.calculateBeginnerScore(resort),
      intermediate: this.calculateIntermediateScore(resort),
      expert: this.calculateExpertScore(resort),
      family: this.calculateFamilyScore(resort),
      value: this.calculateValueScore(resort)
    }
  }

  /**
   * 综合评分算法
   *
   * 权重分配：
   * - 雪道质量: 30%
   * - 设施完善度: 25%
   * - 用户评分: 20%
   * - 人气值: 15%
   * - 性价比: 10%
   */
  calculateOverallScore(resort) {
    const trailScore = this._evaluateTrailQuality(resort) * 0.30
    const facilityScore = this._evaluateFacilities(resort) * 0.25
    const ratingScore = this._normalizeRating(resort.community?.rating || 0) * 0.20
    const popularityScore = this._normalizePopularity(resort.popularity || 0) * 0.15
    const valueScore = this.calculateValueScore(resort) * 0.10

    const total = trailScore + facilityScore + ratingScore + popularityScore + valueScore

    return this._roundScore(total)
  }

  /**
   * 新手友好度评分算法
   *
   * 考虑因素：
   * - 初级雪道比例（高权重）
   * - 魔毯设施
   * - 教练服务
   * - 租赁服务
   * - 总雪道数（适中最好）
   */
  calculateBeginnerScore(resort) {
    let score = 0
    const trails = resort.trails || {}
    const facilities = resort.facilities || {}
    const total = trails.total || trails.totalCount || 1

    // 1. 初级雪道比例 (40%)
    const beginnerRatio = (trails.beginner || 0) / total
    if (beginnerRatio >= 0.4) {
      score += 4.0  // 40%以上初级道，满分
    } else if (beginnerRatio >= 0.25) {
      score += 3.0  // 25-40%，良好
    } else if (beginnerRatio >= 0.15) {
      score += 2.0  // 15-25%，一般
    } else {
      score += 1.0  // <15%，较少
    }

    // 2. 关键设施 (30%)
    if (facilities.magicCarpet) score += 1.5  // 魔毯很重要
    if (facilities.coach) score += 1.0        // 教练服务
    if (facilities.rental) score += 0.5       // 租赁服务

    // 3. 雪道总数适中性 (15%)
    if (total >= 8 && total <= 20) {
      score += 1.5  // 8-20条最适合新手
    } else if (total > 20 && total <= 30) {
      score += 1.0  // 20-30条也不错
    } else if (total < 8) {
      score += 0.5  // 太少可能选择有限
    }

    // 4. 安全和便利设施 (15%)
    if (facilities.locker) score += 0.5
    if (facilities.restaurant) score += 0.5
    if (facilities.parking) score += 0.5

    return this._roundScore(Math.min(score, 10))
  }

  /**
   * 中级友好度评分算法
   *
   * 考虑因素：
   * - 中级雪道数量和比例
   * - 雪道总数
   * - 缆车设施
   * - 垂直落差
   */
  calculateIntermediateScore(resort) {
    let score = 0
    const trails = resort.trails || {}
    const facilities = resort.facilities || {}
    const total = trails.total || trails.totalCount || 1

    // 1. 中级雪道数量 (40%)
    const intermediateCount = trails.intermediate || 0
    if (intermediateCount >= 10) {
      score += 4.0
    } else if (intermediateCount >= 6) {
      score += 3.0
    } else if (intermediateCount >= 3) {
      score += 2.0
    } else {
      score += 1.0
    }

    // 2. 雪道总数 (20%)
    if (total >= 20) {
      score += 2.0
    } else if (total >= 12) {
      score += 1.5
    } else if (total >= 8) {
      score += 1.0
    }

    // 3. 设施 (20%)
    if (facilities.cableCar) score += 1.5
    if (facilities.rental) score += 0.5

    // 4. 垂直落差 (20%)
    const verticalDrop = trails.verticalDrop || 0
    if (verticalDrop >= 500) {
      score += 2.0
    } else if (verticalDrop >= 300) {
      score += 1.5
    } else if (verticalDrop >= 150) {
      score += 1.0
    } else {
      score += 0.5
    }

    return this._roundScore(Math.min(score, 10))
  }

  /**
   * 高手推荐度评分算法
   *
   * 考虑因素：
   * - 高级和专家级雪道数量
   * - 垂直落差
   * - 雪道最长长度
   * - 单板公园
   * - 夜场
   */
  calculateExpertScore(resort) {
    let score = 0
    const trails = resort.trails || {}
    const facilities = resort.facilities || {}

    // 1. 高难度雪道数量 (40%)
    const advancedCount = (trails.advanced || 0) + (trails.expert || 0) * 1.5
    if (advancedCount >= 12) {
      score += 4.0
    } else if (advancedCount >= 8) {
      score += 3.0
    } else if (advancedCount >= 5) {
      score += 2.0
    } else {
      score += 1.0
    }

    // 2. 垂直落差 (30%)
    const verticalDrop = trails.verticalDrop || 0
    if (verticalDrop >= 600) {
      score += 3.0
    } else if (verticalDrop >= 400) {
      score += 2.0
    } else if (verticalDrop >= 250) {
      score += 1.0
    }

    // 3. 最长雪道 (15%)
    const maxLength = trails.maxLength || 0
    if (maxLength >= 3000) {
      score += 1.5
    } else if (maxLength >= 2000) {
      score += 1.0
    } else if (maxLength >= 1000) {
      score += 0.5
    }

    // 4. 特色设施 (15%)
    if (facilities.snowPark) score += 1.0
    if (facilities.cableCar) score += 0.5

    return this._roundScore(Math.min(score, 10))
  }

  /**
   * 亲子友好度评分算法
   *
   * 考虑因素：
   * - 儿童区域
   * - 初级雪道
   * - 餐厅
   * - 住宿
   * - 储物柜
   * - 停车场
   */
  calculateFamilyScore(resort) {
    let score = 0
    const trails = resort.trails || {}
    const facilities = resort.facilities || {}
    const total = trails.total || trails.totalCount || 1

    // 1. 儿童区域 (25%)
    if (facilities.kidsArea) {
      score += 2.5
    }

    // 2. 初级雪道比例 (25%)
    const beginnerRatio = (trails.beginner || 0) / total
    if (beginnerRatio >= 0.3) {
      score += 2.5
    } else if (beginnerRatio >= 0.2) {
      score += 2.0
    } else if (beginnerRatio >= 0.1) {
      score += 1.5
    }

    // 3. 便利设施 (30%)
    if (facilities.restaurant) score += 1.0
    if (facilities.locker) score += 0.5
    if (facilities.parking) score += 0.5
    if (facilities.rental) score += 0.5
    if (facilities.hotel) score += 0.5

    // 4. 安全和服务 (20%)
    if (facilities.coach) score += 1.0
    if (facilities.magicCarpet) score += 1.0

    return this._roundScore(Math.min(score, 10))
  }

  /**
   * 性价比评分算法
   *
   * 考虑因素：
   * - 价格水平
   * - 雪道数量
   * - 设施完善度
   * - 用户评分
   */
  calculateValueScore(resort) {
    let score = 0
    const pricing = resort.pricing || {}
    const trails = resort.trails || {}
    const facilities = resort.facilities || {}
    const rating = resort.community?.rating || 0

    // 获取日均价格
    const avgCost = pricing.avgCost || pricing.daily || 500

    // 1. 价格评估 (30%)
    // 价格越低，这部分得分越高
    if (avgCost < 250) {
      score += 3.0  // 超值
    } else if (avgCost < 400) {
      score += 2.5  // 实惠
    } else if (avgCost < 550) {
      score += 2.0  // 适中
    } else if (avgCost < 700) {
      score += 1.5  // 偏贵
    } else {
      score += 1.0  // 昂贵
    }

    // 2. 雪道数量 (25%)
    const trailCount = trails.total || trails.totalCount || 0
    if (trailCount >= 30) {
      score += 2.5
    } else if (trailCount >= 20) {
      score += 2.0
    } else if (trailCount >= 12) {
      score += 1.5
    } else if (trailCount >= 6) {
      score += 1.0
    } else {
      score += 0.5
    }

    // 3. 设施完善度 (25%)
    const facilityScore = this._evaluateFacilities(resort)
    score += facilityScore * 0.25

    // 4. 用户评分 (20%)
    // 高用户评分说明确实物有所值
    score += this._normalizeRating(rating) * 0.20

    return this._roundScore(Math.min(score, 10))
  }

  /**
   * 批量计算分数
   * 为一组滑雪场计算所有分数
   */
  calculateScoresForResorts(resorts) {
    return resorts.map(resort => ({
      ...resort,
      scores: this.calculateAllScores(resort)
    }))
  }

  // ========== 辅助方法 ==========

  /**
   * 评估雪道质量
   * 基于雪道数量、分布、长度、落差
   */
  _evaluateTrailQuality(resort) {
    let score = 0
    const trails = resort.trails || {}
    const total = trails.total || trails.totalCount || 0

    // 雪道总数 (40%)
    if (total >= 30) {
      score += 4.0
    } else if (total >= 20) {
      score += 3.0
    } else if (total >= 12) {
      score += 2.0
    } else if (total >= 6) {
      score += 1.0
    }

    // 雪道分布多样性 (30%)
    const diversity = this._calculateTrailDiversity(trails)
    score += diversity * 3.0

    // 垂直落差 (20%)
    const verticalDrop = trails.verticalDrop || 0
    if (verticalDrop >= 500) {
      score += 2.0
    } else if (verticalDrop >= 300) {
      score += 1.5
    } else if (verticalDrop >= 150) {
      score += 1.0
    } else {
      score += 0.5
    }

    // 最长雪道 (10%)
    const maxLength = trails.maxLength || 0
    if (maxLength >= 3000) {
      score += 1.0
    } else if (maxLength >= 2000) {
      score += 0.7
    } else if (maxLength >= 1000) {
      score += 0.5
    }

    return Math.min(score, 10)
  }

  /**
   * 计算雪道分布多样性
   * 使用熵的概念，分布越均匀多样性越高
   */
  _calculateTrailDiversity(trails) {
    const total = trails.total || trails.totalCount || 1
    const counts = [
      trails.beginner || 0,
      trails.intermediate || 0,
      trails.advanced || 0,
      trails.expert || 0
    ]

    // 如果没有雪道信息，返回中等分数
    if (total === 0) return 0.5

    // 计算每个难度级别的比例
    const proportions = counts.map(count => count / total).filter(p => p > 0)

    // 如果只有一种难度，多样性最低
    if (proportions.length === 1) return 0.3

    // 如果有2-3种难度，根据分布均匀度评分
    if (proportions.length === 2) return 0.6
    if (proportions.length === 3) return 0.8

    // 如果有4种难度，多样性最高
    return 1.0
  }

  /**
   * 评估设施完善度
   * 基于11种设施的可用性
   */
  _evaluateFacilities(resort) {
    const facilities = resort.facilities || {}
    const facilityList = [
      'rental',       // 租赁
      'parking',      // 停车
      'restaurant',   // 餐厅
      'hotel',        // 住宿
      'locker',       // 储物柜
      'nightSkiing',  // 夜场
      'coach',        // 教练
      'magicCarpet',  // 魔毯
      'cableCar',     // 缆车
      'snowPark',     // 单板公园
      'kidsArea'      // 儿童区
    ]

    // 计算有多少设施可用
    const availableCount = facilityList.filter(f => facilities[f] === true).length

    // 转换为0-10分
    return (availableCount / facilityList.length) * 10
  }

  /**
   * 标准化用户评分
   * 将0-5分转换为0-10分
   */
  _normalizeRating(rating) {
    return (rating / 5) * 10
  }

  /**
   * 标准化人气值
   * 将0-100转换为0-10分
   */
  _normalizePopularity(popularity) {
    return (popularity / 100) * 10
  }

  /**
   * 四舍五入到小数点后1位
   */
  _roundScore(score) {
    return Math.round(score * 10) / 10
  }
}
