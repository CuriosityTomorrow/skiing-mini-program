// pages/note-detail/note-detail.js
const { notesData } = require('../../data/resorts.js');

Page({
  data: {
    noteId: null,
    note: null,
    currentImageIndex: 0,
    previewComments: []
  },

  onLoad(options) {
    if (options.id) {
      this.loadNoteDetail(options.id);
    }
  },

  // 加载笔记详情
  loadNoteDetail(noteId) {
    const note = notesData.find(n => n.id == noteId);

    if (note) {
      // 格式化时间
      const createTime = new Date(note.createTime);
      const now = new Date();
      const diffTime = now - createTime;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let createTimeText;
      if (diffDays === 0) {
        createTimeText = '今天';
      } else if (diffDays === 1) {
        createTimeText = '昨天';
      } else if (diffDays < 7) {
        createTimeText = `${diffDays}天前`;
      } else {
        createTimeText = createTime.toLocaleDateString('zh-CN');
      }

      this.setData({
        note: {
          ...note,
          createTimeText
        }
      });

      // 生成模拟评论预览
      this.generatePreviewComments();
    } else {
      wx.showToast({
        title: '笔记不存在',
        icon: 'none'
      });
    }
  },

  // 生成模拟评论预览
  generatePreviewComments() {
    const mockComments = [
      {
        id: 1,
        user: {
          avatar: 'https://i.pravatar.cc/150?img=20',
          nickname: '雪友A'
        },
        content: '太棒了！求同行～',
        likes: 23,
        timeText: '2小时前'
      },
      {
        id: 2,
        user: {
          avatar: 'https://i.pravatar.cc/150?img=21',
          nickname: '雪友B'
        },
        content: '照片真好看👀',
        likes: 12,
        timeText: '5小时前'
      },
      {
        id: 3,
        user: {
          avatar: 'https://i.pravatar.cc/150?img=22',
          nickname: '雪友C'
        },
        content: '我也想去！',
        likes: 8,
        timeText: '1天前'
      }
    ];

    this.setData({
      previewComments: mockComments.slice(0, 3)
    });
  },

  // 切换点赞
  toggleLike() {
    const note = this.data.note;
    note.isLiked = !note.isLiked;
    note.likes += note.isLiked ? 1 : -1;

    this.setData({ note });

    wx.showToast({
      title: note.isLiked ? '已点赞 🐱💙' : '取消点赞',
      icon: 'none'
    });
  },

  // 切换收藏
  toggleCollect() {
    const note = this.data.note;
    note.isCollected = !note.isCollected;

    this.setData({ note });

    wx.showToast({
      title: note.isCollected ? '已收藏 🐱⭐' : '取消收藏',
      icon: 'none'
    });
  },

  // 查看全部评论
  showAllComments() {
    wx.showToast({
      title: '评论区功能开发中',
      icon: 'none'
    });
  },

  // 分享
  onShare() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  // 申请加入搭子
  applyPartner() {
    const note = this.data.note;

    if (note.partnerInfo && note.partnerInfo.status === 'open') {
      wx.showModal({
        title: '申请加入',
        content: `确定要申请加入${note.author.nickname}的行程吗？`,
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '申请已发送，等待通过 🐾',
              icon: 'none'
            });

            // 更新状态
            note.partnerInfo.currentJoiners += 1;
            if (note.partnerInfo.currentJoiners >= note.partnerInfo.maxJoiners) {
              note.partnerInfo.status = 'full';
            }
            this.setData({ note });
          }
        }
      });
    }
  },

  // 跳转到滑雪场详情
  goToResort() {
    if (this.data.note && this.data.note.resortId) {
      wx.navigateTo({
        url: `/pages/resort/resort?id=${this.data.note.resortId}`
      });
    }
  },

  // Swiper切换
  onSwiperChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    });
  },

  // 分享到微信
  onShareAppMessage() {
    const note = this.data.note;
    return {
      title: note.title,
      path: `/pages/note-detail/note-detail?id=${note.id}`,
      imageUrl: note.coverImage
    };
  }
});
