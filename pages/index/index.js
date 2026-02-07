// pages/index/index.js
const skiResortManager = require('../../utils/ski-resort-manager.js');
const { showToast, showLoading, hideLoading } = require('../../utils/util.js');

Page({
  data: {
    searchKeyword: '',
    departureCity: '',
    filterType: 'all', // all, indoor, outdoor
    filteredResorts: [],
    selectedResorts: [],
    allResorts: [],
    userLocation: null,
    loading: false,
    useRealAPI: true  // 是否使用真实API（已配置高德API Key）
  },

  onLoad() {
    this.initData();
  },

  onShow() {
    this.updateSelectedResorts();
  },

  // 初始化数据
  async initData() {
    if (this.data.useRealAPI) {
      // 使用真实API
      await this.loadRealData();
    } else {
      // 使用模拟数据
      this.loadMockData();
    }
  },

  // 加载真实数据
  async loadRealData() {
    this.setData({ loading: true });

    try {
      // 尝试获取用户位置
      const location = await this.getUserLocation();

      if (location) {
        this.setData({ userLocation: location });

        // 搜索附近的滑雪场
        const result = await skiResortManager.searchNearbySkiResorts(
          `${location.longitude},${location.latitude}`
        );

        // 获取用户所在城市
        const address = await this.getAddressName(location);

        this.setData({
          filteredResorts: result.resorts,
          allResorts: result.resorts,
          departureCity: address.city || ''
        });
      } else {
        // 获取不到位置，加载全国数据
        const result = await skiResortManager.searchAllSkiResorts();
        this.setData({
          filteredResorts: result.resorts,
          allResorts: result.resorts
        });
      }

      this.updateSelectedResorts();
    } catch (error) {
      console.error('加载真实数据失败:', error);
      showToast('加载数据失败，请检查网络');
      // 失败时加载模拟数据
      this.loadMockData();
    } finally {
      this.setData({ loading: false });
    }
  },

  // 加载模拟数据
  loadMockData() {
    const { resortsData } = require('../../data/resorts.js');
    let resorts = [...resortsData];
    resorts.sort((a, b) => b.rating - a.rating);

    this.setData({
      filteredResorts: resorts,
      allResorts: resorts
    });
    this.updateSelectedResorts();
  },

  // 更新已选择的滑雪场状态
  updateSelectedResorts() {
    const app = getApp();
    const selectedIds = (app.globalData.selectedResorts || []).map(r => r.id);

    const filteredResorts = this.data.filteredResorts.map(resort => ({
      ...resort,
      selected: selectedIds.includes(resort.id)
    }));

    this.setData({
      filteredResorts,
      selectedResorts: app.globalData.selectedResorts || []
    });
  },

  // 出发城市输入
  async onDepartureInput(e) {
    const city = e.detail.value;
    this.setData({
      departureCity: city
    });

    if (!city || city.length < 2) {
      return;
    }

    if (this.data.useRealAPI) {
      // 使用真实API搜索
      await this.searchFromCity(city);
    } else {
      // 使用模拟数据
      this.filterAndSortResorts();
    }
  },

  // 从城市搜索
  async searchFromCity(cityName) {
    this.setData({ loading: true });

    try {
      const result = await skiResortManager.searchFromCity(cityName);

      // 应用类型筛选
      let resorts = result.resorts;
      if (this.data.filterType !== 'all') {
        resorts = resorts.filter(r => r.type === this.data.filterType);
      }

      this.setData({
        filteredResorts: resorts,
        allResorts: result.resorts,
        departureCity: result.city || cityName
      });

      this.updateSelectedResorts();
    } catch (error) {
      console.error('从城市搜索失败:', error);
      showToast('搜索失败，请检查城市名称');
    } finally {
      this.setData({ loading: false });
    }
  },

  // 清除出发城市
  onClearDeparture() {
    this.setData({
      departureCity: ''
    });
    this.filterAndSortResorts();
  },

  // 根据出发城市搜索
  onSearchByCity() {
    this.filterAndSortResorts();
  },

  // 获取用户位置
  getUserLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        success: (res) => {
          resolve({
            latitude: res.latitude,
            longitude: res.longitude
          });
        },
        fail: (error) => {
          console.error('获取位置失败:', error);
          reject(error);
        }
      });
    });
  },

  // 获取地址名称（逆地理编码）
  async getAddressName(location) {
    try {
      const amapService = require('../../utils/amap-service.js');
      return await amapService.regeocode(location.longitude, location.latitude);
    } catch (error) {
      console.error('获取地址名称失败:', error);
      return { city: '' };
    }
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.onSearch();
  },

  // 清除搜索
  onClearSearch() {
    this.setData({
      searchKeyword: '',
      filteredResorts: this.data.allResorts.filter(r => {
        if (this.data.filterType !== 'all' && r.type !== this.data.filterType) {
          return false;
        }
        return true;
      }).map(r => ({
        ...r,
        selected: this.data.selectedResorts.some(sr => sr.id === r.id)
      }))
    });
  },

  // 筛选和排序滑雪场
  async filterAndSortResorts() {
    const { departureCity, searchKeyword, filterType, allResorts, selectedResorts, userLocation } = this.data;
    let filtered = [...allResorts];

    // 1. 根据出发城市计算距离并排序（仅模拟数据）
    if (departureCity && !this.data.useRealAPI) {
      const cityCoords = this.getCityCoordinates(departureCity);

      if (cityCoords) {
        filtered = filtered.map(resort => ({
          ...resort,
          distance: this.calculateDistance(cityCoords.lat, cityCoords.lon, resort.latitude || 40, resort.longitude || 117)
        })).sort((a, b) => a.distance - b.distance);
      }
    }

    // 2. 根据搜索关键词筛选
    if (searchKeyword) {
      const keyword = searchKeyword.trim().toLowerCase();
      filtered = filtered.filter(resort => {
        const matchKeyword =
          resort.city.toLowerCase().includes(keyword) ||
          resort.country.toLowerCase().includes(keyword) ||
          resort.province.toLowerCase().includes(keyword) ||
          resort.name.toLowerCase().includes(keyword) ||
          resort.nameEn.toLowerCase().includes(keyword);
        return matchKeyword;
      });
    }

    // 3. 根据类型筛选
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }

    // 4. 更新选中状态
    filtered = filtered.map(r => ({
      ...r,
      selected: selectedResorts.some(sr => sr.id === r.id)
    }));

    this.setData({
      filteredResorts: filtered
    });
  },

  // 获取城市坐标（简化版，实际应使用地图API）
  getCityCoordinates(city) {
    const cityMap = {
      '北京': { lat: 39.9042, lon: 116.4074 },
      '上海': { lat: 31.2304, lon: 121.4737 },
      '广州': { lat: 23.1291, lon: 113.2644 },
      '深圳': { lat: 22.5431, lon: 114.0579 },
      '杭州': { lat: 30.2741, lon: 120.1551 },
      '成都': { lat: 30.5728, lon: 104.0668 },
      '重庆': { lat: 29.4316, lon: 106.9123 },
      '西安': { lat: 34.3416, lon: 108.9398 },
      '南京': { lat: 32.0603, lon: 118.7969 },
      '武汉': { lat: 30.5928, lon: 114.3055 },
      '天津': { lat: 39.0842, lon: 117.2009 },
      '苏州': { lat: 31.2989, lon: 120.5853 },
      '哈尔滨': { lat: 45.8038, lon: 126.5340 },
      '沈阳': { lat: 41.8057, lon: 123.4315 },
      '大连': { lat: 38.9140, lon: 121.6147 },
      '济南': { lat: 36.6512, lon: 117.1201 },
      '青岛': { lat: 36.0671, lon: 120.3826 },
      '郑州': { lat: 34.7466, lon: 113.6254 },
      '长沙': { lat: 28.2282, lon: 112.9388 },
      '厦门': { lat: 24.4798, lon: 118.0894 }
    };

    // 模糊匹配
    for (let key in cityMap) {
      if (city.includes(key) || key.includes(city)) {
        return cityMap[key];
      }
    }
    return null;
  },

  // 计算两点之间的距离（公里）
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径（km）
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  },

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  },

  // 执行搜索
  onSearch() {
    this.filterAndSortResorts();
  },

  // 类型筛选
  onFilterType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      filterType: type
    });
    this.filterAndSortResorts();
  },

  // 点击滑雪场卡片
  onResortTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/resort/resort?id=${id}`
    });
  },

  // 选择/取消选择滑雪场
  onSelectResort(e) {
    const id = e.currentTarget.dataset.id;
    const app = getApp();
    let selectedResorts = [...(app.globalData.selectedResorts || [])];

    const index = selectedResorts.findIndex(r => r.id === id);

    if (index > -1) {
      // 已选择，取消选择
      selectedResorts.splice(index, 1);
      showToast('已取消选择');
    } else {
      // 未选择，添加选择
      if (selectedResorts.length >= 5) {
        showToast('最多只能对比5个滑雪场');
        return;
      }
      const resort = this.data.allResorts.find(r => r.id === id);
      if (resort) {
        selectedResorts.push(resort);
        showToast('已添加到对比');
      }
    }

    app.globalData.selectedResorts = selectedResorts;
    this.updateSelectedResorts();
  },

  // 查看已选
  onViewSelected() {
    const app = getApp();
    if (!app.globalData.selectedResorts || app.globalData.selectedResorts.length === 0) {
      showToast('请先选择滑雪场');
      return;
    }

    wx.navigateTo({
      url: '/pages/compare/compare'
    });
  },

  // 对比
  onCompare() {
    const app = getApp();
    const selectedResorts = app.globalData.selectedResorts || [];

    if (selectedResorts.length < 2) {
      showToast('请至少选择2个滑雪场进行对比');
      return;
    }

    wx.navigateTo({
      url: '/pages/compare/compare'
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '滑雪场助手 - 找到你心仪的滑雪场',
      path: '/pages/index/index',
      imageUrl: '/images/share-bg.png'
    };
  }
});
