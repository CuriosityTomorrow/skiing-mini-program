import { Resort } from '../entities/Resort.entity';

/**
 * 搜索条件值对象
 */
export class ResortSearchCriteria {
  constructor(
    keyword,
    type,
    province,
    city,
    limit = 20,
    offset = 0
  ) {
    this.keyword = keyword
    this.type = type
    this.province = province
    this.city = city
    this.limit = limit
    this.offset = offset
  }
}
