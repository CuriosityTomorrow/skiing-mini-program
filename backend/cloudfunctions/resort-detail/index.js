// 云函数：获取滑雪场详情
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

/**
 * 获取滑雪场详情
 *
 * @param {Object} event - 请求参数
 * @param {string} event.id - 滑雪场ID
 * @returns {Object} 滑雪场详情
 */
exports.main = async (event, context) => {
  const { id } = event;

  console.log('[获取滑雪场详情] ID:', id);

  if (!id) {
    return {
      code: -1,
      message: '缺少滑雪场ID',
      data: null,
    };
  }

  try {
    // 查询滑雪场基本信息
    const resortResult = await db.collection('resorts').doc(id).get();

    if (!resortResult.data) {
      return {
        code: -1,
        message: '滑雪场不存在',
        data: null,
      };
    }

    console.log('[获取滑雪场详情] 成功');

    return {
      code: 0,
      message: 'success',
      data: resortResult.data,
    };
  } catch (error) {
    console.error('[获取滑雪场详情] 错误:', error);

    // 如果是文档不存在的错误
    if (error.errCode === -1) {
      return {
        code: -1,
        message: '滑雪场不存在',
        data: null,
      };
    }

    return {
      code: -1,
      message: error.message || '获取详情失败',
      data: null,
      error: error.errMsg,
    };
  }
};
