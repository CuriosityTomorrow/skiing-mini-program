App({
  globalData: {
    userInfo: null,
    userLocation: null,
    selectedResorts: [], // 用户选中的滑雪场
    skillLevels: [
      { id: 1, label: '小白', description: '刚开始接触滑雪' },
      { id: 2, label: '刚入门', description: '能基本滑行，正在学习中' },
      { id: 3, label: '有点水平但不多', description: '可以熟练滑行，尝试中级道' },
      { id: 4, label: '艺高人胆大', description: '高级道无压力，挑战黑道' },
      { id: 5, label: '顶尖', description: '各种地形都能驾驭' },
      { id: 6, label: '职业选手', description: '专业水平，竞技选手' },
      { id: 7, label: '小趴菜', description: '自嘲，其实就是谦虚的高手' }
    ],
    skiTypes: [
      { id: 1, label: '单板' },
      { id: 2, label: '双板' },
      { id: 3, label: '都玩' }
    ]
  },

  onLaunch() {
    // 获取用户位置
    this.getLocation();
    // 检查登录状态
    this.checkLoginStatus();
  },

  // 获取用户位置
  getLocation() {
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.globalData.userLocation = {
          latitude: res.latitude,
          longitude: res.longitude
        };
      },
      fail(err) {
        console.log('获取位置失败', err);
        wx.showToast({
          title: '请在设置中开启位置权限',
          icon: 'none'
        });
      }
    });
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },

  // 计算两个经纬度之间的距离（单位：km）
  getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径（km）
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }
});
