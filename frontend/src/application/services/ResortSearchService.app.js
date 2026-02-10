import { ResortSearchService } from '../../domain/resort/services/ResortSearchService.domain';
import { ResortSearchCriteria } from '../../domain/resort/repositories/IResortRepository';
import { ResortDTO, ResortSearchParams } from '../dto/ResortDTO';
import { resortMapper } from '../mappers/ResortMapper';

/**
 * 滑雪场搜索应用服务
 *
 * 职责：
 * - 编排用例流程
 * - 调用领域服务
 * - DTO转换
 */
export class ResortSearchAppService {
  constructor(domainService) {
    this.domainService = domainService
  }

  /**
   * 搜索滑雪场用例
   */
  async searchResorts(params) {
    // 1. 构建搜索条件（领域对象）
    const criteria = new ResortSearchCriteria(
      params.keyword,
      params.type,
      undefined, // province
      undefined, // city
      params.limit || 20,
      params.offset || 0
    );

    // 2. 调用领域服务执行搜索
    const resorts = await this.domainService.search(criteria);

    // 3. 转换为DTO（返回给表现层）
    return resortMapper.toDTOList(resorts);
  }

  /**
   * 获取滑雪场详情用例
   */
  async getResortDetail(id) {
    const resort = await this.domainService.getDetail(id);

    if (!resort) {
      return null;
    }

    return resortMapper.toDTO(resort);
  }
}
