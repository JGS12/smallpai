'use strict'

/**
 * 统一成功响应
 */
const success = (data = null, message = '成功') => ({
    code: 0,
    message,
    data
})

/**
 * 统一失败响应
 */
const fail = (message = '请求失败', code = 1) => ({
    code,
    message,
    data: null
})

module.exports = { success, fail }
