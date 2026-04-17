'use strict'

const wishMealsService = require('../services/wishMealsService')
const { success, fail } = require('../utils/response')

/**
 * 创建心愿菜单
 */
const create = async (ctx) => {
  try {
    const { mealId, mealDate, mealType, customName, remark } = ctx.request.body
    const userId = ctx.state.user.id

    const result = await wishMealsService.create({
      userId, mealId, mealDate, mealType, customName, remark
    })

    ctx.body = success(result, '许愿成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
}

/**
 * 获取用户自己的心愿列表
 */
const getList = async (ctx) => {
  try {
    const userId = ctx.state.user.id
    const { date, status } = ctx.query

    const list = await wishMealsService.getList({ userId, date, status })
    ctx.body = success(list)
  } catch (err) {
    ctx.body = fail(err.message)
  }
}

/**
 * 获取今日心愿
 */
const getToday = async (ctx) => {
  try {
    const userId = ctx.state.user.id
    const list = await wishMealsService.getToday({ userId })
    ctx.body = success(list)
  } catch (err) {
    ctx.body = fail(err.message)
  }
}

/**
 * 获取所有心愿（家人/管理端）
 */
const getAll = async (ctx) => {
  try {
    const { date, status, page, pageSize } = ctx.query
    const result = await wishMealsService.getAll({
      date,
      status,
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 20
    })
    ctx.body = success(result)
  } catch (err) {
    ctx.body = fail(err.message)
  }
}

/**
 * 更新心愿状态
 */
const updateStatus = async (ctx) => {
  try {
    const { id } = ctx.params
    const { status } = ctx.request.body
    const userId = ctx.state.user.id

    const result = await wishMealsService.updateStatus({ id: parseInt(id), userId, status })
    ctx.body = success(result, '更新成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
}

/**
 * 管理端更新状态
 */
const adminUpdateStatus = async (ctx) => {
  try {
    const { id } = ctx.params
    const { status } = ctx.request.body

    const result = await wishMealsService.adminUpdateStatus({ id: parseInt(id), status })
    ctx.body = success(result, '更新成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
}

/**
 * 删除心愿
 */
const remove = async (ctx) => {
  try {
    const { id } = ctx.params
    const userId = ctx.state.user.id

    const result = await wishMealsService.remove({ id: parseInt(id), userId })
    ctx.body = success(result, '删除成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
}

/**
 * 管理端删除
 */
const adminRemove = async (ctx) => {
  try {
    const { id } = ctx.params
    const result = await wishMealsService.adminRemove({ id: parseInt(id) })
    ctx.body = success(result, '删除成功')
  } catch (err) {
    ctx.body = fail(err.message)
  }
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
