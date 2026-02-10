/**
 * 位置值对象
 */
export class Location {
  constructor(province, city, address, latitude, longitude) {
    this.province = province
    this.city = city
    this.address = address
    this.latitude = latitude
    this.longitude = longitude
  }

  get fullAddress() {
    return `${this.province}${this.city}${this.address}`;
  }

  equals(other) {
    return (
      this.province === other.province &&
      this.city === other.city &&
      this.address === other.address &&
      this.latitude === other.latitude &&
      this.longitude === other.longitude
    );
  }
}

/**
 * 设施值对象
 */
export class Facilities {
  constructor(hasRental, hasParking, hasRestaurant, hasHotel, hasNightSkiing) {
    this.hasRental = hasRental
    this.hasParking = hasParking
    this.hasRestaurant = hasRestaurant
    this.hasHotel = hasHotel
    this.hasNightSkiing = hasNightSkiing
  }
}

/**
 * 营业时间值对象
 */
export class OperatingHours {
  constructor(openHour, closeHour) {
    this.openHour = openHour
    this.closeHour = closeHour
  }

  /**
   * 检查当前是否营业
   */
  isOpenNow() {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= this.openHour && currentHour < this.closeHour;
  }
}

/**
 * 票价值对象
 */
export class Ticket {
  constructor(type, price, description) {
    this.type = type
    this.price = price
    this.description = description
  }
}

/**
 * 雪道信息值对象
 */
export class TrailInfo {
  constructor(totalCount, beginner, intermediate, advanced, expert) {
    this.totalCount = totalCount
    this.beginner = beginner
    this.intermediate = intermediate
    this.advanced = advanced
    this.expert = expert
  }

  /**
   * 是否适合新手（初级道占30%以上）
   */
  isBeginnerFriendly() {
    if (this.totalCount === 0) return false;
    return this.beginner >= this.totalCount * 0.3;
  }
}

/**
 * 滑雪场实体（聚合根）
 *
 * 业务规则：
 * - 人气排名 1-100
 * - 评分 0-5
 * - 室内/室外分类
 */
export class Resort {
  constructor(id, name, location, type, facilities, operatingHours, tickets, trails, popularity, rating, createdAt, updatedAt) {
    this.id = id
    this._name = name
    this._location = location
    this._type = type
    this._facilities = facilities
    this._operatingHours = operatingHours
    this._tickets = tickets
    this._trails = trails
    this._popularity = popularity
    this._rating = rating
    this.createdAt = createdAt
    this._updatedAt = updatedAt || createdAt

    // 业务规则验证
    this.validatePopularity(popularity);
    this.validateRating(rating);
  }

  // Getters
  get name() {
    return this._name;
  }

  get location() {
    return this._location;
  }

  get type() {
    return this._type;
  }

  get facilities() {
    return this._facilities;
  }

  get operatingHours() {
    return this._operatingHours;
  }

  get tickets() {
    return [...this._tickets];
  }

  get trails() {
    return this._trails;
  }

  get popularity() {
    return this._popularity;
  }

  get rating() {
    return this._rating;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  /**
   * 是否是室内滑雪场
   */
  isIndoor() {
    return this._type === 'indoor';
  }

  /**
   * 是否是室外滑雪场
   */
  isOutdoor() {
    return this._type === 'outdoor';
  }

  /**
   * 计算搜索匹配度分数
   */
  calculateMatchScore(searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return this._popularity;

    let score = 0;

    // 名称匹配：权重最高
    if (this._name.toLowerCase().includes(query)) {
      score += 50;
    }

    // 城市匹配
    if (this._location.city.toLowerCase().includes(query)) {
      score += 30;
    }

    // 省份匹配
    if (this._location.province.toLowerCase().includes(query)) {
      score += 20;
    }

    // 加上人气分数
    score += this._popularity;

    return score;
  }

  /**
   * 更新评分
   */
  updateRating(newRating) {
    this.validateRating(newRating);
    this._rating = newRating;
    this._updatedAt = new Date();
  }

  /**
   * 验证人气分数
   */
  validatePopularity(popularity) {
    if (popularity < 0 || popularity > 100) {
      throw new Error('人气排名必须在0-100之间');
    }
  }

  /**
   * 验证评分
   */
  validateRating(rating) {
    if (rating < 0 || rating > 5) {
      throw new Error('评分必须在0-5之间');
    }
  }
}
