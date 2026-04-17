'use strict'

const { query } = require('../utils/db')

/**
 * 写信给未来
 */
const createLetter = async ({ userId, title, content, unlockDate }) => {
  if (!title || !content || !unlockDate) throw new Error('标题、内容和解锁日期不能为空')
  const result = await query(
    'INSERT INTO future_letters (user_id, title, content, unlock_date) VALUES (?, ?, ?, ?)',
    [userId, title, content, unlockDate]
  )
  return { id: result.insertId }
}

/**
 * 获取信件列表
 */
const getLetters = async ({ userId }) => {
  const items = await query(
    `SELECT id, user_id, title, unlock_date, is_unlocked, created_at,
      CASE WHEN unlock_date <= CURDATE() THEN content ELSE NULL END as content
    FROM future_letters
    WHERE user_id = ?
    ORDER BY unlock_date ASC`,
    [userId]
  )
  return { items }
}

/**
 * 检查并解锁到期信件
 */
const unlockExpiredLetters = async () => {
  await query(
    'UPDATE future_letters SET is_unlocked = 1 WHERE unlock_date <= CURDATE() AND is_unlocked = 0'
  )
  return { success: true }
}

module.exports = { createLetter, getLetters, unlockExpiredLetters }
