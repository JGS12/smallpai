'use strict'

const { query } = require('../utils/db')

/**
 * 添加里程碑
 */
const addMilestone = async ({ userId, title, content, milestoneDate, icon }) => {
  if (!title || !milestoneDate) throw new Error('标题和日期不能为空')
  const result = await query(
    'INSERT INTO baby_milestones (user_id, title, content, milestone_date, icon) VALUES (?, ?, ?, ?, ?)',
    [userId, title, content || null, milestoneDate, icon || '⭐']
  )
  return { id: result.insertId }
}

/**
 * 获取里程碑列表
 */
const getMilestones = async () => {
  const items = await query(
    'SELECT m.*, u.username, u.nickname FROM baby_milestones m LEFT JOIN users u ON m.user_id = u.id ORDER BY m.milestone_date DESC'
  )
  return { items }
}

/**
 * 添加照片
 */
const addPhoto = async ({ userId, photoUrl, caption, photoDate }) => {
  if (!photoUrl || !photoDate) throw new Error('照片URL和日期不能为空')
  const result = await query(
    'INSERT INTO baby_photos (user_id, photo_url, caption, photo_date) VALUES (?, ?, ?, ?)',
    [userId, photoUrl, caption || null, photoDate]
  )
  return { id: result.insertId }
}

/**
 * 获取照片墙
 */
const getPhotos = async ({ page, pageSize }) => {
  page = page || 1
  pageSize = pageSize || 20
  const offset = (page - 1) * pageSize
  const [items, countResult] = await Promise.all([
    query('SELECT p.*, u.username, u.nickname FROM baby_photos p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.photo_date DESC LIMIT ? OFFSET ?', [pageSize, offset]),
    query('SELECT COUNT(*) as total FROM baby_photos')
  ])
  return { items, total: countResult[0].total, page, pageSize }
}

/**
 * 添加日记
 */
const addDiary = async ({ userId, title, content, mood, entryDate }) => {
  if (!content || !entryDate) throw new Error('内容和日期不能为空')
  const result = await query(
    'INSERT INTO diary_entries (user_id, title, content, mood, entry_date) VALUES (?, ?, ?, ?, ?)',
    [userId, title || null, content, mood || null, entryDate]
  )
  return { id: result.insertId }
}

/**
 * 获取日记列表
 */
const getDiaries = async ({ userId, page, pageSize }) => {
  page = page || 1
  pageSize = pageSize || 10
  const offset = (page - 1) * pageSize
  let where = 'WHERE 1=1'
  const params = []
  if (userId) {
    where += ' AND user_id = ?'
    params.push(userId)
  }
  const [items, countResult] = await Promise.all([
    query(`SELECT d.*, u.username, u.nickname FROM diary_entries d LEFT JOIN users u ON d.user_id = u.id ${where} ORDER BY d.entry_date DESC LIMIT ? OFFSET ?`, [...params, pageSize, offset]),
    query(`SELECT COUNT(*) as total FROM diary_entries ${where}`, params)
  ])
  return { items, total: countResult[0].total, page, pageSize }
}

module.exports = {
  addMilestone, getMilestones,
  addPhoto, getPhotos,
  addDiary, getDiaries
}
