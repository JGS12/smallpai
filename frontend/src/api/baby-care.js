// 宝宝护理相关接口
import { request } from '@/utils/request'

/**
 * 获取宝宝护理信息
 */
export const getBabyCare = () => {
  return request({ url: '/baby-care' })
}