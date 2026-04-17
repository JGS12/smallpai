<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'

const today = new Date().toISOString().split('T')[0]
const activeTab = ref('feeding')
const tabs = [
  { key: 'feeding', label: '🍼 哺乳' },
  { key: 'sleep', label: '😴 睡眠' },
  { key: 'mood', label: '😊 心情' },
  { key: 'weight', label: '⚖️ 体重' },
  { key: 'stats', label: '📊 看板' }
]

// 哺乳记录
const feedings = ref([])
const showFeedForm = ref(false)
const feedForm = ref({
  feedTime: today + 'T' + new Date().toTimeString().slice(0, 5),
  duration: '',
  side: '',
  note: ''
})
const sides = ['左边', '右边', '双边']

const fetchFeedings = async () => {
  try {
    const res = await request({ url: `/life-records/feeding?date=${today}` })
    feedings.value = res.items || []
  } catch (e) { console.error(e) }
}

const submitFeeding = async () => {
  try {
    await request({ url: '/life-records/feeding', method: 'POST', data: {
      feedTime: feedForm.value.feedTime,
      duration: feedForm.value.duration || null,
      side: feedForm.value.side === '左边' ? 'left' : feedForm.value.side === '右边' ? 'right' : 'both',
      note: feedForm.value.note
    }})
    uni.showToast({ title: '记录成功', icon: 'success' })
    showFeedForm.value = false
    fetchFeedings()
  } catch (e) { console.error(e) }
}

// 睡眠记录
const sleepRecords = ref([])
const showSleepForm = ref(false)
const sleepForm = ref({
  sleepStart: today + 'T22:00',
  sleepEnd: '',
  quality: '',
  note: ''
})
const qualities = [
  { value: 'good', label: '😊 好' },
  { value: 'normal', label: '😐 一般' },
  { value: 'bad', label: '😴 差' }
]

const fetchSleep = async () => {
  try {
    const res = await request({ url: `/life-records/sleep?date=${today}` })
    sleepRecords.value = res.items || []
  } catch (e) { console.error(e) }
}

const submitSleep = async () => {
  try {
    await request({ url: '/life-records/sleep', method: 'POST', data: {
      sleepStart: sleepForm.value.sleepStart,
      sleepEnd: sleepForm.value.sleepEnd || null,
      quality: sleepForm.value.quality || null,
      note: sleepForm.value.note
    }})
    uni.showToast({ title: '记录成功', icon: 'success' })
    showSleepForm.value = false
    fetchSleep()
  } catch (e) { console.error(e) }
}

// 心情打卡
const moods = ref([])
const todayMood = ref(null)
const moodNote = ref('')
const moodOptions = [
  { value: 'happy', emoji: '😊', label: '开心' },
  { value: 'normal', emoji: '😐', label: '还行' },
  { value: 'sad', emoji: '😢', label: '难过' },
  { value: 'crying', emoji: '😭', label: '崩溃' }
]

const fetchMoods = async () => {
  try {
    const res = await request({ url: `/life-records/mood?startDate=${today}&endDate=${today}` })
    moods.value = res.items || []
    if (moods.value.length > 0) {
      todayMood.value = moods.value[0].mood
      moodNote.value = moods.value[0].note || ''
    }
  } catch (e) { console.error(e) }
}

const submitMood = async (mood) => {
  todayMood.value = mood
  try {
    await request({ url: '/life-records/mood', method: 'POST', data: {
      mood,
      note: moodNote.value,
      recordDate: today
    }})
    uni.showToast({ title: '打卡成功！', icon: 'success' })
  } catch (e) { console.error(e) }
}

// 体重记录
const weights = ref([])
const showWeightForm = ref(false)
const newWeight = ref('')
const weightDate = ref(today)

const fetchWeights = async () => {
  try {
    const res = await request({ url: '/life-records/weight?limit=30' })
    weights.value = res.items || []
  } catch (e) { console.error(e) }
}

const submitWeight = async () => {
  if (!newWeight.value) {
    uni.showToast({ title: '请输入体重', icon: 'none' })
    return
  }
  try {
    await request({ url: '/life-records/weight', method: 'POST', data: {
      weight: parseFloat(newWeight.value),
      recordDate: weightDate.value
    }})
    uni.showToast({ title: '记录成功', icon: 'success' })
    showWeightForm.value = false
    newWeight.value = ''
    fetchWeights()
  } catch (e) { console.error(e) }
}

// 数据看板
const stats = ref(null)
const fetchStats = async () => {
  try {
    const res = await request({ url: '/life-records/stats?days=7' })
    stats.value = res
  } catch (e) { console.error(e) }
}

const switchTab = (key) => {
  activeTab.value = key
  if (key === 'stats') fetchStats()
}

onMounted(() => {
  fetchFeedings()
  fetchSleep()
  fetchMoods()
  fetchWeights()
})
</script>

<template>
  <view class="page-container">
    <!-- Tab 切换 -->
    <scroll-view scroll-x class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </view>
    </scroll-view>

    <!-- 哺乳记录 -->
    <view v-if="activeTab === 'feeding'" class="tab-content">
      <view class="add-bar">
        <text class="section-title">今日哺乳记录</text>
        <view class="add-btn" @click="showFeedForm = true">
          <u-icon name="plus" color="#E8A598" size="16"></u-icon>
          <text>记录</text>
        </view>
      </view>

      <view v-if="feedings.length === 0" class="empty-card">
        <text>今天还没有记录，点击上方 + 开始记录</text>
      </view>

      <view v-for="item in feedings" :key="item.id" class="record-card">
        <view class="record-time">{{ item.feed_time?.replace('T', ' ').slice(0, 16) }}</view>
        <view class="record-details">
          <text v-if="item.duration" class="detail-item">⏱ {{ item.duration }}分钟</text>
          <text v-if="item.side" class="detail-item">{{ item.side === 'left' ? '🍼 左边' : item.side === 'right' ? '🍼 右边' : '🍼 双边' }}</text>
        </view>
        <text v-if="item.note" class="record-note">{{ item.note }}</text>
      </view>
    </view>

    <!-- 睡眠记录 -->
    <view v-if="activeTab === 'sleep'" class="tab-content">
      <view class="add-bar">
        <text class="section-title">今日睡眠记录</text>
        <view class="add-btn" @click="showSleepForm = true">
          <u-icon name="plus" color="#E8A598" size="16"></u-icon>
          <text>记录</text>
        </view>
      </view>

      <view v-if="sleepRecords.length === 0" class="empty-card">
        <text>今天还没有睡眠记录</text>
      </view>

      <view v-for="item in sleepRecords" :key="item.id" class="record-card">
        <view class="record-time">
          {{ item.sleep_start?.replace('T', ' ').slice(0, 16) }}
          <text v-if="item.sleep_end"> → {{ item.sleep_end?.replace('T', ' ').slice(0, 16) }}</text>
        </view>
        <view v-if="item.quality" class="record-details">
          <text class="detail-item">{{ item.quality === 'good' ? '😊 好' : item.quality === 'normal' ? '😐 一般' : '😴 差' }}</text>
        </view>
      </view>
    </view>

    <!-- 心情打卡 -->
    <view v-if="activeTab === 'mood'" class="tab-content">
      <view class="mood-section">
        <text class="section-title">今天心情怎么样？</text>
        <view class="mood-options">
          <view
            v-for="m in moodOptions"
            :key="m.value"
            class="mood-item"
            :class="{ active: todayMood === m.value }"
            @click="submitMood(m.value)"
          >
            <text class="mood-emoji">{{ m.emoji }}</text>
            <text class="mood-label">{{ m.label }}</text>
          </view>
        </view>
        <view v-if="todayMood" class="mood-note">
          <u-input v-model="moodNote" placeholder="记录一下今天的心情..." @blur="submitMood(todayMood)" />
        </view>
      </view>
    </view>

    <!-- 体重记录 -->
    <view v-if="activeTab === 'weight'" class="tab-content">
      <view class="add-bar">
        <text class="section-title">体重记录</text>
        <view class="add-btn" @click="showWeightForm = true">
          <u-icon name="plus" color="#E8A598" size="16"></u-icon>
          <text>记录</text>
        </view>
      </view>

      <view v-if="weights.length === 0" class="empty-card">
        <text>还没有体重记录</text>
      </view>

      <view v-for="item in weights" :key="item.id" class="record-card">
        <view class="record-time">{{ item.record_date }}</view>
        <view class="record-details">
          <text class="detail-item weight-value">{{ item.weight }} kg</text>
        </view>
      </view>
    </view>

    <!-- 数据看板 -->
    <view v-if="activeTab === 'stats'" class="tab-content">
      <text class="section-title">📊 近7天数据看板</text>

      <view v-if="stats" class="stats-grid">
        <view class="stat-card pink">
          <text class="stat-number">{{ stats.feeding.count }}</text>
          <text class="stat-label">哺乳次数</text>
        </view>
        <view class="stat-card blue">
          <text class="stat-number">{{ Math.round(stats.sleep.avgMinutes / 60) }}h</text>
          <text class="stat-label">平均睡眠</text>
        </view>
        <view class="stat-card green">
          <text class="stat-number">{{ stats.sleep.count }}</text>
          <text class="stat-label">睡眠记录</text>
        </view>
      </view>

      <view v-if="stats?.mood?.length > 0" class="mood-stats">
        <text class="sub-title">心情分布</text>
        <view class="mood-bars">
          <view v-for="m in stats.mood" :key="m.mood" class="mood-bar">
            <text>{{ m.mood === 'happy' ? '😊' : m.mood === 'normal' ? '😐' : m.mood === 'sad' ? '😢' : '😭' }}</text>
            <text class="bar-count">{{ m.count }}次</text>
          </view>
        </view>
      </view>

      <view v-if="stats?.weight?.length > 0" class="weight-trend">
        <text class="sub-title">体重趋势</text>
        <view class="weight-points">
          <view v-for="(w, i) in stats.weight" :key="i" class="weight-point">
            <text class="wp-date">{{ w.record_date.slice(5) }}</text>
            <text class="wp-value">{{ w.weight }}kg</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 哺乳记录弹窗 -->
    <u-popup :show="showFeedForm" mode="bottom" round="20" @close="showFeedForm = false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">记录哺乳</text>
          <u-icon name="close" @click="showFeedForm = false"></u-icon>
        </view>
        <view class="form-group">
          <text class="form-label">喂奶时间</text>
          <u-input v-model="feedForm.feedTime" type="text" placeholder="如：2026-04-17T10:30" />
        </view>
        <view class="form-group">
          <text class="form-label">时长（分钟）</text>
          <u-input v-model="feedForm.duration" type="number" placeholder="如：15" />
        </view>
        <view class="form-group">
          <text class="form-label">哪边</text>
          <view class="side-options">
            <view v-for="s in sides" :key="s" class="side-item" :class="{ active: feedForm.side === s }" @click="feedForm.side = s">
              {{ s }}
            </view>
          </view>
        </view>
        <u-button type="primary" @click="submitFeeding" :customStyle="{ backgroundColor: '#E8A598', borderColor: '#E8A598' }">
          保存
        </u-button>
      </view>
    </u-popup>

    <!-- 睡眠记录弹窗 -->
    <u-popup :show="showSleepForm" mode="bottom" round="20" @close="showSleepForm = false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">记录睡眠</text>
          <u-icon name="close" @click="showSleepForm = false"></u-icon>
        </view>
        <view class="form-group">
          <text class="form-label">入睡时间</text>
          <u-input v-model="sleepForm.sleepStart" type="text" placeholder="如：2026-04-17T22:00" />
        </view>
        <view class="form-group">
          <text class="form-label">醒来时间（可选）</text>
          <u-input v-model="sleepForm.sleepEnd" type="text" placeholder="如：2026-04-18T06:00" />
        </view>
        <view class="form-group">
          <text class="form-label">睡眠质量</text>
          <view class="quality-options">
            <view v-for="q in qualities" :key="q.value" class="quality-item" :class="{ active: sleepForm.quality === q.value }" @click="sleepForm.quality = q.value">
              {{ q.label }}
            </view>
          </view>
        </view>
        <u-button type="primary" @click="submitSleep" :customStyle="{ backgroundColor: '#E8A598', borderColor: '#E8A598' }">
          保存
        </u-button>
      </view>
    </u-popup>

    <!-- 体重记录弹窗 -->
    <u-popup :show="showWeightForm" mode="bottom" round="20" @close="showWeightForm = false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">记录体重</text>
          <u-icon name="close" @click="showWeightForm = false"></u-icon>
        </view>
        <view class="form-group">
          <text class="form-label">日期</text>
          <u-input v-model="weightDate" type="text" />
        </view>
        <view class="form-group">
          <text class="form-label">体重（kg）</text>
          <u-input v-model="newWeight" type="digit" placeholder="如：55.5" />
        </view>
        <u-button type="primary" @click="submitWeight" :customStyle="{ backgroundColor: '#E8A598', borderColor: '#E8A598' }">
          保存
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

.tab-bar {
  display: flex;
  white-space: nowrap;
  margin-bottom: 30rpx;
}

.tab-item {
  display: inline-block;
  padding: 14rpx 28rpx;
  font-size: 26rpx;
  color: var(--color-text-secondary);
  background: #FFFFFF;
  border-radius: 100rpx;
  margin-right: 16rpx;
  box-shadow: var(--shadow-card);
}

.tab-item.active {
  background: #E8A598;
  color: #FFFFFF;
}

.tab-content {
  padding-top: 10rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 20rpx;
}

.sub-title {
  font-size: 26rpx;
  font-weight: 500;
  color: var(--color-text-secondary);
  display: block;
  margin: 30rpx 0 16rpx;
}

.add-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.add-bar .section-title {
  margin-bottom: 0;
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

.empty-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 40rpx;
  text-align: center;
  box-shadow: var(--shadow-card);
}

.empty-card text {
  font-size: 26rpx;
  color: var(--color-text-hint);
}

.record-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: var(--shadow-card);
}

.record-time {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  margin-bottom: 8rpx;
}

.record-details {
  display: flex;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.detail-item {
  font-size: 28rpx;
  color: var(--color-text-primary);
}

.weight-value {
  font-size: 36rpx;
  font-weight: bold;
  color: var(--color-primary);
}

.record-note {
  font-size: 24rpx;
  color: var(--color-text-hint);
}

/* 心情 */
.mood-section {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 30rpx;
  box-shadow: var(--shadow-card);
}

.mood-options {
  display: flex;
  justify-content: space-around;
  margin: 30rpx 0;
}

.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border-radius: var(--radius-lg);
}

.mood-item.active {
  background: #FFF5F3;
  transform: scale(1.1);
}

.mood-emoji {
  font-size: 60rpx;
  margin-bottom: 8rpx;
}

.mood-label {
  font-size: 24rpx;
  color: var(--color-text-secondary);
}

/* 数据看板 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.stat-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 24rpx;
  text-align: center;
  box-shadow: var(--shadow-card);
}

.stat-card.pink { border-top: 4rpx solid #E8A598; }
.stat-card.blue { border-top: 4rpx solid #98B8E8; }
.stat-card.green { border-top: 4rpx solid #C8D8C0; }

.stat-number {
  font-size: 40rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
}

.stat-label {
  font-size: 22rpx;
  color: var(--color-text-hint);
}

.mood-bars {
  display: flex;
  justify-content: space-around;
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 24rpx;
  box-shadow: var(--shadow-card);
}

.mood-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 36rpx;
}

.bar-count {
  font-size: 22rpx;
  color: var(--color-text-hint);
  margin-top: 8rpx;
}

.weight-trend .weight-points {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.weight-point {
  background: #FFFFFF;
  border-radius: var(--radius-md);
  padding: 16rpx 24rpx;
  box-shadow: var(--shadow-card);
  text-align: center;
}

.wp-date {
  font-size: 22rpx;
  color: var(--color-text-hint);
  display: block;
}

.wp-value {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--color-text-primary);
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

.side-options, .quality-options {
  display: flex;
  gap: 16rpx;
}

.side-item, .quality-item {
  padding: 12rpx 24rpx;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  font-size: 26rpx;
  color: var(--color-text-secondary);
}

.side-item.active, .quality-item.active {
  background: #FFF5F3;
  color: #E8A598;
  border: 2rpx solid #E8A598;
}
</style>
