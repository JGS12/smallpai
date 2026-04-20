// 宝宝日记相关接口
import { request } from '@/utils/request'

/**
 * 获取里程碑列表
 */
export const getMilestones = () => {
  return request({ url: '/baby-diary/milestones' })
}

/**
 * 创建里程碑
 * @param {Object} data - 里程碑数据
 */
export const createMilestone = (data) => {
  return request({
    url: '/baby-diary/milestones',
    method: 'POST',
    data
  })
}

/**
 * 获取照片列表
 */
export const getPhotos = () => {
  return request({ url: '/baby-diary/photos' })
}

/**
 * 上传照片
 * @param {Object} data - 照片数据
 */
export const uploadPhoto = (data) => {
  return request({
    url: '/baby-diary/photos',
    method: 'POST',
    data
  })
}

/**
 * 获取日记列表
 */
export const getDiaries = () => {
  return request({ url: '/baby-diary/diaries' })
}

/**
 * 创建日记
 * @param {Object} data - 日记数据
 */
export const createDiary = (data) => {
  return request({
    url: '/baby-diary/diaries',
    method: 'POST',
    data
  })
}