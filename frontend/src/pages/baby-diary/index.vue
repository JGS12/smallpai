<script setup>
import { ref, onMounted } from 'vue'
import { getMilestones, createMilestone, getPhotos, uploadPhoto, getDiaries, createDiary } from '@/api'

const activeTab = ref('milestones')
const tabs = [
  { key: 'milestones', label: '⭐ 里程碑' },
  { key: 'photos', label: '📷 照片墙' },
  { key: 'diary', label: '📔 日记' }
]

// 里程碑
const milestones = ref([])
const showMilestoneForm = ref(false)
const milestoneForm = ref({
  title: '',
  content: '',
  milestoneDate: new Date().toISOString().split('T')[0],
  icon: '⭐'
})
const iconOptions = ['⭐', '👶', '🍼', '😴', '😊', '🦶', '👋', '🎉', '💪', '❤️']

const fetchMilestones = async () => {
  try {
    const res = await getMilestones()
    milestones.value = res.items || []
  } catch (e) { console.error(e) }
}

const submitMilestone = async () => {
  if (!milestoneForm.value.title || !milestoneForm.value.milestoneDate) {
    uni.showToast({ title: '请填写标题和日期', icon: 'none' })
    return
  }
  try {
    await createMilestone(milestoneForm.value)
    uni.showToast({ title: '记录成功！', icon: 'success' })
    showMilestoneForm.value = false
    milestoneForm.value = { title: '', content: '', milestoneDate: new Date().toISOString().split('T')[0], icon: '⭐' }
    fetchMilestones()
  } catch (e) { console.error(e) }
}

// 照片墙
const photos = ref([])
const showPhotoForm = ref(false)
const photoForm = ref({
  photoUrl: '',
  caption: '',
  photoDate: new Date().toISOString().split('T')[0]
})

const fetchPhotos = async () => {
  try {
    const res = await getPhotos()
    photos.value = res.items || []
  } catch (e) { console.error(e) }
}

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      photoForm.value.photoUrl = res.tempFilePaths[0]
    }
  })
}

const submitPhoto = async () => {
  if (!photoForm.value.photoUrl) {
    uni.showToast({ title: '请选择照片', icon: 'none' })
    return
  }
  // 简化：直接用本地路径（实际项目需要上传到服务器）
  try {
    await uploadPhoto(photoForm.value)
    uni.showToast({ title: '添加成功！', icon: 'success' })
    showPhotoForm.value = false
    photoForm.value = { photoUrl: '', caption: '', photoDate: new Date().toISOString().split('T')[0] }
    fetchPhotos()
  } catch (e) { console.error(e) }
}

// 日记
const diaries = ref([])
const showDiaryForm = ref(false)
const diaryForm = ref({
  title: '',
  content: '',
  mood: '',
  entryDate: new Date().toISOString().split('T')[0]
})

const fetchDiaries = async () => {
  try {
    const res = await getDiaries()
    diaries.value = res.items || []
  } catch (e) { console.error(e) }
}

const submitDiary = async () => {
  if (!diaryForm.value.content) {
    uni.showToast({ title: '请写点什么吧', icon: 'none' })
    return
  }
  try {
    await createDiary(diaryForm.value)
    uni.showToast({ title: '保存成功！', icon: 'success' })
    showDiaryForm.value = false
    diaryForm.value = { title: '', content: '', mood: '', entryDate: new Date().toISOString().split('T')[0] }
    fetchDiaries()
  } catch (e) { console.error(e) }
}

onMounted(() => {
  fetchMilestones()
  fetchPhotos()
  fetchDiaries()
})
</script>

<template>
  <view class="page-container">
    <!-- Tab -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 里程碑 -->
    <view v-if="activeTab === 'milestones'" class="tab-content">
      <view class="add-bar">
        <text class="section-title">成长里程碑</text>
        <view class="add-btn" @click="showMilestoneForm = true">
          <u-icon name="plus" color="#E8A598" size="16"></u-icon>
          <text>记录</text>
        </view>
      </view>

      <view class="timeline">
        <view v-for="item in milestones" :key="item.id" class="timeline-item">
          <view class="timeline-dot">{{ item.icon }}</view>
          <view class="timeline-content">
            <text class="timeline-date">{{ item.milestone_date }}</text>
            <text class="timeline-title">{{ item.title }}</text>
            <text v-if="item.content" class="timeline-desc">{{ item.content }}</text>
            <text class="timeline-user">{{ item.nickname || item.username }} 记录</text>
          </view>
        </view>
      </view>

      <view v-if="milestones.length === 0" class="empty-card">
        <text>还没有里程碑记录，记录宝宝的每一个第一次吧 ⭐</text>
      </view>
    </view>

    <!-- 照片墙 -->
    <view v-if="activeTab === 'photos'" class="tab-content">
      <view class="add-bar">
        <text class="section-title">照片墙</text>
        <view class="add-btn" @click="showPhotoForm = true">
          <u-icon name="plus" color="#E8A598" size="16"></u-icon>
          <text>添加</text>
        </view>
      </view>

      <view class="photo-grid">
        <view v-for="item in photos" :key="item.id" class="photo-card">
          <view class="photo-placeholder">
            <text class="photo-icon">📷</text>
          </view>
          <text class="photo-caption">{{ item.caption || '宝宝照片' }}</text>
          <text class="photo-date">{{ item.photo_date }}</text>
        </view>
      </view>

      <view v-if="photos.length === 0" class="empty-card">
        <text>照片墙还是空的，快来记录宝宝的成长瞬间 📷</text>
      </view>
    </view>

    <!-- 日记 -->
    <view v-if="activeTab === 'diary'" class="tab-content">
      <view class="add-bar">
        <text class="section-title">成长日记</text>
        <view class="add-btn" @click="showDiaryForm = true">
          <u-icon name="plus" color="#E8A598" size="16"></u-icon>
          <text>写日记</text>
        </view>
      </view>

      <view v-for="item in diaries" :key="item.id" class="diary-card">
        <view class="diary-header">
          <text class="diary-date">{{ item.entry_date }}</text>
          <text v-if="item.mood" class="diary-mood">{{ item.mood }}</text>
        </view>
        <text v-if="item.title" class="diary-title">{{ item.title }}</text>
        <text class="diary-content">{{ item.content }}</text>
        <text class="diary-author">{{ item.nickname || item.username }}</text>
      </view>

      <view v-if="diaries.length === 0" class="empty-card">
        <text>还没有日记，写点什么记录今天吧 📔</text>
      </view>
    </view>

    <!-- 里程碑弹窗 -->
    <u-popup :show="showMilestoneForm" mode="bottom" round="20" @close="showMilestoneForm = false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">记录里程碑</text>
          <u-icon name="close" @click="showMilestoneForm = false"></u-icon>
        </view>
        <view class="form-group">
          <text class="form-label">选择图标</text>
          <view class="icon-grid">
            <view v-for="icon in iconOptions" :key="icon" class="icon-item" :class="{ active: milestoneForm.icon === icon }" @click="milestoneForm.icon = icon">
              {{ icon }}
            </view>
          </view>
        </view>
        <view class="form-group">
          <text class="form-label">标题</text>
          <u-input v-model="milestoneForm.title" placeholder="如：第一次笑" />
        </view>
        <view class="form-group">
          <text class="form-label">描述（可选）</text>
          <u-input v-model="milestoneForm.content" type="textarea" placeholder="记录详情..." />
        </view>
        <view class="form-group">
          <text class="form-label">日期</text>
          <u-input v-model="milestoneForm.milestoneDate" />
        </view>
        <u-button type="primary" @click="submitMilestone" :customStyle="{ backgroundColor: '#E8A598', borderColor: '#E8A598' }">
          保存
        </u-button>
      </view>
    </u-popup>

    <!-- 照片弹窗 -->
    <u-popup :show="showPhotoForm" mode="bottom" round="20" @close="showPhotoForm = false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">添加照片</text>
          <u-icon name="close" @click="showPhotoForm = false"></u-icon>
        </view>
        <view class="form-group">
          <view class="photo-upload" @click="chooseImage">
            <text v-if="!photoForm.photoUrl">📷 点击选择照片</text>
            <text v-else>✅ 已选择照片</text>
          </view>
        </view>
        <view class="form-group">
          <text class="form-label">描述</text>
          <u-input v-model="photoForm.caption" placeholder="记录一下..." />
        </view>
        <view class="form-group">
          <text class="form-label">日期</text>
          <u-input v-model="photoForm.photoDate" />
        </view>
        <u-button type="primary" @click="submitPhoto" :customStyle="{ backgroundColor: '#E8A598', borderColor: '#E8A598' }">
          保存
        </u-button>
      </view>
    </u-popup>

    <!-- 日记弹窗 -->
    <u-popup :show="showDiaryForm" mode="bottom" round="20" @close="showDiaryForm = false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">写日记</text>
          <u-icon name="close" @click="showDiaryForm = false"></u-icon>
        </view>
        <view class="form-group">
          <text class="form-label">标题（可选）</text>
          <u-input v-model="diaryForm.title" placeholder="今天的标题..." />
        </view>
        <view class="form-group">
          <text class="form-label">内容</text>
          <u-input v-model="diaryForm.content" type="textarea" placeholder="今天发生了什么..." />
        </view>
        <view class="form-group">
          <text class="form-label">日期</text>
          <u-input v-model="diaryForm.entryDate" />
        </view>
        <u-button type="primary" @click="submitDiary" :customStyle="{ backgroundColor: '#E8A598', borderColor: '#E8A598' }">
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
  gap: 16rpx;
  margin-bottom: 30rpx;
}

.tab-item {
  padding: 14rpx 28rpx;
  font-size: 26rpx;
  color: var(--color-text-secondary);
  background: #FFFFFF;
  border-radius: 100rpx;
  box-shadow: var(--shadow-card);
}

.tab-item.active {
  background: #E8A598;
  color: #FFFFFF;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: var(--color-text-primary);
}

.add-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
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
  padding: 60rpx 40rpx;
  text-align: center;
  box-shadow: var(--shadow-card);
}

.empty-card text {
  font-size: 26rpx;
  color: var(--color-text-hint);
}

/* 时间线 */
.timeline {
  padding-left: 40rpx;
}

.timeline-item {
  position: relative;
  padding-left: 40rpx;
  padding-bottom: 40rpx;
  border-left: 2rpx solid var(--color-border);
}

.timeline-item:last-child {
  border-left: 2rpx solid transparent;
}

.timeline-dot {
  position: absolute;
  left: -24rpx;
  top: 0;
  width: 48rpx;
  height: 48rpx;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  box-shadow: var(--shadow-card);
}

.timeline-content {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 24rpx;
  box-shadow: var(--shadow-card);
}

.timeline-date {
  font-size: 22rpx;
  color: var(--color-text-hint);
  display: block;
  margin-bottom: 8rpx;
}

.timeline-title {
  font-size: 30rpx;
  font-weight: 500;
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 8rpx;
}

.timeline-desc {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  display: block;
  margin-bottom: 8rpx;
}

.timeline-user {
  font-size: 22rpx;
  color: var(--color-text-hint);
}

/* 照片墙 */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.photo-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.photo-placeholder {
  height: 240rpx;
  background: linear-gradient(135deg, #FFF5F3, #F2DFC8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-icon {
  font-size: 60rpx;
}

.photo-caption {
  padding: 12rpx 16rpx 4rpx;
  font-size: 26rpx;
  color: var(--color-text-primary);
  display: block;
}

.photo-date {
  padding: 0 16rpx 12rpx;
  font-size: 22rpx;
  color: var(--color-text-hint);
  display: block;
}

/* 日记 */
.diary-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: var(--shadow-card);
}

.diary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.diary-date {
  font-size: 22rpx;
  color: var(--color-text-hint);
}

.diary-title {
  font-size: 30rpx;
  font-weight: 500;
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 12rpx;
}

.diary-content {
  font-size: 28rpx;
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: block;
  margin-bottom: 12rpx;
}

.diary-author {
  font-size: 22rpx;
  color: var(--color-text-hint);
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

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.icon-item {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  background: var(--color-bg);
  border-radius: var(--radius-md);
}

.icon-item.active {
  background: #FFF5F3;
  border: 2rpx solid #E8A598;
}

.photo-upload {
  height: 200rpx;
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  border: 2rpx dashed var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: var(--color-text-hint);
}
</style>
