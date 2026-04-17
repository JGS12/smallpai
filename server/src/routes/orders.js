'use strict'

const Router = require('@koa/router')
const router = new Router({ prefix: '/orders' })
const { auth } = require('../middleware/auth')
const orderController = require('../controllers/orderController')

router.post('/', auth, orderController.create)
router.get('/', auth, orderController.list)
router.get('/today', auth, orderController.today)
router.put('/:id/accept', auth, orderController.accept)
router.put('/:id/complete', auth, orderController.complete)
router.delete('/:id', auth, orderController.cancel)

module.exports = router
