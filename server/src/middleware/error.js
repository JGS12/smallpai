'use strict'

/**
 * 全局错误处理中间件
 */
const errorMiddleware = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.status = err.status || 500
        ctx.body = {
            code: ctx.status,
            message: err.message || '服务器内部错误',
            data: null
        }
    }
}

module.exports = errorMiddleware
