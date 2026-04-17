'use strict'

const Router = require('koa-router')
const wishMealsController = require('../controllers/wishMealsController')
const { auth, adminAuth } = require('../middleware/auth')

const router = new Router()

// 用户端接口（需要登录）
router.post('/', auth, wishMealsController.create)
router.get('/my', auth, wishMealsController.getList)
router.get('/today', auth, wishMealsController.getToday)
router.put('/:id/status', auth, wishMealsController.updateStatus)
router.del('/:id', auth, wishMealsController.remove)

// 管理端接口（需要管理员权限）
router.get('/admin/all', adminAuth, wishMealsController.getAll)
router.put('/admin/:id/status', adminAuth, wishMealsController.adminUpdateStatus)
router.del('/admin/:id', adminAuth, wishMealsController.adminRemove)

module.exports = router
