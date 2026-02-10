import { Resort } from '../entities/Resort.entity';
import { IResortRepository, ResortSearchCriteria } from '../repositories/IResortRepository';

/**
 * 滑雪场搜索领域服务
 *
 * 职责：
 * - 编排搜索逻辑
 * - 结果排序和过滤
 */
export class ResortSearchService {
  constructor(repository) {
    this.repository = repository
  }

  /**
   * 搜索滑雪场
   *
   * 业务规则：
   * 1. 如果没有关键词，返回热门滑雪场
   * 2. 如果有关键词，按相关度排序
   * 3. 支持室内/室外筛选
   */
  async search(criteria) {
    let resorts;

    // 场景1：无搜索关键词 - 返回热门滑雪场
    if (!criteria.keyword || criteria.keyword.trim() === '') {
      resorts = await this.repository.getPopularResorts(criteria.limit);
    }
    // 场景2：有搜索关键词 - 搜索并排序
    else {
      resorts = await this.repository.search(criteria);

      // 按相关度排序（领域行为）
      resorts.sort((a, b) => {
        const scoreA = a.calculateMatchScore(criteria.keyword);
        const scoreB = b.calculateMatchScore(criteria.keyword);
        return scoreB - scoreA;
      });
    }

    // 应用筛选条件
    if (criteria.type) {
      resorts = resorts.filter((r) =>
        criteria.type === 'indoor' ? r.isIndoor() : r.isOutdoor()
      );
    }

    return resorts;
  }

  /**
   * 获取滑雪场详情
   */
  async getDetail(id) {
    return this.repository.findById(id);
  }
}
