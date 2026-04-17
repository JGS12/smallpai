import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: uni.getStorageSync('userInfo') || null,
        token: uni.getStorageSync('token') || ''
    }),
    getters: {
        isLogin: (state) => !!state.token,
        // 角色相关 getter
        userRole: (state) => state.userInfo?.role || 'family',
        isMom: (state) => state.userInfo?.role === 'mom',
        isFamily: (state) => state.userInfo?.role === 'family',
        isAdmin: (state) => state.userInfo?.role === 'admin',
        // 权限判断
        canOrder: (state) => state.userInfo?.role === 'mom',
        canWish: (state) => state.userInfo?.role === 'mom',
        canAcceptOrder: (state) => state.userInfo?.role === 'family' || state.userInfo?.role === 'admin',
        canManage: (state) => state.userInfo?.role === 'admin'
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
