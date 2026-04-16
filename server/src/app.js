'use strict'

require('dotenv').config()
const Koa = require('koa')
const { koaBody } = require('koa-body')
const cors = require('@koa/cors')
const koaStatic = require('koa-static')
const path = require('path')

const router = require('./routes')
const errorMiddleware = require('./middleware/error')
const logMiddleware = require('./middleware/logger')

const app = new Koa()

// 静态资源
app.use(koaStatic(path.join(__dirname, '../static')))

// 跨域
app.use(cors())

// 日志
app.use(logMiddleware)

// 错误处理
app.use(errorMiddleware)

// 请求体解析
app.use(koaBody())

// 路由
app.use(router.routes())
app.use(router.allowedMethods())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`✅ 月子小家服务启动成功，端口：${PORT}`)
})

module.exports = app
