'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { query } = require('../utils/db')

const JWT_SECRET = process.env.JWT_SECRET || 'paipai-mini-secret-key'

/**
 * 用户注册
 */
const register = async ({ username, password, invitationCode }) => {
    if (!username || !password) {
        throw new Error('用户名和密码不能为空')
    }

    if (username.length < 2 || username.length > 50) {
        throw new Error('用户名长度需在2-50个字符之间')
    }

    if (password.length < 6) {
        throw new Error('密码长度不能少于6位')
    }

    // 检查用户名是否已存在
    const existing = await query('SELECT id FROM users WHERE username = ?', [username])
    if (existing.length > 0) {
        throw new Error('用户名已存在')
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 插入用户
    const result = await query(
        'INSERT INTO users (username, password, role, invitation_code, created_at) VALUES (?, ?, ?, ?, NOW())',
        [username, hashedPassword, 'member', invitationCode || null]
    )

    // 生成 JWT token
    const token = jwt.sign(
        { id: result.insertId, username },
        JWT_SECRET,
        { expiresIn: '7d' }
    )

    return {
        id: result.insertId,
        username,
        role: 'member',
        token
    }
}

/**
 * 用户登录
 */
const login = async ({ username, password }) => {
    if (!username || !password) {
        throw new Error('用户名和密码不能为空')
    }

    // 查找用户
    const users = await query('SELECT * FROM users WHERE username = ?', [username])
    if (users.length === 0) {
        throw new Error('用户不存在')
    }

    const user = users[0]

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('密码错误')
    }

    // 生成 JWT token
    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
    )

    return {
        id: user.id,
        username: user.username,
        role: user.role,
        token
    }
}

module.exports = {
    register,
    login
}
