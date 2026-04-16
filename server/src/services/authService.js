'use strict'

const db = require('../utils/db')
const crypto = require('crypto')

/**
 * 简单的 md5 加密
 * @param {string} password 
 */
const hashPassword = (password) => {
    return crypto.createHash('md5').update(password + 'paipai-mini-salt').digest('hex')
}

/**
 * 注册用户
 */
const register = async ({ username, password, invitationCode }) => {
    // 1. 检查邀请码
    const codes = await db.query('SELECT * FROM invitation_codes WHERE code = ? AND is_used = 0', [invitationCode])
    if (codes.length === 0) {
        throw new Error('无效或已被使用的邀请码')
    }
    const codeId = codes[0].id

    // 2. 检查用户名
    const users = await db.query('SELECT * FROM users WHERE username = ?', [username])
    if (users.length > 0) {
        throw new Error('用户名已存在')
    }

    // 3. 创建用户
    const hashed = hashPassword(password)
    const result = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed])
    const userId = result.insertId

    // 4. 标记邀请码已使用
    await db.query('UPDATE invitation_codes SET is_used = 1, used_by_id = ? WHERE id = ?', [userId, codeId])

    return { id: userId, username }
}

/**
 * 登录
 */
const login = async ({ username, password }) => {
    const hashed = hashPassword(password)
    const users = await db.query('SELECT id, username, role FROM users WHERE username = ? AND password = ?', [username, hashed])

    if (users.length === 0) {
        throw new Error('用户名或密码错误')
    }

    return users[0]
}

module.exports = {
    register,
    login
}
