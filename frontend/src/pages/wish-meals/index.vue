<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMeals, getMyWishes, createWish, updateWishStatus } from '@/api'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 权限判断
const canCreateWish = computed(() => userStore.isMom)
const canViewWish = computed(() => userStore.isMom || userStore.isFamily || userStore.isAdmin)

// 当前视图：'create' 创建心愿, 'list' 我的心愿
const currentView = ref('list')

// 日期选择
const today = new Date().toISOString().split('T')[0]
const selectedDate = ref(today)
const mealTypes = ['早餐', '午餐', '晚餐', '加餐']
const selectedMealType = ref('')

// 菜品列表
const mealList = ref([])
const selectedMeal = ref(null)
const customName = ref('')
const remark = ref('')

// 我的心愿列表
const myWishes = ref([])

// 获取菜品列表
const fetchMeals = async () => {
  try {
    const res = await getMeals()
    mealList.value = res
  } catch (e) {
    console.error(e)
  }
}

// 获取我的心愿
const fetchMyWishes = async () => {
  try {
    const res = await getMyWishes()
    myWishes.value = res
  } catch (e) {
    console.error(e)
  }
}

// 创建心愿
const handleCreateWish = async () => {
  if (!canCreateWish.value) {
    uni.showToast({ title: '只有妈妈可以许心愿哦', icon: 'none' })
    return
  }
  
  if (!selectedDate.value || !selectedMealType.value) {
    uni.showToast({ title: '请选择日期和餐次', icon: 'none' })
    return
  }
  if (!selectedMeal.value && !customName.value.trim()) {
    uni.showToast({ title: '请选择菜品或输入自定义菜名', icon: 'none' })
    return
  }

  try {
    await createWish({
      mealId: selectedMeal.value?.id || null,
      mealDate: selectedDate.value,
      mealType: selectedMealType.value,
      customName: customName.value.trim() || null,
      remark: remark.value.trim() || null
    })
    uni.showToast({ title: '许愿成功~', icon: 'success' })
    // 重置表单
    selectedMeal.value = null
    customName.value = ''
    remark.value = ''
    // 切换到列表视图
    currentView.value = 'list'
    fetchMyWishes()
  } catch (e) {
    console.error(e)
  }
}

// 取消心愿
const handleCancelWish = async (id) => {
  try {
    await updateWishStatus(id, 'cancelled')
    uni.showToast({ title: '已取消', icon: 'success' })
    fetchMyWishes()
  } catch (e) {
    console.error(e)
  }
}

// 选择菜品
const selectMeal = (meal) => {
  selectedMeal.value = meal
  customName.value = ''
}

// 选择自定义
const selectCustom = () => {
  selectedMeal.value = null
}

// 状态文案
const statusText = (status) => {
  const map = { pending: '待完成', done: '已完成', cancelled: '已取消' }
  return map[status] || status
}

const statusClass = (status) => {
  return `status-${status}`
}

// 按日期分组心愿
const groupedWishes = computed(() => {
  const groups = {}
  myWishes.value.forEach(wish => {
    if (!groups[wish.meal_date]) {
      groups[wish.meal_date] = []
    }
    groups[wish.meal_date].push(wish)
  })
  return groups
})

onMounted(() => {
  fetchMeals()
  fetchMyWishes()
})
</script>

<template>
  <view class="page-container">
    <!-- 权限提示 -->
    <view v-if="!canViewWish" class="no-permission">
      <u-empty mode="permission" text="您没有权限访问此页面"></u-empty>
    </view>

    <view v-else>
      <!-- 顶部切换（只有妈妈可以创建） -->
      <view class="view-tabs" v-if="canCreateWish">
        <view 
          class="tab-item" 
          :class="{ active: currentView === 'list' }" 
          @click="currentView = 'list'"
        >
          <text>我的心愿</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: currentView === 'create' }" 
          @click="currentView = 'create'"
        >
          <text>许个愿</text>
        </view>
      </view>

      <!-- 家人视角的标题 -->
      <view v-if="!canCreateWish" class="family-header">
        <text class="page-title">心愿菜单</text>
        <text class="page-subtitle">妈妈的心愿清单</text>
      </view>

      <!-- 创建心愿（只有妈妈可见） -->
      <view v-if="currentView === 'create' && canCreateWish" class="create-section">
        <!-- 日期选择 -->
        <view class="form-group">
          <text class="form-label">想吃哪天？</text>
          <picker mode="date" :value="selectedDate" :start="today" @change="(e) => selectedDate = e.detail.value">
            <view class="picker-display">
              <u-icon name="calendar" color="#E8A598" size="18"></u-icon>
              <text>{{ selectedDate }}</text>
            </view>
          </picker>
        </view>

        <!-- 餐次选择 -->
        <view class="form-group">
          <text class="form-label">哪一餐？</text>
          <view class="meal-type-list">
          <view 
            v-for="type in mealTypes" 
            :key="type" 
            class="meal-type-item" 
            :class="{ active: selectedMealType === type }"
            @click="selectedMealType = type"
          >
            {{ type }}
          </view>
        </view>
      </view>

      <!-- 菜品选择 -->
      <view class="form-group">
        <text class="form-label">想吃什么？</text>
        <view class="meal-options">
          <view 
            v-for="meal in mealList" 
            :key="meal.id" 
            class="meal-option" 
            :class="{ selected: selectedMeal?.id === meal.id }"
            @click="selectMeal(meal)"
          >
            <text class="meal-name">{{ meal.name }}</text>
            <text class="meal-type-tag">{{ meal.meal_type }}</text>
          </view>
          <!-- 自定义选项 -->
          <view 
            class="meal-option custom-option" 
            :class="{ selected: selectedMeal === null && customName }"
            @click="selectCustom"
          >
            <u-icon name="edit-pen" color="#B5A89F" size="16"></u-icon>
            <text>自己写一个</text>
          </view>
        </view>
      </view>

      <!-- 自定义菜品名 -->
      <view v-if="selectedMeal === null" class="form-group">
        <text class="form-label">自定义菜名</text>
        <input 
          class="custom-input" 
          v-model="customName" 
          placeholder="比如：红烧排骨、番茄蛋汤"
        />
      </view>

      <!-- 备注 -->
      <view class="form-group">
        <text class="form-label">有什么要求？（选填）</text>
        <input 
          class="custom-input" 
          v-model="remark" 
          placeholder="比如：少盐、不要姜、多放汤"
        />
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" @click="handleCreateWish">
        <u-icon name="heart" color="#fff" size="18"></u-icon>
        <text>许个心愿</text>
      </button>
    </view>

    <!-- 我的心愿列表 -->
    <view v-if="currentView === 'list'" class="wish-list-section">
      <view v-if="myWishes.length === 0" class="empty-state">
        <u-empty mode="list" text="还没有心愿，快去许一个吧~"></u-empty>
      </view>

      <view v-else class="wish-groups">
        <view v-for="(wishes, date) in groupedWishes" :key="date" class="date-group">
          <view class="date-header">
            <text class="date-text">{{ date }}</text>
            <text class="date-count">{{ wishes.length }} 个心愿</text>
          </view>
          <view class="wish-cards">
            <view v-for="wish in wishes" :key="wish.id" class="wish-card">
              <view class="wish-main">
                <view class="wish-info">
                  <u-tag 
                    :text="wish.meal_type" 
                    plain 
                    size="mini" 
                    type="primary" 
                    color="#E8A598" 
                    borderColor="#E8A598"
                  ></u-tag>
                  <text class="wish-name">{{ wish.meal_name || wish.custom_name }}</text>
                </view>
                <text v-if="wish.remark" class="wish-remark">
                  <u-icon name="chat" color="#B5A89F" size="12"></u-icon>
                  {{ wish.remark }}
                </text>
              </view>
              <view class="wish-actions">
                <text class="status-text" :class="statusClass(wish.status)">
                  {{ statusText(wish.status) }}
                </text>
                <view 
                  v-if="wish.status === 'pending'" 
                  class="cancel-btn"
                  @click.stop="handleCancelWish(wish.id)"
                >
                  取消
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding: 20rpx 0;
  background-color: var(--color-bg);
  min-height: 100vh;
}

/* 权限提示 */
.no-permission {
  padding: 100rpx 0;
}

/* 家人视角标题 */
.family-header {
  padding: 30rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
}

.page-title {
  font-size: 40rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 8rpx;
}

.page-subtitle {
  font-size: 28rpx;
  color: var(--color-text-secondary);
  display: block;
}

/* 顶部切换 */
.view-tabs {
  display: flex;
  background-color: #FFFFFF;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: var(--color-text-secondary);
  border-bottom: 4rpx solid transparent;
  transition: all 0.3s;
}

.tab-item.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: bold;
}

/* 创建表单 */
.create-section {
  padding: 30rpx;
}

.form-group {
  margin-bottom: 40rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: var(--color-text-primary);
  margin-bottom: 16rpx;
  font-weight: 500;
}

.picker-display {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: var(--radius-md);
  border: 2rpx solid var(--color-border);
  font-size: 28rpx;
}

.meal-type-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.meal-type-item {
  padding: 16rpx 32rpx;
  background-color: #FFFFFF;
  border-radius: var(--radius-lg);
  border: 2rpx solid var(--color-border);
  font-size: 26rpx;
  color: var(--color-text-secondary);
  transition: all 0.3s;
}

.meal-type-item.active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #FFFFFF;
}

.meal-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.meal-option {
  padding: 16rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: var(--radius-md);
  border: 2rpx solid var(--color-border);
  font-size: 26rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  transition: all 0.3s;
}

.meal-option.selected {
  border-color: var(--color-primary);
  background-color: rgba(232, 165, 152, 0.1);
}

.meal-name {
  color: var(--color-text-primary);
}

.meal-type-tag {
  font-size: 20rpx;
  color: var(--color-text-hint);
  background-color: rgba(181, 168, 159, 0.1);
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
}

.custom-option {
  color: var(--color-text-hint);
}

.custom-input {
  padding: 20rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: var(--radius-md);
  border: 2rpx solid var(--color-border);
  font-size: 28rpx;
  width: 100%;
  box-sizing: border-box;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  width: 100%;
  padding: 28rpx 0;
  background-color: var(--color-primary);
  color: #FFFFFF;
  font-size: 30rpx;
  border-radius: var(--radius-lg);
  border: none;
  margin-top: 40rpx;
}

.submit-btn::after {
  border: none;
}

/* 心愿列表 */
.wish-list-section {
  padding: 30rpx;
}

.date-group {
  margin-bottom: 40rpx;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.date-text {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--color-text-primary);
}

.date-count {
  font-size: 24rpx;
  color: var(--color-text-hint);
}

.wish-card {
  background-color: #FFFFFF;
  border-radius: var(--radius-md);
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: var(--shadow-card);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.wish-main {
  flex: 1;
}

.wish-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.wish-name {
  font-size: 28rpx;
  color: var(--color-text-primary);
  font-weight: 500;
}

.wish-remark {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 24rpx;
  color: var(--color-text-hint);
  margin-top: 8rpx;
}

.wish-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.status-text {
  font-size: 24rpx;
  padding: 6rpx 12rpx;
  border-radius: 4rpx;
}

.status-pending {
  color: #F2DFC8;
  background-color: rgba(242, 223, 200, 0.2);
}

.status-done {
  color: #C8D8C0;
  background-color: rgba(200, 216, 192, 0.2);
}

.status-cancelled {
  color: #B5A89F;
  background-color: rgba(181, 168, 159, 0.2);
}

.cancel-btn {
  font-size: 24rpx;
  color: var(--color-text-hint);
  padding: 8rpx 16rpx;
  border: 2rpx solid var(--color-border);
  border-radius: var(--radius-sm);
}

.empty-state {
  padding-top: 100rpx;
}
</style>
