<template>
  <view class="page">
    <!-- 头部 -->
    <view class="header">
      <text class="title">滑雪场对比</text>
      <text class="subtitle">对比 {{ resorts.length }} 个滑雪场</text>
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <!-- 对比表格 -->
    <scroll-view v-else scroll-x class="compare-table">
      <view class="table-wrapper">
        <!-- 表头 -->
        <view class="table-row header-row">
          <view class="label-cell">对比项</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="resort-name">{{ resort.name }}</text>
            <text class="resort-location">{{ resort.city }}</text>
          </view>
        </view>

        <!-- 评分对比 -->
        <view class="section-header">
          <text>📊 评分对比</text>
        </view>

        <view class="table-row">
          <view class="label-cell">综合评分</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <view class="score-bar">
              <text class="score-value">{{ resort.scores?.overall || 0 }}</text>
              <view class="progress-bar">
                <view
                  class="progress-fill"
                  :style="{ width: (resort.scores?.overall || 0) * 10 + '%' }"
                ></view>
              </view>
            </view>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">新手友好度</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <view class="score-bar">
              <text class="score-value">{{ resort.scores?.beginner || 0 }}</text>
              <view class="progress-bar">
                <view
                  class="progress-fill beginner"
                  :style="{ width: (resort.scores?.beginner || 0) * 10 + '%' }"
                ></view>
              </view>
            </view>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">中级友好度</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <view class="score-bar">
              <text class="score-value">{{ resort.scores?.intermediate || 0 }}</text>
              <view class="progress-bar">
                <view
                  class="progress-fill intermediate"
                  :style="{ width: (resort.scores?.intermediate || 0) * 10 + '%' }"
                ></view>
              </view>
            </view>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">高手推荐度</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <view class="score-bar">
              <text class="score-value">{{ resort.scores?.expert || 0 }}</text>
              <view class="progress-bar">
                <view
                  class="progress-fill expert"
                  :style="{ width: (resort.scores?.expert || 0) * 10 + '%' }"
                ></view>
              </view>
            </view>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">亲子友好度</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <view class="score-bar">
              <text class="score-value">{{ resort.scores?.family || 0 }}</text>
              <view class="progress-bar">
                <view
                  class="progress-fill family"
                  :style="{ width: (resort.scores?.family || 0) * 10 + '%' }"
                ></view>
              </view>
            </view>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">性价比</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <view class="score-bar">
              <text class="score-value">{{ resort.scores?.value || 0 }}</text>
              <view class="progress-bar">
                <view
                  class="progress-fill value"
                  :style="{ width: (resort.scores?.value || 0) * 10 + '%' }"
                ></view>
              </view>
            </view>
          </view>
        </view>

        <!-- 基本信息 -->
        <view class="section-header">
          <text>📍 基本信息</text>
        </view>

        <view class="table-row">
          <view class="label-cell">类型</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text :class="['type-badge', resort.type]">
              {{ resort.type === 'indoor' ? '室内' : '室外' }}
            </text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">位置</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">{{ resort.province }}</text>
            <text class="text-sub">{{ resort.city }} {{ resort.district }}</text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">用户评分</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="highlight-value">★ {{ resort.community?.rating || resort.rating || 0 }}</text>
            <text class="text-sub">{{ resort.community?.ratingCount || 0 }} 人评价</text>
          </view>
        </view>

        <!-- 价格对比 -->
        <view class="section-header">
          <text>💰 价格对比</text>
        </view>

        <view class="table-row">
          <view class="label-cell">日票价格</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text :class="['price-value', getPriceClass(resort)]">
              ¥{{ resort.pricing?.daily || resort.pricing?.avgCost || '-' }}
            </text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">夜场价格</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">¥{{ resort.pricing?.night || '-' }}</text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">周末价格</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">¥{{ resort.pricing?.weekend || '-' }}</text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">季卡价格</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">¥{{ resort.pricing?.season || '-' }}</text>
          </view>
        </view>

        <!-- 雪道对比 -->
        <view class="section-header">
          <text>⛷️ 雪道对比</text>
        </view>

        <view class="table-row">
          <view class="label-cell">总雪道数</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="highlight-value">{{ resort.trails?.total || resort.trails?.totalCount || 0 }} 条</text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">初级雪道</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">{{ resort.trails?.beginner || 0 }} 条</text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">中级雪道</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">{{ resort.trails?.intermediate || 0 }} 条</text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">高级雪道</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">{{ resort.trails?.advanced || 0 }} 条</text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">专家级雪道</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">{{ resort.trails?.expert || 0 }} 条</text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">最长雪道</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">{{ resort.trails?.maxLength || '-' }} 米</text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">垂直落差</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">{{ resort.trails?.verticalDrop || '-' }} 米</text>
          </view>
        </view>

        <!-- 设施对比 -->
        <view class="section-header">
          <text>🏗️ 设施对比</text>
        </view>

        <view class="table-row" v-for="facility in facilityList" :key="facility.key">
          <view class="label-cell">{{ facility.label }}</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text :class="['facility-status', resort.facilities?.[facility.key] ? 'yes' : 'no']">
              {{ resort.facilities?.[facility.key] ? '✓' : '✗' }}
            </text>
          </view>
        </view>

        <!-- 季节信息 -->
        <view class="section-header">
          <text>📅 季节信息</text>
        </view>

        <view class="table-row">
          <view class="label-cell">开放月份</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">{{ resort.season?.openMonth || '-' }}月 - {{ resort.season?.closeMonth || '-' }}月</text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">雪质</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text class="text-value">{{ getSnowQualityText(resort.season?.snowQuality) }}</text>
          </view>
        </view>

        <view class="table-row">
          <view class="label-cell">当前状态</view>
          <view v-for="resort in resorts" :key="resort.id" class="data-cell">
            <text :class="['status-badge', resort.season?.status]">
              {{ getStatusText(resort.season?.status) }}
            </text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <button class="btn-back" @click="goBack">返回</button>
      <button class="btn-clear" @click="clearComparison">清空对比</button>
    </view>
  </view>
</template>

<script>
import { ResortSearchAppService } from '../../../application/services/ResortSearchAppService.js'

export default {
  data() {
    return {
      resortIds: [],
      resorts: [],
      loading: false,
      resortService: null,

      facilityList: [
        { key: 'rental', label: '租雪具' },
        { key: 'parking', label: '停车场' },
        { key: 'restaurant', label: '餐厅' },
        { key: 'hotel', label: '住宿' },
        { key: 'locker', label: '储物柜' },
        { key: 'nightSkiing', label: '夜场' },
        { key: 'coach', label: '教练' },
        { key: 'magicCarpet', label: '魔毯' },
        { key: 'cableCar', label: '缆车' },
        { key: 'snowPark', label: '单板公园' },
        { key: 'kidsArea', label: '儿童区' }
      ]
    }
  },

  onLoad(options) {
    console.log('[对比页] 加载', options)

    if (options.ids) {
      this.resortIds = options.ids.split(',')
      console.log('[对比页] 对比ID列表:', this.resortIds)
    }

    this.resortService = new ResortSearchAppService()
    this.loadResorts()
  },

  methods: {
    async loadResorts() {
      if (this.resortIds.length === 0) {
        uni.showToast({
          title: '没有选择滑雪场',
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
          // 筛选出要对比的滑雪场
          this.resorts = result.data.filter(r => this.resortIds.includes(r.id))
          console.log('[对比页] 加载成功，对比', this.resorts.length, '个滑雪场')
        }
      } catch (error) {
        console.error('[对比页] 加载失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    getPriceClass(resort) {
      const price = resort.pricing?.avgCost || resort.pricing?.daily || 0
      if (price < 300) return 'low'
      if (price < 500) return 'mid'
      return 'high'
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
    },

    clearComparison() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空对比列表吗？',
        success: (res) => {
          if (res.confirm) {
            // 清空本地存储的对比列表
            uni.setStorageSync('compare_list', [])
            uni.navigateBack()
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 头部 */
.header {
  padding: 40rpx 20rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.subtitle {
  display: block;
  font-size: 24rpx;
  opacity: 0.9;
}

/* 加载中 */
.loading {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

/* 对比表格 */
.compare-table {
  white-space: nowrap;
}

.table-wrapper {
  display: inline-block;
  min-width: 100%;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.header-row {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  border-bottom: 2px solid #667eea;
}

.label-cell {
  width: 200rpx;
  min-width: 200rpx;
  padding: 24rpx 20rpx;
  font-size: 26rpx;
  color: #666;
  font-weight: bold;
  background: #fafafa;
  border-right: 1px solid #eee;
  display: flex;
  align-items: center;
}

.data-cell {
  width: 220rpx;
  min-width: 220rpx;
  padding: 24rpx 20rpx;
  font-size: 26rpx;
  color: #333;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.resort-name {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 6rpx;
  color: #333;
  word-wrap: break-word;
  white-space: normal;
}

.resort-location {
  font-size: 22rpx;
  color: #999;
}

/* 分段标题 */
.section-header {
  padding: 24rpx 20rpx;
  background: #f5f5f5;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #eee;
}

/* 评分条 */
.score-bar {
  width: 100%;
}

.score-value {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8rpx;
}

.progress-bar {
  width: 100%;
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s;
}

.progress-fill.beginner {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.progress-fill.intermediate {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.progress-fill.expert {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%);
}

.progress-fill.family {
  background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
}

.progress-fill.value {
  background: linear-gradient(135deg, #fddb92 0%, #d1fdff 100%);
}

/* 类型标签 */
.type-badge {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.type-badge.indoor {
  background: #e3f2fd;
  color: #1976d2;
}

.type-badge.outdoor {
  background: #e8f5e9;
  color: #388e3c;
}

/* 状态标签 */
.status-badge {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
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

/* 文本值 */
.text-value {
  font-size: 26rpx;
  color: #333;
}

.text-sub {
  font-size: 22rpx;
  color: #999;
  margin-top: 6rpx;
}

.highlight-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #667eea;
}

/* 价格值 */
.price-value {
  font-size: 32rpx;
  font-weight: bold;
}

.price-value.low {
  color: #4caf50;
}

.price-value.mid {
  color: #ff9800;
}

.price-value.high {
  color: #f44336;
}

/* 设施状态 */
.facility-status {
  font-size: 32rpx;
  font-weight: bold;
}

.facility-status.yes {
  color: #4caf50;
}

.facility-status.no {
  color: #ccc;
}

/* 底部操作栏 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.btn-back, .btn-clear {
  flex: 1;
  padding: 24rpx;
  border-radius: 8rpx;
  text-align: center;
  font-size: 28rpx;
}

.btn-back {
  background: #f5f5f5;
  color: #666;
}

.btn-clear {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}
</style>
