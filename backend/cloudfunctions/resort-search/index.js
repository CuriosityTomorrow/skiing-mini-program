// 云函数：搜索滑雪场
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

/**
 * 搜索滑雪场
 *
 * @param {Object} event - 请求参数
 * @param {string} event.keyword - 搜索关键词（城市/省份/滑雪场名称）
 * @param {string} event.type - 滑雪场类型：'indoor' | 'outdoor'
 * @param {number} event.limit - 返回数量限制
 * @param {number} event.offset - 分页偏移量
 * @returns {Object} 搜索结果
 */
exports.main = async (event, context) => {
  const { keyword, type, limit = 20, offset = 0 } = event;

  console.log('[搜索滑雪场] 参数:', { keyword, type, limit, offset });

  try {
    let query = db.collection('resorts');

    // 构建查询条件
    const whereConditions = {};

    // 关键词搜索（名称、城市、省份）
    if (keyword && keyword.trim()) {
      const searchKeyword = keyword.trim();
      whereConditions.$or = [
        { name: db.RegExp({ regexp: searchKeyword, options: 'i' }) },
        { city: db.RegExp({ regexp: searchKeyword, options: 'i' }) },
        { province: db.RegExp({ regexp: searchKeyword, options: 'i' }) },
      ];
    }

    // 类型筛选
    if (type && (type === 'indoor' || type === 'outdoor')) {
      whereConditions.type = type;
    }

    // 应用查询条件
    if (Object.keys(whereConditions).length > 0) {
      query = query.where(whereConditions);
    }

    // 执行查询
    const result = await query
      .orderBy('popularity', 'desc') // 按人气降序
      .limit(limit)
      .skip(offset)
      .get();

    console.log('[搜索滑雪场] 结果数量:', result.data.length);

    return {
      code: 0,
      message: 'success',
      data: result.data,
      total: result.data.length,
    };
  } catch (error) {
    console.error('[搜索滑雪场] 错误:', error);
    return {
      code: -1,
      message: error.message || '搜索失败',
      data: [],
      error: error.errMsg,
    };
  }
};
