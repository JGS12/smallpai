<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'

const careData = ref([])

const fetchCareData = async () => {
  try {
    const res = await request({ url: '/mother-care' })
    careData.value = res
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchCareData()
})
</script>

<template>
  <view class="page-container">
    <view class="banner">
      <view class="banner-content">
        <text class="title">爱护自己，从心出发</text>
        <text class="desc">科学护理 · 心理疏导 · 营养恢复</text>
      </view>
    </view>

    <view class="care-content">
      <u-collapse accordion>
        <u-collapse-item
          v-for="item in careData"
          :key="item.id"
          :title="item.title"
          :name="item.id"
        >
          <template #title>
             <view class="custom-title">
               <u-icon name="heart-fill" color="#E8A598" size="18"></u-icon>
               <text class="t-text">{{ item.title }}</text>
             </view>
          </template>
          <view class="u-collapse-content">
            <view class="summary">{{ item.summary }}</view>
            <view class="point-list">
              <view v-for="(point, index) in item.key_points" :key="index" class="point-item">
                <text class="p-index">{{ index + 1 }}</text>
                <text class="p-content">{{ point }}</text>
              </view>
            </view>
          </view>
        </u-collapse-item>
      </u-collapse>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  background-color: var(--color-bg);
  min-height: 100vh;
}
.banner {
  height: 300rpx;
  background: linear-gradient(135deg, #FFFAF5 0%, #FEE5DF 100%);
  display: flex;
  align-items: center;
  padding: 0 40rpx;
}
.banner-content .title {
  font-size: 40rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
}
.banner-content .desc {
  font-size: 24rpx;
  color: var(--color-text-secondary);
  margin-top: 16rpx;
  display: block;
}

.care-content {
  padding: 30rpx;
  margin-top: -40rpx;
  background-color: #FFFFFF;
  border-radius: 40rpx 40rpx 0 0;
}

.custom-title {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
}
.t-text {
  font-size: 32rpx;
  font-weight: 600;
  margin-left: 16rpx;
  color: var(--color-text-primary);
}

.summary {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  line-height: 1.6;
  background-color: #FFFAF5;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}

.point-list {
  padding: 0 10rpx;
}
.point-item {
  display: flex;
  margin-bottom: 20rpx;
}
.p-index {
  width: 36rpx;
  height: 36rpx;
  background-color: var(--color-primary);
  color: #FFFFFF;
  font-size: 22rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4rpx;
}
.p-content {
  font-size: 28rpx;
  color: var(--color-text-primary);
  margin-left: 20rpx;
  line-height: 1.5;
}
</style>
