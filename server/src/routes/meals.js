'use strict'

const Router = require('koa-router')
const router = new Router()
const mealsController = require('../controllers/mealsController')

// GET /api/meals        获取月子餐列表（支持 ?week=1&mealType=早餐 筛选）
router.get('/', mealsController.getList)
// GET /api/meals/:id   获取单个菜品详情
router.get('/:id', mealsController.getDetail)

module.exports = router
