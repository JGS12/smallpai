// 生活记录相关接口
import { request } from '@/utils/request'

/**
 * 获取喂养记录
 * @param {String} date - 日期
 */
export const getFeedingRecords = (date) => {
  return request({ url: `/life-records/feeding?date=${date}` })
}

/**
 * 创建喂养记录
 * @param {Object} data - 喂养数据
 */
export const createFeedingRecord = (data) => {
  return request({
    url: '/life-records/feeding',
    method: 'POST',
    data
  })
}

/**
 * 获取睡眠记录
 * @param {String} date - 日期
 */
export const getSleepRecords = (date) => {
  return request({ url: `/life-records/sleep?date=${date}` })
}

/**
 * 创建睡眠记录
 * @param {Object} data - 睡眠数据
 */
export const createSleepRecord = (data) => {
  return request({
    url: '/life-records/sleep',
    method: 'POST',
    data
  })
}

/**
 * 获取心情记录
 * @param {String} startDate - 开始日期
 * @param {String} endDate - 结束日期
 */
export const getMoodRecords = (startDate, endDate) => {
  return request({ url: `/life-records/mood?startDate=${startDate}&endDate=${endDate}` })
}

/**
 * 创建心情记录
 * @param {Object} data - 心情数据
 */
export const createMoodRecord = (data) => {
  return request({
    url: '/life-records/mood',
    method: 'POST',
    data
  })
}

/**
 * 获取体重记录
 * @param {Number} limit - 限制数量
 */
export const getWeightRecords = (limit = 30) => {
  return request({ url: `/life-records/weight?limit=${limit}` })
}

/**
 * 创建体重记录
 * @param {Object} data - 体重数据
 */
export const createWeightRecord = (data) => {
  return request({
    url: '/life-records/weight',
    method: 'POST',
    data
  })
}

/**
 * 获取统计数据
 * @param {Number} days - 天数
 */
export const getLifeStats = (days = 7) => {
  return request({ url: `/life-records/stats?days=${days}` })
}