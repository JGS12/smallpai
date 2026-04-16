import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: uni.getStorageSync('userInfo') || null,
        token: uni.getStorageSync('token') || ''
    }),
    getters: {
        isLogin: (state) => !!state.token
    },
    actions: {
        setLoginInfo({ userInfo, token }) {
            this.userInfo = userInfo
            this.token = token
            uni.setStorageSync('userInfo', userInfo)
            uni.setStorageSync('token', token)
        },
        logout() {
            this.userInfo = null
            this.token = ''
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('token')
        }
    }
})
