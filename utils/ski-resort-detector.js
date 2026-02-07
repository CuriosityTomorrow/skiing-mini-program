/**
 * 滑雪场智能识别和去重工具
 * 基于真实世界规则判断POI是否为滑雪场，并去除重复项
 */

/**
 * 滑雪场关键词库
 * 包含各种可能表示滑雪场的关键词
 */
const SKI_RESORT_KEYWORDS = [
  // 直接关键词
  '滑雪场', '滑雪', '滑雪中心', '滑雪度假村', '滑雪乐园',
  '滑雪公园', '滑雪区', '滑雪胜地',

  // 冰雪相关
  '冰雪', '冰世界', '冰雪世界', '冰雪乐园', '冰雪中心',
  '冰工厂', '冰场', '滑冰场',

  // 热雪/融雪品牌
  '热雪', '热雪奇迹', '融雪', '融雪乐园',

  // 知名品牌/场所
  '乔波', '阿尔卑斯', 'KKPark', 'KK Park',
  '万达滑雪', '万达融雪', '万科滑雪',
  '太舞', '万龙', '云顶', '富龙',

  // 英文
  'ski', 'snow', 'resort', 'slope'
];

/**
 * 非滑雪场关键词（排除这些）
 */
const EXCLUDE_KEYWORDS = [
  '滑雪装备', '滑雪用品', '滑雪服', '滑雪板',
  '滑雪培训', '滑雪教练', '滑雪学校',
  '滑雪租赁', '滑雪维修',
  '冰淇淋', '冰激凌', '冰雪食品',
  '冰雕', '冰灯', '冰雪节'
];

/**
 * 判断POI名称是否可能是滑雪场
 * @param {string} name - POI名称
 * @returns {object} { isSkiResort: boolean, confidence: number, reason: string }
 */
function isSkiResortByName(name) {
  if (!name || typeof name !== 'string') {
    return { isSkiResort: false, confidence: 0, reason: '名称为空' };
  }

  const lowerName = name.toLowerCase();

  // 1. 排除明显不是滑雪场的
  for (const keyword of EXCLUDE_KEYWORDS) {
    if (name.includes(keyword)) {
      return {
        isSkiResort: false,
        confidence: 0,
        reason: `包含排除关键词：${keyword}`
      };
    }
  }

  // 2. 检查滑雪场关键词
  let matchedKeywords = [];
  for (const keyword of SKI_RESORT_KEYWORDS) {
    if (lowerName.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    }
  }

  if (matchedKeywords.length > 0) {
    // 计算置信度
    let confidence = 0.5; // 基础置信度

    // 包含"滑雪场"直接关键词，置信度高
    if (name.includes('滑雪场') || name.includes('滑雪中心')) {
      confidence = 0.95;
    }
    // 包含"冰雪世界"、"热雪奇迹"等，置信度中等
    else if (name.includes('冰雪世界') || name.includes('热雪奇迹') || name.includes('乔波')) {
      confidence = 0.85;
    }
    // 包含其他关键词，置信度低一些
    else {
      confidence = 0.6;
    }

    return {
      isSkiResort: true,
      confidence: confidence,
      reason: `匹配关键词：${matchedKeywords.join(', ')}`
    };
  }

  // 3. 没有匹配关键词
  return {
    isSkiResort: false,
    confidence: 0,
    reason: '名称不包含滑雪相关关键词'
  };
}

/**
 * 计算两个坐标之间的距离（米）
 */
function calculateDistance(lon1, lat1, lon2, lat2) {
  const R = 6371000; // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 判断两个POI是否为同一个滑雪场
 * @param {object} poi1 - 第一个POI
 * @param {object} poi2 - 第二个POI
 * @returns {boolean}
 */
function isSameSkiResort(poi1, poi2) {
  // 1. 检查坐标距离
  const [lon1, lat1] = poi1.location.split(',').map(parseFloat);
  const [lon2, lat2] = poi2.location.split(',').map(parseFloat);

  const distance = calculateDistance(lon1, lat1, lon2, lat2);

  // 距离小于100米，认为是同一个滑雪场
  if (distance < 100) {
    return true;
  }

  // 2. 检查名称相似度
  const name1 = poi1.name || '';
  const name2 = poi2.name || '';

  // 名称包含关系（如"阿尔卑斯冰雪世界"和"阿尔卑斯"）
  if (name1.includes(name2) || name2.includes(name1)) {
    // 再结合距离判断
    if (distance < 500) {
      return true;
    }
  }

  return false;
}

/**
 * 去重滑雪场列表
 * @param {Array} pois - POI列表
 * @returns {Array} 去重后的POI列表
 */
function deduplicateSkiResorts(pois) {
  if (!pois || pois.length === 0) {
    return [];
  }

  const uniquePois = [];
  const duplicates = [];

  for (const poi of pois) {
    let isDuplicate = false;

    // 检查是否与已有POI重复
    for (const existing of uniquePois) {
      if (isSameSkiResort(poi, existing)) {
        isDuplicate = true;
        duplicates.push({
          original: existing,
          duplicate: poi
        });
        break;
      }
    }

    if (!isDuplicate) {
      uniquePois.push(poi);
    }
  }

  return uniquePois;
}

/**
 * 智能筛选滑雪场
 * @param {Array} pois - 原始POI列表
 * @param {object} options - 选项
 * @returns {object} { resorts: Array, filtered: Array, duplicates: Array }
 */
function filterSkiResorts(pois, options = {}) {
  const {
    minConfidence = 0.5,      // 最低置信度
    removeDuplicates = true,  // 是否去重
    verbose = false           // 是否返回详细信息
  } = options;

  const results = {
    all: pois,
    filtered: [],
    removed: [],
    duplicates: [],
    summary: {
      total: pois.length,
      filtered: 0,
      removed: 0,
      duplicates: 0
    }
  };

  // 1. 根据名称筛选
  for (const poi of pois) {
    const check = isSkiResortByName(poi.name);

    if (check.isSkiResort && check.confidence >= minConfidence) {
      results.filtered.push({
        ...poi,
        _confidence: check.confidence,
        _reason: check.reason
      });
    } else {
      results.removed.push({
        ...poi,
        _reason: check.reason
      });
    }
  }

  results.summary.filtered = results.filtered.length;
  results.summary.removed = results.removed.length;

  // 2. 去重
  if (removeDuplicates) {
    const uniquePois = deduplicateSkiResorts(results.filtered);

    // 找出重复的
    for (const filtered of results.filtered) {
      let isDuplicate = false;
      for (const unique of uniquePois) {
        if (unique.id !== filtered.id && isSameSkiResort(filtered, unique)) {
          isDuplicate = true;
          results.duplicates.push({
            keep: unique,
            remove: filtered,
            reason: '坐标重复'
          });
          break;
        }
      }
    }

    results.filtered = uniquePois;
    results.summary.duplicates = results.duplicates.length;
    results.summary.final = uniquePois.length;
  } else {
    results.summary.final = results.filtered.length;
  }

  return results;
}

/**
 * 扩展搜索关键词
 * @param {string} city - 城市名称
 * @returns {Array} 搜索关键词列表
 */
function getSearchKeywords(city) {
  return [
    '滑雪场',
    '滑雪',
    '冰雪世界',
    '冰雪',
    '热雪',
    '乔波',
    '融雪',
    '室内滑雪',
    '滑雪度假村',
    '滑雪中心'
  ];
}

module.exports = {
  isSkiResortByName,
  isSameSkiResort,
  deduplicateSkiResorts,
  filterSkiResorts,
  getSearchKeywords,
  SKI_RESORT_KEYWORDS,
  EXCLUDE_KEYWORDS
};
