'use strict'

const { query } = require('../utils/db')

/**
 * 发送留言
 */
const addMessage = async ({ fromUserId, content }) => {
  if (!content) throw new Error('留言内容不能为空')
  const result = await query(
    'INSERT INTO messages (from_user_id, content) VALUES (?, ?)',
    [fromUserId, content]
  )
  return { id: result.insertId }
}

/**
 * 获取留言列表
 */
const getMessages = async ({ page, pageSize }) => {
  page = page || 1
  pageSize = pageSize || 20
  const offset = (page - 1) * pageSize
  const [items, countResult] = await Promise.all([
    query(`SELECT m.*, u.username, u.nickname, u.avatar
      FROM messages m
      LEFT JOIN users u ON m.from_user_id = u.id
      ORDER BY m.created_at DESC LIMIT ? OFFSET ?`, [pageSize, offset]),
    query('SELECT COUNT(*) as total FROM messages')
  ])
  return { items, total: countResult[0].total, page, pageSize }
}

module.exports = { addMessage, getMessages }
