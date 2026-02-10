/**
 * 依赖注入容器配置
 *
 * 注册所有依赖关系，遵循依赖倒置原则（DIP）
 */

import { ResortSearchService } from '../domain/resort/services/ResortSearchService.domain';
import { ResortRepositoryImpl } from '../infrastructure/api/ResortRepository.impl';
import { ResortSearchAppService } from '../application/services/ResortSearchService.app';

/**
 * 依赖注入容器
 *
 * 使用单例模式管理依赖关系
 */
class DIContainer {
  constructor() {
    this.resortRepository = null
    this.resortSearchService = null
    this.resortSearchAppService = null
  }

  /**
   * 获取滑雪场仓储
   */
  getResortRepository() {
    if (!this.resortRepository) {
      this.resortRepository = new ResortRepositoryImpl();
    }
    return this.resortRepository;
  }

  /**
   * 获取滑雪场搜索领域服务
   */
  getResortSearchService() {
    if (!this.resortSearchService) {
      this.resortSearchService = new ResortSearchService(
        this.getResortRepository()
      );
    }
    return this.resortSearchService;
  }

  /**
   * 获取滑雪场搜索应用服务
   */
  getResortSearchAppService() {
    if (!this.resortSearchAppService) {
      this.resortSearchAppService = new ResortSearchAppService(
        this.getResortSearchService()
      );
    }
    return this.resortSearchAppService;
  }

  /**
   * 重置所有依赖（测试用）
   */
  reset() {
    this.resortRepository = null;
    this.resortSearchService = null;
    this.resortSearchAppService = null;
  }
}

// 导出单例
export const diContainer = new DIContainer();
