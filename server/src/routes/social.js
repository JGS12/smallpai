'use strict'

const Router = require('@koa/router')
const router = new Router({ prefix: '/social' })
const { auth } = require('../middleware/auth')
const socialController = require('../controllers/socialController')

// 留言板
router.post('/messages', auth, socialController.addMessage)
router.get('/messages', auth, socialController.getMessages)

// 成就
router.get('/achievements', auth, socialController.getAchievements)
router.get('/leaderboard', auth, socialController.getLeaderboard)

// 给未来的信
router.post('/letters', auth, socialController.createLetter)
router.get('/letters', auth, socialController.getLetters)

// 本周小报
router.get('/weekly-report', auth, socialController.getWeeklyReport)
router.get('/weekly-reports', auth, socialController.getRecentReports)

module.exports = router
