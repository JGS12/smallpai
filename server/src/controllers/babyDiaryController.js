'use strict'

const babyDiaryService = require('../services/babyDiaryService')

// 里程碑
const addMilestone = async (ctx) => {
  const { title, content, milestoneDate, icon } = ctx.request.body
  const userId = ctx.state.user.id
  try {
    const result = await babyDiaryService.addMilestone({ userId, title, content, milestoneDate, icon })
    ctx.body = { code: 0, message: '添加成功', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const getMilestones = async (ctx) => {
  try {
    const result = await babyDiaryService.getMilestones()
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

// 照片墙
const addPhoto = async (ctx) => {
  const { photoUrl, caption, photoDate } = ctx.request.body
  const userId = ctx.state.user.id
  try {
    const result = await babyDiaryService.addPhoto({ userId, photoUrl, caption, photoDate })
    ctx.body = { code: 0, message: '上传成功', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const getPhotos = async (ctx) => {
  const { page, pageSize } = ctx.query
  try {
    const result = await babyDiaryService.getPhotos({ page: parseInt(page) || 1, pageSize: parseInt(pageSize) || 20 })
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

// 日记
const addDiary = async (ctx) => {
  const { title, content, mood, entryDate } = ctx.request.body
  const userId = ctx.state.user.id
  try {
    const result = await babyDiaryService.addDiary({ userId, title, content, mood, entryDate })
    ctx.body = { code: 0, message: '保存成功', data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

const getDiaries = async (ctx) => {
  const { page, pageSize } = ctx.query
  try {
    const result = await babyDiaryService.getDiaries({ page: parseInt(page) || 1, pageSize: parseInt(pageSize) || 10 })
    ctx.body = { code: 0, data: result }
  } catch (err) {
    ctx.body = { code: 1, message: err.message }
  }
}

module.exports = {
  addMilestone, getMilestones,
  addPhoto, getPhotos,
  addDiary, getDiaries
}
