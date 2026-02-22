/**
 * 滑雪场筛选领域服务（Nomads风格）
 *
 * 设计理念：
 * - 数据驱动：20+维度的精细筛选
 * - 组合过滤：支持多条件叠加
 * - 高性能：纯内存过滤
 */
export class ResortFilterService {
  /**
   * 应用所有筛选条件
   *
   * @param {Array<Resort>} resorts - 滑雪场列表
   * @param {Object} filters - 筛选条件（来自 FilterSchema）
   * @returns {Array<Resort>} 过滤后的滑雪场列表
   */
  applyFilters(resorts, filters) {
    if (!filters || Object.keys(filters).length === 0) {
      return resorts;
    }

    let filtered = [...resorts];

    // 1. 价格筛选
    filtered = this.filterByPrice(filtered, filters);

    // 2. 难度筛选
    filtered = this.filterByDifficulty(filtered, filters);

    // 3. 位置筛选
    filtered = this.filterByLocation(filtered, filters);

    // 4. 类型筛选
    filtered = this.filterByType(filtered, filters);

    // 5. 设施筛选
    filtered = this.filterByFacilities(filtered, filters);

    // 6. 雪道筛选
    filtered = this.filterByTrails(filtered, filters);

    // 7. 季节筛选
    filtered = this.filterBySeason(filtered, filters);

    // 8. 适合人群筛选
    filtered = this.filterBySuitability(filtered, filters);

    // 9. 评分筛选
    filtered = this.filterByRating(filtered, filters);

    // 10. 标签筛选
    filtered = this.filterByTags(filtered, filters);

    return filtered;
  }

  /**
   * 价格筛选
   * 支持：价格区间、价格等级
   */
  filterByPrice(resorts, filters) {
    let filtered = resorts;

    // 价格区间筛选（基于日票价格）
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      filtered = filtered.filter(resort => {
        const price = resort.pricing?.daily || resort.pricing?.avgCost || 0;
        return (!min || price >= min) && (!max || price <= max);
      });
    }

    // 价格等级筛选
    if (filters.priceLevel) {
      filtered = filtered.filter(resort => {
        const avgCost = resort.pricing?.avgCost || resort.pricing?.daily || 0;
        switch (filters.priceLevel) {
          case 'budget':    // 预算型 <300
            return avgCost < 300;
          case 'mid':       // 中端 300-600
            return avgCost >= 300 && avgCost <= 600;
          case 'luxury':    // 高端 >600
            return avgCost > 600;
          default:
            return true;
        }
      });
    }

    return filtered;
  }

  /**
   * 难度筛选
   * 支持：初级、中级、高级、专家级雪道
   */
  filterByDifficulty(resorts, filters) {
    if (!filters.difficulty || filters.difficulty.length === 0) {
      return resorts;
    }

    return resorts.filter(resort => {
      const trails = resort.trails || {};
      return filters.difficulty.some(level => {
        switch (level) {
          case 'beginner':
            return (trails.beginner || 0) > 0;
          case 'intermediate':
            return (trails.intermediate || 0) > 0;
          case 'advanced':
            return (trails.advanced || 0) > 0;
          case 'expert':
            return (trails.expert || 0) > 0;
          default:
            return false;
        }
      });
    });
  }

  /**
   * 位置筛选
   * 支持：省份、最大距离
   */
  filterByLocation(resorts, filters) {
    let filtered = resorts;

    // 省份筛选
    if (filters.provinces && filters.provinces.length > 0) {
      filtered = filtered.filter(resort =>
        filters.provinces.includes(resort.location?.province)
      );
    }

    // 距离筛选（需要先计算距离）
    if (filters.maxDistance) {
      filtered = filtered.filter(resort =>
        !resort.location?.distance || resort.location.distance <= filters.maxDistance
      );
    }

    return filtered;
  }

  /**
   * 类型筛选
   * 支持：室内、室外、全部
   */
  filterByType(resorts, filters) {
    if (!filters.resortType || filters.resortType === 'all') {
      return resorts;
    }

    return resorts.filter(resort => resort.type === filters.resortType);
  }

  /**
   * 设施筛选
   * 支持：租赁、夜场、酒店、餐厅等
   */
  filterByFacilities(resorts, filters) {
    if (!filters.requiredFacilities || filters.requiredFacilities.length === 0) {
      return resorts;
    }

    return resorts.filter(resort => {
      const facilities = resort.facilities || {};
      // 必须满足所有要求的设施
      return filters.requiredFacilities.every(facility => {
        switch (facility) {
          case 'rental':
            return facilities.rental === true;
          case 'nightSkiing':
            return facilities.nightSkiing === true;
          case 'hotel':
            return facilities.hotel === true;
          case 'restaurant':
            return facilities.restaurant === true;
          case 'parking':
            return facilities.parking === true;
          case 'locker':
            return facilities.locker === true;
          case 'coach':
            return facilities.coach === true;
          case 'magicCarpet':
            return facilities.magicCarpet === true;
          case 'cableCar':
            return facilities.cableCar === true;
          case 'snowPark':
            return facilities.snowPark === true;
          case 'kidsArea':
            return facilities.kidsArea === true;
          default:
            return false;
        }
      });
    });
  }

  /**
   * 雪道筛选
   * 支持：最少雪道数、雪道类型
   */
  filterByTrails(resorts, filters) {
    let filtered = resorts;

    // 最少雪道数筛选
    if (filters.minTrails) {
      filtered = filtered.filter(resort =>
        (resort.trails?.total || 0) >= filters.minTrails
      );
    }

    // 雪道类型筛选（与难度筛选类似但逻辑不同）
    if (filters.trailTypes && filters.trailTypes.length > 0) {
      filtered = filtered.filter(resort => {
        const trails = resort.trails || {};
        return filters.trailTypes.every(type => {
          const count = trails[type] || 0;
          return count > 0;
        });
      });
    }

    return filtered;
  }

  /**
   * 季节筛选
   * 支持：可用月份、是否开放、雪质类型
   */
  filterBySeason(resorts, filters) {
    let filtered = resorts;

    // 可用月份筛选
    if (filters.availableIn && filters.availableIn.length > 0) {
      filtered = filtered.filter(resort => {
        const season = resort.season;
        if (!season) return false;

        return filters.availableIn.some(month => {
          // 判断该月份是否在营业范围内
          const openMonth = season.openMonth || 0;
          const closeMonth = season.closeMonth || 0;

          // 跨年情况（如11月-4月）
          if (openMonth > closeMonth) {
            return month >= openMonth || month <= closeMonth;
          }
          // 不跨年情况
          else {
            return month >= openMonth && month <= closeMonth;
          }
        });
      });
    }

    // 是否开放筛选
    if (filters.isOpenNow === true) {
      filtered = filtered.filter(resort =>
        resort.season?.status === 'open'
      );
    }

    // 雪质类型筛选
    if (filters.snowQuality && filters.snowQuality.length > 0) {
      filtered = filtered.filter(resort =>
        filters.snowQuality.includes(resort.season?.snowQuality)
      );
    }

    return filtered;
  }

  /**
   * 适合人群筛选
   * 支持：新手、家庭、高手、周末游、度假
   */
  filterBySuitability(resorts, filters) {
    if (!filters.suitableFor || filters.suitableFor.length === 0) {
      return resorts;
    }

    return resorts.filter(resort => {
      const suitability = resort.suitableFor || {};
      // 至少满足一个适合人群
      return filters.suitableFor.some(type => suitability[type] === true);
    });
  }

  /**
   * 评分筛选
   * 支持：最低评分
   */
  filterByRating(resorts, filters) {
    if (!filters.minRating) {
      return resorts;
    }

    return resorts.filter(resort =>
      (resort.community?.rating || 0) >= filters.minRating
    );
  }

  /**
   * 标签筛选
   * 支持：必须包含指定标签
   */
  filterByTags(resorts, filters) {
    if (!filters.tags || filters.tags.length === 0) {
      return resorts;
    }

    return resorts.filter(resort => {
      const resortTags = resort.tags || [];
      // 至少包含一个指定标签
      return filters.tags.some(tag => resortTags.includes(tag));
    });
  }

  /**
   * 获取可用的筛选选项（用于动态生成筛选器UI）
   *
   * @param {Array<Resort>} resorts - 当前滑雪场列表
   * @returns {Object} 可用的筛选选项
   */
  getAvailableFilterOptions(resorts) {
    const options = {
      provinces: new Set(),
      tags: new Set(),
      facilities: {},
      priceRange: { min: Infinity, max: 0 },
      trailCountRange: { min: Infinity, max: 0 },
      hasIndoor: false,
      hasOutdoor: false,
    };

    resorts.forEach(resort => {
      // 省份
      if (resort.location?.province) {
        options.provinces.add(resort.location.province);
      }

      // 标签
      if (resort.tags) {
        resort.tags.forEach(tag => options.tags.add(tag));
      }

      // 设施统计
      if (resort.facilities) {
        Object.keys(resort.facilities).forEach(facility => {
          if (resort.facilities[facility]) {
            options.facilities[facility] = (options.facilities[facility] || 0) + 1;
          }
        });
      }

      // 价格范围
      const price = resort.pricing?.avgCost || resort.pricing?.daily || 0;
      if (price > 0) {
        options.priceRange.min = Math.min(options.priceRange.min, price);
        options.priceRange.max = Math.max(options.priceRange.max, price);
      }

      // 雪道数量范围
      const trailCount = resort.trails?.total || 0;
      if (trailCount > 0) {
        options.trailCountRange.min = Math.min(options.trailCountRange.min, trailCount);
        options.trailCountRange.max = Math.max(options.trailCountRange.max, trailCount);
      }

      // 类型
      if (resort.type === 'indoor') options.hasIndoor = true;
      if (resort.type === 'outdoor') options.hasOutdoor = true;
    });

    // 转换 Set 为 Array
    options.provinces = Array.from(options.provinces).sort();
    options.tags = Array.from(options.tags).sort();

    // 价格范围调整为整百
    options.priceRange.min = Math.floor(options.priceRange.min / 100) * 100;
    options.priceRange.max = Math.ceil(options.priceRange.max / 100) * 100;

    return options;
  }
}
