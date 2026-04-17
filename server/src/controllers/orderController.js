'use strict'

const orderService = require('../services/orderService')

const create = async (ctx) => {
  const { mealId, customName, mealDate, mealType, remark } = ctx.request.body
  const userId = ctx.state.user.id
  try {
    const result = await orderService.createOrder({ userId, mealId, customName, mealDate, mealType, remark })
    ctx.body = { code: 0, message: '点餐成功', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const list = async (ctx) => {
  const { date, status } = ctx.query
  try {
    const result = await orderService.getOrders({ date, status })
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const today = async (ctx) => {
  try {
    const result = await orderService.getTodayOrders()
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const accept = async (ctx) => {
  const { id } = ctx.params
  const userId = ctx.state.user.id
  try {
    const result = await orderService.acceptOrder({ orderId: id, userId })
    ctx.body = { code: 0, message: '接单成功', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const complete = async (ctx) => {
  const { id } = ctx.params
  const userId = ctx.state.user.id
  try {
    const result = await orderService.completeOrder({ orderId: id, userId })
    ctx.body = { code: 0, message: '已完成', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const cancel = async (ctx) => {
  const { id } = ctx.params
  const userId = ctx.state.user.id
  try {
    const result = await orderService.cancelOrder({ orderId: id, userId })
    ctx.body = { code: 0, message: '已取消', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

module.exports = { create, list, today, accept, complete, cancel }
