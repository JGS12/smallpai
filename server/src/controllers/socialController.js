'use strict'

const messageService = require('../services/messageService')
const achievementService = require('../services/achievementService')
const futureLetterService = require('../services/futureLetterService')
const weeklyReportService = require('../services/weeklyReportService')

// 留言板
const addMessage = async (ctx) => {
  const { content } = ctx.request.body
  const userId = ctx.state.user.id
  try {
    const result = await messageService.addMessage({ fromUserId: userId, content })
    ctx.body = { code: 0, message: '留言成功', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const getMessages = async (ctx) => {
  const { page, pageSize } = ctx.query
  try {
    const result = await messageService.getMessages({ page: parseInt(page) || 1, pageSize: parseInt(pageSize) || 20 })
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

// 成就
const getAchievements = async (ctx) => {
  const userId = ctx.state.user.id
  try {
    // 先检查并授予新成就
    await achievementService.checkAndGrantAchievements({ userId })
    const result = await achievementService.getUserAchievements({ userId })
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const getLeaderboard = async (ctx) => {
  try {
    const result = await achievementService.getLeaderboard()
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

// 给未来的信
const createLetter = async (ctx) => {
  const { title, content, unlockDate } = ctx.request.body
  const userId = ctx.state.user.id
  try {
    const result = await futureLetterService.createLetter({ userId, title, content, unlockDate })
    ctx.body = { code: 0, message: '信件已保存', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const getLetters = async (ctx) => {
  const userId = ctx.state.user.id
  try {
    await futureLetterService.unlockExpiredLetters()
    const result = await futureLetterService.getLetters({ userId })
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

// 本周小报
const getWeeklyReport = async (ctx) => {
  try {
    const result = await weeklyReportService.generateWeeklyReport()
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const getRecentReports = async (ctx) => {
  try {
    const result = await weeklyReportService.getRecentReports({})
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

module.exports = {
  addMessage, getMessages,
  getAchievements, getLeaderboard,
  createLetter, getLetters,
  getWeeklyReport, getRecentReports
}
