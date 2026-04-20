// 知识相关接口
import { request } from '@/utils/request'

/**
 * 获取知识列表
 */
export const getKnowledge = () => {
  return request({ url: '/knowledge' })
}