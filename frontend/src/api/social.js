// 社交相关接口
import { request } from '@/utils/request'

/**
 * 获取留言列表
 * @param {Number} page - 页码
 * @param {Number} pageSize - 每页数量
 */
export const getMessages = (page = 1, pageSize = 20) => {
  return request({ url: `/social/messages?page=${page}&pageSize=${pageSize}` })
}

/**
 * 发送留言
 * @param {String} content - 留言内容
 */
export const sendMessage = (content) => {
  return request({
    url: '/social/messages',
    method: 'POST',
    data: { content }
  })
}

/**
 * 获取成就列表
 */
export const getAchievements = () => {
  return request({ url: '/social/achievements' })
}

/**
 * 获取排行榜
 */
export const getLeaderboard = () => {
  return request({ url: '/social/leaderboard' })
}

/**
 * 获取信件列表
 */
export const getLetters = () => {
  return request({ url: '/social/letters' })
}

/**
 * 发送信件
 * @param {Object} data - { title, content, unlockDate }
 */
export const sendLetter = (data) => {
  return request({
    url: '/social/letters',
    method: 'POST',
    data
  })
}

/**
 * 获取周报
 */
export const getWeeklyReport = () => {
  return request({ url: '/social/weekly-report' })
}

/**
 * 获取历史周报列表
 */
export const getWeeklyReports = () => {
  return request({ url: '/social/weekly-reports' })
}