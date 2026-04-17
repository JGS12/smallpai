<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { request } from '@/utils/request'

const userStore = useUserStore()
const isRegister = ref(false)
const loading = ref(false)

const form = ref({
  username: '',
  password: '',
  invitationCode: '',
  role: 'family' // 默认角色为家人
})

// 角色选项
const roleOptions = [
  { value: 'mom', label: '孕妇/妈妈', icon: '🤰', desc: '可以点餐、发心愿、记录生活' },
  { value: 'family', label: '家人', icon: '👨‍👩‍👧', desc: '查看信息、接单做饭、留言互动' }
]

const selectedRole = ref('family')

const toggleMode = () => {
  isRegister.value = !isRegister.value
}

const selectRole = (role) => {
  selectedRole.value = role
  form.value.role = role
}

const handleSubmit = async () => {
  if (!form.value.username || !form.value.password) {
    return uni.showToast({ title: '请填写完整', icon: 'none' })
  }
  if (isRegister.value && !form.value.invitationCode) {
    return uni.showToast({ title: '注册需填写邀请码', icon: 'none' })
  }

  loading.value = true
  try {
    const url = isRegister.value ? '/auth/register' : '/auth/login'
    const res = await request({
      url,
      method: 'POST',
      data: form.value
    })
    
    // 登录或注册成功后处理，res 即后端返回的 data: { id, username, role, token }
    const { token, ...userInfo } = res
    userStore.setLoginInfo({
      userInfo,
      token
    })
    
    uni.showToast({ title: isRegister.value ? '注册成功' : '欢迎回来', icon: 'success' })
    
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/index/index' })
    }, 1500)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="login-container">
    <view class="login-bg"></view>
    <view class="login-bg-circle"></view>
    
    <view class="form-card">
      <view class="header">
        <text class="title">{{ isRegister ? '加入月子小家' : '欢迎回来' }}</text>
        <text class="subtitle">{{ isRegister ? '开启一段温馨的照护时光' : '家人一直都在这里陪着你' }}</text>
      </view>

      <view class="input-group">
        <u-input v-model="form.username" placeholder="请输入用户名" prefixIcon="account" border="bottom" class="custom-input"></u-input>
        <u-input v-model="form.password" type="password" placeholder="请输入密码" prefixIcon="lock" border="bottom" class="custom-input"></u-input>
        <u-input v-if="isRegister" v-model="form.invitationCode" placeholder="请输入邀请码" prefixIcon="gift" border="bottom" class="custom-input"></u-input>
        
        <!-- 角色选择（仅注册时显示） -->
        <view v-if="isRegister" class="role-selection">
          <text class="role-title">选择你的角色</text>
          <view class="role-options">
            <view 
              v-for="option in roleOptions" 
              :key="option.value"
              class="role-option"
              :class="{ active: selectedRole === option.value }"
              @click="selectRole(option.value)"
            >
              <text class="role-icon">{{ option.icon }}</text>
              <text class="role-label">{{ option.label }}</text>
              <text class="role-desc">{{ option.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="btn-wrap">
        <u-button :text="isRegister ? '立即注册' : '登录'" @click="handleSubmit" :loading="loading" shape="circle" color="#E8A598" class="submit-btn"></u-button>
      </view>

      <view class="footer-ops">
        <text @click="toggleMode" class="toggle-link">{{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: var(--color-bg);
  overflow: hidden;
}

/* 增加更柔和的背景装饰 */
.login-bg {
  position: absolute;
  top: -100rpx;
  left: -100rpx;
  right: -100rpx;
  height: 50vh;
  background: radial-gradient(circle at 50% 0%, var(--color-accent) 0%, var(--color-bg) 100%);
  border-radius: 0 0 300rpx 300rpx;
  opacity: 0.6;
}

.login-bg-circle {
  position: absolute;
  bottom: -150rpx;
  right: -100rpx;
  width: 400rpx;
  height: 400rpx;
  background: var(--color-secondary);
  border-radius: 50%;
  opacity: 0.1;
}

.form-card {
  width: 88%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 48rpx;
  padding: 80rpx 50rpx;
  box-shadow: 0 30rpx 80rpx rgba(232, 165, 152, 0.2);
  z-index: 10;
  border: 1rpx solid rgba(255, 255, 255, 0.5);
}

.header {
  text-align: center;
  margin-bottom: 80rpx;
}

.title {
  font-size: 52rpx;
  font-weight: 600;
  color: var(--color-text-primary);
  display: block;
  letter-spacing: 2rpx;
}

.subtitle {
  font-size: 28rpx;
  color: var(--color-text-secondary);
  margin-top: 20rpx;
  display: block;
  opacity: 0.8;
}

.input-group {
  margin-bottom: 80rpx;
}

.custom-input {
  margin-bottom: 40rpx !important;
  background-color: rgba(237, 224, 216, 0.2) !important;
  border-radius: 24rpx !important;
  padding: 10rpx 20rpx !important;
}

/* 角色选择样式 */
.role-selection {
  margin-bottom: 40rpx;
}

.role-title {
  font-size: 28rpx;
  color: var(--color-text-secondary);
  margin-bottom: 20rpx;
  display: block;
  text-align: center;
}

.role-options {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.role-option {
  background-color: rgba(237, 224, 216, 0.2);
  border-radius: 24rpx;
  padding: 30rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.role-option.active {
  background-color: rgba(232, 165, 152, 0.1);
  border-color: var(--color-primary);
}

.role-icon {
  font-size: 48rpx;
  display: block;
  text-align: center;
  margin-bottom: 10rpx;
}

.role-label {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--color-text-primary);
  display: block;
  text-align: center;
  margin-bottom: 8rpx;
}

.role-desc {
  font-size: 24rpx;
  color: var(--color-text-secondary);
  display: block;
  text-align: center;
  line-height: 1.4;
}

.role-option.active .role-label {
  color: var(--color-primary);
}

.role-option.active .role-desc {
  color: var(--color-text-primary);
}

.btn-wrap {
  margin-bottom: 40rpx;
}

.submit-btn {
  height: 100rpx !important;
  font-size: 34rpx !important;
  font-weight: bold !important;
  box-shadow: 0 12rpx 30rpx rgba(232, 165, 152, 0.4) !important;
  letter-spacing: 4rpx;
}

.footer-ops {
  text-align: center;
}

.toggle-link {
  font-size: 28rpx;
  color: var(--color-text-secondary);
  padding: 20rpx;
  text-decoration: underline;
  opacity: 0.8;
}

.toggle-link:active {
  color: var(--color-primary);
}
</style>
