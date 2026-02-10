import { Resort } from '../../domain/resort/entities/Resort.entity';

/**
 * 滑雪场DTO映射器
 *
 * 职责：在领域实体和DTO之间进行转换
 */
export class ResortMapper {
  toDTO(resort) {
    return {
      id: resort.id,
      name: resort.name,
      province: resort.location.province,
      city: resort.location.city,
      address: resort.location.address,
      latitude: resort.location.latitude,
      longitude: resort.location.longitude,
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
      isOpenNow: resort.operatingHours.isOpenNow(),
      tickets: resort.tickets.map((t) => ({
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
    };
  }

  toDTOList(resorts) {
    return resorts.map((r) => this.toDTO(r));
  }
}

// 导出单例
export const resortMapper = new ResortMapper();
