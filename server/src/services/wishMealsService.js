'use strict'

const { query } = require('../utils/db')

/**
 * 创建心愿菜单
 */
const create = async ({ userId, mealId, mealDate, mealType, customName, remark }) => {
  if (!mealDate || !mealType) {
    throw new Error('日期和餐次不能为空')
  }

  if (!mealId && !customName) {
    throw new Error('请选择菜品或输入自定义菜品名')
  }

  // 检查同一用户同一天同一餐次是否已点
  const existing = await query(
    'SELECT id FROM wish_meals WHERE user_id = ? AND meal_date = ? AND meal_type = ? AND status != ?',
    [userId, mealDate, mealType, 'cancelled']
  )
  if (existing.length > 0) {
    throw new Error('这餐已经点过了哦，可以先取消再重新点')
  }

  const result = await query(
    'INSERT INTO wish_meals (user_id, meal_id, meal_date, meal_type, custom_name, remark) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, mealId || null, mealDate, mealType, customName || null, remark || null]
  )

  return { id: result.insertId }
}

/**
 * 获取用户自己的心愿列表
 */
const getList = async ({ userId, date, status }) => {
  let sql = `
    SELECT w.*, m.name as meal_name, m.description as meal_desc, m.tags as meal_tags
    FROM wish_meals w
    LEFT JOIN meals m ON w.meal_id = m.id
    WHERE w.user_id = ?
  `
  const params = [userId]

  if (date) {
    sql += ' AND w.meal_date = ?'
    params.push(date)
  }
  if (status) {
    sql += ' AND w.status = ?'
    params.push(status)
  }

  sql += ' ORDER BY w.meal_date ASC, w.meal_type ASC'

  return await query(sql, params)
}

/**
 * 获取今日心愿（首页用）
 */
const getToday = async ({ userId }) => {
  const today = new Date().toISOString().split('T')[0]
  return await query(
    `SELECT w.*, m.name as meal_name, m.description as meal_desc, m.tags as meal_tags
     FROM wish_meals w
     LEFT JOIN meals m ON w.meal_id = m.id
     WHERE w.user_id = ? AND w.meal_date = ?
     ORDER BY w.meal_type ASC`,
    [userId, today]
  )
}

/**
 * 获取所有心愿（家人/管理端用）
 */
const getAll = async ({ date, status, page = 1, pageSize = 20 }) => {
  let countSql = 'SELECT COUNT(*) as total FROM wish_meals w'
  let sql = `
    SELECT w.*, u.username, m.name as meal_name, m.description as meal_desc, m.tags as meal_tags
    FROM wish_meals w
    LEFT JOIN users u ON w.user_id = u.id
    LEFT JOIN meals m ON w.meal_id = m.id
    WHERE 1=1
  `
  const params = []
  const countParams = []

  if (date) {
    sql += ' AND w.meal_date = ?'
    countSql += ' WHERE meal_date = ?'
    params.push(date)
    countParams.push(date)
  }
  if (status) {
    sql += ' AND w.status = ?'
    params.push(status)
  }

  sql += ' ORDER BY w.meal_date DESC, w.meal_type ASC'
  sql += ' LIMIT ? OFFSET ?'
  params.push(pageSize, (page - 1) * pageSize)

  const [items, countResult] = await Promise.all([
    query(sql, params),
    query(countSql, countParams)
  ])

  return {
    items,
    total: countResult[0].total,
    page,
    pageSize
  }
}

/**
 * 更新心愿状态
 */
const updateStatus = async ({ id, userId, status }) => {
  const validStatuses = ['pending', 'done', 'cancelled']
  if (!validStatuses.includes(status)) {
    throw new Error('无效的状态')
  }

  // 检查是否存在且属于该用户
  const items = await query('SELECT * FROM wish_meals WHERE id = ?', [id])
  if (items.length === 0) {
    throw new Error('心愿不存在')
  }
  if (items[0].user_id !== userId) {
    throw new Error('只能修改自己的心愿')
  }

  await query('UPDATE wish_meals SET status = ? WHERE id = ?', [status, id])
  return { id, status }
}

/**
 * 管理端更新状态（不限用户）
 */
const adminUpdateStatus = async ({ id, status }) => {
  const validStatuses = ['pending', 'done', 'cancelled']
  if (!validStatuses.includes(status)) {
    throw new Error('无效的状态')
  }

  await query('UPDATE wish_meals SET status = ? WHERE id = ?', [status, id])
  return { id, status }
}

/**
 * 删除心愿
 */
const remove = async ({ id, userId }) => {
  const items = await query('SELECT * FROM wish_meals WHERE id = ?', [id])
  if (items.length === 0) {
    throw new Error('心愿不存在')
  }
  if (items[0].user_id !== userId) {
    throw new Error('只能删除自己的心愿')
  }

  await query('DELETE FROM wish_meals WHERE id = ?', [id])
  return { id }
}

/**
 * 管理端删除
 */
const adminRemove = async ({ id }) => {
  await query('DELETE FROM wish_meals WHERE id = ?', [id])
  return { id }
}

module.exports = {
  create,
  getList,
  getToday,
  getAll,
  updateStatus,
  adminUpdateStatus,
  remove,
  adminRemove
}
