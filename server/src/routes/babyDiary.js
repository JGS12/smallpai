'use strict'

const Router = require('@koa/router')
const router = new Router({ prefix: '/baby-diary' })
const { auth } = require('../middleware/auth')
const babyDiaryController = require('../controllers/babyDiaryController')

// 里程碑
router.post('/milestones', auth, babyDiaryController.addMilestone)
router.get('/milestones', auth, babyDiaryController.getMilestones)

// 照片墙
router.post('/photos', auth, babyDiaryController.addPhoto)
router.get('/photos', auth, babyDiaryController.getPhotos)

// 日记
router.post('/diaries', auth, babyDiaryController.addDiary)
router.get('/diaries', auth, babyDiaryController.getDiaries)

module.exports = router
