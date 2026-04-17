'use strict'

const Router = require('koa-router')
const router = new Router({ prefix: '/admin' })
const { adminAuth } = require('../middleware/auth')
const { query } = require('../utils/db')
const { success, fail } = require('../utils/response')

// ==================== 仪表盘 ====================

router.get('/dashboard', adminAuth, async (ctx) => {
  try {
    const [userCount, mealCount, wishToday, wishPending] = await Promise.all([
      query('SELECT COUNT(*) as count FROM users'),
      query('SELECT COUNT(*) as count FROM meals'),
      query('SELECT COUNT(*) as count FROM wish_meals WHERE meal_date = CURDATE()'),
      query("SELECT COUNT(*) as count FROM wish_meals WHERE status = 'pending'")
    ])

    ctx.body = success({
      userCount: userCount[0].count,
      mealCount: mealCount[0].count,
      wishToday: wishToday[0].count,
      wishPending: wishPending[0].count
    })
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

// ==================== 用户管理 ====================

router.get('/users', adminAuth, async (ctx) => {
  try {
    const items = await query('SELECT id, username, role, invitation_code, created_at FROM users ORDER BY created_at DESC')
    ctx.body = success(items)
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

router.put('/users/:id/role', adminAuth, async (ctx) => {
  try {
    const { id } = ctx.params
    const { role } = ctx.request.body

    if (!['admin', 'member'].includes(role)) {
      ctx.body = fail('无效的角色')
      return
    }

    await query('UPDATE users SET role = ? WHERE id = ?', [role, id])
    ctx.body = success(null, '角色更新成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

router.delete('/users/:id', adminAuth, async (ctx) => {
  try {
    const { id } = ctx.params
    await query('DELETE FROM users WHERE id = ?', [id])
    ctx.body = success(null, '删除成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

// ==================== 仪表盘统计 ====================

router.get('/stats', adminAuth, async (ctx) => {
  try {
    const [userCount, mealCount, wishToday, wishPending] = await Promise.all([
      query('SELECT COUNT(*) as count FROM users'),
      query('SELECT COUNT(*) as count FROM meals'),
      query('SELECT COUNT(*) as count FROM wish_meals WHERE meal_date = CURDATE()'),
      query("SELECT COUNT(*) as count FROM wish_meals WHERE status = 'pending'")
    ])

    ctx.body = success({
      userCount: userCount[0].count,
      mealCount: mealCount[0].count,
      wishToday: wishToday[0].count,
      wishPending: wishPending[0].count
    })
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

// ==================== 菜品管理 ====================

router.get('/meals', adminAuth, async (ctx) => {
  try {
    const items = await query('SELECT * FROM meals ORDER BY week ASC, meal_type ASC')
    ctx.body = success(items)
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

router.post('/meals', adminAuth, async (ctx) => {
  try {
    const { week, mealType, name, description, tags, avoid } = ctx.request.body

    if (!week || !mealType || !name) {
      ctx.body = fail('周次、餐次、菜品名不能为空')
      return
    }

    const result = await query(
      'INSERT INTO meals (week, meal_type, name, description, tags, avoid) VALUES (?, ?, ?, ?, ?, ?)',
      [week, mealType, name, description || null, JSON.stringify(tags || []), avoid || null]
    )

    ctx.body = success({ id: result.insertId }, '添加成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

router.put('/meals/:id', adminAuth, async (ctx) => {
  try {
    const { id } = ctx.params
    const { week, mealType, name, description, tags, avoid } = ctx.request.body

    await query(
      'UPDATE meals SET week = ?, meal_type = ?, name = ?, description = ?, tags = ?, avoid = ? WHERE id = ?',
      [week, mealType, name, description || null, JSON.stringify(tags || []), avoid || null, id]
    )

    ctx.body = success(null, '更新成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

router.del('/meals/:id', adminAuth, async (ctx) => {
  try {
    const { id } = ctx.params
    await query('DELETE FROM meals WHERE id = ?', [id])
    ctx.body = success(null, '删除成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

// ==================== 妈妈照护管理 ====================

router.get('/mother-care', adminAuth, async (ctx) => {
  try {
    const items = await query('SELECT * FROM mother_care ORDER BY id')
    ctx.body = success(items)
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

router.post('/mother-care', adminAuth, async (ctx) => {
  try {
    const { week, title, content, tags } = ctx.request.body
    const result = await query(
      'INSERT INTO mother_care (week, title, content, tags) VALUES (?, ?, ?, ?)',
      [week, title, content, JSON.stringify(tags || [])]
    )
    ctx.body = success({ id: result.insertId }, '添加成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

router.put('/mother-care/:id', adminAuth, async (ctx) => {
  try {
    const { id } = ctx.params
    const { week, title, content, tags } = ctx.request.body
    await query(
      'UPDATE mother_care SET week = ?, title = ?, content = ?, tags = ? WHERE id = ?',
      [week, title, content, JSON.stringify(tags || []), id]
    )
    ctx.body = success(null, '更新成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

router.del('/mother-care/:id', adminAuth, async (ctx) => {
  try {
    const { id } = ctx.params
    await query('DELETE FROM mother_care WHERE id = ?', [id])
    ctx.body = success(null, '删除成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

// ==================== 宝宝护理管理 ====================

router.get('/baby-care', adminAuth, async (ctx) => {
  try {
    const items = await query('SELECT * FROM baby_care ORDER BY id')
    ctx.body = success(items)
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

router.post('/baby-care', adminAuth, async (ctx) => {
  try {
    const { week, title, content, tags } = ctx.request.body
    const result = await query(
      'INSERT INTO baby_care (week, title, content, tags) VALUES (?, ?, ?, ?)',
      [week, title, content, JSON.stringify(tags || [])]
    )
    ctx.body = success({ id: result.insertId }, '添加成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

router.put('/baby-care/:id', adminAuth, async (ctx) => {
  try {
    const { id } = ctx.params
    const { week, title, content, tags } = ctx.request.body
    await query(
      'UPDATE baby_care SET week = ?, title = ?, content = ?, tags = ? WHERE id = ?',
      [week, title, content, JSON.stringify(tags || []), id]
    )
    ctx.body = success(null, '更新成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

router.del('/baby-care/:id', adminAuth, async (ctx) => {
  try {
    const { id } = ctx.params
    await query('DELETE FROM baby_care WHERE id = ?', [id])
    ctx.body = success(null, '删除成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
})

module.exports = router
