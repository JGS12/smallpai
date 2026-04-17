<script setup>
import { ref, computed, onMounted } from 'vue'
import { request } from '@/utils/request'

const today = new Date().toISOString().split('T')[0]
const selectedDate = ref(today)
const selectedType = ref('')
const mealTypes = ['早餐', '加餐', '午餐', '晚餐', '汤水']
const orders = ref([])
const meals = ref([])

// 点餐表单
const showOrderForm = ref(false)
const selectedMeal = ref(null)
const customName = ref('')
const remark = ref('')

// 加载今日点餐
const fetchOrders = async () => {
  try {
    const res = await request({ url: `/orders?date=${selectedDate.value}` })
    orders.value = res.items || []
  } catch (e) {
    console.error(e)
  }
}

// 加载菜单
const fetchMeals = async () => {
  try {
    const res = await request({ url: '/meals' })
    meals.value = res || []
  } catch (e) {
    console.error(e)
  }
}

// 按餐次分组
const groupedOrders = computed(() => {
  const groups = {}
  mealTypes.forEach(t => { groups[t] = [] })
  orders.value.forEach(o => {
    if (groups[o.meal_type]) {
      groups[o.meal_type].push(o)
    }
  })
  return groups
})

// 点餐
const submitOrder = async () => {
  if (!selectedMeal.value && !customName.value) {
    uni.showToast({ title: '请选择菜品或输入自定义菜品', icon: 'none' })
    return
  }
  if (!selectedType.value) {
    uni.showToast({ title: '请选择餐次', icon: 'none' })
    return
  }
  try {
    await request({
      url: '/orders',
      method: 'POST',
      data: {
        mealId: selectedMeal.value?.id || null,
        customName: customName.value || null,
        mealDate: selectedDate.value,
        mealType: selectedType.value,
        remark: remark.value
      }
    })
    uni.showToast({ title: '点餐成功！', icon: 'success' })
    showOrderForm.value = false
    selectedMeal.value = null
    customName.value = ''
    remark.value = ''
    fetchOrders()
  } catch (e) {
    console.error(e)
  }
}

// 接单
const acceptOrder = async (id) => {
  try {
    await request({ url: `/orders/${id}/accept`, method: 'PUT' })
    uni.showToast({ title: '接单成功！', icon: 'success' })
    fetchOrders()
  } catch (e) {
    console.error(e)
  }
}

// 完成
const completeOrder = async (id) => {
  try {
    await request({ url: `/orders/${id}/complete`, method: 'PUT' })
    uni.showToast({ title: '已完成！', icon: 'success' })
    fetchOrders()
  } catch (e) {
    console.error(e)
  }
}

// 取消
const cancelOrder = async (id) => {
  uni.showModal({
    title: '提示',
    content: '确定取消这个点餐吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await request({ url: `/orders/${id}`, method: 'DELETE' })
          uni.showToast({ title: '已取消', icon: 'success' })
          fetchOrders()
        } catch (e) {
          console.error(e)
        }
      }
    }
  })
}

// 状态标签样式
const statusMap = {
  pending: { text: '待接单', color: '#F2A5A5', bg: '#FFF0F0' },
  accepted: { text: '制作中', color: '#E8A598', bg: '#FFF5F3' },
  done: { text: '已完成', color: '#C8D8C0', bg: '#F0F5EE' }
}

onMounted(() => {
  fetchOrders()
  fetchMeals()
})
</script>

<template>
  <view class="page-container">
    <!-- 日期选择 -->
    <view class="date-bar">
      <text class="date-label">📅 {{ selectedDate }}</text>
    </view>

    <!-- 餐次列表 -->
    <view class="meal-sections">
      <view v-for="type in mealTypes" :key="type" class="meal-section">
        <view class="section-header">
          <text class="section-title">{{ type }}</text>
          <view class="add-btn" @click="selectedType = type; showOrderForm = true">
            <u-icon name="plus" color="#E8A598" size="16"></u-icon>
            <text>点餐</text>
          </view>
        </view>

        <view v-if="groupedOrders[type].length === 0" class="empty-tip">
          <text>暂无点餐，点击上方 + 点餐</text>
        </view>

        <view v-for="order in groupedOrders[type]" :key="order.id" class="order-card">
          <view class="order-info">
            <text class="order-name">{{ order.meal_name || order.custom_name }}</text>
            <text v-if="order.remark" class="order-remark">📝 {{ order.remark }}</text>
            <view class="order-meta">
              <text class="order-user">{{ order.nickname || order.username }}</text>
              <view class="status-tag" :style="{ color: statusMap[order.status]?.color, backgroundColor: statusMap[order.status]?.bg }">
                {{ statusMap[order.status]?.text }}
              </view>
            </view>
          </view>
          <view class="order-actions">
            <view v-if="order.status === 'pending'" class="action-btn accept" @click="acceptOrder(order.id)">
              接单
            </view>
            <view v-if="order.status === 'accepted'" class="action-btn done" @click="completeOrder(order.id)">
              完成
            </view>
            <view v-if="order.status === 'pending'" class="action-btn cancel" @click="cancelOrder(order.id)">
              取消
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 点餐弹窗 -->
    <u-popup :show="showOrderForm" mode="bottom" round="20" @close="showOrderForm = false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">点餐 · {{ selectedType }}</text>
          <u-icon name="close" @click="showOrderForm = false"></u-icon>
        </view>

        <view class="form-group">
          <text class="form-label">选择菜品</text>
          <scroll-view scroll-y class="meal-picker">
            <view
              v-for="meal in meals"
              :key="meal.id"
              class="meal-option"
              :class="{ active: selectedMeal?.id === meal.id }"
              @click="selectedMeal = meal; customName = ''"
            >
              <text class="meal-opt-name">{{ meal.name }}</text>
              <text class="meal-opt-desc">{{ meal.description }}</text>
            </view>
          </scroll-view>
        </view>

        <view class="form-group">
          <text class="form-label">或输入自定义菜品</text>
          <u-input v-model="customName" placeholder="如：想吃红烧肉" @input="selectedMeal = null" />
        </view>

        <view class="form-group">
          <text class="form-label">特殊要求（可选）</text>
          <u-input v-model="remark" placeholder="如：少盐、多汤、加个蛋" />
        </view>

        <u-button type="primary" @click="submitOrder" :customStyle="{ backgroundColor: '#E8A598', borderColor: '#E8A598' }">
          确定点餐
        </u-button>
      </view>
    </u-popup>
  </view>
</template>

<style scoped>
.page-container {
  padding: 30rpx;
  background-color: var(--color-bg);
  min-height: 100vh;
}

.date-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  margin-bottom: 30rpx;
  box-shadow: var(--shadow-card);
}

.date-label {
  font-size: 28rpx;
  color: var(--color-text-primary);
  font-weight: 500;
}

.meal-section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: var(--color-text-primary);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 20rpx;
  background: #FFF5F3;
  border-radius: 100rpx;
  font-size: 24rpx;
  color: #E8A598;
}

.empty-tip {
  padding: 30rpx;
  text-align: center;
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.empty-tip text {
  font-size: 26rpx;
  color: var(--color-text-hint);
}

.order-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: var(--shadow-card);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  flex: 1;
}

.order-name {
  font-size: 30rpx;
  font-weight: 500;
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 8rpx;
}

.order-remark {
  font-size: 24rpx;
  color: var(--color-text-secondary);
  display: block;
  margin-bottom: 8rpx;
}

.order-meta {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.order-user {
  font-size: 22rpx;
  color: var(--color-text-hint);
}

.status-tag {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 100rpx;
}

.order-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  padding: 10rpx 24rpx;
  border-radius: 100rpx;
  font-size: 24rpx;
}

.action-btn.accept {
  background: #FFF5F3;
  color: #E8A598;
}

.action-btn.done {
  background: #F0F5EE;
  color: #6B9E6B;
}

.action-btn.cancel {
  background: #FFF0F0;
  color: #CC6666;
}

/* 弹窗 */
.popup-content {
  padding: 30rpx;
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--color-text-primary);
}

.form-group {
  margin-bottom: 24rpx;
}

.form-label {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  display: block;
  margin-bottom: 12rpx;
}

.meal-picker {
  max-height: 400rpx;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 12rpx;
}

.meal-option {
  padding: 16rpx;
  border-radius: var(--radius-sm);
  margin-bottom: 8rpx;
  background: #FFFFFF;
}

.meal-option.active {
  background: #FFF5F3;
  border: 2rpx solid #E8A598;
}

.meal-opt-name {
  font-size: 28rpx;
  color: var(--color-text-primary);
  display: block;
}

.meal-opt-desc {
  font-size: 22rpx;
  color: var(--color-text-hint);
  display: block;
  margin-top: 4rpx;
}
</style>
