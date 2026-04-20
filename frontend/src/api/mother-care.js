// 妈妈护理相关接口
import { request } from '@/utils/request'

/**
 * 获取妈妈护理信息
 */
export const getMotherCare = () => {
  return request({ url: '/mother-care' })
}