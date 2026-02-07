// pages/compare/compare.js
const { showToast, showConfirm } = require('../../utils/util.js');

Page({
  data: {
    selectedResorts: []
  },

  onLoad(options) {
    this.loadSelectedResorts();
  },

  onShow() {
    this.loadSelectedResorts();
  },

  // 加载已选择的滑雪场
  loadSelectedResorts() {
    const app = getApp();
    const selectedResorts = app.globalData.selectedResorts || [];

    this.setData({
      selectedResorts: selectedResorts
    });
  },

  // 查看滑雪场详情
  onViewResort(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/resort/resort?id=${id}`
    });
  },

  // 移除滑雪场
  async onRemoveResort(e) {
    const id = e.currentTarget.dataset.id;
    const confirmed = await showConfirm('确定要移除这个滑雪场吗？', '提示');

    if (confirmed) {
      const app = getApp();
      let selectedResorts = app.globalData.selectedResorts || [];

      selectedResorts = selectedResorts.filter(r => r.id !== id);

      app.globalData.selectedResorts = selectedResorts;

      this.setData({
        selectedResorts: selectedResorts
      });

      showToast('已移除');
    }
  },

  // 清空所有
  async onClearAll() {
    const confirmed = await showConfirm('确定要清空所有已选滑雪场吗？', '提示');

    if (confirmed) {
      const app = getApp();
      app.globalData.selectedResorts = [];

      this.setData({
        selectedResorts: []
      });

      showToast('已清空');
    }
  },

  // 去搜索
  onGoSearch() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 分享
  onShareAppMessage() {
    const { selectedResorts } = this.data;

    if (selectedResorts.length === 0) {
      return {
        title: '滑雪场助手 - 找到你心仪的滑雪场',
        path: '/pages/index/index',
        imageUrl: '/images/share-bg.png'
      };
    }

    const names = selectedResorts.map(r => r.name).join('、');
    const title = `我在对比这些滑雪场：${names}`;

    return {
      title: title.length > 50 ? title.substring(0, 50) + '...' : title,
      path: '/pages/compare/compare',
      imageUrl: selectedResorts[0].images[0]
    };
  }
});
