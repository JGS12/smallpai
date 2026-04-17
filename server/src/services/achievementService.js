'use strict'

const { query } = require('../utils/db')

/**
 * 检查并授予成就
 */
const checkAndGrantAchievements = async ({ userId }) => {
  const granted = []

  // 1. 连续打卡7天 - 心情打卡
  const moods = await query(
    'SELECT record_date FROM mood_records WHERE user_id = ? ORDER BY record_date DESC LIMIT 7',
    [userId]
  )
  if (moods.length >= 7) {
    // 检查是否连续
    let consecutive = true
    for (let i = 0; i < moods.length - 1; i++) {
      const d1 = new Date(moods[i].record_date)
      const d2 = new Date(moods[i + 1].record_date)
      if ((d1 - d2) / (1000 * 60 * 60 * 24) !== 1) {
        consecutive = false
        break
      }
    }
    if (consecutive) {
      await grantBadge({ userId, key: 'streak_7', name: '坚持不懈', icon: '🔥' })
      granted.push({ key: 'streak_7', name: '坚持不懈', icon: '🔥' })
    }
  }

  // 2. 记录10次哺乳 - 妈妈
  const feedingCount = await query('SELECT COUNT(*) as cnt FROM feeding_records WHERE user_id = ?', [userId])
  if (feedingCount[0].cnt >= 10) {
    await grantBadge({ userId, key: 'feeding_10', name: '超级奶妈', icon: '🍼' })
    granted.push({ key: 'feeding_10', name: '超级奶妈', icon: '🍼' })
  }

  // 3. 写5篇日记
  const diaryCount = await query('SELECT COUNT(*) as cnt FROM diary_entries WHERE user_id = ?', [userId])
  if (diaryCount[0].cnt >= 5) {
    await grantBadge({ userId, key: 'diary_5', name: '记录达人', icon: '📝' })
    granted.push({ key: 'diary_5', name: '记录达人', icon: '📝' })
  }

  // 4. 接单10次 - 家人
  const orderCount = await query('SELECT COUNT(*) as cnt FROM orders WHERE accepted_by = ? AND status = ?', [userId, 'done'])
  if (orderCount[0].cnt >= 10) {
    await grantBadge({ userId, key: 'chef_10', name: '超级大厨', icon: '👨‍🍳' })
    granted.push({ key: 'chef_10', name: '超级大厨', icon: '👨‍🍳' })
  }

  // 5. 留言20条
  const msgCount = await query('SELECT COUNT(*) as cnt FROM messages WHERE from_user_id = ?', [userId])
  if (msgCount[0].cnt >= 20) {
    await grantBadge({ userId, key: 'msg_20', name: '暖心大使', icon: '💬' })
    granted.push({ key: 'msg_20', name: '暖心大使', icon: '💬' })
  }

  return { granted }
}

/**
 * 授予徽章
 */
const grantBadge = async ({ userId, key, name, icon }) => {
  const existing = await query('SELECT id FROM achievements WHERE user_id = ? AND badge_key = ?', [userId, key])
  if (existing.length === 0) {
    await query(
      'INSERT INTO achievements (user_id, badge_key, badge_name, badge_icon) VALUES (?, ?, ?, ?)',
      [userId, key, name, icon]
    )
  }
}

/**
 * 获取用户成就
 */
const getUserAchievements = async ({ userId }) => {
  const items = await query('SELECT * FROM achievements WHERE user_id = ? ORDER BY earned_at DESC', [userId])
  return { items }
}

/**
 * 获取排行榜
 */
const getLeaderboard = async () => {
  const [cooks, messagers, feeders] = await Promise.all([
    query(`SELECT u.id, u.username, u.nickname, COUNT(*) as count
      FROM orders o JOIN users u ON o.accepted_by = u.id
      WHERE o.status = 'done' GROUP BY u.id ORDER BY count DESC LIMIT 5`),
    query(`SELECT u.id, u.username, u.nickname, COUNT(*) as count
      FROM messages m JOIN users u ON m.from_user_id = u.id
      GROUP BY u.id ORDER BY count DESC LIMIT 5`),
    query(`SELECT u.id, u.username, u.nickname, COUNT(*) as count
      FROM feeding_records f JOIN users u ON f.user_id = u.id
      GROUP BY u.id ORDER BY count DESC LIMIT 5`)
  ])
  return { cooks, messagers, feeders }
}

module.exports = {
  checkAndGrantAchievements,
  grantBadge,
  getUserAchievements,
  getLeaderboard
}
