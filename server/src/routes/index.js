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

router.use('/meals', mealsRoutes.routes(), mealsRoutes.allowedMethods())
router.use('/mother-care', motherCareRoutes.routes(), motherCareRoutes.allowedMethods())
router.use('/baby-care', babyCareRoutes.routes(), babyCareRoutes.allowedMethods())
router.use('/family-plan', familyPlanRoutes.routes(), familyPlanRoutes.allowedMethods())
router.use('/knowledge', knowledgeRoutes.routes(), knowledgeRoutes.allowedMethods())
router.use('/auth', authRoutes.routes(), authRoutes.allowedMethods())
router.use('/wish-meals', wishMealsRoutes.routes(), wishMealsRoutes.allowedMethods())
router.use(adminRoutes.routes(), adminRoutes.allowedMethods())

module.exports = router
