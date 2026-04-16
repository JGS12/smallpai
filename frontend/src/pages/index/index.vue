<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'
import SectionTitle from '@/components/common/SectionTitle.vue'

const greeting = ref('早安，嘉嘉妈妈')
const dayCount = ref(12)
const todayMeals = ref([])
const motherPlans = ref([])

const fetchHomeData = async () => {
  try {
    const meals = await request({ url: '/meals?week=2&mealType=早餐' })
    todayMeals.value = meals.slice(0, 1)
    
    const plans = await request({ url: '/mother-care' })
    motherPlans.value = plans.slice(0, 2)
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchHomeData()
})

const quickActions = [
  { icon: 'calendar', title: '周餐单', path: '/pages/meals/index', color: '#E8A598' },
  { icon: 'shopping-cart', title: '备物清单', path: '/pages/knowledge/index', color: '#C8D8C0' },
  { icon: 'edit-pen', title: '成长记录', path: '/pages/baby-care/index', color: '#F2DFC8' },
  { icon: 'chat', title: '专家咨询', path: '/pages/knowledge/index', color: '#B5A89F' }
]

const navTo = (url) => {
  uni.switchTab({ url })
}
</script>

<template>
  <view class="page-container">
    <!-- Header -->
    <view class="header">
      <view class="user-info">
        <text class="greeting">{{ greeting }}</text>
        <view class="day-badge">月子第 <text class="highlight">{{ dayCount }}</text> 天</view>
      </view>
      <u-avatar src="/static/avatar.png" size="50"></u-avatar>
    </view>

    <!-- Quick Actions -->
    <view class="quick-grid">
      <view v-for="(item, index) in quickActions" :key="index" class="action-item" @click="navTo(item.path)">
        <view class="icon-wrap" :style="{ backgroundColor: item.color + '20' }">
          <u-icon :name="item.icon" :color="item.color" size="28"></u-icon>
        </view>
        <text class="title">{{ item.title }}</text>
      </view>
    </view>

    <!-- Today's Meal -->
    <view class="content-section">
      <SectionTitle title="今日推荐" sub-title="营养均衡 · 产后恢复" />
      <view class="meal-card" v-for="meal in todayMeals" :key="meal.id">
        <view class="meal-info">
          <text class="tags">{{ meal.meal_type }} · {{ meal.tags?.join(' ') }}</text>
          <text class="name">{{ meal.name }}</text>
          <text class="desc">{{ meal.description }}</text>
        </view>
        <u-image src="/static/placeholder-meal.png" width="80px" height="80px" radius="8px"></u-image>
      </view>
    </view>

    <!-- Care Tips -->
    <view class="content-section">
      <SectionTitle title="妈妈照护" sub-title="科学修养 · 身心关怀" />
      <view class="care-list">
        <view v-for="plan in motherPlans" :key="plan.id" class="care-item">
          <u-icon name="checkmark-circle-fill" color="#E8A598" size="20"></u-icon>
          <view class="care-info">
            <text class="care-title">{{ plan.title }}</text>
            <view class="points">
              <text v-for="(p, i) in plan.key_points" :key="i" class="p-dot">{{ p }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding: 40rpx 30rpx;
  background-color: var(--color-bg);
  min-height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 60rpx;
  margin-bottom: 50rpx;
}
.greeting {
  font-size: 44rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
}
.day-badge {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  background: #FFFFFF;
  padding: 6rpx 20rpx;
  border-radius: 100rpx;
  display: inline-block;
  margin-top: 10rpx;
  box-shadow: var(--shadow-card);
}
.highlight {
  color: var(--color-primary);
  font-weight: bold;
  margin: 0 4rpx;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-bottom: 50rpx;
}
.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon-wrap {
  width: 100rpx;
  height: 100rpx;
  border-radius: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12rpx;
}
.action-item .title {
  font-size: 24rpx;
  color: var(--color-text-secondary);
}

.content-section {
  margin-bottom: 40rpx;
}

.meal-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: var(--shadow-card);
}
.meal-info {
  flex: 1;
  padding-right: 20rpx;
}
.meal-info .tags {
  font-size: 22rpx;
  color: var(--color-primary);
  margin-bottom: 10rpx;
  display: block;
}
.meal-info .name {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 10rpx;
  display: block;
}
.meal-info .desc {
  font-size: 24rpx;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.care-list {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 10rpx 30rpx;
  box-shadow: var(--shadow-card);
}
.care-item {
  display: flex;
  padding: 24rpx 0;
  border-bottom: 1px dashed var(--color-border);
}
.care-item:last-child {
  border-bottom: none;
}
.care-info {
  margin-left: 20rpx;
  flex: 1;
}
.care-title {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
  display: block;
}
.points {
  display: flex;
  flex-wrap: wrap;
}
.p-dot {
  font-size: 22rpx;
  color: var(--color-text-hint);
  background: var(--color-bg);
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
}
</style>
