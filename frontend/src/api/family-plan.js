// 家庭计划相关接口
import { request } from '@/utils/request'

/**
 * 获取家庭计划
 */
export const getFamilyPlan = () => {
  return request({ url: '/family-plan' })
}