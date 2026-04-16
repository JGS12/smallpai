'use strict'

const Router = require('koa-router')
const router = new Router()
const familyPlanController = require('../controllers/familyPlanController')

// GET /api/family-plan
router.get('/', familyPlanController.getList)

module.exports = router
