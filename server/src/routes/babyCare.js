'use strict'

const Router = require('koa-router')
const router = new Router()
const babyCareController = require('../controllers/babyCareController')

// GET /api/baby-care
router.get('/', babyCareController.getList)

module.exports = router
