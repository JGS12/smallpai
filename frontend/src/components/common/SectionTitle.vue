<script setup>
defineProps({
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' }
})
</script>

<template>
  <view class="section-title">
    <view class="title-content">
      <view class="decorator"></view>
      <text class="text">{{ title }}</text>
    </view>
    <text v-if="subTitle" class="sub-text">{{ subTitle }}</text>
  </view>
</template>

<style scoped>
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24rpx;
  padding: 0 10rpx;
}
.title-content {
  display: flex;
  align-items: center;
}
.decorator {
  width: 8rpx;
  height: 32rpx;
  background-color: var(--color-primary);
  border-radius: 4rpx;
  margin-right: 16rpx;
}
.text {
  font-size: 34rpx;
  font-weight: 600;
  color: var(--color-text-primary);
}
.sub-text {
  font-size: 24rpx;
  color: var(--color-text-secondary);
}
</style>
