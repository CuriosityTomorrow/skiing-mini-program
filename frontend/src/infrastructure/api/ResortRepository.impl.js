import { Resort } from '../../domain/resort/entities/Resort.entity';
import {
  IResortRepository,
  ResortSearchCriteria,
} from '../../domain/resort/repositories/IResortRepository';
import { cloudFunctionClient } from './CloudFunctionClient';

/**
 * 滑雪场仓储实现
 *
 * 技术细节：
 * - 通过云函数调用云数据库
 * - 处理数据转换（数据库实体 -> 领域实体）
 */
export class ResortRepositoryImpl {
  async search(criteria) {
    const result = await cloudFunctionClient.callFunction(
      'resort-search',
      {
        keyword: criteria.keyword,
        type: criteria.type,
        limit: criteria.limit,
        offset: criteria.offset,
      }
    );

    if (result.code !== 0 || !result.data) {
      console.error('[搜索滑雪场] 失败:', result.message);
      return [];
    }

    return result.data.map((data) => this.mapToEntity(data));
  }

  async findById(id) {
    const result = await cloudFunctionClient.callFunction(
      'resort-detail',
      { id }
    );

    if (result.code !== 0 || !result.data) {
      console.error('[获取滑雪场详情] 失败:', result.message);
      return null;
    }

    return this.mapToEntity(result.data);
  }

  async getPopularResorts(limit) {
    // 复用搜索接口，不传关键词即可
    return this.search(
      new ResortSearchCriteria(undefined, undefined, undefined, undefined, limit, 0)
    );
  }

  async save(resort) {
    // 暂不实现保存功能（管理员功能）
    console.warn('[保存滑雪场] 暂未实现');
  }

  async count(criteria) {
    // 简化实现：返回固定值（可以后续优化）
    return 0;
  }

  /**
   * 数据映射：数据库实体 -> 领域实体
   */
  mapToEntity(data) {
    const {
      Location,
      Facilities,
      OperatingHours,
      Ticket,
      TrailInfo,
    } = require('../../domain/resort/entities/Resort.entity');

    return new Resort(
      data._id,
      data.name,
      new Location(
        data.province,
        data.city,
        data.address,
        data.latitude,
        data.longitude
      ),
      data.type,
      new Facilities(
        data.facilities.hasRental,
        data.facilities.hasParking,
        data.facilities.hasRestaurant,
        data.facilities.hasHotel,
        data.facilities.hasNightSkiing
      ),
      new OperatingHours(data.openHour, data.closeHour),
      data.tickets.map(
        (t) => new Ticket(t.type, t.price, t.description)
      ),
      new TrailInfo(
        data.trails.totalCount,
        data.trails.beginner,
        data.trails.intermediate,
        data.trails.advanced,
        data.trails.expert
      ),
      data.popularity,
      data.rating,
      new Date(data.createdAt || data.createTime),
      new Date(data.updatedAt)
    );
  }
}
