// 菜品相关接口
import { request } from '@/utils/request'

/**
 * 获取菜品列表
 * @param {Object} params - 查询参数 { week, mealType }
 */
export const getMeals = (params = {}) => {
  const query = new URLSearchParams()
  if (params.week) query.append('week', params.week)
  if (params.mealType) query.append('mealType', params.mealType)
  const queryString = query.toString()
  return request({ url: `/meals${queryString ? '?' + queryString : ''}` })
}

/**
 * 获取单个菜品详情
 * @param {Number} id - 菜品ID
 */
export const getMealById = (id) => {
  return request({ url: `/meals/${id}` })
}