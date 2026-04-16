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
  invitationCode: ''
})

const toggleMode = () => {
  isRegister.value = !isRegister.value
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
    
    // 登录或注册成功后处理
    userStore.setLoginInfo({
      userInfo: res,
      token: 'mock-jwt-token-' + res.id // 第一版先用模拟 token
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
    
    <view class="form-card">
      <view class="header">
        <text class="title">{{ isRegister ? '加入月子小家' : '欢迎回来' }}</text>
        <text class="subtitle">{{ isRegister ? '开启一段温馨的照护时光' : '家人一直都在这里陪着你' }}</text>
      </view>

      <view class="input-group">
        <u-input v-model="form.username" placeholder="请输入用户名" prefixIcon="account" border="bottom" class="custom-input"></u-input>
        <u-input v-model="form.password" type="password" placeholder="请输入密码" prefixIcon="lock" border="bottom" class="custom-input"></u-input>
        <u-input v-if="isRegister" v-model="form.invitationCode" placeholder="请输入邀请码" prefixIcon="gift" border="bottom" class="custom-input"></u-input>
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
}
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40vh;
  background: linear-gradient(to bottom, var(--color-accent), var(--color-bg));
  border-radius: 0 0 100rpx 100rpx;
}
.form-card {
  width: 85%;
  background: #FFFFFF;
  border-radius: 40rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(232, 165, 152, 0.15);
  z-index: 10;
}
.header {
  text-align: center;
  margin-bottom: 60rpx;
}
.title {
  font-size: 44rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
}
.subtitle {
  font-size: 26rpx;
  color: var(--color-text-hint);
  margin-top: 16rpx;
  display: block;
}
.input-group {
  margin-bottom: 60rpx;
}
.custom-input {
  background-color: #F8F9FA !important;
  margin-bottom: 30rpx;
  padding: 20rpx 30rpx !important;
}
.btn-wrap {
  margin-bottom: 30rpx;
}
.submit-btn {
  height: 90rpx !important;
  font-size: 32rpx !important;
}
.footer-ops {
  text-align: center;
}
.toggle-link {
  font-size: 26rpx;
  color: var(--color-primary);
  padding: 20rpx;
}
</style>
