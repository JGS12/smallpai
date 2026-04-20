<script setup>
import { ref, onMounted } from 'vue'
import { getBabyCare } from '@/api'

const babyCareData = ref(null)

const fetchBabyCare = async () => {
  try {
    const res = await getBabyCare()
    babyCareData.value = res
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchBabyCare()
})
</script>

<template>
  <view class="page-container" v-if="babyCareData">
    <!-- Basic Care -->
    <view class="section">
      <view class="section-header">
        <text class="s-title">{{ babyCareData.basic_care?.title }}</text>
        <text class="s-desc">新生儿日常基础照料要点</text>
      </view>
      
      <view class="item-grid">
        <view v-for="item in babyCareData.basic_care?.items" :key="item.name" class="grid-item">
          <u-icon name="star-fill" color="#C8D8C0" size="24"></u-icon>
          <text class="item-name">{{ item.name }}</text>
          <text class="item-val">{{ item.value }}</text>
        </view>
      </view>
    </view>

    <!-- Daily Routine -->
    <view class="section">
      <view class="section-header">
        <text class="s-title">{{ babyCareData.daily_routine?.title }}</text>
      </view>
      <view class="routine-card">
        <view v-for="item in babyCareData.daily_routine?.items" :key="item.name" class="routine-row">
          <text class="r-name">{{ item.name }}</text>
          <text class="r-desc">{{ item.description }}</text>
        </view>
      </view>
    </view>

    <!-- Health Monitoring -->
    <view class="section">
      <view class="section-header">
        <text class="s-title">{{ babyCareData.health_monitoring?.title }}</text>
      </view>
      <view class="health-box">
        <view v-for="item in babyCareData.health_monitoring?.items" :key="item.name" class="health-item">
          <view class="h-dot"></view>
          <view class="h-content">
            <text class="h-name">{{ item.name }}</text>
            <text class="h-desc">{{ item.description }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding: 30rpx;
  background-color: var(--color-bg);
  min-height: 100vh;
}
.section {
  margin-bottom: 40rpx;
}
.section-header {
  margin-bottom: 24rpx;
}
.s-title {
  font-size: 36rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
}
.s-desc {
  font-size: 24rpx;
  color: var(--color-text-hint);
  margin-top: 8rpx;
  display: block;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}
.grid-item {
  background-color: #FFFFFF;
  padding: 30rpx;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-card);
}
.item-name {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  margin: 16rpx 0 8rpx;
}
.item-val {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--color-primary);
}

.routine-card {
  background-color: #FFFFFF;
  padding: 10rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: var(--shadow-card);
}
.routine-row {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1px solid var(--color-bg);
}
.routine-row:last-child {
  border-bottom: none;
}
.r-name {
  font-size: 28rpx;
  flex-shrink: 0;
  color: var(--color-text-primary);
}
.r-desc {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  margin-left: 30rpx;
  text-align: right;
}

.health-box {
  background-color: #FFFFFF;
  padding: 30rpx;
  border-radius: 24rpx;
  box-shadow: var(--shadow-card);
}
.health-item {
  display: flex;
  margin-bottom: 30rpx;
}
.health-item:last-child {
  margin-bottom: 0;
}
.h-dot {
  width: 12rpx;
  height: 12rpx;
  background-color: var(--color-secondary);
  border-radius: 50%;
  margin-top: 14rpx;
  flex-shrink: 0;
}
.h-content {
  margin-left: 20rpx;
}
.h-name {
  font-size: 28rpx;
  font-weight: 500;
  display: block;
}
.h-desc {
  font-size: 24rpx;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-top: 6rpx;
  display: block;
}
</style>
