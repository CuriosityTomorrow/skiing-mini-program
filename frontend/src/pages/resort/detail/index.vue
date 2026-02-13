<template>
  <view class="page">
    <!-- 加载中 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <!-- 详情内容 -->
    <scroll-view v-else scroll-y class="detail-content">
      <!-- 封面和基本信息 -->
      <view class="header-section">
        <!-- 封面图（暂时用渐变代替） -->
        <view class="cover-image">
          <view class="cover-overlay"></view>
          <view class="header-info">
            <text class="resort-name">{{ resort.name }}</text>
            <view class="resort-meta">
              <text class="meta-item">📍 {{ resort.city }} · {{ resort.province }}</text>
              <text v-if="resort.type" class="meta-item">
                {{ resort.type === 'indoor' ? '🏢 室内' : '⛰️ 室外' }}
              </text>
            </view>
          </view>
        </view>

        <!-- 标签栏 -->
        <view class="tags-bar">
          <text v-if="resort.scores && resort.scores.overall >= 8.5" class="tag premium">⭐ 优质</text>
          <text v-if="resort.scores && resort.scores.value >= 8.0" class="tag value">💰 性价比高</text>
          <text v-if="resort.scores && resort.scores.beginner >= 7.5" class="tag beginner">👶 新手友好</text>
          <text v-if="resort.scores && resort.scores.expert >= 8.5" class="tag expert">🎿 高手推荐</text>
          <text v-if="resort.scores && resort.scores.family >= 8.0" class="tag family">👨‍👩‍👧 亲子友好</text>
        </view>
      </view>

      <!-- Ski Score 评分 -->
      <view class="section ski-scores">
        <view class="section-title">
          <text class="title-icon">📊</text>
          <text class="title-text">Ski Score 评分</text>
        </view>

        <view class="score-grid">
          <!-- 综合评分 -->
          <view class="score-card main">
            <text class="score-value">{{ resort.scores?.overall || 0 }}</text>
            <text class="score-label">综合评分</text>
            <view class="score-bar">
              <view class="bar-fill" :style="{ width: (resort.scores?.overall || 0) * 10 + '%' }"></view>
            </view>
          </view>

          <!-- 子评分 -->
          <view class="score-card">
            <text class="score-icon">👶</text>
            <text class="score-value small">{{ resort.scores?.beginner || 0 }}</text>
            <text class="score-label">新手友好</text>
            <view class="score-bar">
              <view class="bar-fill beginner" :style="{ width: (resort.scores?.beginner || 0) * 10 + '%' }"></view>
            </view>
          </view>

          <view class="score-card">
            <text class="score-icon">🎯</text>
            <text class="score-value small">{{ resort.scores?.intermediate || 0 }}</text>
            <text class="score-label">中级友好</text>
            <view class="score-bar">
              <view class="bar-fill intermediate" :style="{ width: (resort.scores?.intermediate || 0) * 10 + '%' }"></view>
            </view>
          </view>

          <view class="score-card">
            <text class="score-icon">🎿</text>
            <text class="score-value small">{{ resort.scores?.expert || 0 }}</text>
            <text class="score-label">高手推荐</text>
            <view class="score-bar">
              <view class="bar-fill expert" :style="{ width: (resort.scores?.expert || 0) * 10 + '%' }"></view>
            </view>
          </view>

          <view class="score-card">
            <text class="score-icon">👨‍👩‍👧</text>
            <text class="score-value small">{{ resort.scores?.family || 0 }}</text>
            <text class="score-label">亲子友好</text>
            <view class="score-bar">
              <view class="bar-fill family" :style="{ width: (resort.scores?.family || 0) * 10 + '%' }"></view>
            </view>
          </view>

          <view class="score-card">
            <text class="score-icon">💰</text>
            <text class="score-value small">{{ resort.scores?.value || 0 }}</text>
            <text class="score-label">性价比</text>
            <view class="score-bar">
              <view class="bar-fill value" :style="{ width: (resort.scores?.value || 0) * 10 + '%' }"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 社区数据 -->
      <view class="section community-stats" v-if="resort.community">
        <view class="stat-grid">
          <view class="stat-item">
            <text class="stat-icon">⭐</text>
            <text class="stat-value">{{ resort.community.rating || 0 }}</text>
            <text class="stat-label">用户评分</text>
          </view>
          <view class="stat-item">
            <text class="stat-icon">💬</text>
            <text class="stat-value">{{ resort.community.reviewCount || 0 }}</text>
            <text class="stat-label">评价数</text>
          </view>
          <view class="stat-item">
            <text class="stat-icon">👥</text>
            <text class="stat-value">{{ resort.community.visitedCount || 0 }}</text>
            <text class="stat-label">去过</text>
          </view>
          <view class="stat-item">
            <text class="stat-icon">❤️</text>
            <text class="stat-value">{{ resort.community.favoriteCount || 0 }}</text>
            <text class="stat-label">收藏</text>
          </view>
        </view>
      </view>

      <!-- 雪道信息 -->
      <view class="section trails-section" v-if="resort.trails">
        <view class="section-title">
          <text class="title-icon">⛷️</text>
          <text class="title-text">雪道信息</text>
        </view>

        <view class="trails-summary">
          <view class="summary-item main">
            <text class="summary-value">{{ resort.trails.total || resort.trails.totalCount || 0 }}</text>
            <text class="summary-label">总雪道数</text>
          </view>
          <view class="summary-item">
            <text class="summary-value">{{ resort.trails.maxLength || '-' }}</text>
            <text class="summary-label">最长雪道(米)</text>
          </view>
          <view class="summary-item">
            <text class="summary-value">{{ resort.trails.verticalDrop || '-' }}</text>
            <text class="summary-label">垂直落差(米)</text>
          </view>
        </view>

        <view class="trails-breakdown">
          <view class="trail-item">
            <view class="trail-bar beginner" :style="{ width: getTrailPercentage('beginner') }"></view>
            <text class="trail-label">初级 {{ resort.trails.beginner || 0 }}条</text>
          </view>
          <view class="trail-item">
            <view class="trail-bar intermediate" :style="{ width: getTrailPercentage('intermediate') }"></view>
            <text class="trail-label">中级 {{ resort.trails.intermediate || 0 }}条</text>
          </view>
          <view class="trail-item">
            <view class="trail-bar advanced" :style="{ width: getTrailPercentage('advanced') }"></view>
            <text class="trail-label">高级 {{ resort.trails.advanced || 0 }}条</text>
          </view>
          <view class="trail-item">
            <view class="trail-bar expert" :style="{ width: getTrailPercentage('expert') }"></view>
            <text class="trail-label">专家级 {{ resort.trails.expert || 0 }}条</text>
          </view>
        </view>
      </view>

      <!-- 价格信息 -->
      <view class="section pricing-section" v-if="resort.pricing">
        <view class="section-title">
          <text class="title-icon">💰</text>
          <text class="title-text">票价信息</text>
        </view>

        <view class="price-list">
          <view class="price-item" v-if="resort.pricing.daily">
            <text class="price-label">日票</text>
            <text class="price-value">¥{{ resort.pricing.daily }}</text>
          </view>
          <view class="price-item" v-if="resort.pricing.night">
            <text class="price-label">夜场票</text>
            <text class="price-value">¥{{ resort.pricing.night }}</text>
          </view>
          <view class="price-item" v-if="resort.pricing.weekend">
            <text class="price-label">周末票</text>
            <text class="price-value">¥{{ resort.pricing.weekend }}</text>
          </view>
          <view class="price-item" v-if="resort.pricing.season">
            <text class="price-label">季卡</text>
            <text class="price-value">¥{{ resort.pricing.season }}</text>
          </view>
        </view>

        <view class="price-note">
          <text>💡 平均消费：¥{{ resort.pricing.avgCost || resort.pricing.daily || '-' }}/天</text>
        </view>
      </view>

      <!-- 设施信息 -->
      <view class="section facilities-section" v-if="resort.facilities">
        <view class="section-title">
          <text class="title-icon">🏗️</text>
          <text class="title-text">设施服务</text>
        </view>

        <view class="facilities-grid">
          <view class="facility-item" :class="{ available: resort.facilities.rental }">
            <text class="facility-icon">🎿</text>
            <text class="facility-label">租雪具</text>
          </view>
          <view class="facility-item" :class="{ available: resort.facilities.coach }">
            <text class="facility-icon">👨‍🏫</text>
            <text class="facility-label">教练</text>
          </view>
          <view class="facility-item" :class="{ available: resort.facilities.parking }">
            <text class="facility-icon">🅿️</text>
            <text class="facility-label">停车场</text>
          </view>
          <view class="facility-item" :class="{ available: resort.facilities.restaurant }">
            <text class="facility-icon">🍴</text>
            <text class="facility-label">餐厅</text>
          </view>
          <view class="facility-item" :class="{ available: resort.facilities.hotel }">
            <text class="facility-icon">🏨</text>
            <text class="facility-label">住宿</text>
          </view>
          <view class="facility-item" :class="{ available: resort.facilities.locker }">
            <text class="facility-icon">🔒</text>
            <text class="facility-label">储物柜</text>
          </view>
          <view class="facility-item" :class="{ available: resort.facilities.nightSkiing }">
            <text class="facility-icon">🌙</text>
            <text class="facility-label">夜场</text>
          </view>
          <view class="facility-item" :class="{ available: resort.facilities.magicCarpet }">
            <text class="facility-icon">✨</text>
            <text class="facility-label">魔毯</text>
          </view>
          <view class="facility-item" :class="{ available: resort.facilities.cableCar }">
            <text class="facility-icon">🚠</text>
            <text class="facility-label">缆车</text>
          </view>
          <view class="facility-item" :class="{ available: resort.facilities.snowPark }">
            <text class="facility-icon">🏂</text>
            <text class="facility-label">单板公园</text>
          </view>
          <view class="facility-item" :class="{ available: resort.facilities.kidsArea }">
            <text class="facility-icon">👶</text>
            <text class="facility-label">儿童区</text>
          </view>
        </view>
      </view>

      <!-- 季节信息 -->
      <view class="section season-section" v-if="resort.season">
        <view class="section-title">
          <text class="title-icon">📅</text>
          <text class="title-text">季节信息</text>
        </view>

        <view class="season-info">
          <view class="info-row">
            <text class="info-label">开放时间</text>
            <text class="info-value">{{ resort.season.openMonth }}月 - {{ resort.season.closeMonth }}月</text>
          </view>
          <view class="info-row">
            <text class="info-label">雪质类型</text>
            <text class="info-value">{{ getSnowQualityText(resort.season.snowQuality) }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">当前状态</text>
            <text :class="['status-badge', resort.season.status]">
              {{ getStatusText(resort.season.status) }}
            </text>
          </view>
          <view class="info-row" v-if="resort.season.bestMonths">
            <text class="info-label">最佳月份</text>
            <text class="info-value">{{ resort.season.bestMonths.join('月, ') }}月</text>
          </view>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="section contact-section" v-if="resort.contact">
        <view class="section-title">
          <text class="title-icon">📞</text>
          <text class="title-text">联系方式</text>
        </view>

        <view class="contact-info">
          <view class="contact-item" v-if="resort.contact.phone">
            <text class="contact-icon">📱</text>
            <text class="contact-label">电话</text>
            <text class="contact-value">{{ resort.contact.phone }}</text>
          </view>
          <view class="contact-item" v-if="resort.contact.website">
            <text class="contact-icon">🌐</text>
            <text class="contact-label">官网</text>
            <text class="contact-value">{{ resort.contact.website }}</text>
          </view>
          <view class="contact-item" v-if="resort.contact.hours">
            <text class="contact-icon">🕐</text>
            <text class="contact-label">营业时间</text>
            <text class="contact-value">{{ resort.contact.hours.open }} - {{ resort.contact.hours.close }}</text>
          </view>
        </view>
      </view>

      <!-- 特色亮点 -->
      <view class="section highlights-section" v-if="resort.highlights && resort.highlights.length > 0">
        <view class="section-title">
          <text class="title-icon">✨</text>
          <text class="title-text">特色亮点</text>
        </view>

        <view class="highlights-list">
          <view v-for="(highlight, index) in resort.highlights" :key="index" class="highlight-item">
            <text class="highlight-bullet">•</text>
            <text class="highlight-text">{{ highlight }}</text>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-placeholder"></view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <button class="action-btn secondary" @click="goBack">
        <text class="btn-icon">←</text>
        <text>返回</text>
      </button>
      <button class="action-btn secondary">
        <text class="btn-icon">❤️</text>
        <text>收藏</text>
      </button>
      <button class="action-btn primary">
        <text class="btn-icon">🧭</text>
        <text>导航</text>
      </button>
    </view>
  </view>
</template>

<script>
import { ResortSearchAppService } from '../../../application/services/ResortSearchAppService.js'

export default {
  data() {
    return {
      resortId: '',
      resort: {},
      loading: false,
      resortService: null
    }
  },

  onLoad(options) {
    console.log('[详情页] 加载', options)

    if (options.id) {
      this.resortId = options.id
    }

    this.resortService = new ResortSearchAppService()
    this.loadResort()
  },

  methods: {
    async loadResort() {
      if (!this.resortId) {
        uni.showToast({
          title: '缺少滑雪场ID',
          icon: 'none'
        })
        return
      }

      this.loading = true
      try {
        // 获取所有滑雪场数据
        const result = await this.resortService.getResorts({
          keyword: '',
          type: 'all'
        })

        if (result.success) {
          // 查找对应ID的滑雪场
          this.resort = result.data.find(r => r.id === this.resortId)
          if (!this.resort) {
            uni.showToast({
              title: '未找到该滑雪场',
              icon: 'none'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          } else {
            console.log('[详情页] 加载成功:', this.resort.name)
          }
        }
      } catch (error) {
        console.error('[详情页] 加载失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    getTrailPercentage(type) {
      const total = this.resort.trails?.total || this.resort.trails?.totalCount || 1
      const count = this.resort.trails?.[type] || 0
      const percent = (count / total) * 100
      return `${Math.max(percent, 5)}%`  // 最小5%确保可见
    },

    getSnowQualityText(quality) {
      const map = {
        'natural': '天然雪',
        'artificial': '人工雪',
        'mixed': '混合'
      }
      return map[quality] || '-'
    },

    getStatusText(status) {
      const map = {
        'open': '开放中',
        'closed': '已关闭',
        'coming_soon': '即将开放'
      }
      return map[status] || '未知'
    },

    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 加载中 */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 28rpx;
  color: #999;
}

.detail-content {
  height: calc(100vh - 120rpx);
  padding-bottom: 40rpx;
}

/* 头部区域 */
.header-section {
  background: #fff;
  margin-bottom: 20rpx;
}

.cover-image {
  height: 400rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 40rpx 30rpx;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
}

.header-info {
  position: relative;
  z-index: 10;
}

.resort-name {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 16rpx;
}

.resort-meta {
  display: flex;
  gap: 24rpx;
}

.meta-item {
  font-size: 26rpx;
  color: rgba(255,255,255,0.9);
}

.tags-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 24rpx 30rpx;
}

.tag {
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.tag.premium {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  color: #fff;
}

.tag.value {
  background: #fff3e0;
  color: #ef6c00;
}

.tag.beginner {
  background: #e3f2fd;
  color: #1976d2;
}

.tag.expert {
  background: #ffebee;
  color: #d32f2f;
}

.tag.family {
  background: #f3e5f5;
  color: #7b1fa2;
}

/* 通用区块样式 */
.section {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 2px solid #f5f5f5;
}

.title-icon {
  font-size: 36rpx;
  margin-right: 12rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

/* Ski Score 评分 */
.ski-scores {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.score-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.score-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.score-card.main {
  grid-column: 1 / -1;
}

.score-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.score-value {
  font-size: 64rpx;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 8rpx;
}

.score-value.small {
  font-size: 48rpx;
}

.score-label {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.score-bar {
  width: 100%;
  height: 8rpx;
  background: #f0f0f0;
  border-radius: 4rpx;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s;
}

.bar-fill.beginner {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.bar-fill.intermediate {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.bar-fill.expert {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%);
}

.bar-fill.family {
  background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
}

.bar-fill.value {
  background: linear-gradient(135deg, #fddb92 0%, #d1fdff 100%);
}

/* 社区数据 */
.community-stats {
  padding: 24rpx 30rpx;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #999;
}

/* 雪道信息 */
.trails-summary {
  display: flex;
  gap: 20rpx;
  margin-bottom: 32rpx;
}

.summary-item {
  flex: 1;
  background: #f5f7fa;
  border-radius: 12rpx;
  padding: 20rpx;
  text-align: center;
}

.summary-item.main {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.summary-value {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.summary-item.main .summary-value {
  color: #fff;
}

.summary-label {
  font-size: 22rpx;
  color: #999;
}

.summary-item.main .summary-label {
  color: rgba(255,255,255,0.9);
}

.trails-breakdown {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.trail-item {
  position: relative;
  height: 60rpx;
  display: flex;
  align-items: center;
}

.trail-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 8rpx;
  transition: width 0.3s;
}

.trail-bar.beginner {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.trail-bar.intermediate {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.trail-bar.advanced {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%);
}

.trail-bar.expert {
  background: linear-gradient(135deg, #d38312 0%, #a83279 100%);
}

.trail-label {
  position: relative;
  z-index: 10;
  padding-left: 20rpx;
  font-size: 26rpx;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
}

/* 价格信息 */
.price-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
}

.price-label {
  font-size: 28rpx;
  color: #666;
}

.price-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #667eea;
}

.price-note {
  margin-top: 16rpx;
  padding: 16rpx;
  background: #fff3e0;
  border-radius: 8rpx;
  text-align: center;
  font-size: 24rpx;
  color: #ef6c00;
}

/* 设施信息 */
.facilities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.facility-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  opacity: 0.4;
}

.facility-item.available {
  opacity: 1;
  background: linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%);
}

.facility-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.facility-label {
  font-size: 22rpx;
  color: #666;
  text-align: center;
}

/* 季节信息 */
.season-info {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #f5f5f5;
}

.info-label {
  font-size: 26rpx;
  color: #999;
}

.info-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.status-badge {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.status-badge.open {
  background: #e8f5e9;
  color: #388e3c;
}

.status-badge.closed {
  background: #ffebee;
  color: #d32f2f;
}

.status-badge.coming_soon {
  background: #fff3e0;
  color: #f57c00;
}

/* 联系方式 */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
}

.contact-icon {
  font-size: 36rpx;
}

.contact-label {
  flex-shrink: 0;
  font-size: 26rpx;
  color: #999;
  width: 120rpx;
}

.contact-value {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}

/* 特色亮点 */
.highlights-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.highlight-item {
  display: flex;
  gap: 16rpx;
  padding: 16rpx;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 20%, #f6d365 100%);
  border-radius: 12rpx;
}

.highlight-bullet {
  flex-shrink: 0;
  font-size: 32rpx;
  color: #fff;
}

.highlight-text {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  line-height: 1.6;
}

/* 底部占位 */
.bottom-placeholder {
  height: 40rpx;
}

/* 底部操作栏 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.05);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.action-btn.secondary {
  background: #f5f5f5;
  color: #666;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-icon {
  font-size: 32rpx;
}
</style>
