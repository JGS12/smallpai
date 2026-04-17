'use strict'

const { query } = require('../utils/db')

/**
 * 生成本周小报
 */
const generateWeeklyReport = async () => {
  const now = new Date()
  const dayOfWeek = now.getDay() || 7 // 周日=7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + 1)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const startStr = monday.toISOString().split('T')[0]
  const endStr = sunday.toISOString().split('T')[0]

  // 最受欢迎的菜
  const topMeal = await query(
    `SELECT COALESCE(m.name, o.custom_name) as name, COUNT(*) as count
     FROM orders o LEFT JOIN meals m ON o.meal_id = m.id
     WHERE o.meal_date BETWEEN ? AND ?
     GROUP BY COALESCE(m.name, o.custom_name)
     ORDER BY count DESC LIMIT 1`, [startStr, endStr]
  )

  // 心情平均分
  const moodScore = await query(
    `SELECT AVG(CASE mood
      WHEN 'happy' THEN 5
      WHEN 'normal' THEN 3
      WHEN 'sad' THEN 2
      WHEN 'crying' THEN 1
      ELSE 3 END) as avg_score
    FROM mood_records WHERE record_date BETWEEN ? AND ?`, [startStr, endStr]
  )

  // 哺乳次数
  const feedingCount = await query(
    'SELECT COUNT(*) as count FROM feeding_records WHERE DATE(feed_time) BETWEEN ? AND ?', [startStr, endStr]
  )

  // 留言数
  const msgCount = await query(
    'SELECT COUNT(*) as count FROM messages WHERE DATE(created_at) BETWEEN ? AND ?', [startStr, endStr]
  )

  // 完成订单数
  const orderCount = await query(
    `SELECT COUNT(*) as count FROM orders WHERE meal_date BETWEEN ? AND ? AND status = 'done'`, [startStr, endStr]
  )

  // 宝宝体重变化
  const weightChange = await query(
    `SELECT MIN(weight) as min_w, MAX(weight) as max_w
     FROM weight_records WHERE record_date BETWEEN ? AND ?`, [startStr, endStr]
  )

  const report = {
    weekStart: startStr,
    weekEnd: endStr,
    topMeal: topMeal[0] || { name: '暂无', count: 0 },
    moodScore: Math.round((moodScore[0].avg_score || 0) * 10) / 10,
    feedingCount: feedingCount[0].count,
    msgCount: msgCount[0].count,
    orderCount: orderCount[0].count,
    weightGain: weightChange[0].max_w && weightChange[0].min_w
      ? (weightChange[0].max_w - weightChange[0].min_w).toFixed(2)
      : null
  }

  // 缓存到数据库
  const existing = await query('SELECT id FROM weekly_reports WHERE week_start = ?', [startStr])
  if (existing.length > 0) {
    await query('UPDATE weekly_reports SET report_data = ? WHERE id = ?', [JSON.stringify(report), existing[0].id])
  } else {
    await query('INSERT INTO weekly_reports (week_start, report_data) VALUES (?, ?)', [startStr, JSON.stringify(report)])
  }

  return report
}

/**
 * 获取最近的小报
 */
const getRecentReports = async ({ limit }) => {
  const items = await query(
    'SELECT * FROM weekly_reports ORDER BY week_start DESC LIMIT ?',
    [limit || 4]
  )
  return { items: items.map(i => ({ ...i, report_data: typeof i.report_data === 'string' ? JSON.parse(i.report_data) : i.report_data })) }
}

module.exports = { generateWeeklyReport, getRecentReports }
