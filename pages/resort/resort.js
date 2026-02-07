// pages/resort/resort.js
const { resortsData, reviewsData, notesData, partnersData } = require('../../data/resorts.js');
const { showToast } = require('../../utils/util.js');

Page({
  data: {
    resortId: null,
    resort: null,
    reviews: [],
    relatedNotes: [],
    resortPartners: [],
    isCollected: false,
    isSelected: false
  },

  onLoad(options) {
    const resortId = parseInt(options.id);

    if (!resortId) {
      showToast('滑雪场不存在');
      wx.navigateBack();
      return;
    }

    this.setData({ resortId });
    this.loadResortInfo(resortId);
    this.loadReviews(resortId);
    this.loadRelatedNotes(resortId);
    this.loadResortPartners(resortId);
    this.checkCollectionStatus(resortId);
    this.checkSelectionStatus(resortId);
  },

  // 加载滑雪场信息
  loadResortInfo(resortId) {
    const resort = resortsData.find(r => r.id === resortId);

    if (!resort) {
      showToast('滑雪场不存在');
      wx.navigateBack();
      return;
    }

    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: resort.name
    });

    this.setData({ resort });
  },

  // 加载相关笔记
  loadRelatedNotes(resortId) {
    // 获取关联到该滑雪场的笔记
    const relatedNotes = notesData.filter(note => note.resortId === resortId);
    this.setData({ relatedNotes });
  },

  // 加载该滑雪场的找搭子信息
  loadResortPartners(resortId) {
    const resort = resortsData.find(r => r.id === resortId);
    if (!resort) return;

    // 获取目标滑雪场为该滑雪场的搭子信息
    const resortPartners = partnersData.filter(partner => partner.targetResort === resort.name);
    this.setData({ resortPartners });
  },

  // 点击笔记卡片
  onNoteTap(e) {
    const note = e.currentTarget.dataset.note;
    wx.navigateTo({
      url: `/pages/note-detail/note-detail?id=${note.id}`
    });
  },

  // 查看全部笔记
  onViewAllNotes() {
    wx.showToast({
      title: '笔记列表页开发中',
      icon: 'none'
    });
  },

  // 加载评价
  loadReviews(resortId) {
    // 获取该滑雪场的评价，只显示前3条
    const reviews = reviewsData
      .filter(r => r.resortId === resortId)
      .slice(0, 3)
      .map(review => ({
        ...review,
        // 添加打分信息
        aiScore: (Math.random() * 2 + 3).toFixed(1),
        userScores: [
          { userId: 1, score: 4.5 },
          { userId: 2, score: 4.8 }
        ],
        avgScore: ((Math.random() * 2 + 3 + 4.5 + 4.8) / 3).toFixed(1)
      }));

    this.setData({ reviews });
  },

  // 加载该滑雪场的找搭子信息
  loadResortPartners(resortId) {
    const { partnersData } = require('../../data/resorts.js');

    const partners = partnersData.filter(p => p.targetResort.includes(this.data.resort.name));
    this.setData({ resortPartners: partners });
  },

  // 检查收藏状态
  checkCollectionStatus(resortId) {
    try {
      const collections = wx.getStorageSync('collections') || [];
      const isCollected = collections.includes(resortId);
      this.setData({ isCollected });
    } catch (e) {
      console.error('获取收藏状态失败', e);
    }
  },

  // 检查选中状态
  checkSelectionStatus(resortId) {
    const app = getApp();
    const selectedResorts = app.globalData.selectedResorts || [];
    const isSelected = selectedResorts.some(r => r.id === resortId);

    this.setData({ isSelected });
  },

  // 预览图片
  onPreviewImage(e) {
    const url = e.currentTarget.dataset.url;
    const urls = e.currentTarget.dataset.urls;

    wx.previewImage({
      current: url,
      urls: urls
    });
  },

  // 收藏/取消收藏
  onCollect() {
    const { resortId, isCollected } = this.data;

    try {
      let collections = wx.getStorageSync('collections') || [];

      if (isCollected) {
        // 取消收藏
        collections = collections.filter(id => id !== resortId);
        showToast('已取消收藏');
      } else {
        // 添加收藏
        collections.push(resortId);
        showToast('收藏成功');
      }

      wx.setStorageSync('collections', collections);
      this.setData({ isCollected: !isCollected });
    } catch (e) {
      showToast('操作失败，请重试');
    }
  },

  // 加入/取消对比
  onAddToCompare() {
    const { resortId, resort, isSelected } = this.data;
    const app = getApp();
    let selectedResorts = app.globalData.selectedResorts || [];

    if (isSelected) {
      // 已选择，取消选择
      selectedResorts = selectedResorts.filter(r => r.id !== resortId);
      showToast('已取消选择');
    } else {
      // 未选择，添加
      if (selectedResorts.length >= 5) {
        showToast('最多只能对比5个滑雪场');
        return;
      }
      selectedResorts.push(resort);
      showToast('已添加到对比');
    }

    app.globalData.selectedResorts = selectedResorts;
    this.setData({ isSelected: !isSelected });
  },

  // 查看全部评价
  onViewAllReviews() {
    // 跳转到探索页的评价列表
    wx.switchTab({
      url: '/pages/explore/explore'
    });
  },

  // 写评价
  onWriteReview() {
    showToast('发布评价功能开发中');
    // TODO: 跳转到发布评价页面
  },

  // 查看搭子详情
  onViewPartner(e) {
    const partner = e.currentTarget.dataset.partner;
    wx.showModal({
      title: partner.user.nickname,
      content: `目标雪场：${partner.targetResort}\n计划日期：${partner.plannedDate}\n\n${partner.description}`,
      confirmText: '联系',
      success(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: partner.user.wechat,
            success: () => {
              showToast('微信号已复制');
            }
          });
        }
      }
    });
  },

  // 发布找搭子
  onPostPartner() {
    showToast('发布行程功能开发中');
    // TODO: 跳转到发布行程页面
  },

  // 分享
  onShareAppMessage() {
    const { resort } = this.data;

    return {
      title: `${resort.name} - ${resort.city}`,
      path: `/pages/resort/resort?id=${resort.id}`,
      imageUrl: resort.images[0]
    };
  },

  onShareTimeline() {
    const { resort } = this.data;

    return {
      title: `${resort.name} - ${resort.city}`,
      imageUrl: resort.images[0]
    };
  }
});
