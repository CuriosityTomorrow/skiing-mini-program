// pages/community/community.js
const { notesData } = require('../../data/resorts.js');

Page({
  data: {
    currentLocation: '北京',
    currentTab: 0,
    tabs: [
      { name: '全部', type: 'all' },
      { name: '体验', type: 'experience' },
      { name: '找搭子', type: 'partner' },
      { name: '推荐', type: 'recommend' }
    ],
    allNotes: [],
    filteredNotes: [],
    leftNotes: [],
    rightNotes: [],
    loading: false
  },

  onLoad() {
    this.loadNotes();
  },

  // 加载笔记数据
  loadNotes() {
    this.setData({ loading: true });

    // 模拟网络请求延迟
    setTimeout(() => {
      this.setData({
        allNotes: notesData,
        loading: false
      }, () => {
        this.filterNotes();
      });
    }, 500);
  },

  // 切换Tab
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    }, () => {
      this.filterNotes();
    });
  },

  // 筛选笔记
  filterNotes() {
    const currentTab = this.data.tabs[this.data.currentTab];
    let filtered = [];

    switch (currentTab.type) {
      case 'all':
        filtered = this.data.allNotes;
        break;
      case 'experience':
        filtered = this.data.allNotes.filter(note => note.type === 'experience');
        break;
      case 'partner':
        filtered = this.data.allNotes.filter(note => note.type === 'partner');
        break;
      case 'recommend':
        // 推荐算法：按点赞数排序
        filtered = [...this.data.allNotes].sort((a, b) => b.likes - a.likes);
        break;
    }

    this.setData({
      filteredNotes: filtered
    }, () => {
      this.splitToColumns();
    });
  },

  // 分流到左右两列（瀑布流）
  splitToColumns() {
    const notes = this.data.filteredNotes;
    const leftNotes = [];
    const rightNotes = [];
    let leftHeight = 0;
    let rightHeight = 0;

    notes.forEach(note => {
      // 简单估算：每张图片高度 + 文字高度
      const noteHeight = 300 + note.title.length * 2 + 80;

      if (leftHeight <= rightHeight) {
        leftNotes.push(note);
        leftHeight += noteHeight;
      } else {
        rightNotes.push(note);
        rightHeight += noteHeight;
      }
    });

    this.setData({
      leftNotes,
      rightNotes
    });
  },

  // 点击笔记卡片
  onNoteTap(e) {
    const note = e.currentTarget.dataset.note;
    wx.navigateTo({
      url: `/pages/note-detail/note-detail?id=${note.id}`
    });
  },

  // 发布笔记
  onPublish() {
    wx.navigateTo({
      url: '/pages/note-publish/note-publish'
    });
  },

  // 搜索
  onSearch() {
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  },

  // 消息
  onMessage() {
    wx.showToast({
      title: '消息功能开发中',
      icon: 'none'
    });
  },

  // 切换位置
  changeLocation() {
    wx.showActionSheet({
      itemList: ['北京', '上海', '广州', '深圳', '哈尔滨', '张家口'],
      success: (res) => {
        const cities = ['北京', '上海', '广州', '深圳', '哈尔滨', '张家口'];
        this.setData({
          currentLocation: cities[res.tapIndex]
        });
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadNotes();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.loading) return;

    wx.showToast({
      title: '没有更多了',
      icon: 'none'
    });
  }
});
