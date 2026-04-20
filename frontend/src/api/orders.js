// 点餐相关接口
import { request } from '@/utils/request'

/**
 * 获取点餐列表
 * @param {String} date - 日期，格式 YYYY-MM-DD
 */
export const getOrders = (date) => {
  return request({ url: `/orders?date=${date}` })
}

/**
 * 创建点餐
 * @param {Object} data - { mealId, customName, mealDate, mealType, remark }
 */
export const createOrder = (data) => {
  return request({
    url: '/orders',
    method: 'POST',
    data
  })
}

/**
 * 接单
 * @param {Number} id - 点餐ID
 */
export const acceptOrder = (id) => {
  return request({
    url: `/orders/${id}/accept`,
    method: 'PUT'
  })
}

/**
 * 完成点餐
 * @param {Number} id - 点餐ID
 */
export const completeOrder = (id) => {
  return request({
    url: `/orders/${id}/complete`,
    method: 'PUT'
  })
}

/**
 * 取消点餐
 * @param {Number} id - 点餐ID
 */
export const cancelOrder = (id) => {
  return request({
    url: `/orders/${id}`,
    method: 'DELETE'
  })
}