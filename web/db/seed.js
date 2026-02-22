import Database from 'better-sqlite3'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ============================================================
// TOP50 滑雪场原始数据（来自小程序 ResortSearchAppService）
// ============================================================
const rawResorts = [
  { id: '1', name: '万龙滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 98, latitude: 40.9814, longitude: 115.2814, trailCount: 32, rating: 4.8 },
  { id: '2', name: '太舞滑雪小镇', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 96, latitude: 40.9506, longitude: 115.3406, trailCount: 28, rating: 4.7 },
  { id: '3', name: '云顶滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 95, latitude: 40.9892, longitude: 115.3492, trailCount: 41, rating: 4.8 },
  { id: '4', name: '万科松花湖度假区', province: '吉林省', city: '吉林市', district: '丰满区', type: 'outdoor', popularity: 97, latitude: 43.2834, longitude: 126.6234, trailCount: 34, rating: 4.9 },
  { id: '5', name: '长白山国际度假区', province: '吉林省', city: '白山市', district: '抚松县', type: 'outdoor', popularity: 94, latitude: 42.0156, longitude: 127.7556, trailCount: 43, rating: 4.8 },
  { id: '6', name: '亚布力滑雪旅游度假区', province: '黑龙江省', city: '哈尔滨市', district: '尚志市', type: 'outdoor', popularity: 95, latitude: 44.7723, longitude: 128.4723, trailCount: 46, rating: 4.7 },
  { id: '7', name: '北大湖滑雪场', province: '吉林省', city: '吉林市', district: '永吉县', type: 'outdoor', popularity: 93, latitude: 43.2945, longitude: 126.5745, trailCount: 26, rating: 4.6 },
  { id: '8', name: '阿勒泰将军山滑雪场', province: '新疆维吾尔自治区', city: '阿勒泰地区', district: '阿勒泰市', type: 'outdoor', popularity: 91, latitude: 47.8445, longitude: 88.1445, trailCount: 22, rating: 4.7 },
  { id: '9', name: '富龙滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 92, latitude: 40.9745, longitude: 115.2745, trailCount: 25, rating: 4.6 },
  { id: '10', name: '融创雪世界（哈尔滨）', province: '黑龙江省', city: '哈尔滨市', district: '松北区', type: 'indoor', popularity: 90, latitude: 45.7923, longitude: 126.5923, trailCount: 5, rating: 4.5 },
  { id: '11', name: '南山滑雪场', province: '北京市', city: '北京市', district: '密云区', type: 'outdoor', popularity: 89, latitude: 40.6178, longitude: 116.9178, trailCount: 21, rating: 4.5 },
  { id: '12', name: '融创雪世界（广州）', province: '广东省', city: '广州市', district: '花都区', type: 'indoor', popularity: 88, latitude: 23.3789, longitude: 113.1789, trailCount: 4, rating: 4.6 },
  { id: '13', name: '丝绸之路国际滑雪场', province: '新疆维吾尔自治区', city: '乌鲁木齐市', district: '乌鲁木齐县', type: 'outdoor', popularity: 88, latitude: 43.4856, longitude: 87.0856, trailCount: 20, rating: 4.4 },
  { id: '14', name: '军都山滑雪场', province: '北京市', city: '北京市', district: '昌平区', type: 'outdoor', popularity: 87, latitude: 40.2889, longitude: 116.0889, trailCount: 15, rating: 4.3 },
  { id: '15', name: '融创雪世界（成都）', province: '四川省', city: '成都市', district: '都江堰市', type: 'indoor', popularity: 86, latitude: 30.9912, longitude: 103.6412, trailCount: 4, rating: 4.5 },
  { id: '16', name: '长春莲花山滑雪场', province: '吉林省', city: '长春市', district: '二道区', type: 'outdoor', popularity: 86, latitude: 43.7823, longitude: 125.9823, trailCount: 18, rating: 4.4 },
  { id: '17', name: '多乐美地滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 90, latitude: 40.9523, longitude: 115.2523, trailCount: 24, rating: 4.5 },
  { id: '18', name: '乔波冰雪世界（北京）', province: '北京市', city: '北京市', district: '顺义区', type: 'indoor', popularity: 85, latitude: 40.1234, longitude: 116.6534, trailCount: 3, rating: 4.4 },
  { id: '19', name: '银河滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 85, latitude: 40.9634, longitude: 115.2634, trailCount: 16, rating: 4.3 },
  { id: '20', name: '天山天池滑雪场', province: '新疆维吾尔自治区', city: '昌吉州', district: '阜康市', type: 'outdoor', popularity: 84, latitude: 43.8867, longitude: 88.1367, trailCount: 15, rating: 4.3 },
  { id: '21', name: '西岭雪山滑雪场', province: '四川省', city: '成都市', district: '大邑县', type: 'outdoor', popularity: 84, latitude: 30.6345, longitude: 103.1345, trailCount: 9, rating: 4.4 },
  { id: '22', name: '怀北国际滑雪场', province: '北京市', city: '北京市', district: '怀柔区', type: 'outdoor', popularity: 83, latitude: 40.4567, longitude: 116.6567, trailCount: 13, rating: 4.2 },
  { id: '23', name: '乔波冰雪世界（绍兴）', province: '浙江省', city: '绍兴市', district: '柯桥区', type: 'indoor', popularity: 83, latitude: 29.9845, longitude: 120.4845, trailCount: 3, rating: 4.3 },
  { id: '24', name: '帽儿山滑雪场', province: '黑龙江省', city: '哈尔滨市', district: '尚志市', type: 'outdoor', popularity: 82, latitude: 45.2134, longitude: 127.5134, trailCount: 12, rating: 4.2 },
  { id: '25', name: '热雪奇迹（北京）', province: '北京市', city: '北京市', district: '丰台区', type: 'indoor', popularity: 82, latitude: 39.8567, longitude: 116.2867, trailCount: 3, rating: 4.3 },
  { id: '26', name: '渔阳滑雪场', province: '北京市', city: '北京市', district: '平谷区', type: 'outdoor', popularity: 81, latitude: 40.2678, longitude: 117.0678, trailCount: 11, rating: 4.1 },
  { id: '27', name: '神农架滑雪场', province: '湖北省', city: '神农架林区', district: '神农架林区', type: 'outdoor', popularity: 80, latitude: 31.7445, longitude: 110.6745, trailCount: 8, rating: 4.3 },
  { id: '28', name: '棋盘山冰雪大世界', province: '辽宁省', city: '沈阳市', district: '浑南区', type: 'outdoor', popularity: 80, latitude: 41.8456, longitude: 123.5856, trailCount: 10, rating: 4.2 },
  { id: '29', name: '美林谷滑雪场', province: '内蒙古自治区', city: '赤峰市', district: '喀喇沁旗', type: 'outdoor', popularity: 79, latitude: 41.9123, longitude: 118.7123, trailCount: 12, rating: 4.1 },
  { id: '30', name: '峨眉山滑雪场', province: '四川省', city: '乐山市', district: '峨眉山市', type: 'outdoor', popularity: 78, latitude: 29.6012, longitude: 103.4812, trailCount: 7, rating: 4.2 },
  { id: '31', name: '雪世界滑雪场', province: '北京市', city: '北京市', district: '昌平区', type: 'outdoor', popularity: 78, latitude: 40.3123, longitude: 116.1123, trailCount: 8, rating: 4.0 },
  { id: '32', name: '照金国际滑雪场', province: '陕西省', city: '铜川市', district: '耀州区', type: 'outdoor', popularity: 77, latitude: 34.9845, longitude: 109.0845, trailCount: 10, rating: 4.1 },
  { id: '33', name: '银七星滑雪场', province: '上海市', city: '上海市', district: '闵行区', type: 'indoor', popularity: 77, latitude: 31.0123, longitude: 121.3823, trailCount: 3, rating: 4.2 },
  { id: '34', name: '东北亚滑雪场', province: '辽宁省', city: '沈阳市', district: '新城子区', type: 'outdoor', popularity: 76, latitude: 42.0234, longitude: 123.4234, trailCount: 9, rating: 4.0 },
  { id: '35', name: '大明山滑雪场', province: '浙江省', city: '杭州市', district: '临安区', type: 'outdoor', popularity: 76, latitude: 30.2634, longitude: 119.6234, trailCount: 8, rating: 4.1 },
  { id: '36', name: '九龙滑雪场', province: '山西省', city: '太原市', district: '娄烦县', type: 'outdoor', popularity: 75, latitude: 38.0678, longitude: 111.7678, trailCount: 7, rating: 3.9 },
  { id: '37', name: '金陵大报恩寺滑雪场', province: '江苏省', city: '南京市', district: '秦淮区', type: 'indoor', popularity: 75, latitude: 32.0012, longitude: 118.7812, trailCount: 2, rating: 4.0 },
  { id: '38', name: '太白山滑雪场', province: '陕西省', city: '宝鸡市', district: '眉县', type: 'outdoor', popularity: 74, latitude: 34.0567, longitude: 107.7567, trailCount: 6, rating: 4.0 },
  { id: '39', name: '伏牛山滑雪场', province: '河南省', city: '洛阳市', district: '栾川县', type: 'outdoor', popularity: 74, latitude: 33.7856, longitude: 111.6156, trailCount: 9, rating: 4.1 },
  { id: '40', name: '岗什卡滑雪场', province: '青海省', city: '海北州', district: '门源县', type: 'outdoor', popularity: 73, latitude: 37.6234, longitude: 101.6234, trailCount: 8, rating: 4.0 },
  { id: '41', name: '蓟州国际滑雪场', province: '天津市', city: '天津市', district: '蓟州区', type: 'outdoor', popularity: 73, latitude: 40.0456, longitude: 117.4056, trailCount: 10, rating: 4.0 },
  { id: '42', name: '和政松鸣岩滑雪场', province: '甘肃省', city: '临夏州', district: '和政县', type: 'outdoor', popularity: 72, latitude: 35.4123, longitude: 103.3123, trailCount: 6, rating: 3.9 },
  { id: '43', name: '江南天池滑雪场', province: '浙江省', city: '湖州市', district: '安吉县', type: 'outdoor', popularity: 72, latitude: 30.5845, longitude: 119.5845, trailCount: 6, rating: 4.0 },
  { id: '44', name: '轿子雪山滑雪场', province: '云南省', city: '昆明市', district: '禄劝县', type: 'outdoor', popularity: 71, latitude: 26.2456, longitude: 102.6456, trailCount: 5, rating: 3.9 },
  { id: '45', name: '大围山滑雪场', province: '湖南省', city: '长沙市', district: '浏阳市', type: 'outdoor', popularity: 70, latitude: 28.4178, longitude: 114.1578, trailCount: 6, rating: 3.9 },
  { id: '46', name: '嵩山滑雪场', province: '河南省', city: '郑州市', district: '登封市', type: 'outdoor', popularity: 70, latitude: 34.4823, longitude: 113.0423, trailCount: 7, rating: 3.9 },
  { id: '47', name: '云顶山滑雪场', province: '福建省', city: '福州市', district: '永泰县', type: 'outdoor', popularity: 69, latitude: 25.8723, longitude: 118.9323, trailCount: 5, rating: 3.8 },
  { id: '48', name: '大别山滑雪场', province: '安徽省', city: '六安市', district: '霍山县', type: 'outdoor', popularity: 68, latitude: 31.3923, longitude: 116.3323, trailCount: 6, rating: 3.8 },
  { id: '49', name: '蒙山滑雪场', province: '山东省', city: '临沂市', district: '蒙阴县', type: 'outdoor', popularity: 67, latitude: 35.7112, longitude: 117.9512, trailCount: 5, rating: 3.7 },
  { id: '50', name: '烟台塔山滑雪场', province: '山东省', city: '烟台市', district: '芝罘区', type: 'outdoor', popularity: 66, latitude: 37.5234, longitude: 121.4234, trailCount: 6, rating: 3.7 },
]

// ============================================================
// 数据生成辅助函数
// ============================================================

/**
 * 根据雪道总数和滑雪场特征分配各级别雪道数量
 */
function generateTrails(resort) {
  const total = resort.trailCount

  if (resort.type === 'indoor') {
    // 室内滑雪场以初级和中级为主
    const beginner = Math.max(1, Math.round(total * 0.5))
    const intermediate = Math.max(1, Math.round(total * 0.35))
    const advanced = Math.max(0, total - beginner - intermediate)
    const expert = 0
    return { total, beginner, intermediate, advanced, expert, maxVerticalDrop: 60 + Math.round(Math.random() * 40) }
  }

  // 大型滑雪场（30+条雪道）：更均衡的分布，包含专家级
  if (total >= 30) {
    const beginner = Math.round(total * 0.25)
    const intermediate = Math.round(total * 0.40)
    const advanced = Math.round(total * 0.25)
    const expert = total - beginner - intermediate - advanced
    return { total, beginner, intermediate, advanced, expert, maxVerticalDrop: 500 + Math.round(Math.random() * 400) }
  }

  // 中型滑雪场（15-29条雪道）
  if (total >= 15) {
    const beginner = Math.round(total * 0.30)
    const intermediate = Math.round(total * 0.40)
    const advanced = Math.round(total * 0.20)
    const expert = total - beginner - intermediate - advanced
    return { total, beginner, intermediate, advanced, expert, maxVerticalDrop: 300 + Math.round(Math.random() * 300) }
  }

  // 小型滑雪场（<15条雪道）：以初中级为主
  const beginner = Math.max(1, Math.round(total * 0.40))
  const intermediate = Math.max(1, Math.round(total * 0.35))
  const advanced = Math.max(0, total - beginner - intermediate - (total >= 8 ? 1 : 0))
  const expert = total >= 8 ? Math.max(0, total - beginner - intermediate - advanced) : 0
  return { total, beginner, intermediate, advanced, expert, maxVerticalDrop: 100 + Math.round(Math.random() * 200) }
}

/**
 * 根据滑雪场类型和人气生成设施信息
 */
function generateFacilities(resort) {
  const isIndoor = resort.type === 'indoor'
  const isTop = resort.popularity >= 90
  const isMid = resort.popularity >= 80

  return {
    hasRental: true, // 所有滑雪场都有租赁
    hasParking: true, // 所有滑雪场都有停车
    hasRestaurant: true, // 所有滑雪场都有餐饮
    hasHotel: isTop || (isMid && !isIndoor && Math.random() > 0.3),
    hasNightSkiing: isIndoor || (isTop && Math.random() > 0.3) || Math.random() > 0.6,
    hasSnowmaking: !isIndoor && (isTop || isMid || Math.random() > 0.4),
    hasSkiSchool: isTop || isMid || Math.random() > 0.3,
    hasChildrenArea: isIndoor || isTop || Math.random() > 0.5,
    hasLocker: true,
    hasMedical: isTop || isMid || Math.random() > 0.4,
    liftCount: isIndoor ? (resort.trailCount >= 4 ? 2 : 1) : Math.max(1, Math.round(resort.trailCount / 4)),
  }
}

/**
 * 根据人气和类型生成票价信息
 */
function generatePricing(resort) {
  const base = resort.type === 'indoor'
    ? 200 + Math.round(resort.popularity * 2.5)
    : 150 + Math.round(resort.popularity * 3)

  const weekdayDaily = base
  const weekendDaily = Math.round(base * 1.3)
  const halfDay = Math.round(base * 0.65)
  const nightSkiing = Math.round(base * 0.5)

  const pricing = {
    weekdayDaily,
    weekendDaily,
    halfDay,
    currency: 'CNY',
  }

  // 部分滑雪场有夜场价格
  if (resort.type === 'indoor' || resort.popularity >= 85) {
    pricing.nightSkiing = nightSkiing
  }

  // 高端滑雪场有季卡
  if (resort.popularity >= 90) {
    pricing.seasonPass = Math.round(weekdayDaily * 15)
  }

  return pricing
}

/**
 * 根据滑雪场类型生成季节信息
 */
function generateSeason(resort) {
  if (resort.type === 'indoor') {
    return {
      openMonth: 1,
      closeMonth: 12,
      yearRound: true,
      bestMonths: [12, 1, 2],
      description: '全年开放',
    }
  }

  // 东北和新疆地区雪季更长
  const northernProvinces = ['黑龙江省', '吉林省', '新疆维吾尔自治区', '内蒙古自治区']
  const isNorth = northernProvinces.includes(resort.province)

  // 南方地区雪季更短
  const southernProvinces = ['四川省', '云南省', '湖南省', '湖北省', '浙江省', '福建省', '安徽省', '广东省']
  const isSouth = southernProvinces.includes(resort.province)

  if (isNorth) {
    return {
      openMonth: 10,
      closeMonth: 4,
      yearRound: false,
      bestMonths: [12, 1, 2],
      description: '10月至次年4月',
    }
  }

  if (isSouth) {
    return {
      openMonth: 12,
      closeMonth: 2,
      yearRound: false,
      bestMonths: [1, 2],
      description: '12月至次年2月',
    }
  }

  // 华北、西北地区
  return {
    openMonth: 11,
    closeMonth: 3,
    yearRound: false,
    bestMonths: [12, 1, 2],
    description: '11月至次年3月',
  }
}

/**
 * 根据人气生成社区数据
 */
function generateCommunity(resort) {
  const reviewCount = Math.round(resort.popularity * 15 + Math.random() * 200)
  const favoriteCount = Math.round(resort.popularity * 25 + Math.random() * 500)
  const shareCount = Math.round(resort.popularity * 5 + Math.random() * 100)

  return {
    rating: resort.rating,
    reviewCount,
    favoriteCount,
    shareCount,
    recentReviewCount: Math.round(reviewCount * 0.15),
  }
}

/**
 * 根据雪道分布和设施生成适合人群
 */
function generateSuitableFor(trails, facilities) {
  const result = []

  // 初级雪道占比高 => 适合初学者
  const beginnerRatio = trails.beginner / trails.total
  if (beginnerRatio >= 0.35) {
    result.push('初学者')
  }

  // 有儿童区或初级占比高 => 适合家庭
  if (facilities.hasChildrenArea || beginnerRatio >= 0.3) {
    result.push('家庭亲子')
  }

  // 中级雪道占比高 => 适合进阶
  const intermediateRatio = trails.intermediate / trails.total
  if (intermediateRatio >= 0.3) {
    result.push('进阶玩家')
  }

  // 高级+专家占比高 => 适合高手
  const advancedRatio = (trails.advanced + trails.expert) / trails.total
  if (advancedRatio >= 0.2) {
    result.push('高手挑战')
  }

  // 有夜场 => 适合上班族
  if (facilities.hasNightSkiing) {
    result.push('夜场体验')
  }

  // 有酒店 => 适合度假
  if (facilities.hasHotel) {
    result.push('度假休闲')
  }

  return result
}

/**
 * 根据滑雪场特征生成标签
 */
function generateTags(resort, trails, facilities) {
  const tags = []

  // 冬奥场地标签
  const olympicResorts = ['云顶滑雪场', '万龙滑雪场', '太舞滑雪小镇', '富龙滑雪场']
  if (olympicResorts.includes(resort.name)) {
    tags.push('冬奥场地')
  }

  // 规模标签
  if (trails.total >= 30) {
    tags.push('超大规模')
  } else if (trails.total >= 20) {
    tags.push('大型雪场')
  }

  // 人气标签
  if (resort.popularity >= 95) {
    tags.push('TOP5热门')
  } else if (resort.popularity >= 90) {
    tags.push('TOP10热门')
  }

  // 类型标签
  if (resort.type === 'indoor') {
    tags.push('室内滑雪')
    tags.push('全年可玩')
  }

  // 评分标签
  if (resort.rating >= 4.7) {
    tags.push('口碑极佳')
  }

  // 设施标签
  if (facilities.hasNightSkiing) {
    tags.push('夜场滑雪')
  }
  if (facilities.hasHotel) {
    tags.push('住宿配套')
  }
  if (facilities.hasSkiSchool) {
    tags.push('教学服务')
  }

  // 地域标签
  if (resort.province === '河北省' && resort.district === '崇礼区') {
    tags.push('崇礼雪区')
  }
  if (['黑龙江省', '吉林省'].includes(resort.province)) {
    tags.push('东北粉雪')
  }
  if (resort.province === '新疆维吾尔自治区') {
    tags.push('野雪天堂')
  }

  // 特色标签
  const southernProvinces = ['四川省', '云南省', '湖南省', '湖北省', '浙江省', '福建省', '安徽省', '广东省', '上海市', '江苏省']
  if (southernProvinces.includes(resort.province) && resort.type === 'outdoor') {
    tags.push('南方滑雪')
  }

  // 网红标签（大城市附近 + 人气高）
  const bigCities = ['北京市', '上海市', '广州市', '成都市']
  if (bigCities.includes(resort.city) && resort.popularity >= 80) {
    tags.push('网红打卡')
  }

  // 初学者友好
  if (trails.beginner / trails.total >= 0.4) {
    tags.push('新手友好')
  }

  return tags.slice(0, 8) // 最多8个标签
}

/**
 * 生成地址
 */
function generateAddress(resort) {
  return `${resort.province}${resort.city}${resort.district}`
}

/**
 * 生成联系方式
 */
function generateContact(resort) {
  // 生成一个看起来合理的电话号码
  const areaCode = ['010', '0431', '0451', '0313', '0991', '0871', '028', '021', '020', '0571']
  const code = areaCode[Math.floor(Math.random() * areaCode.length)]
  const number = String(Math.floor(10000000 + Math.random() * 90000000))

  return {
    phone: `${code}-${number}`,
    website: null,
    wechat: null,
  }
}

// ============================================================
// 组装完整滑雪场数据
// ============================================================
function buildResortData(raw) {
  const trails = generateTrails(raw)
  const facilities = generateFacilities(raw)
  const pricing = generatePricing(raw)
  const season = generateSeason(raw)
  const community = generateCommunity(raw)
  const suitableFor = generateSuitableFor(trails, facilities)
  const tags = generateTags(raw, trails, facilities)
  const highlights = generateHighlights(raw, trails, facilities, tags)
  const address = generateAddress(raw)
  const contact = generateContact(raw)

  return {
    name: raw.name,
    province: raw.province,
    city: raw.city,
    district: raw.district,
    address,
    latitude: raw.latitude,
    longitude: raw.longitude,
    type: raw.type,
    popularity: raw.popularity,
    rating: raw.rating,
    facilities: JSON.stringify(facilities),
    trails: JSON.stringify(trails),
    pricing: JSON.stringify(pricing),
    season: JSON.stringify(season),
    contact: JSON.stringify(contact),
    community: JSON.stringify(community),
    scores: null, // 由 ScoringService 计算
    suitableFor: JSON.stringify(suitableFor),
    highlights: JSON.stringify(highlights),
    tags: JSON.stringify(tags),
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  }
}

/**
 * 生成滑雪场亮点描述
 */
function generateHighlights(resort, trails, facilities, tags) {
  const highlights = []

  if (tags.includes('冬奥场地')) {
    highlights.push('2022年北京冬奥会比赛场地')
  }

  if (trails.total >= 30) {
    highlights.push(`拥有${trails.total}条雪道，规模宏大`)
  }

  if (trails.maxVerticalDrop >= 500) {
    highlights.push(`最大垂直落差${trails.maxVerticalDrop}米`)
  }

  if (resort.type === 'indoor') {
    highlights.push('室内恒温滑雪，四季皆可体验')
  }

  if (facilities.hasNightSkiing && resort.type === 'outdoor') {
    highlights.push('支持夜间滑雪，灯光氛围绝佳')
  }

  if (tags.includes('东北粉雪')) {
    highlights.push('天然粉雪，雪质优秀')
  }

  if (tags.includes('野雪天堂')) {
    highlights.push('新疆优质天然雪，雪期长')
  }

  if (facilities.hasHotel) {
    highlights.push('配套度假酒店，滑雪度假一站式体验')
  }

  if (facilities.hasSkiSchool) {
    highlights.push('专业滑雪学校，国际认证教练')
  }

  if (tags.includes('南方滑雪')) {
    highlights.push('南方稀缺滑雪资源，交通便利')
  }

  if (resort.rating >= 4.8) {
    highlights.push('用户评分极高，口碑出众')
  }

  return highlights.slice(0, 5) // 最多5条亮点
}

// ============================================================
// 主执行逻辑
// ============================================================
function main() {
  console.log('=== 滑雪场数据库初始化脚本 ===')
  console.log('')

  // 1. 确保 db 目录存在
  const dbDir = resolve(__dirname)
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
    console.log('[目录] 创建数据库目录:', dbDir)
  }

  // 2. 创建/连接 SQLite 数据库
  const dbPath = resolve(dbDir, 'skiing.db')
  console.log('[数据库] 路径:', dbPath)

  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  // 3. 创建 resorts 表
  console.log('[表] 创建 resorts 表...')
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS resorts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      province TEXT NOT NULL,
      city TEXT NOT NULL,
      district TEXT,
      address TEXT,
      latitude REAL,
      longitude REAL,
      type TEXT NOT NULL,
      popularity INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      facilities TEXT,
      trails TEXT,
      pricing TEXT,
      season TEXT,
      contact TEXT,
      community TEXT,
      scores TEXT,
      suitable_for TEXT,
      highlights TEXT,
      tags TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `)
  console.log('[表] resorts 表创建成功')

  // 4. 清空已有数据（避免重复插入）
  const existingCount = sqlite.prepare('SELECT COUNT(*) as count FROM resorts').get()
  if (existingCount.count > 0) {
    console.log(`[清理] 删除已有 ${existingCount.count} 条记录...`)
    sqlite.exec('DELETE FROM resorts')
  }

  // 5. 批量插入数据
  console.log(`[插入] 开始插入 ${rawResorts.length} 个滑雪场...`)

  const insertStmt = sqlite.prepare(`
    INSERT INTO resorts (
      name, province, city, district, address,
      latitude, longitude, type, popularity, rating,
      facilities, trails, pricing, season, contact,
      community, scores, suitable_for, highlights, tags,
      created_at, updated_at
    ) VALUES (
      @name, @province, @city, @district, @address,
      @latitude, @longitude, @type, @popularity, @rating,
      @facilities, @trails, @pricing, @season, @contact,
      @community, @scores, @suitableFor, @highlights, @tags,
      @createdAt, @updatedAt
    )
  `)

  const insertAll = sqlite.transaction((resorts) => {
    for (const raw of resorts) {
      const data = buildResortData(raw)
      insertStmt.run(data)
    }
  })

  insertAll(rawResorts)

  // 6. 验证
  const finalCount = sqlite.prepare('SELECT COUNT(*) as count FROM resorts').get()
  console.log(`[完成] 成功插入 ${finalCount.count} 个滑雪场`)
  console.log('')

  // 打印部分数据预览
  const preview = sqlite.prepare('SELECT id, name, type, popularity, rating FROM resorts ORDER BY popularity DESC LIMIT 10').all()
  console.log('=== 人气 TOP10 预览 ===')
  console.table(preview)

  // 关闭数据库
  sqlite.close()
  console.log('')
  console.log('[完成] 数据库已关闭，seed 完成。')
  console.log(`[提示] 数据库文件: ${dbPath}`)
}

main()
