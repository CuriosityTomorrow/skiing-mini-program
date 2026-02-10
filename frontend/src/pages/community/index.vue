<template>
  <view class="community-page">
    <!-- 顶部类型切换 -->
    <view class="type-tabs">
      <view
        v-for="type in noteTypes"
        :key="type.value"
        class="tab-item"
        :class="{ active: currentType === type.value }"
        @click="switchType(type.value)"
      >
        <text>{{ type.label }}</text>
      </view>
    </view>

    <!-- 瀑布流笔记列表 -->
    <view class="notes-waterfall">
      <view class="column" v-for="(column, colIndex) in columns" :key="colIndex">
        <view
          v-for="note in column"
          :key="note.id"
          class="note-card"
          @click="handleNoteClick(note)"
        >
          <!-- 封面图 -->
          <image class="cover-image" :src="note.coverImage" mode="aspectFill" />

          <!-- 笔记信息 -->
          <view class="note-info">
            <text class="note-title">{{ note.title }}</text>

            <!-- 用户信息 -->
            <view class="user-info">
              <image class="avatar" :src="note.user.avatar" mode="aspectFill" />
              <text class="nickname">{{ note.user.nickname }}</text>
            </view>

            <!-- 用户标签 -->
            <view class="tags">
              <text v-for="tag in note.user.tags" :key="tag" class="tag">{{ tag }}</text>
            </view>

            <!-- 关联滑雪场 -->
            <view v-if="note.resort" class="resort-tag">
              <text>📍 {{ note.resort.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentType: 'all',
      noteTypes: [
        { label: '全部', value: 'all' },
        { label: '体验分享', value: 'experience' },
        { label: '找搭子', value: 'findPartner' }
      ],
      allNotes: [
        {
          id: '1',
          title: '万龙初体验，雪质超赞！',
          coverImage: 'https://picsum.photos/300/400?random=1',
          type: 'experience',
          content: '第一次来万龙，雪质真的太好了...',
          user: {
            id: 'u1',
            nickname: '小雪花',
            avatar: 'https://picsum.photos/100/100?random=11',
            tags: ['单板', '中级', '北京']
          },
          resort: {
            id: '1',
            name: '万龙滑雪场'
          },
          likes: 128,
          createTime: '2026-02-08'
        },
        {
          id: '2',
          title: '周末找单板搭子！',
          coverImage: 'https://picsum.photos/300/500?random=2',
          type: 'findPartner',
          content: '本人女生，单板中级，周末去军都山...',
          user: {
            id: 'u2',
            nickname: '滑雪小白',
            avatar: 'https://picsum.photos/100/100?random=12',
            tags: ['单板', '初级', '北京']
          },
          resort: {
            id: '4',
            name: '军都山滑雪场'
          },
          likes: 45,
          createTime: '2026-02-09'
        },
        {
          id: '3',
          title: '太舞的夜场太美了',
          coverImage: 'https://picsum.photos/300/450?random=3',
          type: 'experience',
          content: '夜场灯光很漂亮，雪道也很好...',
          user: {
            id: 'u3',
            nickname: '雪山飞狐',
            avatar: 'https://picsum.photos/100/100?random=13',
            tags: ['双板', '高级', '河北']
          },
          resort: {
            id: '2',
            name: '太舞滑雪场'
          },
          likes: 256,
          createTime: '2026-02-07'
        },
        {
          id: '4',
          title: '室内雪场也能练技术',
          coverImage: 'https://picsum.photos/300/380?random=4',
          type: 'experience',
          content: '乔波冰雪世界很适合练习基础动作',
          user: {
            id: 'u1',
            nickname: '小雪花',
            avatar: 'https://picsum.photos/100/100?random=11',
            tags: ['单板', '中级', '北京']
          },
          resort: {
            id: '3',
            name: '乔波冰雪世界'
          },
          likes: 89,
          createTime: '2026-02-06'
        },
        {
          id: '5',
          title: '明天去融创，有一起的吗？',
          coverImage: 'https://picsum.photos/300/420?random=5',
          type: 'findPartner',
          content: '广州的朋友，明天下午去融创雪世界',
          user: {
            id: 'u4',
            nickname: '南方的雪',
            avatar: 'https://picsum.photos/100/100?random=14',
            tags: ['单板', '初级', '广州']
          },
          resort: {
            id: '5',
            name: '融创雪世界'
          },
          likes: 32,
          createTime: '2026-02-10'
        }
      ],
      columns: [[], []]
    }
  },
  onLoad() {
    this.loadNotes()
  },
  methods: {
    loadNotes() {
      // 根据类型筛选
      let filtered = this.currentType === 'all'
        ? [...this.allNotes]
        : this.allNotes.filter(note => note.type === this.currentType)

      // 分配到两列（瀑布流简单实现）
      this.columns = [[], []]
      filtered.forEach((note, index) => {
        this.columns[index % 2].push(note)
      })
    },
    switchType(type) {
      this.currentType = type
      this.loadNotes()
    },
    handleNoteClick(note) {
      console.log('点击笔记:', note.id)
      // TODO: 跳转到笔记详情页
      uni.showToast({
        title: '笔记详情页待开发',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.community-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.type-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #667eea;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2rpx;
}

.notes-waterfall {
  display: flex;
  padding: 20rpx 10rpx;
  gap: 20rpx;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.note-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
}

.cover-image {
  width: 100%;
  height: 400rpx;
  display: block;
}

.note-info {
  padding: 20rpx;
}

.note-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-right: 12rpx;
}

.nickname {
  font-size: 24rpx;
  color: #666;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.tag {
  padding: 6rpx 16rpx;
  background: #f0f0f0;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #999;
}

.resort-tag {
  padding: 8rpx 16rpx;
  background: linear-gradient(135deg, #667eea22 0%, #764ba222 100%);
  border-radius: 8rpx;
  display: inline-block;
}

.resort-tag text {
  font-size: 22rpx;
  color: #667eea;
}
</style>
