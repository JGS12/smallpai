<script setup>
import { ref, onMounted } from 'vue'
import { getMessages, sendMessage, getAchievements, getLeaderboard, getLetters, sendLetter } from '@/api'

const activeTab = ref('messages')
const tabs = [
  { key: 'messages', label: '💬 留言板' },
  { key: 'achievements', label: '🏅 成就' },
  { key: 'leaderboard', label: '🏆 排行榜' },
  { key: 'letters', label: '💌 未来信' }
]

// 留言板
const messages = ref([])
const newMessage = ref('')
const msgPage = ref(1)

const fetchMessages = async (reset = false) => {
  try {
    if (reset) {
      msgPage.value = 1
      messages.value = []
    }
    const res = await getMessages(msgPage.value, 20)
    messages.value = reset ? (res.items || []) : [...messages.value, ...(res.items || [])]
  } catch (e) { console.error(e) }
}

const handleSendMessage = async () => {
  if (!newMessage.value.trim()) {
    uni.showToast({ title: '请输入留言内容', icon: 'none' })
    return
  }
  try {
    await sendMessage(newMessage.value)
    newMessage.value = ''
    uni.showToast({ title: '留言成功！', icon: 'success' })
    fetchMessages(true)
  } catch (e) { console.error(e) }
}

const loadMoreMessages = () => {
  msgPage.value++
  fetchMessages()
}

// 成就
const achievements = ref([])
const fetchAchievements = async () => {
  try {
    const res = await getAchievements()
    achievements.value = res.items || []
  } catch (e) { console.error(e) }
}

// 排行榜
const leaderboard = ref({ cooks: [], messagers: [], feeders: [] })
const fetchLeaderboard = async () => {
  try {
    const res = await getLeaderboard()
    leaderboard.value = res || { cooks: [], messagers: [], feeders: [] }
  } catch (e) { console.error(e) }
}

// 未来信
const letters = ref([])
const showLetterForm = ref(false)
const letterForm = ref({
  title: '',
  content: '',
  unlockDate: ''
})

const fetchLetters = async () => {
  try {
    const res = await getLetters()
    letters.value = res.items || []
  } catch (e) { console.error(e) }
}

const submitLetter = async () => {
  if (!letterForm.value.title || !letterForm.value.content || !letterForm.value.unlockDate) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  try {
    await sendLetter(letterForm.value)
    uni.showToast({ title: '信件已保存！', icon: 'success' })
    showLetterForm.value = false
    letterForm.value = { title: '', content: '', unlockDate: '' }
    fetchLetters()
  } catch (e) { console.error(e) }
}

onMounted(() => {
  fetchMessages()
  fetchAchievements()
  fetchLeaderboard()
  fetchLetters()
})
</script>

<template>
  <view class="page-container">
    <!-- Tab -->
    <scroll-view scroll-x class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </view>
    </scroll-view>

    <!-- 留言板 -->
    <view v-if="activeTab === 'messages'" class="tab-content">
      <!-- 发送框 -->
      <view class="send-box">
        <u-input v-model="newMessage" placeholder="给妈妈说句暖心的话..." :customStyle="{ flex: 1 }" />
        <view class="send-btn" @click="handleSendMessage">发送</view>
      </view>

      <!-- 消息列表 -->
      <view class="message-list">
        <view v-for="msg in messages" :key="msg.id" class="message-item">
          <view class="msg-header">
            <view class="msg-avatar">{{ (msg.nickname || msg.username || '家')[0] }}</view>
            <text class="msg-name">{{ msg.nickname || msg.username || '家人' }}</text>
            <text class="msg-time">{{ msg.created_at?.slice(0, 16) }}</text>
          </view>
          <text class="msg-content">{{ msg.content }}</text>
        </view>
      </view>

      <view v-if="messages.length > 0" class="load-more" @click="loadMoreMessages">
        <text>加载更多</text>
      </view>

      <view v-if="messages.length === 0" class="empty-card">
        <text>留言板还是空的，说句暖心的话吧 💬</text>
      </view>
    </view>

    <!-- 成就 -->
    <view v-if="activeTab === 'achievements'" class="tab-content">
      <text class="section-title">🏅 我的成就</text>

      <view v-if="achievements.length > 0" class="achievement-grid">
        <view v-for="item in achievements" :key="item.id" class="achievement-card">
          <text class="achievement-icon">{{ item.badge_icon }}</text>
          <text class="achievement-name">{{ item.badge_name }}</text>
          <text class="achievement-date">{{ item.earned_at?.slice(0, 10) }}</text>
        </view>
      </view>

      <view v-if="achievements.length === 0" class="empty-card">
        <text>还没有成就，多互动就能解锁哦 🏅</text>
      </view>

      <!-- 待解锁成就 -->
      <text class="section-title" style="margin-top: 30rpx;">🔒 待解锁</text>
      <view class="achievement-grid">
        <view class="achievement-card locked">
          <text class="achievement-icon">🔥</text>
          <text class="achievement-name">坚持不懈</text>
          <text class="achievement-desc">连续打卡7天</text>
        </view>
        <view class="achievement-card locked">
          <text class="achievement-icon">🍼</text>
          <text class="achievement-name">超级奶妈</text>
          <text class="achievement-desc">记录10次哺乳</text>
        </view>
        <view class="achievement-card locked">
          <text class="achievement-icon">📝</text>
          <text class="achievement-name">记录达人</text>
          <text class="achievement-desc">写5篇日记</text>
        </view>
        <view class="achievement-card locked">
          <text class="achievement-icon">👨‍🍳</text>
          <text class="achievement-name">超级大厨</text>
          <text class="achievement-desc">完成10次送餐</text>
        </view>
        <view class="achievement-card locked">
          <text class="achievement-icon">💬</text>
          <text class="achievement-name">暖心大使</text>
          <text class="achievement-desc">发送20条留言</text>
        </view>
      </view>
    </view>

    <!-- 排行榜 -->
    <view v-if="activeTab === 'leaderboard'" class="tab-content">
      <text class="section-title">🏆 排行榜</text>

      <view class="board-section">
        <text class="board-title">👨‍🍳 超级大厨（送餐最多）</text>
        <view v-if="leaderboard.cooks.length > 0">
          <view v-for="(user, i) in leaderboard.cooks" :key="i" class="board-item">
            <text class="board-rank">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) }}</text>
            <text class="board-name">{{ user.nickname || user.username }}</text>
            <text class="board-count">{{ user.count }} 次</text>
          </view>
        </view>
        <view v-else class="board-empty">暂无数据</view>
      </view>

      <view class="board-section">
        <text class="board-title">💬 暖心大使（留言最多）</text>
        <view v-if="leaderboard.messagers.length > 0">
          <view v-for="(user, i) in leaderboard.messagers" :key="i" class="board-item">
            <text class="board-rank">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) }}</text>
            <text class="board-name">{{ user.nickname || user.username }}</text>
            <text class="board-count">{{ user.count }} 条</text>
          </view>
        </view>
        <view v-else class="board-empty">暂无数据</view>
      </view>

      <view class="board-section">
        <text class="board-title">🍼 哺乳记录（妈妈专属）</text>
        <view v-if="leaderboard.feeders.length > 0">
          <view v-for="(user, i) in leaderboard.feeders" :key="i" class="board-item">
            <text class="board-rank">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) }}</text>
            <text class="board-name">{{ user.nickname || user.username }}</text>
            <text class="board-count">{{ user.count }} 次</text>
          </view>
        </view>
        <view v-else class="board-empty">暂无数据</view>
      </view>
    </view>

    <!-- 未来信 -->
    <view v-if="activeTab === 'letters'" class="tab-content">
      <view class="add-bar">
        <text class="section-title">💌 给未来的信</text>
        <view class="add-btn" @click="showLetterForm = true">
          <u-icon name="plus" color="#E8A598" size="16"></u-icon>
          <text>写信</text>
        </view>
      </view>

      <view v-for="letter in letters" :key="letter.id" class="letter-card">
        <view class="letter-header">
          <text class="letter-icon">{{ letter.is_unlocked ? '📬' : '📪' }}</text>
          <text class="letter-title">{{ letter.title }}</text>
        </view>
        <text class="letter-unlock">{{ letter.is_unlocked ? '已解锁' : `解锁日期：${letter.unlock_date}` }}</text>
        <text v-if="letter.is_unlocked" class="letter-content">{{ letter.content }}</text>
        <text v-else class="letter-locked">内容在解锁日期后可见 🔒</text>
      </view>

      <view v-if="letters.length === 0" class="empty-card">
        <text>写一封信给未来的自己或宝宝吧 💌</text>
      </view>
    </view>

    <!-- 写信弹窗 -->
    <u-popup :show="showLetterForm" mode="bottom" round="20" @close="showLetterForm = false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">写信给未来</text>
          <u-icon name="close" @click="showLetterForm = false"></u-icon>
        </view>
        <view class="form-group">
          <text class="form-label">标题</text>
          <u-input v-model="letterForm.title" placeholder="如：给宝宝的一封信" />
        </view>
        <view class="form-group">
          <text class="form-label">内容</text>
          <u-input v-model="letterForm.content" type="textarea" placeholder="写下你想说的话..." />
        </view>
        <view class="form-group">
          <text class="form-label">解锁日期</text>
          <u-input v-model="letterForm.unlockDate" placeholder="如：2027-04-17（宝宝1岁生日）" />
        </view>
        <u-button type="primary" @click="submitLetter" :customStyle="{ backgroundColor: '#E8A598', borderColor: '#E8A598' }">
          保存信件
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
  padding: 14rpx 24rpx;
  font-size: 24rpx;
  color: var(--color-text-secondary);
  background: #FFFFFF;
  border-radius: 100rpx;
  margin-right: 12rpx;
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
  display: block;
  margin-bottom: 20rpx;
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

/* 留言板 */
.send-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 16rpx 20rpx;
  margin-bottom: 24rpx;
  box-shadow: var(--shadow-card);
}

.send-btn {
  padding: 12rpx 28rpx;
  background: #E8A598;
  color: #FFFFFF;
  border-radius: 100rpx;
  font-size: 26rpx;
}

.message-item {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: var(--shadow-card);
}

.msg-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.msg-avatar {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, #E8A598, #F2DFC8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #FFFFFF;
}

.msg-name {
  font-size: 26rpx;
  font-weight: 500;
  color: var(--color-text-primary);
  flex: 1;
}

.msg-time {
  font-size: 22rpx;
  color: var(--color-text-hint);
}

.msg-content {
  font-size: 28rpx;
  color: var(--color-text-primary);
  line-height: 1.5;
}

.load-more {
  text-align: center;
  padding: 24rpx;
  font-size: 26rpx;
  color: var(--color-text-hint);
}

/* 成就 */
.achievement-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.achievement-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 24rpx 16rpx;
  text-align: center;
  box-shadow: var(--shadow-card);
}

.achievement-card.locked {
  opacity: 0.5;
}

.achievement-icon {
  font-size: 48rpx;
  display: block;
  margin-bottom: 8rpx;
}

.achievement-name {
  font-size: 24rpx;
  color: var(--color-text-primary);
  display: block;
  font-weight: 500;
}

.achievement-desc {
  font-size: 20rpx;
  color: var(--color-text-hint);
  display: block;
  margin-top: 4rpx;
}

.achievement-date {
  font-size: 20rpx;
  color: var(--color-text-hint);
  display: block;
  margin-top: 4rpx;
}

/* 排行榜 */
.board-section {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: var(--shadow-card);
}

.board-title {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 16rpx;
}

.board-item {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx dashed var(--color-border);
}

.board-item:last-child {
  border-bottom: none;
}

.board-rank {
  width: 48rpx;
  font-size: 28rpx;
  text-align: center;
}

.board-name {
  flex: 1;
  font-size: 26rpx;
  color: var(--color-text-primary);
}

.board-count {
  font-size: 26rpx;
  color: var(--color-primary);
  font-weight: 500;
}

.board-empty {
  font-size: 24rpx;
  color: var(--color-text-hint);
  text-align: center;
  padding: 20rpx;
}

/* 未来信 */
.letter-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: var(--shadow-card);
  border-left: 6rpx solid #E8A598;
}

.letter-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.letter-icon {
  font-size: 32rpx;
}

.letter-title {
  font-size: 30rpx;
  font-weight: 500;
  color: var(--color-text-primary);
}

.letter-unlock {
  font-size: 22rpx;
  color: var(--color-text-hint);
  display: block;
  margin-bottom: 12rpx;
}

.letter-content {
  font-size: 28rpx;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.letter-locked {
  font-size: 26rpx;
  color: var(--color-text-hint);
  font-style: italic;
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
</style>
