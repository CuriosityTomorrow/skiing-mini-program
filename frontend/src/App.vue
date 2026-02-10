<script>
export default {
  onLaunch() {
    console.log('[App] 应用启动')
    console.log('[App] 当前模式：Mock 数据模式')
  },
  onShow() {
    console.log('[App] 应用显示')
  },
  onHide() {
    console.log('[App] 应用隐藏')
  }
}
</script>

<style lang="scss">
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}
</style>
