<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  // 检查登录态，未登录则跳转登录页
  const token = uni.getStorageSync('token')
  const pages = getCurrentPages()
  const currentPage = pages.length > 0 ? pages[pages.length - 1].route : ''

  if (!token && currentPage !== 'pages/login/index') {
    uni.reLaunch({ url: '/pages/login/index' })
  }
})

onShow(() => {
  // console.log('App Show')
})

onHide(() => {
  // console.log('App Hide')
})
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "@/uni_modules/uview-plus/index.scss";
@import "@/styles/common.css";
@import "@/styles/variables.css";

page {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
