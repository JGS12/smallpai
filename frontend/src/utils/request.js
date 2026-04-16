// 请求封装
const BASE_URL = 'http://111.231.44.183:3000/api'

/**
 * 统一请求方法
 * @param {Object} options - 请求配置
 * @param {string} options.url - 接口路径（不含 BASE_URL）
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [options.method='GET'] - 请求方法
 * @param {Object} [options.data] - 请求数据
 */
export const request = (options) => {
    const token = uni.getStorageSync('token')

    return new Promise((resolve, reject) => {
        uni.request({
            url: BASE_URL + options.url,
            method: options.method || 'GET',
            data: options.data || {},
            header: {
                'Authorization': token ? `Bearer ${token}` : '',
                ...options.header
            },
            success: (res) => {
                if (res.data.code === 0) {
                    resolve(res.data.data)
                } else if (res.data.code === 401) {
                    // Token 失效，清空并跳转
                    uni.removeStorageSync('token')
                    uni.reLaunch({ url: '/pages/login/index' })
                    reject(res.data)
                } else {
                    uni.showToast({
                        title: res.data.message || '请求失败',
                        icon: 'none'
                    })
                    reject(res.data)
                }
            },
            fail: (err) => {
                uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
                reject(err)
            }
        })
    })
}
