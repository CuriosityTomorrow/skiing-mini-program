// 格式化距离显示
const formatDistance = (distance) => {
  if (distance < 1) {
    return Math.round(distance * 1000) + 'm';
  }
  return distance.toFixed(1) + 'km';
};

// 格式化价格显示
const formatPrice = (price, unit) => {
  return `¥${price}/${unit}`;
};

// 获取滑雪场类型标签
const getTypeLabel = (type) => {
  return type === 'indoor' ? '室内' : '室外';
};

// 获取滑雪场类型样式
const getTypeClass = (type) => {
  return type === 'indoor' ? 'tag-indoor' : 'tag-outdoor';
};

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 时间格式化
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 显示提示
const showToast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration
  });
};

// 显示加载
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  });
};

// 隐藏加载
const hideLoading = () => {
  wx.hideLoading();
};

// 显示确认对话框
const showConfirm = (content, title = '提示') => {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success(res) {
        resolve(res.confirm);
      }
    });
  });
};

// 获取用户信息
const getUserInfo = () => {
  try {
    const userInfo = wx.getStorageSync('userInfo');
    return userInfo || null;
  } catch (e) {
    return null;
  }
};

// 保存用户信息
const saveUserInfo = (userInfo) => {
  try {
    wx.setStorageSync('userInfo', userInfo);
    const app = getApp();
    if (app) {
      app.globalData.userInfo = userInfo;
    }
    return true;
  } catch (e) {
    return false;
  }
};

// 计算两个坐标之间的距离
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const app = getApp();
  if (app && app.getDistance) {
    return app.getDistance(lat1, lon1, lat2, lon2);
  }

  // 如果app获取失败，使用简单的计算
  const R = 6371; // 地球半径（km）
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

// 排序滑雪场（按距离）
const sortResortsByDistance = (resorts, userLocation) => {
  if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
    return resorts;
  }

  return resorts.map(resort => ({
    ...resort,
    distance: calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      resort.latitude,
      resort.longitude
    )
  })).sort((a, b) => a.distance - b.distance);
};

module.exports = {
  formatDistance,
  formatPrice,
  getTypeLabel,
  getTypeClass,
  generateId,
  formatTime,
  showToast,
  showLoading,
  hideLoading,
  showConfirm,
  getUserInfo,
  saveUserInfo,
  calculateDistance,
  sortResortsByDistance
};
