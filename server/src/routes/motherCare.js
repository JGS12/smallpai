'use strict'

const Router = require('koa-router')
const router = new Router()
const motherCareController = require('../controllers/motherCareController')

// GET /api/mother-care          获取所有阶段照护信息
router.get('/', motherCareController.getList)
// GET /api/mother-care/:week    获取指定周的照护信息
router.get('/:week', motherCareController.getByWeek)

module.exports = router
