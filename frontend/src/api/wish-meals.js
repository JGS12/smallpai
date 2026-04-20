// 心愿菜单相关接口
import { request } from '@/utils/request'

/**
 * 获取我的心愿列表
 */
export const getMyWishes = () => {
  return request({ url: '/wish-meals/my' })
}

/**
 * 获取今日心愿
 */
export const getTodayWishes = () => {
  return request({ url: '/wish-meals/today' })
}

/**
 * 创建心愿
 * @param {Object} data - { mealId, mealDate, mealType, customName, remark }
 */
export const createWish = (data) => {
  return request({
    url: '/wish-meals',
    method: 'POST',
    data
  })
}

/**
 * 更新心愿状态
 * @param {Number} id - 心愿ID
 * @param {String} status - 状态：pending/done/cancelled
 */
export const updateWishStatus = (id, status) => {
  return request({
    url: `/wish-meals/${id}/status`,
    method: 'PUT',
    data: { status }
  })
}