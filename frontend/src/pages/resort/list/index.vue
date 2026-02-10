<template>
  <view class="page">
    <view class="search-bar">
      <input class="search-input" placeholder="搜索滑雪场" :value="keyword" @input="onInput" />
      <button class="search-btn" @click="handleSearch">搜索</button>
    </view>

    <view class="filters">
      <view class="filter-tag" :class="{ active: filterType !== 'all' }" @click="toggleFilter">
        <text>{{ filterTypeText }}</text>
      </view>
    </view>

    <view class="list">
      <view class="item" v-for="(item, index) in list" :key="item.id">
        <text class="name">{{ item.name }}</text>
        <text class="city">{{ item.city }} · {{ item.province }}</text>
        <text class="info">雪道: {{ item.trails.totalCount }}条 评分: {{ item.rating }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      filterType: 'all',
      allResorts: [
        { id: '1', name: '万龙滑雪场', province: '河北省', city: '张家口市', type: 'outdoor', trails: { totalCount: 32 }, rating: 4.8 },
        { id: '2', name: '太舞滑雪场', province: '河北省', city: '张家口市', type: 'outdoor', trails: { totalCount: 28 }, rating: 4.7 },
        { id: '3', name: '乔波冰雪世界', province: '北京市', city: '北京市', type: 'indoor', trails: { totalCount: 12 }, rating: 4.5 },
        { id: '4', name: '军都山滑雪场', province: '北京市', city: '北京市', type: 'outdoor', trails: { totalCount: 15 }, rating: 4.3 },
        { id: '5', name: '融创雪世界', province: '广东省', city: '广州市', type: 'indoor', trails: { totalCount: 10 }, rating: 4.6 }
      ],
      list: []
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
    this.list = [...this.allResorts]
    console.log('[页面] 初始列表长度:', this.list.length)
  },
  methods: {
    onInput(e) {
      this.keyword = e.detail.value
      console.log('[输入] ', this.keyword)
    },
    handleSearch() {
      console.log('[搜索] 关键词:', this.keyword, '类型:', this.filterType)

      let filtered = [...this.allResorts]

      if (this.filterType !== 'all') {
        filtered = filtered.filter(item => item.type === this.filterType)
      }

      if (this.keyword && this.keyword.trim()) {
        const keyword = this.keyword.trim()
        filtered = filtered.filter(item => {
          return item.name.includes(keyword) ||
                 item.city.includes(keyword) ||
                 item.province.includes(keyword)
        })
      }

      console.log('[搜索] 结果:', filtered.length, '条')
      this.list = filtered
    },
    toggleFilter() {
      const types = ['all', 'indoor', 'outdoor']
      const index = types.indexOf(this.filterType)
      this.filterType = types[(index + 1) % 3]
      console.log('[筛选] 切换到:', this.filterType)
      this.handleSearch()
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

.list {
  margin-top: 20rpx;
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
