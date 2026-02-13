<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-section">
      <view class="search-bar">
        <input
          class="search-input"
          placeholder="搜索滑雪场或城市"
          :value="keyword"
          @input="onInput"
        />
        <button class="search-btn" @click="handleSearch" :loading="loading">
          搜索
        </button>
      </view>
    </view>

    <!-- 筛选和排序栏 -->
    <view class="control-bar">
      <button class="filter-btn" @click="showFilterPanel = !showFilterPanel">
        <text>🔍 筛选 ({{ activeFilterCount }})</text>
      </button>
      <picker
        mode="selector"
        :range="sortOptions"
        range-key="label"
        :value="sortIndex"
        @change="onSortChange"
      >
        <view class="sort-btn">
          <text>{{ currentSortLabel }} ▼</text>
        </view>
      </picker>
      <button class="compare-btn" @click="toggleCompareMode">
        <text>{{ compareMode ? '✓ 对比中' : '⚖️ 对比' }}</text>
      </button>
    </view>

    <!-- 筛选面板 -->
    <view v-if="showFilterPanel" class="filter-panel">
      <!-- 价格筛选 -->
      <view class="filter-group">
        <text class="filter-label">价格等级</text>
        <view class="filter-options">
          <view
            v-for="option in priceLevelOptions"
            :key="option.value"
            class="filter-chip"
            :class="{ active: filters.priceLevel === option.value }"
            @click="togglePriceLevel(option.value)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>

      <!-- 难度筛选 -->
      <view class="filter-group">
        <text class="filter-label">难度级别</text>
        <view class="filter-options">
          <view
            v-for="option in difficultyOptions"
            :key="option.value"
            class="filter-chip"
            :class="{ active: filters.difficulty && filters.difficulty.includes(option.value) }"
            @click="toggleDifficulty(option.value)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>

      <!-- 设施筛选 -->
      <view class="filter-group">
        <text class="filter-label">必备设施</text>
        <view class="filter-options">
          <view
            v-for="option in facilityOptions"
            :key="option.value"
            class="filter-chip"
            :class="{ active: filters.requiredFacilities && filters.requiredFacilities.includes(option.value) }"
            @click="toggleFacility(option.value)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>

      <!-- 适合人群筛选 -->
      <view class="filter-group">
        <text class="filter-label">适合人群</text>
        <view class="filter-options">
          <view
            v-for="option in suitabilityOptions"
            :key="option.value"
            class="filter-chip"
            :class="{ active: filters.suitableFor && filters.suitableFor.includes(option.value) }"
            @click="toggleSuitability(option.value)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>

      <!-- 类型筛选 -->
      <view class="filter-group">
        <text class="filter-label">类型</text>
        <view class="filter-options">
          <view
            v-for="option in typeOptions"
            :key="option.value"
            class="filter-chip"
            :class="{ active: filters.resortType === option.value }"
            @click="toggleType(option.value)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="filter-actions">
        <button class="btn-reset" @click="resetFilters">重置</button>
        <button class="btn-apply" @click="applyFilters">应用筛选</button>
      </view>
    </view>

    <!-- 结果统计 -->
    <view v-if="!loading" class="result-info">
      <text>找到 {{ list.length }} 个滑雪场</text>
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <!-- Grid 列表 -->
    <view v-else class="grid-list">
      <view v-if="list.length === 0" class="empty">
        <text>暂无符合条件的滑雪场</text>
      </view>
      <view
        v-else
        v-for="(item, index) in list"
        :key="item.id"
        class="resort-card"
        :class="{ 'compare-mode': compareMode }"
        @click="compareMode ? toggleCompareItem(item) : goToDetail(item.id)"
      >
        <!-- 对比模式复选框 -->
        <view v-if="compareMode" class="compare-checkbox">
          <text :class="['checkbox-icon', isInCompareList(item.id) ? 'checked' : '']">
            {{ isInCompareList(item.id) ? '✓' : '' }}
          </text>
        </view>

        <!-- 顶部标签 -->
        <view class="card-tags">
          <text v-if="item.type === 'indoor'" class="tag indoor">室内</text>
          <text v-else class="tag outdoor">室外</text>
          <text v-if="item.scores && item.scores.overall >= 8.5" class="tag premium">优质</text>
          <text v-if="item.scores && item.scores.value >= 8.0" class="tag value">性价比高</text>
        </view>

        <!-- 名称和位置 -->
        <view class="card-header">
          <text class="resort-name">{{ item.name }}</text>
          <text class="resort-location">{{ item.city || item.district }} · {{ item.province }}</text>
        </view>

        <!-- 评分展示（Nomads风格）-->
        <view class="score-section" v-if="item.scores">
          <view class="overall-score">
            <text class="score-value">{{ item.scores.overall || 0 }}</text>
            <text class="score-label">综合评分</text>
          </view>
          <view class="sub-scores">
            <view class="score-item">
              <text class="score-icon">👶</text>
              <text class="score-num">{{ item.scores.beginner || 0 }}</text>
              <text class="score-text">新手</text>
            </view>
            <view class="score-item">
              <text class="score-icon">🎿</text>
              <text class="score-num">{{ item.scores.expert || 0 }}</text>
              <text class="score-text">高手</text>
            </view>
            <view class="score-item">
              <text class="score-icon">👨‍👩‍👧</text>
              <text class="score-num">{{ item.scores.family || 0 }}</text>
              <text class="score-text">亲子</text>
            </view>
            <view class="score-item">
              <text class="score-icon">💰</text>
              <text class="score-num">{{ item.scores.value || 0 }}</text>
              <text class="score-text">性价比</text>
            </view>
          </view>
        </view>

        <!-- 关键数据 -->
        <view class="card-data">
          <view class="data-item">
            <text class="data-label">雪道</text>
            <text class="data-value">{{ item.trails?.total || item.trails?.totalCount || 0 }}条</text>
          </view>
          <view class="data-item">
            <text class="data-label">价格</text>
            <text class="data-value">¥{{ item.pricing?.avgCost || item.pricing?.daily || '-' }}</text>
          </view>
          <view class="data-item">
            <text class="data-label">评分</text>
            <text class="data-value">★{{ item.community?.rating || item.rating || 0 }}</text>
          </view>
        </view>

        <!-- 设施图标 -->
        <view class="card-facilities" v-if="item.facilities">
          <text v-if="item.facilities.rental" class="facility-icon">🎿</text>
          <text v-if="item.facilities.nightSkiing" class="facility-icon">🌙</text>
          <text v-if="item.facilities.hotel" class="facility-icon">🏨</text>
          <text v-if="item.facilities.restaurant" class="facility-icon">🍴</text>
          <text v-if="item.facilities.kidsArea" class="facility-icon">👶</text>
          <text v-if="item.facilities.snowPark" class="facility-icon">🏂</text>
        </view>
      </view>
    </view>

    <!-- 对比操作栏 -->
    <view v-if="compareMode && compareList.length > 0" class="compare-actions">
      <view class="compare-info">
        <text>已选 {{ compareList.length }} 个滑雪场</text>
        <text class="compare-hint">(最多选4个)</text>
      </view>
      <button class="btn-start-compare" @click="startCompare" :disabled="compareList.length < 2">
        开始对比
      </button>
    </view>
  </view>
</template>

<script>
import { ResortSearchAppService } from '../../../application/services/ResortSearchAppService.js'

export default {
  data() {
    return {
      keyword: '',
      list: [],
      loading: false,
      resortService: null,
      showFilterPanel: false,

      // 对比功能
      compareMode: false,
      compareList: [],

      // 筛选条件
      filters: {
        priceLevel: null,
        difficulty: [],
        requiredFacilities: [],
        suitableFor: [],
        resortType: null
      },

      // 排序选项
      sortOptions: [
        { value: 'popularity', label: '按人气排序' },
        { value: 'overall_score', label: '按综合评分' },
        { value: 'beginner_score', label: '按新手友好度' },
        { value: 'expert_score', label: '按高手推荐度' },
        { value: 'family_score', label: '按亲子友好度' },
        { value: 'value_score', label: '按性价比' },
        { value: 'price_low', label: '价格从低到高' },
        { value: 'rating', label: '按用户评分' }
      ],
      sortIndex: 0,
      currentSort: 'popularity',

      // 筛选选项
      priceLevelOptions: [
        { value: 'budget', label: '预算型 <300' },
        { value: 'mid', label: '中端 300-600' },
        { value: 'luxury', label: '高端 >600' }
      ],
      difficultyOptions: [
        { value: 'beginner', label: '初级' },
        { value: 'intermediate', label: '中级' },
        { value: 'advanced', label: '高级' },
        { value: 'expert', label: '专家级' }
      ],
      facilityOptions: [
        { value: 'rental', label: '租雪具' },
        { value: 'coach', label: '教练' },
        { value: 'nightSkiing', label: '夜场' },
        { value: 'hotel', label: '住宿' },
        { value: 'restaurant', label: '餐厅' },
        { value: 'kidsArea', label: '儿童区' },
        { value: 'snowPark', label: '单板公园' },
        { value: 'parking', label: '停车场' }
      ],
      suitabilityOptions: [
        { value: 'beginner', label: '新手' },
        { value: 'family', label: '亲子' },
        { value: 'expert', label: '高手' },
        { value: 'weekend', label: '周末游' },
        { value: 'vacation', label: '度假' }
      ],
      typeOptions: [
        { value: 'outdoor', label: '室外' },
        { value: 'indoor', label: '室内' }
      ]
    }
  },

  computed: {
    currentSortLabel() {
      return this.sortOptions[this.sortIndex].label
    },

    activeFilterCount() {
      let count = 0
      if (this.filters.priceLevel) count++
      if (this.filters.difficulty && this.filters.difficulty.length > 0) count++
      if (this.filters.requiredFacilities && this.filters.requiredFacilities.length > 0) count++
      if (this.filters.suitableFor && this.filters.suitableFor.length > 0) count++
      if (this.filters.resortType) count++
      return count
    }
  },

  onLoad() {
    console.log('[页面] Grid View 列表页加载')
    this.resortService = new ResortSearchAppService()
    this.loadResorts()
  },

  methods: {
    async loadResorts() {
      this.loading = true
      try {
        const result = await this.resortService.getResorts({
          keyword: this.keyword,
          filters: this.filters,
          sortBy: this.currentSort
        })

        if (result.success) {
          this.list = result.data
          console.log('[加载] 成功，共', result.total, '个滑雪场')
        } else {
          console.error('[加载] 失败:', result.error)
        }
      } catch (error) {
        console.error('[加载] 异常:', error)
      } finally {
        this.loading = false
      }
    },

    onInput(e) {
      this.keyword = e.detail.value
    },

    handleSearch() {
      console.log('[搜索] 关键词:', this.keyword)
      this.loadResorts()
    },

    onSortChange(e) {
      this.sortIndex = e.detail.value
      this.currentSort = this.sortOptions[this.sortIndex].value
      console.log('[排序] 切换到:', this.currentSort)
      this.loadResorts()
    },

    togglePriceLevel(value) {
      this.filters.priceLevel = this.filters.priceLevel === value ? null : value
    },

    toggleDifficulty(value) {
      if (!this.filters.difficulty) {
        this.filters.difficulty = []
      }
      const index = this.filters.difficulty.indexOf(value)
      if (index > -1) {
        this.filters.difficulty.splice(index, 1)
      } else {
        this.filters.difficulty.push(value)
      }
    },

    toggleFacility(value) {
      if (!this.filters.requiredFacilities) {
        this.filters.requiredFacilities = []
      }
      const index = this.filters.requiredFacilities.indexOf(value)
      if (index > -1) {
        this.filters.requiredFacilities.splice(index, 1)
      } else {
        this.filters.requiredFacilities.push(value)
      }
    },

    toggleSuitability(value) {
      if (!this.filters.suitableFor) {
        this.filters.suitableFor = []
      }
      const index = this.filters.suitableFor.indexOf(value)
      if (index > -1) {
        this.filters.suitableFor.splice(index, 1)
      } else {
        this.filters.suitableFor.push(value)
      }
    },

    toggleType(value) {
      this.filters.resortType = this.filters.resortType === value ? null : value
    },

    resetFilters() {
      this.filters = {
        priceLevel: null,
        difficulty: [],
        requiredFacilities: [],
        suitableFor: [],
        resortType: null
      }
      console.log('[筛选] 重置')
    },

    applyFilters() {
      console.log('[筛选] 应用:', this.filters)
      this.showFilterPanel = false
      this.loadResorts()
    },

    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/resort/detail/index?id=${id}`
      })
    },

    // 对比功能相关方法
    toggleCompareMode() {
      this.compareMode = !this.compareMode
      if (!this.compareMode) {
        // 退出对比模式，清空选择
        this.compareList = []
      }
      console.log('[对比] 对比模式:', this.compareMode)
    },

    toggleCompareItem(item) {
      const index = this.compareList.findIndex(r => r.id === item.id)
      if (index > -1) {
        // 已存在，移除
        this.compareList.splice(index, 1)
      } else {
        // 不存在，添加
        if (this.compareList.length >= 4) {
          uni.showToast({
            title: '最多只能选择4个',
            icon: 'none'
          })
          return
        }
        this.compareList.push(item)
      }
      console.log('[对比] 当前选择:', this.compareList.length, '个')
    },

    isInCompareList(id) {
      return this.compareList.some(r => r.id === id)
    },

    startCompare() {
      if (this.compareList.length < 2) {
        uni.showToast({
          title: '至少选择2个滑雪场',
          icon: 'none'
        })
        return
      }

      const ids = this.compareList.map(r => r.id).join(',')
      console.log('[对比] 开始对比:', ids)

      uni.navigateTo({
        url: `/pages/resort/compare/index?ids=${ids}`
      })
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 搜索栏 */
.search-section {
  padding: 20rpx;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.search-bar {
  display: flex;
  gap: 20rpx;
}

.search-input {
  flex: 1;
  padding: 20rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  background: #f9f9f9;
}

.search-btn {
  padding: 20rpx 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
  color: #fff;
  font-size: 28rpx;
}

/* 控制栏 */
.control-bar {
  padding: 20rpx;
  background: #fff;
  display: flex;
  gap: 16rpx;
  border-bottom: 1px solid #eee;
}

.filter-btn, .sort-btn, .compare-btn {
  flex: 1;
  padding: 16rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  text-align: center;
  font-size: 26rpx;
  color: #333;
  min-width: 0;
}

/* 筛选面板 */
.filter-panel {
  background: #fff;
  padding: 30rpx 20rpx;
  border-bottom: 1px solid #eee;
  max-height: 600rpx;
  overflow-y: scroll;
}

.filter-group {
  margin-bottom: 30rpx;
}

.filter-label {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
  color: #333;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.filter-chip {
  padding: 12rpx 24rpx;
  background: #f5f5f5;
  border-radius: 40rpx;
  font-size: 24rpx;
  color: #666;
}

.filter-chip.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.filter-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}

.btn-reset, .btn-apply {
  flex: 1;
  padding: 24rpx;
  border-radius: 8rpx;
  text-align: center;
  font-size: 28rpx;
}

.btn-reset {
  background: #f5f5f5;
  color: #666;
}

.btn-apply {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

/* 结果统计 */
.result-info {
  padding: 20rpx;
  font-size: 26rpx;
  color: #999;
}

/* 加载中 */
.loading {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

/* Grid 列表 */
.grid-list {
  padding: 20rpx;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24rpx;
}

.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

/* 滑雪场卡片 */
.resort-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-tags {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.tag {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.tag.indoor {
  background: #e3f2fd;
  color: #1976d2;
}

.tag.outdoor {
  background: #e8f5e9;
  color: #388e3c;
}

.tag.premium {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  color: #fff;
}

.tag.value {
  background: #fff3e0;
  color: #ef6c00;
}

.card-header {
  margin-bottom: 20rpx;
}

.resort-name {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
  color: #333;
}

.resort-location {
  display: block;
  font-size: 24rpx;
  color: #999;
}

/* 评分展示 */
.score-section {
  display: flex;
  gap: 24rpx;
  padding: 20rpx 0;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  margin: 20rpx 0;
}

.overall-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 24rpx;
  border-right: 1px solid #f5f5f5;
}

.score-value {
  font-size: 48rpx;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.score-label {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}

.sub-scores {
  flex: 1;
  display: flex;
  justify-content: space-around;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-icon {
  font-size: 32rpx;
  margin-bottom: 4rpx;
}

.score-num {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.score-text {
  font-size: 20rpx;
  color: #999;
  margin-top: 4rpx;
}

/* 关键数据 */
.card-data {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16rpx;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data-label {
  font-size: 22rpx;
  color: #999;
  margin-bottom: 6rpx;
}

.data-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

/* 设施图标 */
.card-facilities {
  display: flex;
  gap: 16rpx;
  padding-top: 16rpx;
  border-top: 1px solid #f5f5f5;
}

.facility-icon {
  font-size: 32rpx;
}

/* 对比功能样式 */
.resort-card.compare-mode {
  position: relative;
  cursor: pointer;
}

.compare-checkbox {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  z-index: 10;
}

.checkbox-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  border: 2px solid #ddd;
  border-radius: 50%;
  background: #fff;
  font-size: 28rpx;
  color: #fff;
}

.checkbox-icon.checked {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.compare-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 20rpx;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.compare-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.compare-info text:first-child {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.compare-hint {
  font-size: 22rpx;
  color: #999;
}

.btn-start-compare {
  padding: 20rpx 48rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
}

.btn-start-compare[disabled] {
  background: #ccc;
  opacity: 0.6;
}

</style>
