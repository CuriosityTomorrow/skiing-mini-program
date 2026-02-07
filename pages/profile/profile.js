// pages/profile/profile.js
const { getUserInfo, saveUserInfo, showToast, showConfirm } = require('../../utils/util.js');

Page({
  data: {
    userInfo: null,
    stats: {
      reviewCount: 0,
      partnerCount: 0,
      followerCount: 0
    },
    showEditModal: false,
    skillLevels: [],
    editForm: {
      nickname: '',
      gender: '',
      age: '',
      location: '',
      skiType: 0,
      experience: '',
      level: 0,
      wechat: ''
    }
  },

  onLoad() {
    const app = getApp();
    this.setData({
      skillLevels: app.globalData.skillLevels
    });
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = getUserInfo();

    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        stats: {
          reviewCount: userInfo.reviewCount || 0,
          partnerCount: userInfo.partnerCount || 0,
          followerCount: userInfo.followerCount || 0
        }
      });
    }
  },

  // 获取用户信息授权
  async onGetUserInfo(e) {
    if (e.detail.userInfo) {
      // 用户同意授权
      const userInfo = e.detail.userInfo;

      // 保存用户信息
      const profile = {
        id: Date.now(),
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl,
        gender: userInfo.gender === 1 ? '男' : '女',
        skiType: 0,
        skiTypeLabel: '未设置',
        experience: '',
        level: 0,
        levelLabel: '未设置',
        location: '',
        wechat: '',
        reviewCount: 0,
        partnerCount: 0,
        followerCount: 0
      };

      const success = saveUserInfo(profile);

      if (success) {
        this.setData({
          userInfo: profile
        });
        showToast('登录成功');
      } else {
        showToast('登录失败，请重试');
      }
    } else {
      showToast('需要授权才能使用完整功能');
    }
  },

  // 编辑资料
  onEditProfile() {
    const userInfo = this.data.userInfo;

    this.setData({
      showEditModal: true,
      editForm: {
        nickname: userInfo.nickname || '',
        gender: userInfo.gender || '',
        age: userInfo.age || '',
        location: userInfo.location || '',
        skiType: userInfo.skiType || 0,
        experience: userInfo.experience || '',
        level: userInfo.level || 0,
        wechat: userInfo.wechat || ''
      }
    });
  },

  // 关闭编辑弹窗
  onCloseEditModal() {
    this.setData({
      showEditModal: false
    });
  },

  // 阻止冒泡
  stopPropagation() {
    // 空函数，阻止事件冒泡
  },

  // 昵称输入
  onNicknameInput(e) {
    this.setData({
      'editForm.nickname': e.detail.value
    });
  },

  // 性别选择
  onGenderSelect(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      'editForm.gender': gender
    });
  },

  // 年龄输入
  onAgeInput(e) {
    this.setData({
      'editForm.age': e.detail.value
    });
  },

  // 所在地输入
  onLocationInput(e) {
    this.setData({
      'editForm.location': e.detail.value
    });
  },

  // 滑雪类型选择
  onSkiTypeSelect(e) {
    const type = parseInt(e.currentTarget.dataset.type);
    this.setData({
      'editForm.skiType': type
    });
  },

  // 滑雪时长输入
  onExperienceInput(e) {
    this.setData({
      'editForm.experience': e.detail.value
    });
  },

  // 水平选择
  onLevelSelect(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    this.setData({
      'editForm.level': id
    });
  },

  // 微信号输入
  onWechatInput(e) {
    this.setData({
      'editForm.wechat': e.detail.value
    });
  },

  // 保存资料
  onSaveProfile() {
    const form = this.data.editForm;

    // 验证必填项
    if (!form.nickname) {
      showToast('请输入昵称');
      return;
    }

    if (!form.skiType) {
      showToast('请选择滑雪类型');
      return;
    }

    if (!form.level) {
      showToast('请选择滑雪水平');
      return;
    }

    // 获取滑雪类型和水平标签
    const app = getApp();
    const skiTypeInfo = app.globalData.skiTypes.find(t => t.id === form.skiType);
    const levelInfo = app.globalData.skillLevels.find(l => l.id === form.level);

    const updatedUserInfo = {
      ...this.data.userInfo,
      nickname: form.nickname,
      gender: form.gender,
      age: form.age,
      location: form.location,
      skiType: form.skiType,
      skiTypeLabel: skiTypeInfo ? skiTypeInfo.label : '未设置',
      experience: form.experience,
      level: form.level,
      levelLabel: levelInfo ? levelInfo.label : '未设置',
      wechat: form.wechat
    };

    const success = saveUserInfo(updatedUserInfo);

    if (success) {
      this.setData({
        userInfo: updatedUserInfo,
        showEditModal: false
      });
      showToast('保存成功');
    } else {
      showToast('保存失败，请重试');
    }
  },

  // 我的评价
  onMyReviews() {
    if (!this.checkLogin()) return;
    showToast('我的评价功能开发中');
    // TODO: 跳转到我的评价页面
  },

  // 我的搭子
  onMyPartners() {
    if (!this.checkLogin()) return;
    showToast('我的搭子功能开发中');
    // TODO: 跳转到我的搭子页面
  },

  // 收藏
  onFavorites() {
    if (!this.checkLogin()) return;
    showToast('收藏功能开发中');
    // TODO: 跳转到收藏页面
  },

  // 设置
  onSettings() {
    showToast('设置功能开发中');
  },

  // 关于
  onAbout() {
    wx.showModal({
      title: '关于滑雪场助手',
      content: '版本：1.0.0\n\n帮助你找到心仪的滑雪场，发现滑雪搭子，分享滑雪体验。\n\n祝你滑雪愉快！⛷️',
      showCancel: false
    });
  },

  // 反馈
  onFeedback() {
    showToast('反馈功能开发中');
  },

  // 退出登录
  async onLogout() {
    const confirmed = await showConfirm('确定要退出登录吗？', '提示');

    if (confirmed) {
      try {
        wx.removeStorageSync('userInfo');
        const app = getApp();
        app.globalData.userInfo = null;

        this.setData({
          userInfo: null
        });

        showToast('已退出登录');
      } catch (e) {
        showToast('退出失败，请重试');
      }
    }
  },

  // 检查登录状态
  checkLogin() {
    if (!this.data.userInfo) {
      showToast('请先登录');
      return false;
    }
    return true;
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
