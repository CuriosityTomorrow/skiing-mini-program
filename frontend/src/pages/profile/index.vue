<template>
  <view class="profile-page">
    <view class="header">
      <image class="avatar" src="https://picsum.photos/200/200?random=100" mode="aspectFill" />
      <text class="nickname">游客用户</text>
      <text class="bio">这个人很懒，什么都没写</text>
    </view>

    <view class="tags-section">
      <view class="section-title">我的标签</view>
      <view class="tags">
        <text class="tag">单板</text>
        <text class="tag">中级</text>
        <text class="tag">北京</text>
        <text class="tag-add">+ 添加标签</text>
      </view>
      <text class="hint">（标签编辑功能待开发）</text>
    </view>

    <view class="stats">
      <view class="stat-item">
        <text class="stat-value">0</text>
        <text class="stat-label">笔记</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">0</text>
        <text class="stat-label">收藏</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">0</text>
        <text class="stat-label">关注</text>
      </view>
    </view>

    <view class="menu">
      <view class="menu-item">
        <text>我的笔记</text>
      </view>
      <view class="menu-item">
        <text>我的收藏</text>
      </view>
      <view class="menu-item">
        <text>设置</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  onLoad() {
    console.log('个人中心页面加载')
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255,255,255,0.5);
  margin-bottom: 24rpx;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}

.bio {
  font-size: 24rpx;
  opacity: 0.9;
}

.tags-section {
  background: #fff;
  margin: 20rpx;
  padding: 32rpx;
  border-radius: 16rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.tag {
  padding: 12rpx 24rpx;
  background: linear-gradient(135deg, #667eea22 0%, #764ba222 100%);
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #667eea;
}

.tag-add {
  padding: 12rpx 24rpx;
  border: 2rpx dashed #ddd;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #999;
}

.hint {
  font-size: 22rpx;
  color: #999;
}

.stats {
  background: #fff;
  margin: 20rpx;
  padding: 32rpx;
  border-radius: 16rpx;
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.menu {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item text {
  font-size: 28rpx;
  color: #333;
}
</style>
