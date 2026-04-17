'use strict'

const { query } = require('../utils/db')

/**
 * 创建点餐
 */
const createOrder = async ({ userId, mealId, customName, mealDate, mealType, remark }) => {
  if (!mealDate || !mealType) {
    throw new Error('用餐日期和餐次不能为空')
  }
  if (!mealId && !customName) {
    throw new Error('请选择菜品或输入自定义菜品名')
  }
  const result = await query(
    'INSERT INTO orders (user_id, meal_id, custom_name, meal_date, meal_type, remark) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, mealId || null, customName || null, mealDate, mealType, remark || null]
  )
  return { id: result.insertId }
}

/**
 * 获取点餐列表（按日期筛选）
 */
const getOrders = async ({ date, status }) => {
  let sql = `SELECT o.*, u.username, u.nickname,
    m.name as meal_name, m.description as meal_desc,
    a.username as accepted_by_name, a.nickname as accepted_by_nickname
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN meals m ON o.meal_id = m.id
    LEFT JOIN users a ON o.accepted_by = a.id
    WHERE 1=1`
  const params = []
  if (date) {
    sql += ' AND o.meal_date = ?'
    params.push(date)
  }
  if (status) {
    sql += ' AND o.status = ?'
    params.push(status)
  }
  sql += ' ORDER BY o.meal_date DESC, o.meal_type ASC'
  const items = await query(sql, params)
  return { items }
}

/**
 * 获取今日点餐
 */
const getTodayOrders = async () => {
  const today = new Date().toISOString().split('T')[0]
  return getOrders({ date: today })
}

/**
 * 接单
 */
const acceptOrder = async ({ orderId, userId }) => {
  const orders = await query('SELECT * FROM orders WHERE id = ?', [orderId])
  if (orders.length === 0) throw new Error('订单不存在')
  if (orders[0].status !== 'pending') throw new Error('该订单已被接单或已完成')
  await query('UPDATE orders SET status = ?, accepted_by = ? WHERE id = ?', ['accepted', userId, orderId])
  return { success: true }
}

/**
 * 完成订单
 */
const completeOrder = async ({ orderId, userId }) => {
  const orders = await query('SELECT * FROM orders WHERE id = ?', [orderId])
  if (orders.length === 0) throw new Error('订单不存在')
  if (orders[0].status !== 'accepted') throw new Error('该订单状态不正确')
  await query('UPDATE orders SET status = ? WHERE id = ?', ['done', orderId])
  return { success: true }
}

/**
 * 取消订单
 */
const cancelOrder = async ({ orderId, userId }) => {
  const orders = await query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId])
  if (orders.length === 0) throw new Error('订单不存在或无权操作')
  await query('DELETE FROM orders WHERE id = ?', [orderId])
  return { success: true }
}

module.exports = {
  createOrder,
  getOrders,
  getTodayOrders,
  acceptOrder,
  completeOrder,
  cancelOrder
}
