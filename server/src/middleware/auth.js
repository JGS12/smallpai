'use strict'

const jwt = require('jsonwebtoken')
const { query } = require('../utils/db')

const JWT_SECRET = process.env.JWT_SECRET || 'paipai-mini-secret-key'

/**
 * JWT 鉴权中间件
 */
const auth = async (ctx, next) => {
  const token = ctx.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    ctx.status = 401
    ctx.body = { code: 401, message: '请先登录', data: null }
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const users = await query('SELECT id, username, role FROM users WHERE id = ?', [decoded.id])
    if (users.length === 0) {
      ctx.status = 401
      ctx.body = { code: 401, message: '用户不存在', data: null }
      return
    }

    ctx.state.user = users[0]
    await next()
  } catch (err) {
    ctx.status = 401
    ctx.body = { code: 401, message: '登录已过期，请重新登录', data: null }
  }
}

/**
 * 管理员鉴权中间件
 */
const adminAuth = async (ctx, next) => {
  const token = ctx.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    ctx.status = 401
    ctx.body = { code: 401, message: '请先登录', data: null }
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const users = await query('SELECT id, username, role FROM users WHERE id = ?', [decoded.id])
    if (users.length === 0) {
      ctx.status = 401
      ctx.body = { code: 401, message: '用户不存在', data: null }
      return
    }

    if (users[0].role !== 'admin') {
      ctx.status = 403
      ctx.body = { code: 403, message: '需要管理员权限', data: null }
      return
    }

    ctx.state.user = users[0]
    await next()
  } catch (err) {
    ctx.status = 401
    ctx.body = { code: 401, message: '登录已过期，请重新登录', data: null }
  }
}

module.exports = { auth, adminAuth }
