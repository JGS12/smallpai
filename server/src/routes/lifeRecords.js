'use strict'

const Router = require('@koa/router')
const router = new Router({ prefix: '/life-records' })
const { auth } = require('../middleware/auth')
const lifeRecordController = require('../controllers/lifeRecordController')

// 哺乳记录
router.post('/feeding', auth, lifeRecordController.addFeeding)
router.get('/feeding', auth, lifeRecordController.getFeedings)

// 睡眠记录
router.post('/sleep', auth, lifeRecordController.addSleep)
router.get('/sleep', auth, lifeRecordController.getSleepRecords)

// 心情打卡
router.post('/mood', auth, lifeRecordController.addMood)
router.get('/mood', auth, lifeRecordController.getMoods)

// 体重记录
router.post('/weight', auth, lifeRecordController.addWeight)
router.get('/weight', auth, lifeRecordController.getWeights)

// 数据统计
router.get('/stats', auth, lifeRecordController.getStats)

module.exports = router
