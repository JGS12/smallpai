<script setup>
import { ref, onMounted, computed } from 'vue'
import { request } from '@/utils/request'
import { useUserStore } from '@/store/user'
import SectionTitle from '@/components/common/SectionTitle.vue'

const userStore = useUserStore()

const greeting = computed(() => {
  if (userStore.isMom) {
    return `早安，${userStore.userInfo?.username || '妈妈'}`
  } else if (userStore.isFamily) {
    return `你好，${userStore.userInfo?.username || '家人'}`
  } else {
    return `欢迎，${userStore.userInfo?.username || '管理员'}`
  }
})

const dayCount = ref(12)
const todayMeals = ref([])
const motherPlans = ref([])
const todayWishes = ref([])

const fetchHomeData = async () => {
  try {
    const meals = await request({ url: '/meals?week=2&mealType=早餐' })
    todayMeals.value = meals.slice(0, 1)
    
    const plans = await request({ url: '/mother-care' })
    motherPlans.value = plans.slice(0, 2)

    // 获取今日心愿
    const wishes = await request({ url: '/wish-meals/today' })
    todayWishes.value = wishes
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchHomeData()
})

// 根据角色显示不同的快捷功能
const quickActions = computed(() => {
  const baseActions = [
    { icon: 'calendar', title: '周餐单', path: '/pages/meals/index', color: '#E8A598', roles: ['mom', 'family', 'admin'] },
    { icon: 'edit-pen', title: '生活记录', path: '/pages/life-records/index', color: '#F2DFC8', roles: ['mom', 'family', 'admin'] },
    { icon: 'baby', title: '成长日记', path: '/pages/baby-diary/index', color: '#98B8E8', roles: ['mom', 'family', 'admin'] },
    { icon: 'chat', title: '家人互动', path: '/pages/social/index', color: '#E8A598', roles: ['mom', 'family', 'admin'] },
    { icon: 'file-text', title: '本周小报', path: '/pages/weekly-report/index', color: '#C8D8C0', roles: ['mom', 'family', 'admin'] },
    { icon: 'info-circle', title: '月子百科', path: '/pages/knowledge/index', color: '#F2DFC8', roles: ['mom', 'family', 'admin'] }
  ]

  // 妈妈特有功能
  const momActions = [
    { icon: 'heart', title: '心愿菜单', path: '/pages/wish-meals/index', color: '#F2A5A5', roles: ['mom'] },
    { icon: 'shopping-cart', title: '点餐台', path: '/pages/orders/index', color: '#C8D8C0', roles: ['mom'] }
  ]

  // 家人特有功能
  const familyActions = [
    { icon: 'list', title: '接单中心', path: '/pages/orders/index', color: '#C8D8C0', roles: ['family', 'admin'] }
  ]

  const userRole = userStore.userRole
  
  // 合并角色对应的功能
  let actions = [...baseActions.filter(action => action.roles.includes(userRole))]
  
  if (userRole === 'mom') {
    actions = [...momActions, ...actions]
  } else if (userRole === 'family' || userRole === 'admin') {
    actions = [...familyActions, ...actions]
  }
  
  return actions
})

const navTo = (url) => {
  // 检查是否是 tabBar 页面
  const tabBarPages = ['/pages/index/index', '/pages/meals/index', '/pages/mother-care/index', '/pages/baby-care/index']
  if (tabBarPages.includes(url)) {
    uni.switchTab({ url })
  } else {
    uni.navigateTo({ url })
  }
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

    <!-- 今日心愿 -->
    <view class="content-section" v-if="todayWishes.length > 0">
      <SectionTitle title="今日心愿" sub-title="你想吃的 · 都在这里" />
      <view class="wish-list">
        <view v-for="wish in todayWishes" :key="wish.id" class="wish-item">
          <u-tag 
            :text="wish.meal_type" 
            plain 
            size="mini" 
            type="primary" 
            color="#E8A598" 
            borderColor="#E8A598"
          ></u-tag>
          <text class="wish-name">{{ wish.meal_name || wish.custom_name }}</text>
          <text v-if="wish.remark" class="wish-remark">{{ wish.remark }}</text>
        </view>
      </view>
    </view>

    <!-- 查看更多心愿 -->
    <view class="more-wishes" @click="navTo('/pages/wish-meals/index')">
      <u-icon name="heart" color="#E8A598" size="16"></u-icon>
      <text>查看所有心愿</text>
      <u-icon name="arrow-right" color="#B5A89F" size="14"></u-icon>
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
  row-gap: 30rpx;
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

/* 今日心愿 */
.wish-list {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 10rpx 30rpx;
  box-shadow: var(--shadow-card);
}

.wish-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 0;
  border-bottom: 1px dashed var(--color-border);
}

.wish-item:last-child {
  border-bottom: none;
}

.wish-name {
  font-size: 28rpx;
  color: var(--color-text-primary);
  flex: 1;
}

.wish-remark {
  font-size: 22rpx;
  color: var(--color-text-hint);
}

.more-wishes {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 24rpx;
  margin-top: 20rpx;
  font-size: 26rpx;
  color: var(--color-text-secondary);
}
</style>
