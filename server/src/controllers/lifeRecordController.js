'use strict'

const lifeRecordService = require('../services/lifeRecordService')

// 哺乳记录
const addFeeding = async (ctx) => {
  const { feedTime, duration, side, note } = ctx.request.body
  const userId = ctx.state.user.id
  try {
    const result = await lifeRecordService.addFeeding({ userId, feedTime, duration, side, note })
    ctx.body = { code: 0, message: '记录成功', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const getFeedings = async (ctx) => {
  const { date } = ctx.query
  const userId = ctx.state.user.id
  try {
    const result = await lifeRecordService.getFeedings({ userId, date })
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

// 睡眠记录
const addSleep = async (ctx) => {
  const { sleepStart, sleepEnd, quality, note } = ctx.request.body
  const userId = ctx.state.user.id
  try {
    const result = await lifeRecordService.addSleep({ userId, sleepStart, sleepEnd, quality, note })
    ctx.body = { code: 0, message: '记录成功', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const getSleepRecords = async (ctx) => {
  const { date } = ctx.query
  const userId = ctx.state.user.id
  try {
    const result = await lifeRecordService.getSleepRecords({ userId, date })
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

// 心情打卡
const addMood = async (ctx) => {
  const { mood, note, recordDate } = ctx.request.body
  const userId = ctx.state.user.id
  try {
    const result = await lifeRecordService.addMood({ userId, mood, note, recordDate })
    ctx.body = { code: 0, message: '打卡成功', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const getMoods = async (ctx) => {
  const { startDate, endDate } = ctx.query
  const userId = ctx.state.user.id
  try {
    const result = await lifeRecordService.getMoods({ userId, startDate, endDate })
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

// 体重记录
const addWeight = async (ctx) => {
  const { weight, recordDate, note } = ctx.request.body
  const userId = ctx.state.user.id
  try {
    const result = await lifeRecordService.addWeight({ userId, weight, recordDate, note })
    ctx.body = { code: 0, message: '记录成功', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const getWeights = async (ctx) => {
  const { limit } = ctx.query
  const userId = ctx.state.user.id
  try {
    const result = await lifeRecordService.getWeights({ userId, limit: parseInt(limit) || 30 })
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

// 数据统计
const getStats = async (ctx) => {
  const { days } = ctx.query
  const userId = ctx.state.user.id
  try {
    const result = await lifeRecordService.getStats({ userId, days: parseInt(days) || 7 })
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

module.exports = {
  addFeeding, getFeedings,
  addSleep, getSleepRecords,
  addMood, getMoods,
  addWeight, getWeights,
  getStats
}
