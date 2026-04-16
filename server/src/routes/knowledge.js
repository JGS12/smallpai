'use strict'

const Router = require('koa-router')
const router = new Router()
const knowledgeController = require('../controllers/knowledgeController')

// GET /api/knowledge              获取知识列表（支持 ?category=饮食 筛选）
router.get('/', knowledgeController.getList)
// GET /api/knowledge/:id         获取知识详情
router.get('/:id', knowledgeController.getDetail)

module.exports = router
