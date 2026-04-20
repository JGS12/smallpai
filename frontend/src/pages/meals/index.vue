<script setup>
import { ref, onMounted } from 'vue'
import { getMeals } from '@/api'

const currentWeek = ref(1)
const currentCate = ref('全部')
const mealList = ref([])

const categories = ['全部', '早餐', '午餐', '晚餐', '加餐', '汤水']

const fetchMeals = async () => {
  try {
    const res = await getMeals({ 
      week: currentWeek.value,
      mealType: currentCate.value !== '全部' ? currentCate.value : undefined
    })
    mealList.value = res
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchMeals()
})

const changeWeek = (week) => {
  currentWeek.value = week
  fetchMeals()
}

const changeCate = (cate) => {
  currentCate.value = cate
  fetchMeals()
}
</script>

<template>
  <view class="page-container">
    <!-- Week Selector -->
    <scroll-view scroll-x class="week-tabs">
      <view v-for="w in 4" :key="w" class="week-tab" :class="{ active: currentWeek === w }" @click="changeWeek(w)">
        <text class="w-label">第 {{ w }} 周</text>
        <view class="w-dot" v-if="currentWeek === w"></view>
      </view>
    </scroll-view>

    <!-- Category Tabs -->
    <u-tabs 
      :list="categories.map(c => ({ name: c }))" 
      @click="(e) => changeCate(e.name)"
      lineColor="#E8A598"
      activeStyle="{ color: '#E8A598', fontWeight: 'bold' }"
      inactiveStyle="{ color: '#8C7B72' }"
    ></u-tabs>

    <!-- Meal List -->
    <view class="meal-list">
      <view v-for="item in mealList" :key="item.id" class="meal-card">
        <view class="card-header">
          <u-tag :text="item.meal_type" plain size="mini" type="primary" color="#E8A598" borderColor="#E8A598"></u-tag>
          <text class="meal-name">{{ item.name }}</text>
        </view>
        <text class="meal-desc">{{ item.description }}</text>
        <view class="meal-tags">
          <text v-for="(tag, i) in item.tags" :key="i" class="tag">{{ tag }}</text>
        </view>
        <view class="avoid-box" v-if="item.avoid">
          <u-icon name="warning" color="#B5A89F" size="14"></u-icon>
          <text class="avoid-text">忌：{{ item.avoid }}</text>
        </view>
      </view>
      
      <u-empty v-if="mealList.length === 0" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png"></u-empty>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding: 20rpx 0;
  background-color: var(--color-bg);
  min-height: 100vh;
}
.week-tabs {
  background-color: #FFFFFF;
  white-space: nowrap;
  padding: 20rpx 30rpx;
  margin-bottom: 2rpx;
}
.week-tab {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-right: 50rpx;
  position: relative;
}
.w-label {
  font-size: 28rpx;
  color: var(--color-text-secondary);
}
.week-tab.active .w-label {
  color: var(--color-text-primary);
  font-weight: bold;
}
.w-dot {
  width: 30rpx;
  height: 6rpx;
  background-color: var(--color-primary);
  border-radius: 3rpx;
  margin-top: 10rpx;
}

.meal-list {
  padding: 30rpx;
}
.meal-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: var(--shadow-card);
}
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}
.meal-name {
  font-size: 34rpx;
  font-weight: bold;
  margin-left: 20rpx;
  color: var(--color-text-primary);
}
.meal-desc {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: block;
}
.meal-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}
.tag {
  font-size: 22rpx;
  color: var(--color-text-hint);
  background-color: #FFF5F2;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
  margin-right: 12rpx;
}
.avoid-box {
  background-color: #F8F8F8;
  padding: 16rpx 20rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
}
.avoid-text {
  font-size: 22rpx;
  color: var(--color-text-secondary);
  margin-left: 10rpx;
}
</style>
