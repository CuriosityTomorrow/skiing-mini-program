<template>
  <view class="page">
    <view class="search-bar">
      <input class="search-input" placeholder="搜索滑雪场或城市" :value="keyword" @input="onInput" />
      <button class="search-btn" @click="handleSearch" :loading="loading">搜索</button>
    </view>

    <view class="filters">
      <view class="filter-tag" :class="{ active: filterType !== 'all' }" @click="toggleFilter">
        <text>{{ filterTypeText }}</text>
      </view>
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <!-- 列表 -->
    <view v-else class="list">
      <view v-if="list.length === 0" class="empty">
        <text>暂无数据</text>
      </view>
      <view v-else class="item" v-for="(item, index) in list" :key="item.id">
        <text class="name">{{ item.name }}</text>
        <text class="city">{{ item.city }} · {{ item.province }}</text>
        <text class="info">雪道: {{ item.trails?.totalCount || 0 }}条 评分: {{ item.rating || 0 }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ResortSearchAppService } from '../../../application/services/ResortSearchAppService.js'

export default {
  data() {
    return {
      keyword: '',
      filterType: 'all',
      list: [],
      loading: false,
      resortService: null
    }
  },
  computed: {
    filterTypeText() {
      const map = { all: '全部', indoor: '室内', outdoor: '室外' }
      return map[this.filterType]
    }
  },
  onLoad() {
    console.log('[页面] onLoad 执行')
    this.resortService = new ResortSearchAppService()
    this.loadDefaultResorts()
  },
  methods: {
    // 加载默认热门滑雪场（50个）
    async loadDefaultResorts() {
      this.loading = true
      try {
        console.log('[加载] 获取热门滑雪场')
        const result = await this.resortService.getResorts({
          type: this.filterType
        })

        if (result.success) {
          this.list = result.data
          console.log('[加载] 成功，共', result.total, '个滑雪场')
        } else {
          console.error('[加载] 失败:', result.error)
          uni.showToast({
            title: '加载失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('[加载] 异常:', error)
      } finally {
        this.loading = false
      }
    },

    onInput(e) {
      this.keyword = e.detail.value
      console.log('[输入] ', this.keyword)
    },

    async handleSearch() {
      console.log('[搜索] 关键词:', this.keyword, '类型:', this.filterType)
      this.loading = true

      try {
        const result = await this.resortService.getResorts({
          keyword: this.keyword,
          type: this.filterType,
          // TODO: 获取用户位置
          userLocation: null
        })

        if (result.success) {
          this.list = result.data
          console.log('[搜索] 结果:', result.total, '条')

          if (result.total === 0) {
            uni.showToast({
              title: '未找到相关滑雪场',
              icon: 'none'
            })
          }
        }
      } catch (error) {
        console.error('[搜索] 异常:', error)
      } finally {
        this.loading = false
      }
    },

    toggleFilter() {
      const types = ['all', 'indoor', 'outdoor']
      const index = types.indexOf(this.filterType)
      this.filterType = types[(index + 1) % 3]
      console.log('[筛选] 切换到:', this.filterType)

      // 重新加载数据
      if (!this.keyword || this.keyword.trim() === '') {
        this.loadDefaultResorts()
      } else {
        this.handleSearch()
      }
    }
  }
}
</script>

<style scoped>
.page {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.search-input {
  flex: 1;
  padding: 20rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  background: #fff;
}

.search-btn {
  padding: 20rpx 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
  color: #fff;
  font-size: 28rpx;
}

.filters {
  margin-bottom: 20rpx;
}

.filter-tag {
  display: inline-block;
  padding: 12rpx 32rpx;
  background-color: #f5f5f5;
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #666;
}

.filter-tag.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.loading {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.list {
  margin-top: 20rpx;
}

.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.item {
  padding: 20rpx;
  background: #fff;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.city {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.info {
  font-size: 24rpx;
  color: #999;
  display: block;
}
</style>
