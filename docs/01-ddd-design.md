# DDD 领域设计详解

## 1. 领域层（Domain Layer）

### 1.1 滑雪场聚合（Resort Aggregate）

```typescript
// frontend/src/domain/resort/entities/Resort.entity.ts

/**
 * 滑雪场实体（聚合根）
 *
 * 业务规则：
 * - 滑雪场必须有名称、位置信息
 * - 人气排名 1-100
 * - 评分 0-5
 */
export class Resort {
  constructor(
    readonly id: string,
    private _name: string,
    private _location: Location,
    private _type: ResortType,
    private _facilities: Facilities,
    private _operatingHours: OperatingHours,
    private _tickets: Ticket[],
    private _trails: TrailInfo,
    private _popularity: number, // 1-100
    private _rating: number,      // 0-5
    readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  // Getters
  get name(): string { return this._name; }
  get location(): Location { return this._location; }
  get type(): ResortType { return this._type; }
  get facilities(): Facilities { return this._facilities; }
  get operatingHours(): OperatingHours { return this._operatingHours; }
  get tickets(): Ticket[] { return [...this._tickets]; }
  get trails(): TrailInfo { return this._trails; }
  get popularity(): number { return this._popularity; }
  get rating(): number { return this._rating; }

  // 领域行为：更新评分
  updateRating(newRating: number): void {
    if (newRating < 0 || newRating > 5) {
      throw new Error('评分必须在0-5之间');
    }
    this._rating = newRating;
    this._updatedAt = new Date();
  }

  // 领域行为：是否室内滑雪场
  isIndoor(): boolean {
    return this._type === ResortType.INDOOR;
  }

  // 领域行为：是否室外滑雪场
  isOutdoor(): boolean {
    return this._type === ResortType.OUTDOOR;
  }

  // 领域行为：计算匹配度（用于搜索排序）
  calculateMatchScore(searchQuery: string): number {
    const nameMatch = this._name.toLowerCase().includes(searchQuery.toLowerCase()) ? 50 : 0;
    const cityMatch = this._location.city.toLowerCase().includes(searchQuery.toLowerCase()) ? 30 : 0;
    const provinceMatch = this._location.province.toLowerCase().includes(searchQuery.toLowerCase()) ? 20 : 0;
    return nameMatch + cityMatch + provinceMatch + this._popularity;
  }

  // 领域行为：是否营业中
  isOpenNow(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= this._operatingHours.openHour &&
           currentHour < this._operatingHours.closeHour;
  }
}

// 值对象：位置
export class Location {
  constructor(
    readonly province: string,
    readonly city: string,
    readonly address: string,
    readonly coordinates: Coordinates
  ) {}

  get fullAddress(): string {
    return `${this.province}${this.city}${this.address}`;
  }

  // 值对象是不可变的，通过equals判断相等
  equals(other: Location): boolean {
    return this.province === other.province &&
           this.city === other.city &&
           this.address === other.address;
  }
}

// 值对象：坐标
export class Coordinates {
  constructor(readonly latitude: number, readonly longitude: number) {}
}

// 枚举：滑雪场类型
export enum ResortType {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor'
}

// 值对象：设施
export class Facilities {
  constructor(
    readonly hasRental: boolean,
    readonly hasParking: boolean,
    readonly hasRestaurant: boolean,
    readonly hasHotel: boolean,
    readonly hasNightSkiing: boolean
  ) {}
}

// 值对象：营业时间
export class OperatingHours {
  constructor(
    readonly openHour: number,
    readonly closeHour: number,
    readonly seasonalSchedule?: SeasonalSchedule
  ) {}
}

// 值对象：季节性营业时间
export class SeasonalSchedule {
  constructor(
    readonly winterSeason: { start: string; end: string },
    readonly summerSeason?: { start: string; end: string }
  ) {}
}

// 值对象：票价
export class Ticket {
  constructor(
    readonly type: string,        // 成人票/儿童票/全天票/半天票
    readonly price: number,
    readonly description?: string
  ) {}
}

// 值对象：雪道信息
export class TrailInfo {
  constructor(
    readonly totalCount: number,
    readonly beginner: number,      // 初级道数量
    readonly intermediate: number,  // 中级道数量
    readonly advanced: number,      // 高级道数量
    readonly expert: number         // 专家道数量
  ) {}

  // 领域逻辑：获得适合新手的滑雪场
  isBeginnerFriendly(): boolean {
    return this.beginner >= this.totalCount * 0.3; // 初级道占30%以上
  }
}
```

### 1.2 仓储接口（Repository Interface）

```typescript
// frontend/src/domain/resort/repositories/IResortRepository.ts

import { Resort } from '../entities/Resort.entity';

export interface IResortRepository {
  // 根据搜索条件查询滑雪场
  search(criteria: ResortSearchCriteria): Promise<Resort[]>;

  // 根据ID获取滑雪场
  findById(id: string): Promise<Resort | null>;

  // 获取热门滑雪场
  getPopularResorts(limit: number): Promise<Resort[]>;

  // 保存滑雪场（从高德数据同步时使用）
  save(resort: Resort): Promise<void>;

  // 检查缓存是否存在
  existsInCache(key: string): Promise<boolean>;
}

// 搜索条件（值对象）
export class ResortSearchCriteria {
  constructor(
    readonly keyword?: string,        // 关键词（城市/省份/滑雪场名）
    readonly type?: ResortType,       // 室内/室外筛选
    readonly province?: string,        // 省份筛选
    readonly city?: string,            // 城市筛选
    readonly limit: number = 20,       // 返回数量限制
    readonly offset: number = 0        // 分页偏移
  ) {}
}
```

### 1.3 领域服务（Domain Service）

```typescript
// frontend/src/domain/resort/services/ResortSearchService.domain.ts

import { Resort } from '../entities/Resort.entity';
import { IResortRepository, ResortSearchCriteria } from '../repositories/IResortRepository';
import { injectable, inject } from 'tsyringe';

/**
 * 滑雪场搜索领域服务
 *
 * 职责：
 * - 编排搜索逻辑
 * - 整合多数据源（缓存 + 高德API）
 * - 结果排序和过滤
 */
@injectable()
export class ResortSearchService {
  constructor(
    @inject('IResortRepository') private repository: IResortRepository
  ) {}

  /**
   * 搜索滑雪场
   *
   * 业务规则：
   * 1. 如果没有关键词，返回热门滑雪场
   * 2. 如果有关键词，按相关度排序
   * 3. 支持室内/室外筛选
   */
  async search(criteria: ResortSearchCriteria): Promise<Resort[]> {
    let resorts: Resort[];

    // 场景1：无搜索关键词 - 返回热门滑雪场
    if (!criteria.keyword || criteria.keyword.trim() === '') {
      resorts = await this.repository.getPopularResorts(criteria.limit);
    }
    // 场景2：有搜索关键词 - 搜索并排序
    else {
      resorts = await this.repository.search(criteria);

      // 按相关度排序（领域行为）
      resorts.sort((a, b) =>
        b.calculateMatchScore(criteria.keyword!) - a.calculateMatchScore(criteria.keyword!)
      );
    }

    // 应用筛选条件
    if (criteria.type) {
      resorts = resorts.filter(r =>
        criteria.type === 'indoor' ? r.isIndoor() : r.isOutdoor()
      );
    }

    return resorts;
  }
}
```

## 2. 应用层（Application Layer）

### 2.1 应用服务（Application Service）

```typescript
// frontend/src/application/services/ResortSearchService.app.ts

import { ResortSearchService } from '@/domain/resort/services/ResortSearchService.domain';
import { ResortSearchCriteria } from '@/domain/resort/repositories/IResortRepository';
import { ResortDTO } from '../dto/ResortDTO';
import { ResortMapper } from '../mappers/ResortMapper';
import { injectable, inject } from 'tsyringe';

/**
 * 滑雪场搜索应用服务
 *
 * 职责：
 * - 编排用例流程
 * - 调用领域服务
 * - DTO转换
 * - 处理横切关注点（日志、缓存等）
 */
@injectable()
export class ResortSearchAppService {
  constructor(
    @inject('ResortSearchService') private domainService: ResortSearchService,
    @inject('ResortMapper') private mapper: ResortMapper
  ) {}

  /**
   * 搜索滑雪场用例
   *
   * @param request 搜索请求DTO
   * @returns 滑雪场列表DTO
   */
  async searchResorts(request: SearchResortsRequest): Promise<ResortDTO[]> {
    // 1. 构建搜索条件（领域对象）
    const criteria = new ResortSearchCriteria(
      request.keyword,
      request.type ? this.mapToResortType(request.type) : undefined,
      undefined,
      undefined,
      request.limit || 20,
      request.offset || 0
    );

    // 2. 调用领域服务执行搜索
    const resorts = await this.domainService.search(criteria);

    // 3. 转换为DTO（返回给表现层）
    return resorts.map(resort => this.mapper.toDTO(resort));
  }

  private mapToResortType(type: string): 'indoor' | 'outdoor' {
    return type === 'indoor' ? 'indoor' : 'outdoor';
  }
}

// 请求DTO
export interface SearchResortsRequest {
  keyword?: string;
  type?: 'indoor' | 'outdoor';
  limit?: number;
  offset?: number;
}
```

### 2.2 DTO（Data Transfer Object）

```typescript
// frontend/src/application/dto/ResortDTO.ts

/**
 * 滑雪场数据传输对象
 *
 * 用途：在应用层和表现层之间传输数据
 * 特点：纯数据容器，无业务逻辑
 */
export interface ResortDTO {
  id: string;
  name: string;
  province: string;
  city: string;
  address: string;
  type: 'indoor' | 'outdoor';
  facilities: {
    hasRental: boolean;
    hasParking: boolean;
    hasRestaurant: boolean;
    hasHotel: boolean;
    hasNightSkiing: boolean;
  };
  openTime: string;
  closeTime: string;
  tickets: Array<{
    type: string;
    price: number;
    description?: string;
  }>;
  trails: {
    totalCount: number;
    beginner: number;
    intermediate: number;
    advanced: number;
    expert: number;
  };
  popularity: number;
  rating: number;
  isOpenNow: boolean;
}

// DTO转换器（Mapper）
export class ResortMapper {
  toDTO(resort: Resort): ResortDTO {
    return {
      id: resort.id,
      name: resort.name,
      province: resort.location.province,
      city: resort.location.city,
      address: resort.location.address,
      type: resort.type,
      facilities: {
        hasRental: resort.facilities.hasRental,
        hasParking: resort.facilities.hasParking,
        hasRestaurant: resort.facilities.hasRestaurant,
        hasHotel: resort.facilities.hasHotel,
        hasNightSkiing: resort.facilities.hasNightSkiing,
      },
      openTime: `${resort.operatingHours.openHour}:00`,
      closeTime: `${resort.operatingHours.closeHour}:00`,
      tickets: resort.tickets.map(t => ({
        type: t.type,
        price: t.price,
        description: t.description,
      })),
      trails: {
        totalCount: resort.trails.totalCount,
        beginner: resort.trails.beginner,
        intermediate: resort.trails.intermediate,
        advanced: resort.trails.advanced,
        expert: resort.trails.expert,
      },
      popularity: resort.popularity,
      rating: resort.rating,
      isOpenNow: resort.isOpenNow(),
    };
  }
}
```

## 3. 基础设施层（Infrastructure Layer）

### 3.1 仓储实现（Repository Implementation）

```typescript
// frontend/src/infrastructure/api/ResortRepository.impl.ts

import { IResortRepository, ResortSearchCriteria } from '@/domain/resort/repositories/IResortRepository';
import { Resort } from '@/domain/resort/entities/Resort.entity';
import { AmapService } from './AmapService';
import { injectable, inject } from 'tsyringe';
import tcb from 'tcb-js-sdk';

/**
 * 滑雪场仓储实现
 *
 * 技术细节：
 * - 整合云数据库和高德地图API
 * - 实现缓存策略
 * - 处理数据转换
 */
@injectable()
export class ResortRepositoryImpl implements IResortRepository {
  private db: tcb.Database;

  constructor(
    @inject('AmapService') private amapService: AmapService
  ) {
    // 初始化云数据库
    const app = tcb.init({ env: 'your-env-id' });
    this.db = app.database();
  }

  async search(criteria: ResortSearchCriteria): Promise<Resort[]> {
    // 1. 先查云数据库缓存
    const cachedResults = await this.searchFromDatabase(criteria);

    // 2. 如果缓存有数据，直接返回
    if (cachedResults.length > 0) {
      return cachedResults;
    }

    // 3. 缓存未命中，调用高德地图API
    const amapResults = await this.searchFromAmap(criteria);

    // 4. 保存到云数据库（作为缓存）
    await this.cacheToDatabase(amapResults);

    return amapResults;
  }

  async findById(id: string): Promise<Resort | null> {
    const result = await this.db.collection('resorts').doc(id).get();

    if (!result.data || result.data.length === 0) {
      return null;
    }

    return this.mapToEntity(result.data[0]);
  }

  async getPopularResorts(limit: number): Promise<Resort[]> {
    const result = await this.db
      .collection('resorts')
      .orderBy('popularity', 'desc')
      .limit(limit)
      .get();

    return result.data.map(item => this.mapToEntity(item));
  }

  async save(resort: Resort): Promise<void> {
    await this.db.collection('resorts').add({
      _id: resort.id,
      ...this.mapToData(resort),
    });
  }

  async existsInCache(key: string): Promise<boolean> {
    const result = await this.db
      .collection('resort_cache')
      .where({ key })
      .count();

    return result.total > 0;
  }

  // 私有方法：从云数据库搜索
  private async searchFromDatabase(criteria: ResortSearchCriteria): Promise<Resort[]> {
    let query = this.db.collection('resorts');

    // 构建查询条件
    if (criteria.keyword) {
      query = query.where({
        $or: [
          { name: new RegExp(criteria.keyword, 'i') },
          { city: new RegExp(criteria.keyword, 'i') },
          { province: new RegExp(criteria.keyword, 'i') },
        ],
      });
    }

    if (criteria.type) {
      query = query.where({ type: criteria.type });
    }

    const result = await query
      .limit(criteria.limit)
      .skip(criteria.offset)
      .get();

    return result.data.map(item => this.mapToEntity(item));
  }

  // 私有方法：从高德地图API搜索
  private async searchFromAmap(criteria: ResortSearchCriteria): Promise<Resort[]> {
    const keyword = criteria.keyword || '滑雪场';
    const city = criteria.city || criteria.province || undefined;

    const amapData = await this.amapService.searchText({
      keyword,
      city,
      types: this.getAmapSkiResortTypeCode(criteria.type),
    });

    return amapData.map(item => this.convertAmapToResort(item));
  }

  // 私有方法：缓存到数据库
  private async cacheToDatabase(resorts: Resort[]): Promise<void> {
    const batch = this.db.batch();

    resorts.forEach(resort => {
      const collection = this.db.collection('resorts');
      batch.add({
        collection,
        data: this.mapToData(resort),
      });
    });

    await batch.commit();
  }

  // 私有方法：数据映射（数据库实体 -> 领域实体）
  private mapToEntity(data: any): Resort {
    return new Resort(
      data._id,
      data.name,
      new Location(
        data.province,
        data.city,
        data.address,
        { latitude: data.latitude, longitude: data.longitude }
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
      data.tickets,
      new TrailInfo(
        data.trails.totalCount,
        data.trails.beginner,
        data.trails.intermediate,
        data.trails.advanced,
        data.trails.expert
      ),
      data.popularity,
      data.rating,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }

  // 私有方法：数据映射（领域实体 -> 数据库实体）
  private mapToData(resort: Resort): any {
    return {
      name: resort.name,
      province: resort.location.province,
      city: resort.location.city,
      address: resort.location.address,
      latitude: resort.location.coordinates.latitude,
      longitude: resort.location.coordinates.longitude,
      type: resort.type,
      facilities: {
        hasRental: resort.facilities.hasRental,
        hasParking: resort.facilities.hasParking,
        hasRestaurant: resort.facilities.hasRestaurant,
        hasHotel: resort.facilities.hasHotel,
        hasNightSkiing: resort.facilities.hasNightSkiing,
      },
      openHour: resort.operatingHours.openHour,
      closeHour: resort.operatingHours.closeHour,
      tickets: resort.tickets,
      trails: {
        totalCount: resort.trails.totalCount,
        beginner: resort.trails.beginner,
        intermediate: resort.trails.intermediate,
        advanced: resort.trails.advanced,
        expert: resort.trails.expert,
      },
      popularity: resort.popularity,
      rating: resort.rating,
      createdAt: resort.createdAt.toISOString(),
      updatedAt: resort.updatedAt.toISOString(),
    };
  }

  // 私有方法：获取高德地图分类代码
  private getAmapSkiResortTypeCode(type?: 'indoor' | 'outdoor'): string {
    // 高德地图POI分类代码
    // 110000: 旅游景点
    // 具体的滑雪场分类需要查高德文档
    return type === 'indoor' ? '室内滑雪场' : '滑雪场';
  }

  // 私有方法：高德数据转换为领域实体
  private convertAmapToResort(amapItem: any): Resort {
    // 这里需要根据高德API返回的实际数据结构进行转换
    return new Resort(
      amapItem.id,
      amapItem.name,
      new Location(
        amapItem.pname || '',      // 省份
        amapItem.cityname || '',   // 城市
        amapItem.address || '',    // 地址
        { latitude: amapItem.location.lat, longitude: amapItem.location.lng }
      ),
      this.detectResortType(amapItem),  // 根据名称或其他信息判断室内/室外
      new Facilities(false, false, false, false, false), // 需要从详细信息API获取
      new OperatingHours(9, 18),
      [],
      new TrailInfo(0, 0, 0, 0, 0),
      0,  // 人气需要从其他来源获取
      0,  // 评分需要从用户评价计算
      new Date(),
      new Date()
    );
  }

  private detectResortType(amapItem: any): 'indoor' | 'outdoor' {
    const name = amapItem.name.toLowerCase();
    return name.includes('室内') ? 'indoor' : 'outdoor';
  }
}
```

### 3.2 高德地图服务（Amap Service）

```typescript
// frontend/src/infrastructure/map/AmapService.ts

import amapFile from '@/static/amap-wx.js'; // 高德地图微信小程序SDK

/**
 * 高德地图服务
 *
 * 职责：
 * - 封装高德地图API调用
 * - 处理API响应
 * - 错误处理
 */
export class AmapService {
  private amap: any;

  constructor() {
    this.amap = new amapFile.AMapWX({
      key: 'your-amap-key',
    });
  }

  /**
   * 文本搜索（POI搜索）
   */
  async searchText(params: {
    keyword: string;
    city?: string;
    types?: string;
  }): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.amap.getPoiAround({
        keywords: params.keyword,
        city: params.city || '',
        success: (data: any) => {
          resolve(data.poisData || []);
        },
        fail: (error: any) => {
          reject(new Error(`高德地图API调用失败: ${error.errMsg}`));
        },
      });
    });
  }

  /**
   * 获取POI详细信息
   */
  async getDetail(id: string): Promise<any> {
    // 调用高德详情API
    return Promise.resolve({});
  }

  /**
   * 地理编码（地址 -> 坐标）
   */
  async geocode(address: string, city?: string): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      this.amap.getGeocode({
        address,
        city: city || '',
        success: (data: any) => {
          resolve({
            lat: data[0].latitude,
            lng: data[0].longitude,
          });
        },
        fail: (error: any) => {
          reject(new Error(`地理编码失败: ${error.errMsg}`));
        },
      });
    });
  }

  /**
   * 逆地理编码（坐标 -> 地址）
   */
  async reverseGeocode(lat: number, lng: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.amap.getRegeo({
        location: `${lng},${lat}`,
        success: (data: any) => {
          resolve(data[0]);
        },
        fail: (error: any) => {
          reject(new Error(`逆地理编码失败: ${error.errMsg}`));
        },
      });
    });
  }
}
```

## 4. 表现层（Interface Layer）

### 4.1 页面组件（Page Component）

```vue
<!-- frontend/src/interfaces/pages/resort/list.vue -->
<template>
  <view class="resort-list-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <uni-search-bar
        v-model="searchKeyword"
        placeholder="搜索城市、省份或滑雪场"
        @confirm="handleSearch"
        @clear="handleClear"
      />
    </view>

    <!-- 筛选器 -->
    <view class="filters">
      <uni-tag
        :text="filterType === 'all' ? '全部' : filterType === 'indoor' ? '室内' : '室外'"
        :type="filterType !== 'all' ? 'primary' : 'default'"
        @click="toggleFilter"
      />
    </view>

    <!-- 滑雪场列表 -->
    <scroll-view
      class="resort-list"
      scroll-y
      @scrolltolower="loadMore"
    >
      <view
        v-for="resort in resorts"
        :key="resort.id"
        class="resort-item"
        @click="goToDetail(resort.id)"
      >
        <view class="resort-header">
          <text class="resort-name">{{ resort.name }}</text>
          <view class="resort-type-tag">
            <uni-tag :text="resort.type === 'indoor' ? '室内' : '室外'" size="mini" />
          </view>
        </view>

        <view class="resort-location">
          <text class="location">{{ resort.city }} · {{ resort.province }}</text>
        </view>

        <view class="resort-info">
          <view class="info-item">
            <text class="label">雪道：</text>
            <text class="value">{{ resort.trails.totalCount }}条</text>
          </view>
          <view class="info-item">
            <text class="label">评分：</text>
            <uni-rate :value="resort.rating" readonly size="12" />
          </view>
          <view class="info-item">
            <text class="label">人气：</text>
            <text class="value">{{ resort.popularity }}</text>
          </view>
        </view>

        <view class="resort-status">
          <uni-tag
            :text="resort.isOpenNow ? '营业中' : '已关闭'"
            :type="resort.isOpenNow ? 'success' : 'warning'"
            size="mini"
          />
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="loading" class="loading">
        <uni-load-more status="loading" />
      </view>

      <!-- 无更多数据 -->
      <view v-if="!hasMore && resorts.length > 0" class="no-more">
        <uni-load-more status="noMore" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useResortList } from '@/interfaces/hooks/useResortList';

// 使用组合式函数封装页面逻辑
const {
  searchKeyword,
  filterType,
  resorts,
  loading,
  hasMore,
  handleSearch,
  handleClear,
  toggleFilter,
  loadMore,
  goToDetail,
} = useResortList();

onMounted(() => {
  // 初始加载：显示热门滑雪场
  handleSearch();
});
</script>

<style scoped lang="scss">
.resort-list-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.search-bar {
  padding: 20rpx;
  background-color: #fff;
}

.filters {
  padding: 20rpx;
  background-color: #fff;
  border-top: 1px solid #e5e5e5;
}

.resort-list {
  flex: 1;
  padding: 20rpx;
}

.resort-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.resort-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.resort-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.resort-location {
  margin-bottom: 20rpx;

  .location {
    font-size: 26rpx;
    color: #999;
  }
}

.resort-info {
  display: flex;
  gap: 30rpx;
  margin-bottom: 20rpx;

  .info-item {
    display: flex;
    align-items: center;
    gap: 8rpx;

    .label {
      font-size: 24rpx;
      color: #666;
    }

    .value {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.resort-status {
  display: flex;
  justify-content: flex-end;
}

.loading, .no-more {
  padding: 40rpx 0;
  text-align: center;
}
</style>
```

### 4.2 组合式函数（Composable）

```typescript
// frontend/src/interfaces/hooks/useResortList.ts

import { ref } from 'vue';
import { ResortSearchAppService } from '@/application/services/ResortSearchService.app';
import { container } from 'tsyringe';

/**
 * 滑雪场列表页面逻辑
 *
 * 职责：
 * - 封装页面状态
 * - 处理用户交互
 * - 调用应用服务
 */
export function useResortList() {
  // 依赖注入
  const appService = container.resolve(ResortSearchAppService);

  // 页面状态
  const searchKeyword = ref('');
  const filterType = ref<'all' | 'indoor' | 'outdoor'>('all');
  const resorts = ref<ResortDTO[]>([]);
  const loading = ref(false);
  const hasMore = ref(true);
  const currentPage = ref(0);

  /**
   * 搜索滑雪场
   */
  const handleSearch = async () => {
    loading.value = true;
    currentPage.value = 0;
    resorts.value = [];

    try {
      const result = await appService.searchResorts({
        keyword: searchKeyword.value || undefined,
        type: filterType.value === 'all' ? undefined : filterType.value,
        limit: 20,
        offset: 0,
      });

      resorts.value = result;
      hasMore.value = result.length >= 20;
    } catch (error) {
      console.error('搜索失败:', error);
      uni.showToast({
        title: '搜索失败，请重试',
        icon: 'none',
      });
    } finally {
      loading.value = false;
    }
  };

  /**
   * 清空搜索
   */
  const handleClear = async () => {
    searchKeyword.value = '';
    await handleSearch();
  };

  /**
   * 切换筛选条件
   */
  const toggleFilter = async () => {
    const types: Array<'all' | 'indoor' | 'outdoor'> = ['all', 'indoor', 'outdoor'];
    const currentIndex = types.indexOf(filterType.value);
    filterType.value = types[(currentIndex + 1) % types.length];
    await handleSearch();
  };

  /**
   * 加载更多
   */
  const loadMore = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;
    currentPage.value++;

    try {
      const result = await appService.searchResorts({
        keyword: searchKeyword.value || undefined,
        type: filterType.value === 'all' ? undefined : filterType.value,
        limit: 20,
        offset: currentPage.value * 20,
      });

      resorts.value.push(...result);
      hasMore.value = result.length >= 20;
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      loading.value = false;
    }
  };

  /**
   * 跳转到详情页
   */
  const goToDetail = (resortId: string) => {
    uni.navigateTo({
      url: `/pages/resort/detail?id=${resortId}`,
    });
  };

  return {
    searchKeyword,
    filterType,
    resorts,
    loading,
    hasMore,
    handleSearch,
    handleClear,
    toggleFilter,
    loadMore,
    goToDetail,
  };
}
```

## 5. 依赖注入配置

```typescript
// frontend/src/di/container.ts

import { container } from 'tsyringe';
import { ResortRepositoryImpl } from '@/infrastructure/api/ResortRepositoryImpl';
import { IResortRepository } from '@/domain/resort/repositories/IResortRepository';
import { ResortSearchService } from '@/domain/resort/services/ResortSearchService.domain';
import { AmapService } from '@/infrastructure/map/AmapService';
import { ResortSearchAppService } from '@/application/services/ResortSearchService.app';
import { ResortMapper } from '@/application/dto/ResortDTO';

/**
 * 依赖注入容器配置
 *
 * 注册所有依赖关系，遵循依赖倒置原则（DIP）
 */
export function configureDI() {
  // 基础设施层实现
  container.registerSingleton('IResortRepository', ResortRepositoryImpl);
  container.registerSingleton('AmapService', AmapService);

  // 领域层服务
  container.registerSingleton('ResortSearchService', ResortSearchService);

  // 应用层服务和工具
  container.registerSingleton('ResortSearchAppService', ResortSearchAppService);
  container.registerSingleton('ResortMapper', ResortMapper);
}

// 在应用启动时调用
configureDI();
```

## 总结

### DDD分层职责

| 层级 | 职责 | 依赖 |
|------|------|------|
| **领域层** | 核心业务逻辑，业务规则 | 无（最内层） |
| **应用层** | 用例编排，DTO转换 | 依赖领域层 |
| **基础设施层** | 技术实现，外部集成 | 实现领域层接口 |
| **表现层** | 用户界面，交互处理 | 依赖应用层 |

### 依赖方向

```
表现层 → 应用层 → 领域层
                  ↑
基础设施层 ────────┘
```

### 关键优势

1. **业务逻辑集中**：核心业务规则在领域层，易于维护和测试
2. **技术解耦**：可以替换基础设施实现（如从高德切换到百度地图）
3. **清晰分层**：每层职责明确，团队协作更容易
4. **易于测试**：通过接口Mock，可以独立测试各层
5. **可扩展**：新增功能只需添加新的聚合和用例

下一步我们可以讨论具体的技术实现细节或开始搭建项目结构。
