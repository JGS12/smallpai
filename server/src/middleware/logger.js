'use strict'

/**
 * 请求日志中间件
 */
const logMiddleware = async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    const log = `[${new Date().toLocaleString()}] ${ctx.method} ${ctx.url} - ${ctx.status} (${ms}ms)`
    process.stdout.write(log + '\n')
}

module.exports = logMiddleware
