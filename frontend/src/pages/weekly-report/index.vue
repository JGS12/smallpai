<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'

const currentReport = ref(null)
const recentReports = ref([])

const fetchCurrentReport = async () => {
  try {
    const res = await request({ url: '/social/weekly-report' })
    currentReport.value = res
  } catch (e) { console.error(e) }
}

const fetchRecentReports = async () => {
  try {
    const res = await request({ url: '/social/weekly-reports' })
    recentReports.value = res.items || []
  } catch (e) { console.error(e) }
}

onMounted(() => {
  fetchCurrentReport()
  fetchRecentReports()
})
</script>

<template>
  <view class="page-container">
    <!-- 本周小报 -->
    <view v-if="currentReport" class="report-card">
      <view class="report-header">
        <text class="report-title">📰 本周小报</text>
        <text class="report-date">{{ currentReport.weekStart }} ~ {{ currentReport.weekEnd }}</text>
      </view>

      <view class="report-stats">
        <view class="stat-item">
          <text class="stat-emoji">🍽️</text>
          <text class="stat-value">{{ currentReport.topMeal.name }}</text>
          <text class="stat-label">最受欢迎的菜</text>
        </view>
        <view class="stat-item">
          <text class="stat-emoji">😊</text>
          <text class="stat-value">{{ currentReport.moodScore }}⭐</text>
          <text class="stat-label">平均心情</text>
        </view>
        <view class="stat-item">
          <text class="stat-emoji">🍼</text>
          <text class="stat-value">{{ currentReport.feedingCount }}次</text>
          <text class="stat-label">哺乳次数</text>
        </view>
        <view class="stat-item">
          <text class="stat-emoji">💬</text>
          <text class="stat-value">{{ currentReport.msgCount }}条</text>
          <text class="stat-label">家人留言</text>
        </view>
        <view class="stat-item">
          <text class="stat-emoji">✅</text>
          <text class="stat-value">{{ currentReport.orderCount }}单</text>
          <text class="stat-label">完成送餐</text>
        </view>
        <view v-if="currentReport.weightGain" class="stat-item">
          <text class="stat-emoji">⚖️</text>
          <text class="stat-value">{{ currentReport.weightGain }}kg</text>
          <text class="stat-label">体重变化</text>
        </view>
      </view>

      <view class="report-summary">
        <text class="summary-text">
          本周最想吃的菜是「{{ currentReport.topMeal.name }}」，点了 {{ currentReport.topMeal.count }} 次。
          妈妈本周心情平均 {{ currentReport.moodScore }}⭐，
          家人们留下了 {{ currentReport.msgCount }} 条暖心留言 💕
        </text>
      </view>
    </view>

    <view v-else class="empty-card">
      <text>正在生成本周小报...</text>
    </view>

    <!-- 历史小报 -->
    <view v-if="recentReports.length > 0" class="history-section">
      <text class="section-title">📚 历史小报</text>
      <view v-for="report in recentReports" :key="report.id" class="history-card">
        <text class="history-date">{{ report.report_data?.weekStart }} ~ {{ report.report_data?.weekEnd }}</text>
        <view class="history-stats">
          <text>{{ report.report_data?.feedingCount }}次哺乳</text>
          <text>{{ report.report_data?.msgCount }}条留言</text>
          <text>{{ report.report_data?.moodScore }}⭐心情</text>
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

.report-card {
  background: linear-gradient(135deg, #FFF5F3, #FFFAF5);
  border-radius: var(--radius-xl);
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: var(--shadow-card);
  border: 2rpx solid #E8A59830;
}

.report-header {
  text-align: center;
  margin-bottom: 30rpx;
}

.report-title {
  font-size: 36rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
}

.report-date {
  font-size: 24rpx;
  color: var(--color-text-hint);
  margin-top: 8rpx;
}

.report-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.stat-item {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 20rpx 12rpx;
  text-align: center;
}

.stat-emoji {
  font-size: 36rpx;
  display: block;
}

.stat-value {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
  margin: 4rpx 0;
}

.stat-label {
  font-size: 20rpx;
  color: var(--color-text-hint);
}

.report-summary {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 24rpx;
}

.summary-text {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 20rpx;
}

.history-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: var(--shadow-card);
}

.history-date {
  font-size: 24rpx;
  color: var(--color-text-hint);
  display: block;
  margin-bottom: 8rpx;
}

.history-stats {
  display: flex;
  gap: 20rpx;
}

.history-stats text {
  font-size: 24rpx;
  color: var(--color-text-secondary);
}

.empty-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 60rpx 40rpx;
  text-align: center;
  box-shadow: var(--shadow-card);
}

.empty-card text {
  font-size: 26rpx;
  color: var(--color-text-hint);
}
</style>
