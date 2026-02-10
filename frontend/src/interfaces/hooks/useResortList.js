import { ref } from 'vue'
import { diContainer } from '../../di/container'

/**
 * 滑雪场列表页面逻辑
 *
 * 职责：
 * - 封装页面状态
 * - 处理用户交互
 * - 调用应用服务
 */
export function useResortList() {
  // 应用服务
  const appService = diContainer.getResortSearchAppService()

  // 页面状态
  const searchKeyword = ref('')
  const filterType = ref('all')
  const resorts = ref([])
  const loading = ref(false)
  const hasMore = ref(true)
  const currentPage = ref(0)

  /**
   * 搜索滑雪场
   */
  const handleSearch = async () => {
    loading.value = true
    currentPage.value = 0
    resorts.value = []

    try {
      const params = {
        keyword: searchKeyword.value || undefined,
        type: filterType.value === 'all' ? undefined : filterType.value,
        limit: 20,
        offset: 0,
      }

      const result = await appService.searchResorts(params)
      resorts.value = result
      hasMore.value = result.length >= 20

      console.log('[搜索结果] 数量:', result.length)
    } catch (error) {
      console.error('[搜索失败]', error)
      uni.showToast({
        title: error.message || '搜索失败，请重试',
        icon: 'none',
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 清空搜索
   */
  const handleClear = async () => {
    searchKeyword.value = ''
    await handleSearch()
  }

  /**
   * 切换筛选条件
   */
  const toggleFilter = async () => {
    const types = ['all', 'indoor', 'outdoor']
    const currentIndex = types.indexOf(filterType.value)
    filterType.value = types[(currentIndex + 1) % types.length]
    await handleSearch()
  }

  /**
   * 加载更多
   */
  const loadMore = async () => {
    if (loading.value || !hasMore.value) return

    loading.value = true
    currentPage.value++

    try {
      const params = {
        keyword: searchKeyword.value || undefined,
        type: filterType.value === 'all' ? undefined : filterType.value,
        limit: 20,
        offset: currentPage.value * 20,
      }

      const result = await appService.searchResorts(params)
      resorts.value.push(...result)
      hasMore.value = result.length >= 20

      console.log('[加载更多] 数量:', result.length)
    } catch (error) {
      console.error('[加载更多失败]', error)
      uni.showToast({
        title: '加载失败，请重试',
        icon: 'none',
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 跳转到详情页
   */
  const goToDetail = (resortId) => {
    uni.navigateTo({
      url: `/pages/resort/detail/index?id=${resortId}`,
    })
  }

  return {
    // 状态
    searchKeyword,
    filterType,
    resorts,
    loading,
    hasMore,

    // 方法
    handleSearch,
    handleClear,
    toggleFilter,
    loadMore,
    goToDetail,
  }
}
