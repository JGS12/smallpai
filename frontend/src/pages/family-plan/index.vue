<script setup>
import { ref, onMounted } from 'vue'
import { getFamilyPlan } from '@/api'

const planData = ref(null)

const fetchPlan = async () => {
  try {
    const res = await getFamilyPlan()
    planData.value = res
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchPlan()
})
</script>

<template>
  <view class="page-container" v-if="planData">
    <view class="header-card">
      <view class="h-main">
        <text class="h-title">家庭和谐方案</text>
        <text class="h-badge">{{ planData.config?.current_mode }}模式</text>
      </view>
      <text class="h-desc">{{ planData.config?.description }}</text>
    </view>

    <view class="task-section">
      <view class="section-header">
        <u-icon name="list-dot" color="#C8D8C0" size="20"></u-icon>
        <text class="s-title">责任清单</text>
      </view>
      
      <view v-for="task in planData.tasks" :key="task.id" class="task-card">
        <view class="task-meta">
          <u-avatar :text="task.role.substring(0, 1)" size="30" bg-color="#F2DFC8"></u-avatar>
          <view class="task-info">
            <text class="role-name">{{ task.role }}</text>
            <text class="task-name">{{ task.task_name }}</text>
          </view>
        </view>
        <u-tag :text="task.frequency" type="info" plain size="mini"></u-tag>
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
.header-card {
  background: linear-gradient(135deg, #C8D8C0 0%, #E0EADD 100%);
  padding: 40rpx;
  border-radius: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: var(--shadow-card);
}
.h-main {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.h-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #3D3532;
}
.h-badge {
  font-size: 20rpx;
  color: #FFFFFF;
  background: rgba(61, 53, 50, 0.2);
  padding: 4rpx 16rpx;
  border-radius: 100rpx;
  margin-left: 16rpx;
}
.h-desc {
  font-size: 24rpx;
  color: #5A524F;
  line-height: 1.5;
  display: block;
}

.task-section {
  background-color: #FFFFFF;
  border-radius: 30rpx;
  padding: 30rpx;
  box-shadow: var(--shadow-card);
}
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}
.s-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-left: 16rpx;
}

.task-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #F5F5F5;
}
.task-card:last-child {
  border-bottom: none;
}
.task-meta {
  display: flex;
  align-items: center;
}
.task-info {
  margin-left: 20rpx;
}
.role-name {
  font-size: 22rpx;
  color: var(--color-text-hint);
  display: block;
}
.task-name {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-top: 4rpx;
  display: block;
}
</style>
