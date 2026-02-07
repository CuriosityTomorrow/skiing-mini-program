// pages/explore/explore.js
const { resortsData, reviewsData, partnersData } = require('../../data/resorts.js');
const { showToast, showConfirm } = require('../../utils/util.js');

Page({
  data: {
    currentTab: 0,
    partnerSearchKeyword: '',
    partnerFilterType: 'latest', // latest, resort, departure
    showSimilarTrips: false,

    // 社区数据
    reviews: [],

    // 找搭子数据
    partners: [],
    similarTrips: []
  },

  onLoad() {
    this.initReviews();
    this.initPartners();
  },

  // 初始化评价列表
  initReviews() {
    // 为每条评价添加滑雪场名称和媒体类型
    const reviews = reviewsData.map(review => {
      const resort = resortsData.find(r => r.id === review.resortId);
      return {
        ...review,
        resortName: resort ? resort.name : '未知滑雪场',
        mediaType: review.images && review.images.length > 0 ? 'image' : 'text',
        // 模拟AI和网友打分
        aiScore: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
        userScores: [
          { userId: 1, score: 4.5 },
          { userId: 2, score: 4.8 },
          { userId: 3, score: 4.2 }
        ],
        avgScore: 0
      };
    });

    // 计算平均分
    reviews.forEach(review => {
      const allScores = [review.aiScore, ...review.userScores.map(u => u.score)];
      review.avgScore = (allScores.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / allScores.length).toFixed(1);
    });

    this.setData({ reviews });
  },

  // 初始化搭子列表
  initPartners() {
    // 为每个搭子添加匹配用户
    const partners = partnersData.map(partner => ({
      ...partner,
      matchedUsers: this.findMatchedUsers(partner)
    }));

    this.setData({ partners });
  },

  // 查找匹配的用户（智能匹配算法）
  findMatchedUsers(partner) {
    const { partnersData } = require('../../data/resorts.js');

    // 查找相同滑雪场或相近日期的行程
    const matched = partnersData
      .filter(p => p.id !== partner.id) // 排除自己
      .filter(p => {
        // 相同滑雪场或时间相近（前后7天内）
        const sameResort = p.targetResort === partner.targetResort;
        const date1 = new Date(partner.plannedDate);
        const date2 = new Date(p.plannedDate);
        const daysDiff = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
        const nearDate = daysDiff <= 7;

        return sameResort || nearDate;
      })
      .slice(0, 5) // 最多显示5个
      .map(p => p.user);

    return matched;
  },

  // 切换标签
  switchTab(e) {
    const tab = parseInt(e.currentTarget.dataset.tab);
    this.setData({ currentTab: tab });
  },

  // 找搭子搜索输入
  onPartnerSearchInput(e) {
    const keyword = e.detail.value.toLowerCase();
    this.setData({ partnerSearchKeyword: keyword });
    this.filterPartners();
  },

  // 找搭子筛选
  onPartnerFilter(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ partnerFilterType: type });
    this.filterPartners();
  },

  // 筛选搭子
  filterPartners() {
    const { partnerSearchKeyword, partnerFilterType, partnersData } = this.data;
    let filtered = [...partnersData];

    // 关键词搜索
    if (partnerSearchKeyword) {
      filtered = filtered.filter(p => {
        return p.targetResort.includes(partnerSearchKeyword) ||
               p.user.location.includes(partnerSearchKeyword) ||
               p.description.includes(partnerSearchKeyword);
      });
    }

    // 排序
    if (partnerFilterType === 'latest') {
      filtered.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    } else if (partnerFilterType === 'resort') {
      filtered.sort((a, b) => a.targetResort.localeCompare(b.targetResort));
    } else if (partnerFilterType === 'departure') {
      filtered.sort((a, b) => a.user.location.localeCompare(b.user.location));
    }

    // 重新计算匹配用户
    filtered = filtered.map(p => ({
      ...p,
      matchedUsers: this.findMatchedUsers(p)
    }));

    this.setData({ partners: filtered });
  },

  // 查看匹配用户详情
  onViewMatchedUser(e) {
    const user = e.currentTarget.dataset.user;
    wx.showModal({
      title: user.nickname,
      content: `${user.skiType} · ${user.level}\n${user.experience}\n${user.location}`,
      showCancel: false
    });
  },

  // 发布行程后的智能匹配
  showMatchedTrips(newPartner) {
    const matched = this.findSimilarTrips(newPartner);

    if (matched.length > 0) {
      this.setData({
        similarTrips: matched,
        showSimilarTrips: true
      });
    }
  },

  // 查找相似行程
  findSimilarTrips(newPartner) {
    const { partnersData } = require('../../data/resorts.js');

    return partnersData
      .filter(p => p.id !== newPartner.id)
      .filter(p => {
        // 相同滑雪场
        const sameResort = p.targetResort === newPartner.targetResort;
        // 相近日期
        const date1 = new Date(newPartner.plannedDate);
        const date2 = new Date(p.plannedDate);
        const daysDiff = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
        const nearDate = daysDiff <= 7;

        return sameResort || nearDate;
      })
      .map(p => {
        // 计算匹配度
        let matchPercent = 0;
        if (p.targetResort === newPartner.targetResort) matchPercent += 50;
        const date1 = new Date(newPartner.plannedDate);
        const date2 = new Date(p.plannedDate);
        const daysDiff = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 3) matchPercent += 30;
        else if (daysDiff <= 7) matchPercent += 20;
        if (p.user.level === newPartner.user.level) matchPercent += 20;

        return {
          ...p,
          matchPercent: Math.min(matchPercent, 100)
        };
      })
      .sort((a, b) => b.matchPercent - a.matchPercent)
      .slice(0, 10);
  },

  // 查看相似行程
  onViewSimilarTrip(e) {
    const trip = e.currentTarget.dataset.trip;
    wx.showModal({
      title: trip.user.nickname,
      content: `目标雪场：${trip.targetResort}\n计划日期：${trip.plannedDate}\n匹配度：${trip.matchPercent}%\n\n是否联系TA？`,
      confirmText: '联系',
      success(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: trip.user.wechat,
            success: () => {
              showToast('微信号已复制');
            }
          });
        }
      }
    });
  },

  // 点击滑雪场
  onResortTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/resort/resort?id=${id}`
    });
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

  // 点赞
  async onLike(e) {
    const id = e.currentTarget.dataset.id;
    const reviews = this.data.reviews.map(review => {
      if (review.id === id) {
        return {
          ...review,
          likes: review.likes + 1
        };
      }
      return review;
    });

    this.setData({ reviews });
    showToast('点赞成功');
  },

  // 评论
  onComment(e) {
    const id = e.currentTarget.dataset.id;
    // TODO: 实现评论功能
    showToast('评论功能开发中');
  },

  // 分享评价
  onShareReview(e) {
    const id = e.currentTarget.dataset.id;
    // 触发分享
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 发布评价
  onPublish() {
    showToast('发布功能开发中');
    // TODO: 跳转到发布页面
    // wx.navigateTo({
    //   url: '/pages/publish/publish'
    // });
  },

  // 发布找搭子
  onPublishPartner() {
    showToast('发布功能开发中');
    // TODO: 跳转到发布搭子页面
    // wx.navigateTo({
    //   url: '/pages/publish-partner/publish-partner'
    // });
  },

  // 联系
  async onContact(e) {
    const wechat = e.currentTarget.dataset.wechat;
    const confirmed = await showConfirm(`微信号：${wechat}\n\n是否复制？`, '联系方式');

    if (confirmed) {
      wx.setClipboardData({
        data: wechat,
        success: () => {
          showToast('已复制到剪贴板');
        }
      });
    }
  },

  // 申请加入
  async onJoin(e) {
    const id = e.currentTarget.dataset.id;
    const partner = this.data.partners.find(p => p.id === id);

    if (!partner) return;

    // TODO: 实际应用中这里应该发送申请请求
    const confirmed = await showConfirm(
      `即将申请加入${partner.user.nickname}的滑雪之旅\n\n目标雪场：${partner.targetResort}\n计划日期：${partner.plannedDate}`,
      '确认加入'
    );

    if (confirmed) {
      showToast('申请已发送，等待对方确认');
    }
  },

  // 分享
  onShareAppMessage() {
    const titles = [
      '发现超棒的滑雪场！',
      '快来这里找滑雪搭子～',
      '滑雪社区等你来分享！'
    ];

    return {
      title: titles[this.data.currentTab] || titles[0],
      path: '/pages/explore/explore',
      imageUrl: '/images/share-bg.png'
    };
  },

  onShareTimeline() {
    return {
      title: '滑雪场助手 - 探索全球滑雪场，找滑雪搭子',
      imageUrl: '/images/share-bg.png'
    };
  }
});
