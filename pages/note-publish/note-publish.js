// pages/note-publish/note-publish.js
const { resortsData } = require('../../data/resorts.js');

Page({
  data: {
    noteType: 'experience', // experience | partner
    images: [],
    title: '',
    content: '',
    selectedResort: null,
    tags: [],
    tagInput: '',
    canPublish: false,

    // 找搭子信息
    partnerInfo: {
      plannedDate: '',
      maxJoiners: 4,
      currentJoiners: 1,
      tags: []
    },
    personCountOptions: [1, 2, 3, 4, 5, 6, 7, 8],
    partnerTagOptions: ['可开车', 'AA制', '女生专属', '中等水平', '高手同行', '新手友好']
  },

  onLoad() {
    // 设置默认日期为一周后
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    const plannedDate = defaultDate.toISOString().split('T')[0];

    this.setData({
      'partnerInfo.plannedDate': plannedDate
    });
  },

  // 选择类型
  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      noteType: type
    });
    this.checkCanPublish();
  },

  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 9 - this.data.images.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const images = [...this.data.images, ...res.tempFiles.map(file => file.tempFilePath)];
        this.setData({ images });
        this.checkCanPublish();
      }
    });
  },

  // 删除图片
  removeImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({ images });
  },

  // 标题输入
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    });
    this.checkCanPublish();
  },

  // 正文输入
  onContentInput(e) {
    this.setData({
      content: e.detail.value
    });
    this.checkCanPublish();
  },

  // 选择滑雪场
  selectResort() {
    // 这里可以跳转到搜索页面，简化起见直接展示
    wx.showActionSheet({
      itemList: resortsData.slice(0, 10).map(r => r.name),
      success: (res) => {
        this.setData({
          selectedResort: resortsData[res.tapIndex]
        });
      }
    });
  },

  // 标签输入
  onTagInput(e) {
    this.setData({
      tagInput: e.detail.value
    });
  },

  // 添加标签
  addTag() {
    const tag = this.data.tagInput.trim();
    if (tag && !this.data.tags.includes(tag)) {
      this.setData({
        tags: [...this.data.tags, tag],
        tagInput: ''
      });
    }
  },

  // 删除标签
  removeTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const tags = this.data.tags.filter(t => t !== tag);
    this.setData({ tags });
  },

  // 找搭子 - 选择日期
  onDateChange(e) {
    this.setData({
      'partnerInfo.plannedDate': e.detail.value
    });
  },

  // 找搭子 - 选择人数
  onPersonCountChange(e) {
    const count = this.data.personCountOptions[e.detail.value] + 1;
    this.setData({
      'partnerInfo.maxJoiners': count
    });
  },

  // 切换找搭子标签
  togglePartnerTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const tags = this.data.partnerInfo.tags;
    const index = tags.indexOf(tag);

    if (index > -1) {
      tags.splice(index, 1);
    } else {
      tags.push(tag);
    }

    this.setData({
      'partnerInfo.tags': tags
    });
  },

  // 检查是否可以发布
  checkCanPublish() {
    const { noteType, title, images } = this.data;
    let canPublish = false;

    if (noteType === 'experience') {
      canPublish = title.trim().length > 0;
    } else {
      canPublish = title.trim().length > 0;
    }

    this.setData({ canPublish });
  },

  // 发布
  onPublish() {
    if (!this.data.canPublish) return;

    wx.showLoading({
      title: '发布中...',
      mask: true
    });

    // 模拟发布
    setTimeout(() => {
      wx.hideLoading();

      wx.showModal({
        title: '发布成功',
        content: '🐱⛷️✨\n\n你的笔记已被雪友们看到啦～',
        showCancel: false,
        confirmText: '返回',
        success: () => {
          wx.navigateBack();
        }
      });
    }, 1500);
  },

  // 取消
  onCancel() {
    if (this.data.title || this.data.content || this.data.images.length > 0) {
      wx.showModal({
        title: '提示',
        content: '放弃编辑？内容将保存到草稿箱',
        confirmText: '放弃',
        cancelText: '继续编辑',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  },

  // 草稿箱
  showDrafts() {
    wx.showToast({
      title: '草稿箱功能开发中',
      icon: 'none'
    });
  }
});
