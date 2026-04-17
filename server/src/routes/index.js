'use strict'

const Router = require('koa-router')
const router = new Router({ prefix: '/api' })

const mealsRoutes = require('./meals')
const motherCareRoutes = require('./motherCare')
const babyCareRoutes = require('./babyCare')
const familyPlanRoutes = require('./familyPlan')
const knowledgeRoutes = require('./knowledge')
const authRoutes = require('./auth')
const wishMealsRoutes = require('./wishMeals')
const adminRoutes = require('./admin')
const orderRoutes = require('./orders')
const lifeRecordRoutes = require('./lifeRecords')
const babyDiaryRoutes = require('./babyDiary')
const socialRoutes = require('./social')

router.use('/meals', mealsRoutes.routes(), mealsRoutes.allowedMethods())
router.use('/mother-care', motherCareRoutes.routes(), motherCareRoutes.allowedMethods())
router.use('/baby-care', babyCareRoutes.routes(), babyCareRoutes.allowedMethods())
router.use('/family-plan', familyPlanRoutes.routes(), familyPlanRoutes.allowedMethods())
router.use('/knowledge', knowledgeRoutes.routes(), knowledgeRoutes.allowedMethods())
router.use('/auth', authRoutes.routes(), authRoutes.allowedMethods())
router.use('/wish-meals', wishMealsRoutes.routes(), wishMealsRoutes.allowedMethods())
router.use(adminRoutes.routes(), adminRoutes.allowedMethods())
router.use(orderRoutes.routes(), orderRoutes.allowedMethods())
router.use(lifeRecordRoutes.routes(), lifeRecordRoutes.allowedMethods())
router.use(babyDiaryRoutes.routes(), babyDiaryRoutes.allowedMethods())
router.use(socialRoutes.routes(), socialRoutes.allowedMethods())

module.exports = router
