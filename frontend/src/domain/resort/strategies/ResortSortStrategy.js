/**
 * 滑雪场排序策略
 * 封装所有排序逻辑，方便后续调整和扩展
 */
export class ResortSortStrategy {
  /**
   * 默认排序：按人气排序
   * TODO: 后续可以综合考虑：搜索量、评论数、打卡量等
   * 当前实现：简单按搜索量（popularity字段）
   */
  sortByPopularity(resorts) {
    return [...resorts].sort((a, b) => {
      // 人气值越高，排名越靠前
      return (b.popularity || 0) - (a.popularity || 0)
    })
  }

  /**
   * 搜索排序：按相关度排序
   * TODO: 后续可以综合考虑：距离、匹配度、人气等
   * 当前实现：简单按距离排序（如果有用户位置）
   *
   * @param {Array} resorts - 滑雪场列表
   * @param {String} keyword - 搜索关键词
   * @param {Object} userLocation - 用户位置 {latitude, longitude}
   */
  sortByRelevance(resorts, keyword, userLocation = null) {
    // 如果有用户位置，按距离排序
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      return this._sortByDistance(resorts, userLocation)
    }

    // 如果没有用户位置，按名称匹配度和人气综合排序
    return this._sortByMatchScore(resorts, keyword)
  }

  /**
   * 按距离排序（从近到远）
   * 使用 Haversine 公式计算两点间距离
   */
  _sortByDistance(resorts, userLocation) {
    const resortsWithDistance = resorts.map(resort => ({
      ...resort,
      distance: this._calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        resort.latitude,
        resort.longitude
      )
    }))

    return resortsWithDistance.sort((a, b) => a.distance - b.distance)
  }

  /**
   * 按匹配度排序
   * 匹配度 = 名称匹配分数 * 0.7 + 人气分数 * 0.3
   */
  _sortByMatchScore(resorts, keyword) {
    const keywordLower = keyword.toLowerCase()

    const resortsWithScore = resorts.map(resort => {
      const name = (resort.name || '').toLowerCase()

      // 计算名称匹配分数（0-100）
      let nameScore = 0
      if (name === keywordLower) {
        nameScore = 100 // 完全匹配
      } else if (name.startsWith(keywordLower)) {
        nameScore = 80 // 开头匹配
      } else if (name.includes(keywordLower)) {
        nameScore = 60 // 包含匹配
      } else {
        nameScore = 0 // 不匹配
      }

      // 人气分数（0-100）
      const popularityScore = Math.min((resort.popularity || 0) / 100, 100)

      // 综合分数
      const matchScore = nameScore * 0.7 + popularityScore * 0.3

      return {
        ...resort,
        matchScore
      }
    })

    return resortsWithScore.sort((a, b) => b.matchScore - a.matchScore)
  }

  /**
   * 计算两点间距离（单位：公里）
   * 使用 Haversine 公式
   */
  _calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // 地球半径（公里）
    const dLat = this._toRad(lat2 - lat1)
    const dLon = this._toRad(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._toRad(lat1)) *
      Math.cos(this._toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return distance
  }

  _toRad(degrees) {
    return degrees * (Math.PI / 180)
  }
}
