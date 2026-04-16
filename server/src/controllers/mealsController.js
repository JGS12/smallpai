'use strict'

const { success, fail } = require('../utils/response')
const mealsService = require('../services/mealsService')

/**
 * 获取月子餐列表，支持 ?week=1&mealType=早餐 筛选
 */
const getList = async (ctx) => {
    const { week, mealType } = ctx.query
    const data = await mealsService.getList({ week, mealType })
    ctx.body = success(data)
}

/**
 * 获取单个菜品详情
 */
const getDetail = async (ctx) => {
    const { id } = ctx.params
    const data = await mealsService.getDetail(id)
    if (!data) {
        ctx.body = fail('未找到该菜品')
        return
    }
    ctx.body = success(data)
}

module.exports = { getList, getDetail }
