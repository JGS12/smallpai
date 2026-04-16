'use strict'

const { success } = require('../utils/response')
const motherCareService = require('../services/motherCareService')

const getList = async (ctx) => {
    const data = await motherCareService.getList()
    ctx.body = success(data)
}

const getByWeek = async (ctx) => {
    const { week } = ctx.params
    const data = await motherCareService.getByWeek(Number(week))
    ctx.body = success(data)
}

module.exports = { getList, getByWeek }
