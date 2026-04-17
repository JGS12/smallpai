'use strict'

const { query } = require('../utils/db')

/**
 * 添加哺乳记录
 */
const addFeeding = async ({ userId, feedTime, duration, side, note }) => {
  if (!feedTime) throw new Error('喂奶时间不能为空')
  const result = await query(
    'INSERT INTO feeding_records (user_id, feed_time, duration, side, note) VALUES (?, ?, ?, ?, ?)',
    [userId, feedTime, duration || null, side || null, note || null]
  )
  return { id: result.insertId }
}

/**
 * 获取哺乳记录
 */
const getFeedings = async ({ userId, date }) => {
  let sql = 'SELECT * FROM feeding_records WHERE user_id = ?'
  const params = [userId]
  if (date) {
    sql += ' AND DATE(feed_time) = ?'
    params.push(date)
  }
  sql += ' ORDER BY feed_time DESC'
  const items = await query(sql, params)
  return { items }
}

/**
 * 添加睡眠记录
 */
const addSleep = async ({ userId, sleepStart, sleepEnd, quality, note }) => {
  if (!sleepStart) throw new Error('入睡时间不能为空')
  const result = await query(
    'INSERT INTO sleep_records (user_id, sleep_start, sleep_end, quality, note) VALUES (?, ?, ?, ?, ?)',
    [userId, sleepStart, sleepEnd || null, quality || null, note || null]
  )
  return { id: result.insertId }
}

/**
 * 获取睡眠记录
 */
const getSleepRecords = async ({ userId, date }) => {
  let sql = 'SELECT * FROM sleep_records WHERE user_id = ?'
  const params = [userId]
  if (date) {
    sql += ' AND DATE(sleep_start) = ?'
    params.push(date)
  }
  sql += ' ORDER BY sleep_start DESC'
  const items = await query(sql, params)
  return { items }
}

/**
 * 心情打卡
 */
const addMood = async ({ userId, mood, note, recordDate }) => {
  if (!mood) throw new Error('请选择心情')
  if (!recordDate) throw new Error('请选择日期')
  // 每天只能打卡一次，更新已有记录
  const existing = await query('SELECT id FROM mood_records WHERE user_id = ? AND record_date = ?', [userId, recordDate])
  if (existing.length > 0) {
    await query('UPDATE mood_records SET mood = ?, note = ? WHERE id = ?', [mood, note || null, existing[0].id])
    return { id: existing[0].id, updated: true }
  }
  const result = await query(
    'INSERT INTO mood_records (user_id, mood, note, record_date) VALUES (?, ?, ?, ?)',
    [userId, mood, note || null, recordDate]
  )
  return { id: result.insertId, updated: false }
}

/**
 * 获取心情记录
 */
const getMoods = async ({ userId, startDate, endDate }) => {
  let sql = 'SELECT * FROM mood_records WHERE user_id = ?'
  const params = [userId]
  if (startDate) {
    sql += ' AND record_date >= ?'
    params.push(startDate)
  }
  if (endDate) {
    sql += ' AND record_date <= ?'
    params.push(endDate)
  }
  sql += ' ORDER BY record_date DESC'
  const items = await query(sql, params)
  return { items }
}

/**
 * 添加体重记录
 */
const addWeight = async ({ userId, weight, recordDate, note }) => {
  if (!weight) throw new Error('请输入体重')
  if (!recordDate) throw new Error('请选择日期')
  const result = await query(
    'INSERT INTO weight_records (user_id, weight, record_date, note) VALUES (?, ?, ?, ?)',
    [userId, weight, recordDate, note || null]
  )
  return { id: result.insertId }
}

/**
 * 获取体重记录
 */
const getWeights = async ({ userId, limit }) => {
  const items = await query(
    'SELECT * FROM weight_records WHERE user_id = ? ORDER BY record_date DESC LIMIT ?',
    [userId, limit || 30]
  )
  return { items }
}

/**
 * 数据统计（用于看板）
 */
const getStats = async ({ userId, days }) => {
  days = days || 7
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString().split('T')[0]

  const [feedingCount, sleepStats, moodStats, weightTrend] = await Promise.all([
    query('SELECT COUNT(*) as count FROM feeding_records WHERE user_id = ? AND feed_time >= ?', [userId, sinceStr]),
    query(`SELECT AVG(TIMESTAMPDIFF(MINUTE, sleep_start, sleep_end)) as avg_minutes,
      COUNT(*) as count FROM sleep_records WHERE user_id = ? AND sleep_start >= ? AND sleep_end IS NOT NULL`, [userId, sinceStr]),
    query(`SELECT mood, COUNT(*) as count FROM mood_records WHERE user_id = ? AND record_date >= ? GROUP BY mood`, [userId, sinceStr]),
    query('SELECT weight, record_date FROM weight_records WHERE user_id = ? AND record_date >= ? ORDER BY record_date ASC', [userId, sinceStr])
  ])

  return {
    feeding: { count: feedingCount[0].count },
    sleep: {
      count: sleepStats[0].count,
      avgMinutes: Math.round(sleepStats[0].avg_minutes || 0)
    },
    mood: moodStats,
    weight: weightTrend
  }
}

module.exports = {
  addFeeding, getFeedings,
  addSleep, getSleepRecords,
  addMood, getMoods,
  addWeight, getWeights,
  getStats
}
