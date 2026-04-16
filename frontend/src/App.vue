<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  // 仅在非登录页且无 token 时跳转
  // 注意：小程序启动时无法通过 getCurrentPages 准确获取首屏路径
  // 我们可以通过把登录页设为 pages.json 的第一个实现自然加载
  console.log('App Launch')
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
@import "uview-plus/index.scss";
@import "@/styles/common.css";
@import "@/styles/variables.css";

page {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
