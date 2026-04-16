'use strict'

const authService = require('../services/authService')

/**
 * 注册
 */
const register = async (ctx) => {
    const { username, password, invitationCode } = ctx.request.body
    if (!username || !password || !invitationCode) {
        ctx.body = { code: 1, message: '请填写全部必填项' }
        return
    }

    try {
        const user = await authService.register({ username, password, invitationCode })
        ctx.body = { code: 0, message: '注册成功', data: user }
    } catch (err) {
        ctx.body = { code: 1, message: err.message }
    }
}

/**
 * 登录
 */
const login = async (ctx) => {
    const { username, password } = ctx.request.body
    if (!username || !password) {
        ctx.body = { code: 1, message: '请输入用户名和密码' }
        return
    }

    try {
        const user = await authService.login({ username, password })
        ctx.body = { code: 0, message: '登录成功', data: user }
    } catch (err) {
        ctx.body = { code: 1, message: err.message }
    }
}

module.exports = {
    register,
    login
}
